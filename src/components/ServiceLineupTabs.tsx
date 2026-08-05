"use client";

import { useState } from "react";
import { updateServiceLineupAssignment } from "@/lib/actions";
import VolunteerCombobox from "@/components/VolunteerCombobox";

type Team = { id: string; name: string };
type Role = { id: string; name: string; instrument: string | null };
type Volunteer = { id: string; name: string; nickname: string | null; instruments: string[] };
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

  const assignmentByRole = new Map(
    assignments
      .filter((a) => a.team_id === activeTeamId)
      .map((a) => [a.role_id, a.person_id])
  );

  // Error catcher: once someone is booked into a real instrument role, hide
  // them from every other instrument role in this team so they can't
  // accidentally be double-booked on two instruments at once. Vocals and
  // Musical Director are exempt - picking either never blocks (or gets
  // blocked by) picking one instrument.
  const EXEMPT_INSTRUMENTS = new Set(["Vocals", "Musical Director"]);
  const bookedElsewhereNonExempt = (roleId: string) =>
    new Set(
      roles
        .filter((r) => !EXEMPT_INSTRUMENTS.has(r.instrument ?? "") && r.id !== roleId)
        .map((r) => assignmentByRole.get(r.id))
        .filter((id): id is string => Boolean(id))
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
          // Exempt roles (Vocals, Musical Director) show everyone who has the
          // skill, full stop - an instrument booking elsewhere never hides
          // them here. Only non-exempt (real instrument) roles exclude people
          // already booked on another instrument.
          const isExemptRole = EXEMPT_INSTRUMENTS.has(role.instrument ?? "");
          const excluded = isExemptRole ? new Set<string>() : bookedElsewhereNonExempt(role.id);
          const eligible = volunteers.filter(
            (v) =>
              (role.instrument ? v.instruments.includes(role.instrument) : true) &&
              !excluded.has(v.id)
          );
          const currentPersonId = assignmentByRole.get(role.id) ?? null;

          return (
            <div
              key={role.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="shrink-0 font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase sm:w-40">
                {role.name}
              </span>
              <VolunteerCombobox
                key={`${activeTeamId}_${role.id}`}
                value={currentPersonId}
                volunteers={eligible}
                onChange={(personId) =>
                  updateServiceLineupAssignment(serviceId, activeTeamId, role.id, personId)
                }
              />
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
