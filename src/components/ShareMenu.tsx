"use client";

import { useState } from "react";

type Song = {
  name: string;
  singer_or_band: string | null;
  version: string | null;
  key: string | null;
  alt_key: string | null;
  anchor_id: string | null;
  bpm: number | null;
  time_signature_numerator: number;
  time_signature_denominator: number;
};
type Playlist = { url: string };
type Team = { id: string; name: string };
type Role = { id: string; name: string; team_id: string | null };
type Volunteer = { id: string; name: string; nickname: string | null };
type Assignment = { team_id: string; role_id: string; person_id: string | null };

type ShareData = {
  dateLabel: string;
  title: string | null;
  songs: Song[];
  playlists: Playlist[];
  teams: Team[];
  roles: Role[];
  volunteers: Volunteer[];
  assignments: Assignment[];
};

function assignedName(
  data: ShareData,
  teamId: string,
  roleId: string
): string {
  const assignment = data.assignments.find(
    (a) => a.team_id === teamId && a.role_id === roleId
  );
  const volunteer = data.volunteers.find((v) => v.id === assignment?.person_id);
  return volunteer ? volunteer.nickname || volunteer.name : "Open";
}

function anchorName(data: ShareData, song: Song): string | null {
  if (!song.anchor_id) return null;
  const v = data.volunteers.find((v) => v.id === song.anchor_id);
  return v ? v.nickname || v.name : null;
}

function rolesForTeam(data: ShareData, teamId: string): Role[] {
  return data.roles.filter((r) => r.team_id === null || r.team_id === teamId);
}

