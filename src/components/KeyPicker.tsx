const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function KeyPicker({
  value,
  onSelect,
  disabledValue,
}: {
  value: string | null;
  onSelect: (key: string) => void;
  disabledValue?: string | null;
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {KEYS.map((k) => {
        const isDisabled = k === disabledValue && k !== value;
        return (
          <button
            key={k}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect(k)}
            className={`min-h-11 rounded-in border px-2 py-1.5 font-mono text-sm font-semibold transition-colors sm:min-h-0 ${
              k === value
                ? "border-accent bg-accent text-accent-foreground"
                : isDisabled
                  ? "cursor-not-allowed border-rule bg-transparent text-ink3 opacity-40"
                  : "border-rule bg-transparent text-ink hover:border-rule-strong"
            }`}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
