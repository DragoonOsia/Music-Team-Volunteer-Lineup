import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureUpcomingSundays, ensureServiceLineupSlots, archivePastServices } from "@/lib/actions";
import ReadOnlyLineupTabs from "@/components/ReadOnlyLineupTabs";

const SECTION_LABEL =
  "mb-3 border-b-2 border-rule-strong pb-2 font-mono text-[11px] font-medium tracking-[0.2em] text-ink3 uppercase";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function Home() {
  await archivePastServices();
  await ensureUpcomingSundays(3);

  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("id, service_date, title")
    .eq("archived", false)
    .gte("service_date", todayKey())
    .order("service_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!service) {
    return (
      <div className="space-y-3">
        <h1 className="font-serif text-2xl text-ink">No upcoming service</h1>
        <p className="font-serif text-lg text-ink2 italic">
          Nothing scheduled yet.{" "}
          <Link href="/services" className="text-accent not-italic underline">
            Go to Services
          </Link>{" "}
          to add one.
        </p>
      </div>
    );
  }

  await ensureServiceLineupSlots(service.id);

  const [{ data: teams }, { data: roles }, { data: volunteers }, { data: assignments }, { data: playlists }, { data: songs }] =
    await Promise.all([
      supabase.from("teams").select("id, name").order("sort_order"),
      supabase.from("roles").select("id, name").order("sort_order"),
      supabase.from("volunteers").select("id, name, nickname").order("name"),
      supabase.from("service_lineup_assignments").select("team_id, role_id, person_id").eq("service_id", service.id),
      supabase.from("playlists").select("id, url").eq("service_id", service.id).order("created_at"),
      supabase
        .from("songs")
        .select("id, name, singer_or_band, version, key, alt_key, anchor_id, bpm, time_signature_numerator, time_signature_denominator")
        .eq("service_id", service.id)
        .order("sort_order")
        .order("created_at"),
    ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-[26px] leading-[1.05] text-ink sm:text-[36px]">
            {formatDate(service.service_date)}
          </h1>
          {service.title && (
            <p className="mt-2 font-serif text-lg text-ink2 italic">{service.title}</p>
          )}
          {(playlists ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(playlists ?? []).map((playlist) => (
                <a
                  key={playlist.id}
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-btn bg-accent px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 sm:min-h-0"
                >
                  Playlist
                </a>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/services/${service.id}`}
          className="inline-flex min-h-11 w-fit items-center rounded-btn border border-rule px-4 py-2 font-mono text-xs font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
        >
          Edit Service →
        </Link>
      </div>

      {(songs ?? []).length > 0 && (
        <div>
          <h2 className={SECTION_LABEL}>Songs</h2>
          <ul className="divide-y divide-rule">
            {(songs ?? []).map((song) => {
              const anchor = (volunteers ?? []).find((v) => v.id === song.anchor_id);
              return (
                <li key={song.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[20px] text-ink">{song.name}</span>
                    {anchor && (
                      <span className="inline-flex items-center gap-1.5 rounded-in border border-accent bg-accent px-2 py-0.5 text-accent-foreground">
                        <span className="font-mono text-[10px] font-semibold tracking-[0.08em] uppercase">
                          Anchor
                        </span>
                        <span className="text-xs font-medium">
                          {anchor.nickname || anchor.name}
                        </span>
                      </span>
                    )}
                    {(song.key || song.alt_key) && (
                      <span className="rounded-in border border-rule bg-card px-1.5 py-0.5 font-mono text-xs font-semibold text-ink">
                        {[song.key, song.alt_key].filter(Boolean).join(" / ")}
                      </span>
                    )}
                    {song.bpm !== null && (
                      <span className="font-mono text-xs text-ink3">{song.bpm} BPM</span>
                    )}
                    <span className="font-mono text-xs text-ink3">
                      {song.time_signature_numerator}/{song.time_signature_denominator}
                    </span>
                  </div>
                  {(song.singer_or_band || song.version) && (
                    <div className="mt-0.5 text-sm text-ink2">
                      {[song.singer_or_band, song.version].filter(Boolean).join(" — ")}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <h2 className={SECTION_LABEL}>Lineup</h2>
        <ReadOnlyLineupTabs
          teams={teams ?? []}
          roles={roles ?? []}
          volunteers={volunteers ?? []}
          assignments={assignments ?? []}
        />
      </div>
    </div>
  );
}
