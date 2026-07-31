import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureUpcomingSundays } from "@/lib/actions";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  await ensureUpcomingSundays(3);

  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, service_date, title")
    .eq("archived", false)
    .order("service_date", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Services</h1>
          <p className="text-sm text-muted">
            Pick a service to see its setlist and lineup.
          </p>
        </div>
        <Link
          href="/services/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
        >
          New Service
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {(services ?? []).map((service) => (
          <li key={service.id}>
            <Link
              href={`/services/${service.id}`}
              className="flex items-center justify-between py-3 hover:opacity-70"
            >
              <span>
                {formatDate(service.service_date)}
                {service.title ? ` — ${service.title}` : ""}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
        {(!services || services.length === 0) && (
          <li className="py-6 text-center text-sm text-muted">
            No services yet. Create one to start building a lineup.
          </li>
        )}
      </ul>
    </div>
  );
}
