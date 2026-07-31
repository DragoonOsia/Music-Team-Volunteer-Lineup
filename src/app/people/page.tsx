import { createClient } from "@/lib/supabase/server";
import { addPerson, deletePerson } from "@/lib/actions";

export default async function PeoplePage() {
  const supabase = await createClient();
  const { data: people } = await supabase
    .from("people")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Team Members</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Add everyone who can be scheduled. They&apos;ll show up in the lineup dropdowns.
        </p>
      </div>

      <form action={addPerson} className="flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-black/10 dark:divide-white/10">
        {(people ?? []).map((person) => (
          <li key={person.id} className="flex items-center justify-between py-2">
            <span>{person.name}</span>
            <form action={deletePerson.bind(null, person.id)}>
              <button
                type="submit"
                className="text-sm text-black/50 hover:text-red-600 dark:text-white/50"
              >
                Remove
              </button>
            </form>
          </li>
        ))}
        {(!people || people.length === 0) && (
          <li className="py-6 text-center text-sm text-black/50 dark:text-white/50">
            No team members yet. Add your first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
