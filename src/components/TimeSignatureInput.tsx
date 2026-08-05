export default function TimeSignatureInput({
  numerator,
  denominator,
  onChange,
}: {
  numerator: number;
  denominator: number;
  onChange: (next: { numerator: number; denominator: number }) => void;
}) {
  return (
    <div className="flex w-fit items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={numerator}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange({ numerator: Number.isFinite(n) && n > 0 ? n : 1, denominator });
        }}
        className="h-[46px] w-[46px] rounded-in border border-rule bg-transparent text-center font-mono text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="font-mono text-base text-ink3">/</span>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={denominator}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange({ numerator, denominator: Number.isFinite(n) && n > 0 ? n : 1 });
        }}
        className="h-[46px] w-[46px] rounded-in border border-rule bg-transparent text-center font-mono text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
