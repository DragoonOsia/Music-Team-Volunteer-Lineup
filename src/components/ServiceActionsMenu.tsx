"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetServiceSongs, archiveService, unarchiveService } from "@/lib/actions";
import AddRoleModal from "@/components/AddRoleModal";

type Team = { id: string; name: string };

export default function ServiceActionsMenu({
  serviceId,
  archived,
  teams,
}: {
  serviceId: string;
  archived: boolean;
  teams: Team[];
}) {
  const [open, setOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleReset() {
    setOpen(false);
    if (!confirm("Reset this service's setlist? This removes every song added to it.")) {
      return;
    }
    if (!confirm("Are you sure? This can't be undone.")) {
      return;
    }
    startTransition(() => {
      resetServiceSongs(serviceId);
    });
  }

  function handleArchiveToggle() {
    setOpen(false);
    startTransition(async () => {
      if (archived) {
        await unarchiveService(serviceId);
      } else {
        await archiveService(serviceId);
        router.push("/services");
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-2 font-mono text-xs font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong disabled:opacity-50 sm:min-h-0"
      >
        Actions ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-rule border-t-2 border-t-rule-strong bg-card py-1">
            <button
              onClick={() => {
                setOpen(false);
                setAddRoleOpen(true);
              }}
              className="flex min-h-11 w-full items-center px-3 py-2 text-left font-mono text-[11px] font-medium tracking-[0.14em] text-ink2 uppercase hover:text-ink sm:min-h-0"
            >
              Add Role
            </button>
            <button
              onClick={handleArchiveToggle}
              className="flex min-h-11 w-full items-center px-3 py-2 text-left font-mono text-[11px] font-medium tracking-[0.14em] text-ink2 uppercase hover:text-ink sm:min-h-0"
            >
              {archived ? "Restore" : "Archive"}
            </button>
            <button
              onClick={handleReset}
              className="flex min-h-11 w-full items-center px-3 py-2 text-left font-mono text-[11px] font-medium tracking-[0.14em] text-danger uppercase hover:opacity-80 sm:min-h-0"
            >
              Reset Lineup
            </button>
          </div>
        </>
      )}
      <AddRoleModal open={addRoleOpen} onClose={() => setAddRoleOpen(false)} teams={teams} />
    </div>
  );
}
