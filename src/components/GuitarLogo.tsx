export default function GuitarLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <ellipse cx="19" cy="33" rx="12" ry="9" fill="currentColor" />
      <ellipse cx="24" cy="20" rx="7.5" ry="8" fill="currentColor" />
      <circle cx="19" cy="33" r="4" fill="var(--background)" />
      <rect x="21.5" y="4" width="4" height="18" rx="1.5" fill="currentColor" />
      <rect x="20" y="4" width="7" height="3" rx="1" fill="currentColor" />
      <line x1="22.3" y1="8" x2="22.3" y2="33" stroke="var(--background)" strokeWidth="0.6" />
      <line x1="23.3" y1="8" x2="23.3" y2="33" stroke="var(--background)" strokeWidth="0.6" />
      <line x1="24.3" y1="8" x2="24.3" y2="33" stroke="var(--background)" strokeWidth="0.6" />
    </svg>
  );
}
