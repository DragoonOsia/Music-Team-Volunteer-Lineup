const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function KeyPicker({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onSelect(k)}
          className={`min-h-11 rounded-in border px-2 py-1.5 font-mono text-sm font-semibold transition-colors sm:min-h-0 ${
            k === value
              ? "border-accent bg-accent text-accent-foreground"
              : "border-rule bg-transparent text-ink hover:border-rule-strong"
          }`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
