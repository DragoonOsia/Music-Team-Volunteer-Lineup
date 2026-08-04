import { addService } from "@/lib/actions";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">New Service</h1>
        <p className="text-sm text-muted">
          Add a date and we&apos;ll set up an empty lineup you can fill in.
        </p>
      </div>

      <form action={addService} className="space-y-4">
        <div>
          <label htmlFor="service_date" className="mb-1 block text-sm font-medium">
            Date
          </label>
          <input
            id="service_date"
            type="date"
            name="service_date"
            required
            className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title <span className="text-muted">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="e.g. Sunday Service"
            className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
        >
          Create Service
        </button>
      </form>
    </div>
  );
}
