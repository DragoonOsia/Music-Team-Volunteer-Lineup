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
      <div className="mb-4 flex gap-6 border-b border-rule">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setActiveTeamId(team.id)}
            className={`-mb-px border-b-2 pb-2 font-mono text-xs tracking-[0.14em] uppercase ${
              team.id === activeTeamId
                ? "border-accent font-semibold text-ink"
                : "border-transparent font-normal text-ink3 hover:text-ink"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <div className="divide-y divide-rule">
        {roles.map((role) => {
          const personId = assignmentByRole.get(role.id) ?? null;
          const volunteer = volunteers.find((v) => v.id === personId);
          const name = displayName(volunteer);
          return (
            <div key={role.id} className="flex items-baseline gap-3 py-3">
              <span className="shrink-0 font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase">
                {role.name}
              </span>
              <span className="flex-1 translate-y-[-4px] border-b border-dotted border-rule" />
              <span className="text-[19px] text-ink">
                {name ?? <em className="text-[17px] text-ink3 italic">Open</em>}
              </span>
            </div>
          );
        })}
        {roles.length === 0 && (
          <p className="py-6 text-center text-sm text-ink3 italic">
            No roles set up yet.
          </p>
        )}
      </div>
    </div>
  );
}
