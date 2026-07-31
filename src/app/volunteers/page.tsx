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
          <h1 className="text-xl font-semibold">Volunteers</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Everyone who can be scheduled onto a team.
          </p>
        </div>
        <AddVolunteerModal />
      </div>

      <ul className="divide-y divide-black/10 dark:divide-white/10">
        {(volunteers ?? []).map((v) => (
          <li key={v.id} className="flex items-center justify-between gap-3 py-3">
            <div>
              <div className="font-medium">
                {v.name}
                {v.nickname && (
                  <span className="text-black/50 dark:text-white/50"> &quot;{v.nickname}&quot;</span>
                )}
              </div>
              {v.instruments.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {v.instruments.map((inst) => (
                    <span
                      key={inst}
                      className="rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <form action={deleteVolunteer.bind(null, v.id)}>
              <button
                type="submit"
                className="text-sm text-black/50 hover:text-red-600 dark:text-white/50"
              >
                Remove
              </button>
            </form>
          </li>
        ))}
        {(!volunteers || volunteers.length === 0) && (
          <li className="py-6 text-center text-sm text-black/50 dark:text-white/50">
            No volunteers yet. Add your first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
