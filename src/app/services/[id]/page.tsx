import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteService, deleteSong, deletePlaylist, ensureServiceLineupSlots } from "@/lib/actions";
import AddSongModal from "@/components/AddSongModal";
import AddPlaylistModal from "@/components/AddPlaylistModal";
import ServiceActionsMenu from "@/components/ServiceActionsMenu";
import ServiceLineupTabs from "@/components/ServiceLineupTabs";
import SongKeyModal from "@/components/SongKeyModal";
import EditSongModal from "@/components/EditSongModal";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("id, service_date, title")
    .eq("id", id)
    .single();

  if (!service) notFound();

  await ensureServiceLineupSlots(service.id);

  const [{ data: songs }, { data: playlists }, { data: teams }, { data: roles }, { data: volunteers }, { data: assignments }] =
    await Promise.all([
      supabase.from("songs").select("id, name, singer_or_band, version, url, key, bpm").eq("service_id", id).order("created_at"),
      supabase.from("playlists").select("id, url").eq("service_id", id).order("created_at"),
      supabase.from("teams").select("id, name").order("sort_order"),
      supabase.from("roles").select("id, name, instrument").order("sort_order"),
      supabase.from("volunteers").select("id, name, nickname, instruments").order("name"),
      supabase.from("service_lineup_assignments").select("team_id, role_id, person_id").eq("service_id", id),
    ]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{formatDate(service.service_date)}</h1>
          {service.title && (
            <p className="text-sm text-muted">{service.title}</p>
          )}
        </div>
        <form action={deleteService.bind(null, service.id)}>
          <button
            type="submit"
            className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-danger hover:border-danger hover:bg-surface"
          >
            Delete service
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AddSongModal serviceId={service.id} />
        <ServiceActionsMenu serviceId={service.id} />
        <AddPlaylistModal serviceId={service.id} />
      </div>

      <div>
        <h2 className="mb-2 text-base font-semibold">Songs</h2>
        <ul className="divide-y divide-border">
          {(songs ?? []).map((song) => (
            <li key={song.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <div className="flex items-center gap-2 font-medium">
                  {song.name}
                  <SongKeyModal serviceId={service.id} songId={song.id} currentKey={song.key} />
                  {song.bpm !== null && (
                    <span className="text-xs text-muted">{song.bpm} BPM</span>
                  )}
                </div>
                <div className="text-sm text-muted">
                  {[song.singer_or_band, song.version].filter(Boolean).join(" — ")}
                  {song.url && (
                    <>
                      {(song.singer_or_band || song.version) && " · "}
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Link
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <EditSongModal serviceId={service.id} song={song} />
                <form action={deleteSong.bind(null, service.id, song.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-danger hover:border-danger hover:bg-surface"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </li>
          ))}
          {Array.from({ length: Math.max(0, 3 - (songs?.length ?? 0)) }, (_, i) => (
            <li key={`empty-${i}`} className="flex items-center justify-between gap-3 py-3">
              <span className="text-sm text-muted italic">Empty slot</span>
              <AddSongModal
                serviceId={service.id}
                triggerLabel="Edit"
                triggerClassName="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium hover:bg-surface"
              />
            </li>
          ))}
        </ul>
      </div>

      {(playlists ?? []).length > 0 && (
        <div>
          <h2 className="mb-2 text-base font-semibold">Playlists</h2>
          <ul className="divide-y divide-border">
            {(playlists ?? []).map((playlist) => (
              <li key={playlist.id} className="flex items-center justify-between gap-3 py-2">
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate underline"
                >
                  {playlist.url}
                </a>
                <form action={deletePlaylist.bind(null, service.id, playlist.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-danger hover:border-danger hover:bg-surface"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="mb-2 text-base font-semibold">Lineup</h2>
        <ServiceLineupTabs
          serviceId={service.id}
          teams={teams ?? []}
          roles={roles ?? []}
          volunteers={volunteers ?? []}
          assignments={assignments ?? []}
        />
      </div>
    </div>
  );
}
