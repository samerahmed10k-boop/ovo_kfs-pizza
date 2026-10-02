type Props = { size?: number; withText?: boolean; mono?: boolean };

export default function Logo({ size = 44, withText = true, mono = false }: Props) {
  const gold = mono ? "#1a1a1a" : "#f5b301";
  const red = mono ? "#555" : "#e03131";
  const cream = mono ? "#1a1a1a" : "#f3ece2";
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" aria-label="OVO logo">
        <defs>
          <linearGradient id="ovoG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gold} />
            <stop offset="100%" stopColor={mono ? "#1a1a1a" : "#ff8a00"} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill={mono ? "none" : "#0b0a09"} stroke="url(#ovoG)" strokeWidth="3" />
        {/* pizza slice */}
        <path d="M50 22 L74 66 A27 27 0 0 1 26 66 Z" fill="url(#ovoG)" opacity="0.95" />
        <circle cx="44" cy="56" r="4" fill={red} />
        <circle cx="58" cy="52" r="3.4" fill={red} />
        <circle cx="51" cy="66" r="3.4" fill={red} />
        <circle cx="50" cy="50" r="47" fill="none" stroke={cream} strokeWidth="1" opacity="0.35" />
      </svg>
      {withText && (
        <span className="d-flex flex-column lh-1">
          <span
            className="display-font"
            style={{ fontSize: size * 0.62, color: mono ? "#1a1a1a" : "#f3ece2" }}
          >
            OVO
          </span>
          <span
            style={{
              fontSize: size * 0.2,
              color: gold,
              letterSpacing: 2,
              fontWeight: 700,
            }}
          >
            PIZZA • 2014
          </span>
        </span>
      )}
    </span>
  );
}
