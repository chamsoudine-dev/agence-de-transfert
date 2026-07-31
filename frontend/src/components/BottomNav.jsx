import { NavLink } from "react-router-dom";

/**
 * Barre de navigation inférieure — design fidèle à MyNita
 * Accès direct à l'Accueil, au Rechargement de compte et à l'Historique
 */
const items = [
  { to: "/", label: "Accueil", icon: HomeIcon },
  { to: "/recharger-client", label: "Recharger", icon: RechargeNavIcon },
  { to: "/historique", label: "Historique", icon: HistoryIcon },
  { to: "/carte", label: "Visa", icon: CardIcon },
  { to: "/reglages", label: "Réglage", icon: SettingsIcon },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#0F2C6B] text-white px-2 pt-3 pb-4 flex justify-around shadow-[0_-6px_24px_rgba(15,44,107,0.5)] z-30"
      style={{ borderTopLeftRadius: "18px", borderTopRightRadius: "18px" }}
    >
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 flex-1 py-0.5 text-[10px] font-semibold transition-colors relative ${
              isActive ? "text-[#E87040]" : "text-white/60"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={isActive ? "text-[#E87040]" : "text-white/60"}>
                <Icon />
              </span>
              {label}
              {/* Indicateur ligne active */}
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-[#E87040] rounded-full" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 4l9 8" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
function RechargeNavIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
