import Link from "next/link";

interface NexGuildLogoProps {
  theme?: "gold" | "teal";
  className?: string;
  href?: string;
}

export function NexGuildLogo({ theme = "gold", className, href = "/" }: NexGuildLogoProps) {
  const accent = theme === "teal" ? "#14b8a6" : "#F59E0B";

  return (
    <Link href={href} aria-label="NexGuild — Home" className={className} style={{ display: "inline-flex", flexShrink: 0 }}>
      <svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <g transform="translate(22, 20)">
          <circle cx="0"   cy="0"  r="10" fill="#1a1a1a" stroke={accent} strokeWidth="1.5" />
          <circle cx="0"   cy="-6" r="4"  fill={accent} />
          <rect   x="-4"  y="-1"  width="8"  height="9" rx="4" fill={accent} />

          <circle cx="-16" cy="6"  r="7" fill="#1a1a1a" stroke={accent} strokeWidth="1" opacity="0.85" />
          <circle cx="-16" cy="2"  r="3" fill={accent} opacity="0.85" />
          <rect   x="-19"  y="6"  width="6" height="7" rx="3" fill={accent} opacity="0.85" />

          <circle cx="16" cy="6"  r="7" fill="#1a1a1a" stroke={accent} strokeWidth="1" opacity="0.85" />
          <circle cx="16" cy="2"  r="3" fill={accent} opacity="0.85" />
          <rect   x="13"  y="6"  width="6" height="7" rx="3" fill={accent} opacity="0.85" />

          <circle cx="-26" cy="14" r="5" fill="#1a1a1a" stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <circle cx="-26" cy="11" r="2.5" fill={accent} opacity="0.5" />

          <circle cx="26" cy="14" r="5" fill="#1a1a1a" stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <circle cx="26" cy="11" r="2.5" fill={accent} opacity="0.5" />
        </g>

        <text x="48" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#ffffff">
          Nex<tspan fill={accent}>Guild</tspan>
        </text>
        <text x="48" y="28" fontFamily="Arial, sans-serif" fontWeight="300" fontSize="5" fill={accent} letterSpacing="2" opacity="0.75">
          DIGITAL WORKFORCE
        </text>
      </svg>
    </Link>
  );
}
