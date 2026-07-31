export default function BpmStepper({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (bpm: number | null) => void;
}) {
  const current = value ?? 0;

  return (
    <div className="flex w-fit items-center rounded-md border border-border-strong">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, current - 1))}
        className="px-3 py-1.5 text-sm text-muted hover:text-foreground"
        aria-label="Decrease BPM"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ""}
        placeholder="0"
        onChange={(e) => {
          const n = e.target.value === "" ? null : Number(e.target.value);
          onChange(n === null || Number.isNaN(n) ? null : Math.max(0, n));
        }}
        className="w-14 border-x border-border-strong bg-transparent px-2 py-1.5 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        className="px-3 py-1.5 text-sm text-muted hover:text-foreground"
        aria-label="Increase BPM"
      >
        +
      </button>
    </div>
  );
}
