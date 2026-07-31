"use client";

import { useState } from "react";

type Team = { id: string; name: string };
type Role = { id: string; name: string };
type Volunteer = { id: string; name: string; nickname: string | null };
type Assignment = { team_id: string; role_id: string; person_id: string | null };

function displayName(v: Volunteer | undefined) {
  if (!v) return null;
  return v.nickname || v.name;
}

export default function ReadOnlyLineupTabs({
  teams,
  roles,
  volunteers,
  assignments,
}: {
  teams: Team[];
  roles: Role[];
  volunteers: Volunteer[];
  assignments: Assignment[];
}) {
  const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id ?? "");

  const assignmentByRole = new Map(
    assignments
      .filter((a) => a.team_id === activeTeamId)
      .map((a) => [a.role_id, a.person_id])
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
          const personId = assignmentByRole.get(role.id) ?? null;
          const volunteer = volunteers.find((v) => v.id === personId);
          return (
            <div key={role.id} className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm font-medium">{role.name}</span>
              <span className="text-sm text-muted">
                {displayName(volunteer) ?? "Unassigned"}
              </span>
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
