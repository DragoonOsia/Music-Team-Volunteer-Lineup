"use client";

import { useTransition } from "react";
import { updateAssignment } from "@/lib/actions";

type Person = { id: string; name: string };

export default function RoleAssignmentRow({
  serviceId,
  roleId,
  roleName,
  people,
  currentPersonId,
}: {
  serviceId: string;
  roleId: string;
  roleName: string;
  people: Person[];
  currentPersonId: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium">{roleName}</span>
      <select
        defaultValue={currentPersonId ?? ""}
        disabled={isPending}
        onChange={(e) => {
          const personId = e.target.value;
          startTransition(() => {
            updateAssignment(serviceId, roleId, personId);
          });
        }}
        className="min-w-[180px] rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/15 dark:bg-black"
      >
        <option value="">— Unassigned —</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </div>
  );
}
