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
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">No upcoming service</h1>
        <p className="text-sm text-muted">
          Nothing scheduled yet.{" "}
          <Link href="/services" className="underline">
            Go to Services
          </Link>{" "}
          to add one.
        </p>
      </div>
    );
  }

  await ensureServiceLineupSlots(service.id);

  const [{ data: teams }, { data: roles }, { data: volunteers }, { data: assignments }] =
    await Promise.all([
      supabase.from("teams").select("id, name").order("sort_order"),
      supabase.from("roles").select("id, name").order("sort_order"),
      supabase.from("volunteers").select("id, name, nickname").order("name"),
      supabase.from("service_lineup_assignments").select("team_id, role_id, person_id").eq("service_id", service.id),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">Upcoming Sunday</p>
          <h1 className="text-xl font-semibold">{formatDate(service.service_date)}</h1>
          {service.title && <p className="text-sm text-muted">{service.title}</p>}
        </div>
        <Link
          href={`/services/${service.id}`}
          className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium hover:bg-surface"
        >
          Edit service →
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
