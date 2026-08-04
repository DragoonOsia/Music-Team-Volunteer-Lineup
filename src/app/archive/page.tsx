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
        <h1 className="font-serif text-2xl text-ink">Archive</h1>
        <p className="mt-1 font-serif text-lg text-ink2 italic">
          Services you&apos;ve archived. Restore one to bring it back to the main list.
        </p>
      </div>

      <ul className="divide-y divide-rule">
        {(services ?? []).map((service) => (
          <li key={service.id} className="flex items-center justify-between gap-3 py-4">
            <Link href={`/services/${service.id}`} className="text-[19px] text-ink hover:opacity-80">
              {formatDate(service.service_date)}
              {service.title ? ` — ${service.title}` : ""}
            </Link>
            <form action={unarchiveService.bind(null, service.id)}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
              >
                Restore
              </button>
            </form>
          </li>
        ))}
        {(!services || services.length === 0) && (
          <li className="py-6 text-center text-sm text-ink3 italic">
            No archived services.
          </li>
        )}
      </ul>
    </div>
  );
}
