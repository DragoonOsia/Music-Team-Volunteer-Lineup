import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureUpcomingSundays, archivePastServices } from "@/lib/actions";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusFor(totalSlots: number, filledSlots: number, hasSongs: boolean) {
  if (filledSlots === 0 && !hasSongs) {
    return { label: "NOT STARTED", className: "text-ink3" };
  }
  if (!hasSongs) {
    return { label: "NEEDS SETLIST", className: "text-danger" };
  }
  if (totalSlots > 0 && filledSlots === totalSlots) {
    return { label: "FULLY SET", className: "text-accent" };
  }
  const open = totalSlots - filledSlots;
  return { label: `${open} ROLE${open === 1 ? "" : "S"} OPEN`, className: "text-ink2" };
}

export default async function ServicesPage() {
  await archivePastServices();
  await ensureUpcomingSundays(3);

  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, service_date, title")
    .eq("archived", false)
    .order("service_date", { ascending: true });

  const serviceIds = (services ?? []).map((s) => s.id);

  const [{ data: assignments }, { data: songs }] =
    serviceIds.length > 0
      ? await Promise.all([
          supabase
            .from("service_lineup_assignments")
            .select("service_id, person_id")
            .in("service_id", serviceIds),
          supabase.from("songs").select("service_id").in("service_id", serviceIds),
        ])
      : [{ data: [] }, { data: [] }];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Services</h1>
          <p className="mt-1 font-serif text-lg text-ink2 italic">
            Pick a service to see its setlist and lineup.
          </p>
        </div>
        <Link
          href="/services/new"
          className="inline-flex min-h-11 items-center rounded-btn bg-accent px-4 py-2 font-mono text-xs font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 sm:min-h-0"
        >
          New Service
        </Link>
      </div>

      <ul className="divide-y divide-rule">
        {(services ?? []).map((service) => {
          const rows = (assignments ?? []).filter((a) => a.service_id === service.id);
          const totalSlots = rows.length;
          const filledSlots = rows.filter((a) => a.person_id).length;
          const hasSongs = (songs ?? []).some((s) => s.service_id === service.id);
          const status = statusFor(totalSlots, filledSlots, hasSongs);
          return (
            <li key={service.id}>
              <Link
                href={`/services/${service.id}`}
                className="flex items-center justify-between gap-4 py-4 hover:opacity-80"
              >
                <span className="text-[19px] text-ink">
                  {formatDate(service.service_date)}
                  {service.title ? ` — ${service.title}` : ""}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span
                    className={`font-mono text-[11px] font-medium tracking-[0.2em] uppercase ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <span aria-hidden className="text-ink3">
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {(!services || services.length === 0) && (
          <li className="py-6 text-center text-sm text-ink3 italic">
            No services yet. Create one to start building a lineup.
          </li>
        )}
      </ul>
    </div>
  );
}
