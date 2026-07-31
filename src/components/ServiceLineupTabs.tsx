"use client";

import { useState, useTransition } from "react";
import { updateServiceLineupAssignment } from "@/lib/actions";
import VolunteerCombobox from "@/components/VolunteerCombobox";

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

  // Error catcher: once someone is booked into a non-Vocals role, hide them
  // from every other non-Vocals role in this team so they can't accidentally
  // be double-booked on two instruments at once. Vocals roles are exempt.
  const bookedElsewhereNonVocals = (roleId: string) =>
    new Set(
      roles
        .filter((r) => r.instrument !== "Vocals" && r.id !== roleId)
        .map((r) => assignmentByRole.get(r.id))
        .filter((id): id is string => Boolean(id))
    );

  return (
    <div>
      <div className="mb-3 flex gap-2 border-b border-border">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setActiveTeamId(team.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              team.id === activeTeamId
                ? "border-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border rounded-lg border border-border px-4">
        {roles.map((role) => {
          const excluded = bookedElsewhereNonVocals(role.id);
          const eligible = volunteers.filter(
            (v) =>
              (role.instrument ? v.instruments.includes(role.instrument) : true) &&
              !excluded.has(v.id)
          );
          const currentPersonId = assignmentByRole.get(role.id) ?? null;

          return (
            <div key={role.id} className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm font-medium">{role.name}</span>
              <VolunteerCombobox
                key={`${activeTeamId}_${role.id}`}
                value={currentPersonId}
                volunteers={eligible}
                disabled={isPending}
                onChange={(personId) => {
                  startTransition(() => {
                    updateServiceLineupAssignment(serviceId, activeTeamId, role.id, personId);
                  });
                }}
              />
            </div>
          );
        })}
        {roles.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            No roles set up yet.
          </p>
        )}
      </div>
    </div>
  );
}
