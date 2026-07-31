"use client";

import { useState, useTransition } from "react";
import { updateServiceLineupAssignment } from "@/lib/actions";

type Team = { id: string; name: string };
type Role = { id: string; name: string; instrument: string | null };
type Volunteer = { id: string; name: string; instruments: string[] };
type Assignment = { team_id: string; role_id: string; person_id: string | null };

export default function ServiceLineupTabs({
  serviceId,
  teams,
  roles,
  volunteers,
  assignments,
}: {
  serviceId: string;
  teams: Team[];
  roles: Role[];
  volunteers: Volunteer[];
  assignments: Assignment[];
}) {
  const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  const assignmentByRole = new Map(
    assignments
      .filter((a) => a.team_id === activeTeamId)
      .map((a) => [a.role_id, a.person_id])
  );

  return (
    <div>
      <div className="mb-3 flex gap-2 border-b border-black/10 dark:border-white/10">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setActiveTeamId(team.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              team.id === activeTeamId
                ? "border-foreground"
                : "border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <div className="divide-y divide-black/10 rounded-lg border border-black/10 px-4 dark:divide-white/10 dark:border-white/10">
        {roles.map((role) => {
          const eligible = volunteers.filter((v) =>
            role.instrument ? v.instruments.includes(role.instrument) : true
          );
          const currentPersonId = assignmentByRole.get(role.id) ?? null;

          return (
            <div key={role.id} className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm font-medium">{role.name}</span>
              <select
                key={`${activeTeamId}_${role.id}`}
                defaultValue={currentPersonId ?? ""}
                disabled={isPending}
                onChange={(e) => {
                  const personId = e.target.value;
                  startTransition(() => {
                    updateServiceLineupAssignment(serviceId, activeTeamId, role.id, personId);
                  });
                }}
                className="min-w-[180px] rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/15 dark:bg-black"
              >
                <option value="">— Unassigned —</option>
                {eligible.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
        {roles.length === 0 && (
          <p className="py-6 text-center text-sm text-black/50 dark:text-white/50">
            No roles set up yet.
          </p>
        )}
      </div>
    </div>
  );
}
