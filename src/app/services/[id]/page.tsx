import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteService } from "@/lib/actions";
import RoleAssignmentRow from "@/components/RoleAssignmentRow";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ServiceLineupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: service }, { data: roles }, { data: people }, { data: assignments }] =
    await Promise.all([
      supabase.from("services").select("id, service_date, title").eq("id", id).single(),
      supabase.from("roles").select("id, name").order("sort_order"),
      supabase.from("people").select("id, name").order("name"),
      supabase.from("lineup_assignments").select("role_id, person_id").eq("service_id", id),
    ]);

  if (!service) notFound();

  const assignmentByRole = new Map(
    (assignments ?? []).map((a) => [a.role_id, a.person_id])
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{formatDate(service.service_date)}</h1>
          {service.title && (
            <p className="text-sm text-black/60 dark:text-white/60">{service.title}</p>
          )}
        </div>
        <form action={deleteService.bind(null, service.id)}>
          <button
            type="submit"
            className="text-sm text-black/50 hover:text-red-600 dark:text-white/50"
          >
            Delete service
          </button>
        </form>
      </div>

      <div className="divide-y divide-black/10 dark:divide-white/10">
        {(roles ?? []).map((role) => (
          <RoleAssignmentRow
            key={role.id}
            serviceId={service.id}
            roleId={role.id}
            roleName={role.name}
            people={people ?? []}
            currentPersonId={assignmentByRole.get(role.id) ?? null}
          />
        ))}
        {(!roles || roles.length === 0) && (
          <p className="py-6 text-center text-sm text-black/50 dark:text-white/50">
            No roles set up yet. Add rows to the &quot;roles&quot; table in Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
