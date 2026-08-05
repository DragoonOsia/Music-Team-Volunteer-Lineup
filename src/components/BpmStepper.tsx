export default function BpmStepper({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (bpm: number | null) => void;
}) {
  const current = value ?? 0;

  return (
    <div className="flex w-fit items-center rounded-in border border-rule">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, current - 1))}
        className="flex min-h-11 min-w-11 items-center justify-center px-3 font-mono text-base text-ink3 hover:text-ink sm:min-h-0 sm:min-w-0 sm:text-sm"
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
        className="w-16 border-x border-rule bg-transparent px-2 py-1.5 text-center font-mono text-base [appearance:textfield] sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        className="flex min-h-11 min-w-11 items-center justify-center px-3 font-mono text-base text-ink3 hover:text-ink sm:min-h-0 sm:min-w-0 sm:text-sm"
        aria-label="Increase BPM"
      >
        +
      </button>
    </div>
  );
}
