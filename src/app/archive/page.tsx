import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { unarchiveService } from "@/lib/actions";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, service_date, title")
    .eq("archived", true)
    .order("service_date", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Archive</h1>
        <p className="text-sm text-muted">
          Services you&apos;ve archived. Unarchive one to bring it back to the main list.
        </p>
      </div>

      <ul className="divide-y divide-border">
        {(services ?? []).map((service) => (
          <li key={service.id} className="flex items-center justify-between gap-3 py-3">
            <Link href={`/services/${service.id}`} className="hover:opacity-70">
              {formatDate(service.service_date)}
              {service.title ? ` — ${service.title}` : ""}
            </Link>
            <form action={unarchiveService.bind(null, service.id)}>
              <button
                type="submit"
                className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium hover:bg-surface"
              >
                Unarchive
              </button>
            </form>
          </li>
        ))}
        {(!services || services.length === 0) && (
          <li className="py-6 text-center text-sm text-muted">
            No archived services.
          </li>
        )}
      </ul>
    </div>
  );
}
