"use client";

import { useRef, useState, useTransition } from "react";
import { deleteSong, reorderSongs } from "@/lib/actions";
import EditSongModal from "@/components/EditSongModal";

type Song = {
  id: string;
  name: string;
  singer_or_band: string | null;
  version: string | null;
  url: string | null;
  key: string | null;
  alt_key: string | null;
  bpm: number | null;
  time_signature_numerator: number;
  time_signature_denominator: number;
};

const DANGER_BUTTON =
  "inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-danger uppercase hover:border-danger sm:min-h-0";

export default function SongList({
  serviceId,
  songs: initialSongs,
}: {
  serviceId: string;
  songs: Song[];
}) {
  const [songs, setSongs] = useState(initialSongs);
  // Re-sync from fresh server data (song added/edited/removed elsewhere)
  // without stomping an in-progress drag - same "adjust state during
  // render" pattern used by VolunteerCombobox, no Effect needed.
  const [lastSeenIds, setLastSeenIds] = useState(() => initialSongs.map((s) => s.id).join(","));
  const currentIds = initialSongs.map((s) => s.id).join(",");
  if (currentIds !== lastSeenIds) {
    setLastSeenIds(currentIds);
    setSongs(initialSongs);
  }

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const draggingRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [, startTransition] = useTransition();

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>, id: string) {
    e.preventDefault();
    draggingRef.current = true;
    setDraggedId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!draggingRef.current || !listRef.current) return;
    const rows = Array.from(listRef.current.children) as HTMLElement[];
    const overRow = rows.find((row) => {
      const rect = row.getBoundingClientRect();
      return e.clientY >= rect.top && e.clientY <= rect.bottom;
    });
    const overId = overRow?.dataset.songId;
    if (!overId || overId === draggedId) return;
    setSongs((prev) => {
      const fromIndex = prev.findIndex((s) => s.id === draggedId);
      const toIndex = prev.findIndex((s) => s.id === overId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDraggedId(null);
    startTransition(() => {
      reorderSongs(serviceId, songs.map((s) => s.id));
    });
  }

  if (songs.length === 0) return null;

  return (
    <ul ref={listRef} className="divide-y divide-rule">
      {songs.map((song) => (
        <li
          key={song.id}
          data-song-id={song.id}
          className={`flex items-center gap-2 py-4 ${draggedId === song.id ? "opacity-40" : ""}`}
        >
          <button
            type="button"
            aria-label="Drag to reorder"
            onPointerDown={(e) => handlePointerDown(e, song.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="flex h-11 w-11 shrink-0 touch-none items-center justify-center text-ink3 hover:text-ink active:cursor-grabbing"
            style={{ cursor: "grab" }}
          >
            ⠿
          </button>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[20px] text-ink">{song.name}</span>
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
              <div className="mt-0.5 text-sm text-ink2">
                {[song.singer_or_band, song.version].filter(Boolean).join(" — ")}
                {song.url && (
                  <>
                    {(song.singer_or_band || song.version) && " · "}
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline"
                    >
                      Link
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <EditSongModal serviceId={serviceId} song={song} />
              <form action={deleteSong.bind(null, serviceId, song.id)}>
                <button type="submit" className={DANGER_BUTTON}>
                  Remove
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
