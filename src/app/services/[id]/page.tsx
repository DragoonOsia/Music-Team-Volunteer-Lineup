import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteService, deletePlaylist, ensureServiceLineupSlots } from "@/lib/actions";
import AddSongModal from "@/components/AddSongModal";
import AddPlaylistModal from "@/components/AddPlaylistModal";
import EditPlaylistModal from "@/components/EditPlaylistModal";
import ServiceActionsMenu from "@/components/ServiceActionsMenu";
import ServiceLineupTabs from "@/components/ServiceLineupTabs";
import SongList from "@/components/SongList";
import ShareMenu from "@/components/ShareMenu";

const SECTION_LABEL =
  "mb-3 border-b-2 border-rule-strong pb-2 font-mono text-[11px] font-medium tracking-[0.2em] text-ink3 uppercase";
const DANGER_BUTTON =
  "inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-danger uppercase hover:border-danger sm:min-h-0";

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
    .select("id, service_date, title, archived")
    .eq("id", id)
    .single();

  if (!service) notFound();

  await ensureServiceLineupSlots(service.id);

  const [{ data: songs }, { data: playlists }, { data: teams }, { data: roles }, { data: volunteers }, { data: assignments }] =
    await Promise.all([
      supabase
        .from("songs")
        .select("id, name, singer_or_band, version, url, key, alt_key, bpm, time_signature_numerator, time_signature_denominator")
        .eq("service_id", id)
        .order("sort_order")
        .order("created_at"),
      supabase.from("playlists").select("id, url").eq("service_id", id).order("created_at"),
      supabase.from("teams").select("id, name").order("sort_order"),
      supabase.from("roles").select("id, name, instrument").order("sort_order"),
      supabase.from("volunteers").select("id, name, nickname, instruments").order("name"),
      supabase.from("service_lineup_assignments").select("team_id, role_id, person_id").eq("service_id", id),
    ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-ink sm:text-[42px]">
            {formatDate(service.service_date)}
          </h1>
          {service.title && (
            <p className="mt-1 font-serif text-lg text-ink2 italic">{service.title}</p>
          )}
          {service.archived && (
            <span className="mt-2 inline-block rounded-in border border-rule px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.14em] text-ink3 uppercase">
              Archived
            </span>
          )}
        </div>
        <form action={deleteService.bind(null, service.id)}>
          <button type="submit" className={DANGER_BUTTON}>
            Delete Service
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AddSongModal serviceId={service.id} />
        <ServiceActionsMenu serviceId={service.id} archived={service.archived} />
        <ShareMenu
          dateLabel={formatDate(service.service_date)}
          title={service.title}
          songs={songs ?? []}
          playlists={playlists ?? []}
          teams={teams ?? []}
          roles={roles ?? []}
          volunteers={volunteers ?? []}
          assignments={assignments ?? []}
        />
        {(playlists ?? []).length === 0 && <AddPlaylistModal serviceId={service.id} />}
      </div>

      <div>
        <h2 className={SECTION_LABEL}>Songs</h2>
        {(songs ?? []).length > 0 ? (
          <SongList serviceId={service.id} songs={songs ?? []} />
        ) : (
          <p className="py-6 text-center text-sm text-ink3 italic">
            No songs yet. Add one above.
          </p>
        )}
      </div>

      {(playlists ?? []).length > 0 && (
        <div>
          <h2 className={SECTION_LABEL}>Playlists</h2>
          <ul className="divide-y divide-rule">
            {(playlists ?? []).map((playlist) => (
              <li key={playlist.id} className="flex items-center justify-between gap-3 py-3">
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-btn bg-accent px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 sm:min-h-0"
                >
                  Playlist
                </a>
                <div className="flex shrink-0 items-center gap-2">
                  <EditPlaylistModal serviceId={service.id} playlist={playlist} />
                  <form action={deletePlaylist.bind(null, service.id, playlist.id)}>
                    <button type="submit" className={DANGER_BUTTON}>
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className={SECTION_LABEL}>Lineup</h2>
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
