import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureUpcomingSundays, ensureServiceLineupSlots, archivePastServices } from "@/lib/actions";
import ReadOnlyLineupTabs from "@/components/ReadOnlyLineupTabs";

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

  const [{ data: teams }, { data: roles }, { data: volunteers }, { data: assignments }, { data: playlists }] =
    await Promise.all([
      supabase.from("teams").select("id, name").order("sort_order"),
      supabase.from("roles").select("id, name").order("sort_order"),
      supabase.from("volunteers").select("id, name, nickname").order("name"),
      supabase.from("service_lineup_assignments").select("team_id, role_id, person_id").eq("service_id", service.id),
      supabase.from("playlists").select("id, url").eq("service_id", service.id).order("created_at"),
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
                  className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
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

      <ReadOnlyLineupTabs
        teams={teams ?? []}
        roles={roles ?? []}
        volunteers={volunteers ?? []}
        assignments={assignments ?? []}
      />
    </div>
  );
}
