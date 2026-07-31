export default function Logo({ size = "md", withTagline = true, light = false }) {
  const dims = {
    sm: { badge: 40, text: "text-lg" },
    md: { badge: 64, text: "text-2xl" },
    lg: { badge: 96, text: "text-4xl" },
  }[size];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <svg width={dims.badge} height={dims.badge} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke={light ? "#fff" : "#0F2C6B"} strokeWidth="2.5" opacity="0.35" />
          <circle cx="32" cy="32" r="23" fill={light ? "rgba(255,255,255,0.08)" : "#0F2C6B"} />
          <path
            d="M20 34c0-7 5.5-12.5 12.5-12.5S45 27 45 34"
            stroke="#E1332C"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M45 34l-5-1 2 5" stroke="#E1332C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text
            x="32"
            y="41"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontWeight="800"
            fontSize="20"
            fill="#fff"
          >
            R
          </text>
        </svg>
        <span className={`font-display font-extrabold ${dims.text} ${light ? "text-white" : "text-ricardo-blue"}`}>
          Ricardo
        </span>
      </div>
      {withTagline && (
        <span className={`text-[11px] tracking-widest mt-1 font-semibold ${light ? "text-white/80" : "text-ricardo-red"}`}>
          TRANSFERT D&apos;ARGENT
        </span>
      )}
    </div>
  );
}
