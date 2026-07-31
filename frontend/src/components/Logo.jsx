/**
 * Logo My Nita — reproduction fidèle du logo original
 * "my" en orange italic, téléphone incliné, flèche circulaire bleue,
 * "NITA" en bleu marine bold, flèche orange, "TRANSFERT D'ARGENT" en bas
 */
export default function Logo({ size = "md", light = false }) {
  const scale = { sm: 0.55, md: 0.80, lg: 1.15 }[size] || 0.80;
  const w = Math.round(220 * scale);
  const h = Math.round(220 * scale);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Flèche circulaire bleue (arc autour du téléphone) ── */}
      <path
        d="M 110 28 A 68 68 0 1 1 55 62"
        stroke="#0F2C6B"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pointe de flèche orange en haut à gauche */}
      <polygon points="50,38 44,62 68,56" fill="#E87040" />

      {/* ── Téléphone incliné (bleu + orange) ── */}
      <g transform="rotate(-18, 130, 70)">
        {/* Corps du téléphone */}
        <rect x="112" y="30" width="36" height="58" rx="5" fill="#0F2C6B" />
        {/* Écran orange */}
        <rect x="116" y="37" width="28" height="38" rx="3" fill="#E87040" />
        {/* Bouton home */}
        <circle cx="130" cy="81" r="3" fill="white" />
        {/* Lignes écran */}
        <line x1="120" y1="43" x2="140" y2="43" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="49" x2="136" y2="49" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="55" x2="138" y2="55" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* ── "my" en orange italic ── */}
      <text
        x="28"
        y="118"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="42"
        fill="#E87040"
      >
        my
      </text>

      {/* ── "NITA" en bleu marine bold ── */}
      <text
        x="20"
        y="163"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="900"
        fontSize="56"
        fill="#0F2C6B"
        letterSpacing="2"
      >
        NITA
      </text>

      {/* ── Petite flèche orange diagonale après NITA ── */}
      <g transform="translate(185, 130) rotate(0)">
        <line x1="0" y1="22" x2="20" y2="2" stroke="#E87040" strokeWidth="5" strokeLinecap="round" />
        <polygon points="20,2 6,2 20,16" fill="#E87040" />
      </g>

      {/* ── "TRANSFERT D'ARGENT" en bleu ── */}
      <text
        x="110"
        y="195"
        textAnchor="middle"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#0F2C6B"
        letterSpacing="0.8"
      >
        TRANSFERT D&apos;ARGENT
      </text>
    </svg>
  );
}
