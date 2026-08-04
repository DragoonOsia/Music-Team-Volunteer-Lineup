import { createClient } from "@/lib/supabase/server";
import { deleteVolunteer } from "@/lib/actions";
import AddVolunteerModal from "@/components/AddVolunteerModal";

export default async function VolunteersPage() {
  const supabase = await createClient();
  const { data: volunteers } = await supabase
    .from("volunteers")
    .select("id, name, nickname, instruments")
    .order("name");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Volunteers</h1>
          <p className="mt-1 font-serif text-lg text-ink2 italic">
            Everyone who can be scheduled onto a team.
          </p>
        </div>
        <AddVolunteerModal />
      </div>

      {volunteers && volunteers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-rule-strong">
                <th className="pb-2 pr-4 font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase">
                  Name
                </th>
                <th className="pb-2 pr-4 font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase">
                  Goes by
                </th>
                <th className="pb-2 pr-4 font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase">
                  Can play
                </th>
                <th className="pb-2 text-right font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v.id} className="border-b border-rule">
                  <td className="py-3 pr-4 text-[17px] text-ink">{v.name}</td>
                  <td className="py-3 pr-4 text-[17px] text-ink2">{v.nickname || "—"}</td>
                  <td className="py-3 pr-4">
                    {v.instruments.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {v.instruments.map((inst) => (
                          <span
                            key={inst}
                            className="rounded-in border border-rule px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-ink2 uppercase"
                          >
                            {inst}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink3 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <form action={deleteVolunteer.bind(null, v.id)}>
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-danger uppercase hover:border-danger sm:min-h-0"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-ink3 italic">
          No volunteers yet. Add your first one above.
        </p>
      )}
    </div>
  );
}