function songMeta(song: Song): string {
  const keyPart = [song.key, song.alt_key].filter(Boolean).join("/");
  return [
    keyPart || null,
    song.bpm !== null ? `${song.bpm} BPM` : null,
    `${song.time_signature_numerator}/${song.time_signature_denominator}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function buildShareText(data: ShareData): string {
  const lines: string[] = [];
  lines.push(data.dateLabel + (data.title ? ` — ${data.title}` : ""));

  if (data.songs.length > 0) {
    lines.push("", "SETLIST");
    data.songs.forEach((song, i) => {
      const meta = songMeta(song);
      const anchor = anchorName(data, song);
      lines.push(`${i + 1}. ${song.name}${meta ? ` (${meta})` : ""}`);
      if (anchor) lines.push(`   ⚓ ANCHOR: ${anchor}`);
      const sub = [song.singer_or_band, song.version].filter(Boolean).join(" — ");
      if (sub) lines.push(`   ${sub}`);
    });
  }

  if (data.playlists.length > 0) {
    lines.push("", "PLAYLIST");
    data.playlists.forEach((p) => lines.push(p.url));
  }

  data.teams.forEach((team) => {
    lines.push("", team.name.toUpperCase());
    rolesForTeam(data, team.id).forEach((role) => {
      lines.push(`${role.name}: ${assignedName(data, team.id, role.id)}`);
    });
  });

  return lines.join("\n").trim();
}

// Fixed light palette, matching the app's "always paper, regardless of
// viewer theme" convention for exported/shared artifacts.
const INK = "#1b1a17";
const INK2 = "#5d5a51";
const INK3 = "#8b8578";
const ACCENT = "#2f5d50";
const PAPER = "#f7f4ed";
const RULE = "#e3ddd0";

type DrawLine =
  | { kind: "eyebrow"; text: string }
  | { kind: "title"; text: string }
  | { kind: "subtitle"; text: string }
  | { kind: "section"; text: string }
  | { kind: "song"; text: string }
  | { kind: "songAnchor"; text: string }
  | { kind: "songSub"; text: string }
  | { kind: "role"; label: string; value: string }
  | { kind: "spacer" };

const LINE_HEIGHT: Record<DrawLine["kind"], number> = {
  eyebrow: 26,
  title: 46,
  subtitle: 28,
  section: 34,
  song: 26,
  songAnchor: 22,
  songSub: 22,
  role: 26,
  spacer: 14,
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function downloadAsImage(data: ShareData) {
  await document.fonts.ready;

  const width = 900;
  const paddingX = 56;
  const contentWidth = width - paddingX * 2;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;

  const plan: DrawLine[] = [];
  plan.push({ kind: "eyebrow", text: "WORSHIP TEAM LINEUP" });
  plan.push({ kind: "title", text: data.dateLabel });
  if (data.title) plan.push({ kind: "subtitle", text: data.title });

  if (data.songs.length > 0) {
    plan.push({ kind: "spacer" }, { kind: "section", text: "SETLIST" });
    data.songs.forEach((song, i) => {
      const meta = songMeta(song);
      const anchor = anchorName(data, song);
      plan.push({ kind: "song", text: `${i + 1}. ${song.name}${meta ? `  (${meta})` : ""}` });
      if (anchor) plan.push({ kind: "songAnchor", text: `⚓ ANCHOR: ${anchor}` });
      const sub = [song.singer_or_band, song.version].filter(Boolean).join(" — ");
      if (sub) plan.push({ kind: "songSub", text: sub });
    });
  }

  if (data.playlists.length > 0) {
    plan.push({ kind: "spacer" }, { kind: "section", text: "PLAYLIST" });
    data.playlists.forEach((p) => plan.push({ kind: "songSub", text: p.url }));
  }

  data.teams.forEach((team) => {
    plan.push({ kind: "spacer" }, { kind: "section", text: team.name.toUpperCase() });
    rolesForTeam(data, team.id).forEach((role) => {
      plan.push({ kind: "role", label: role.name, value: assignedName(data, team.id, role.id) });
    });
  });

  // Pre-measure wrapped line counts so canvas height is known before drawing.
  let height = 64;
  const wrapped: { line: DrawLine; extraLines: string[] }[] = [];
  for (const line of plan) {
    let extraLines: string[] = [];
    if (line.kind === "songSub" || line.kind === "subtitle") {
      measureCtx.font =
        line.kind === "subtitle" ? 'italic 400 18px "Newsreader"' : '400 14px "Newsreader"';
      extraLines = wrapText(measureCtx, line.text, contentWidth);
      height += LINE_HEIGHT[line.kind] * Math.max(1, extraLines.length);
    } else {
      height += LINE_HEIGHT[line.kind];
    }
    wrapped.push({ line, extraLines });
  }
  height += 48;

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  let y = 48;
  for (const { line, extraLines } of wrapped) {
    ctx.textBaseline = "top";
    switch (line.kind) {
      case "eyebrow":
        ctx.font = '600 12px "IBM Plex Mono"';
        ctx.fillStyle = ACCENT;
        ctx.fillText(line.text, paddingX, y);
        y += LINE_HEIGHT.eyebrow;
        break;
      case "title":
        ctx.font = '500 34px "Newsreader"';
        ctx.fillStyle = INK;
        ctx.fillText(line.text, paddingX, y);
        y += LINE_HEIGHT.title;
        break;
      case "subtitle":
        ctx.font = 'italic 400 18px "Newsreader"';
        ctx.fillStyle = INK2;
        (extraLines.length ? extraLines : [line.text]).forEach((l) => {
          ctx.fillText(l, paddingX, y);
          y += LINE_HEIGHT.subtitle;
        });
        break;
      case "section":
        ctx.font = '600 13px "IBM Plex Mono"';
        ctx.fillStyle = INK3;
        ctx.fillText(line.text, paddingX, y);
        ctx.strokeStyle = RULE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingX, y + 22);
        ctx.lineTo(width - paddingX, y + 22);
        ctx.stroke();
        y += LINE_HEIGHT.section;
        break;
      case "song":
        ctx.font = '500 19px "Newsreader"';
        ctx.fillStyle = INK;
        ctx.fillText(line.text, paddingX, y);
        y += LINE_HEIGHT.song;
        break;
      case "songAnchor":
        ctx.font = '600 13px "IBM Plex Mono"';
        ctx.fillStyle = ACCENT;
        ctx.fillText(line.text, paddingX + 16, y);
        y += LINE_HEIGHT.songAnchor;
        break;
      case "songSub":
        ctx.font = '400 14px "Newsreader"';
        ctx.fillStyle = INK2;
        (extraLines.length ? extraLines : [line.text]).forEach((l) => {
          ctx.fillText(l, paddingX + 16, y);
          y += LINE_HEIGHT.songSub;
        });
        break;
      case "role":
        ctx.font = '600 11px "IBM Plex Mono"';
        ctx.fillStyle = INK3;
        ctx.fillText(line.label.toUpperCase(), paddingX, y + 4);
        {
          const labelWidth = ctx.measureText(line.label.toUpperCase()).width;
          ctx.font = '400 16px "Newsreader"';
          ctx.fillStyle = INK;
          ctx.fillText(line.value, paddingX + labelWidth + 12, y);
        }
        y += LINE_HEIGHT.role;
        break;
      case "spacer":
        y += LINE_HEIGHT.spacer;
        break;
    }
  }

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.dateLabel.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-lineup.png`;
  a.click();
  URL.revokeObjectURL(url);
}

const ALL_TEAMS = "all";

export default function ShareMenu(props: ShareData) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scope, setScope] = useState<string>(ALL_TEAMS);

  function flashFeedback(message: string) {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 1800);
  }

  function scopedData(): ShareData {
    if (scope === ALL_TEAMS) return props;
    return { ...props, teams: props.teams.filter((t) => t.id === scope) };
  }

  async function handleCopyText() {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(buildShareText(scopedData()));
      flashFeedback("Copied!");
    } catch {
      flashFeedback("Couldn't copy");
    }
  }

  async function handleDownloadImage() {
    setOpen(false);
    try {
      await downloadAsImage(scopedData());
    } catch {
      flashFeedback("Couldn't generate image");
    }
  }

  const scopeOptionClass = (active: boolean) =>
    `rounded-in border px-2 py-1 font-mono text-[10px] font-medium tracking-[0.1em] uppercase ${
      active
        ? "border-accent bg-accent text-accent-foreground"
        : "border-rule text-ink2 hover:border-rule-strong"
    }`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-2 font-mono text-xs font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
      >
        Share ▾
      </button>
      {feedback && (
        <span className="absolute top-full left-0 mt-1 whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.1em] text-accent uppercase">
          {feedback}
        </span>
      )}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-64 rounded-lg border border-rule border-t-2 border-t-rule-strong bg-card py-2">
            <div className="px-3 pb-2">
              <p className="mb-1.5 font-mono text-[9px] font-medium tracking-[0.18em] text-ink3 uppercase">
                Team
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setScope(ALL_TEAMS)}
                  className={scopeOptionClass(scope === ALL_TEAMS)}
                >
                  All Teams
                </button>
                {props.teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setScope(team.id)}
                    className={scopeOptionClass(scope === team.id)}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-rule pt-1">
              <button
                onClick={handleCopyText}
                className="flex min-h-11 w-full items-center px-3 py-2 text-left font-mono text-[11px] font-medium tracking-[0.14em] text-ink2 uppercase hover:text-ink sm:min-h-0"
              >
                Copy as Text
              </button>
              <button
                onClick={handleDownloadImage}
                className="flex min-h-11 w-full items-center px-3 py-2 text-left font-mono text-[11px] font-medium tracking-[0.14em] text-ink2 uppercase hover:text-ink sm:min-h-0"
              >
                Download as Image
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
