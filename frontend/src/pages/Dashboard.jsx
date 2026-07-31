import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Logo from "../components/Logo.jsx";

/**
 * Actions principales du tableau de bord
 * (identiques à MyNita mais avec branding Ricardo)
 */
const menuItems = [
  {
    label: "Envoyer de\nl'argent",
    to: "/envoyer",
    bg: "#EDF2FF",
    iconColor: "#6C8EEF",
    icon: <SendIcon />,
  },
  {
    label: "Compte à\ncompte",
    to: "/compte-a-compte",
    bg: "#E8F8F5",
    iconColor: "#3BB5A0",
    icon: <TransferIcon />,
  },
  {
    label: "Envoi à moi\nmême",
    to: "/envoyer",
    bg: "#FEF0EB",
    iconColor: "#E87040",
    icon: <SelfIcon />,
  },
  {
    label: "Encaisser\nun envoi",
    to: "/recharger",
    bg: "#FDE8EC",
    iconColor: "#E84068",
    icon: <WalletIcon />,
  },
  {
    label: "Achat de\ncrédit",
    to: "#",
    bg: "#E8F8ED",
    iconColor: "#3CB86A",
    icon: <CreditIcon />,
  },
  {
    label: "Services\nPaiement",
    to: "#",
    bg: "#EDE8F8",
    iconColor: "#8B5CF6",
    icon: <PayIcon />,
  },
  {
    label: "Transfert\nbancaire",
    to: "#",
    bg: "#FDE8F0",
    iconColor: "#D6457A",
    icon: <BankIcon />,
  },
  {
    label: "Transfert\ninternational",
    to: "#",
    bg: "#FFF0E0",
    iconColor: "#E87040",
    icon: <GlobalIcon />,
  },
  {
    label: "Recharger\nun client",
    to: "/recharger-client",
    bg: "#E8F0FE",
    iconColor: "#1A73E8",
    icon: <RechargeClientIcon />,
  },
];

export default function Dashboard() {
  const { wallet, refreshWallet } = useAuth();
  const [hidden, setHidden] = useState(true);

  const fullName = wallet
    ? `${wallet.firstName} ${wallet.lastName}`.toUpperCase()
    : "...";

  const phone = wallet
    ? `+${(wallet.countryCode || "227").replace("+", "")}${wallet.phone}`
    : "...";

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* ─── Header orange ─────────────────────────────────── */}
      <div className="bg-ricardo-red px-5 pt-5 pb-14 rounded-b-[32px] shadow-lg">
        <div className="flex items-start justify-between text-white">
          {/* Gauche : menu + logo My Nita */}
          <div className="flex items-start gap-3">
            <button id="btn-menu" className="mt-1">
              <MenuIcon />
            </button>
            <div>
              {/* Logo My Nita : my italic orange + NITA bleu → sur fond orange on inverse */}
              <div className="flex items-baseline gap-0.5 leading-none">
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontStyle: "italic",
                    fontSize: "15px",
                    color: "#FFD4B8",
                    letterSpacing: "-0.5px",
                  }}
                >
                  my
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 900,
                    fontSize: "17px",
                    color: "#ffffff",
                    letterSpacing: "1px",
                  }}
                >
                  Nita
                </span>
              </div>
              <p className="text-xs text-white/70 leading-tight">Bienvenue</p>
              <p className="font-bold text-white text-sm mt-0.5">{fullName}</p>
            </div>
          </div>
          {/* Droite : notif + tel + langue */}
          <div className="flex items-center gap-3 mt-1">
            <button id="btn-notifications" className="relative">
              <BellIcon />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0F2C6B] rounded-full text-[9px] flex items-center justify-center font-bold">
                5
              </span>
            </button>
            <button id="btn-call">
              <PhoneCallIcon />
            </button>
            <div className="bg-white/20 rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
              fr
              <ChevronDownSmall />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Carte Solde ───────────────────────────────────── */}
      <div className="px-4 -mt-10 z-10">
        <div className="bg-white rounded-3xl shadow-card p-5">
          {/* En-tête carte */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-ricardo-red font-bold text-base">
              Solde principal
            </p>
            <button
              id="btn-refresh"
              onClick={refreshWallet}
              className="text-ricardo-blue"
            >
              <RefreshIcon />
            </button>
          </div>

          {/* Montant */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-2xl font-extrabold text-ricardo-blue tracking-widest font-display">
              {hidden
                ? "* * * * * * * *"
                : `${wallet?.balance?.toLocaleString("fr-FR") ?? 0} ${wallet?.currency ?? "CFA"}`}
            </p>
            <button
              id="btn-toggle-balance"
              onClick={() => setHidden((h) => !h)}
              className="text-gray-400"
            >
              <EyeIcon />
            </button>
          </div>

          {/* Numéro de compte */}
          <div className="flex items-center justify-between">
            <p className="text-ricardo-blue font-bold text-base">{phone}</p>
            <div className="flex gap-3 text-ricardo-blue">
              <button id="btn-copy-phone">
                <CopyIcon />
              </button>
              <button id="btn-qrcode">
                <QrIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bannière Accès Rapide Rechargement Client ────── */}
      <div className="px-4 mt-3">
        <Link
          to="/recharger-client"
          className="bg-gradient-to-r from-[#0F2C6B] to-[#1e4db7] text-white rounded-2xl p-4 flex items-center justify-between shadow-md active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <p className="font-bold text-sm">Recharger un compte client</p>
              <p className="text-xs text-white/70">Afficher la liste des comptes & créditer un numéro</p>
            </div>
          </div>
          <span className="bg-[#E87040] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
            Recharger →
          </span>
        </Link>
      </div>

      {/* ─── Grille d'actions ──────────────────────────────── */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-3xl shadow-card p-4">
          <div className="grid grid-cols-4 gap-y-5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.bg, color: item.iconColor }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-[10px] font-semibold text-gray-700 leading-tight"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bouton flottant ───────────────────────────────── */}
      <div className="fixed bottom-20 right-4 z-20">
        <button
          id="btn-floating"
          className="w-14 h-14 bg-ricardo-blue rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <FloatIcon />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

/* ─── Icônes du header ───────────────────────────────────── */
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function PhoneCallIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.24 1.07h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function ChevronDownSmall() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Icônes de la carte ─────────────────────────────────── */
function RefreshIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2C6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8l4 4-4 4" />
    </svg>
  );
}
function QrIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h0M17 14h0" />
    </svg>
  );
}
function FloatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/* ─── Icônes des actions ─────────────────────────────────── */
function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function TransferIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 8 16 13" />
      <line x1="21" y1="8" x2="3" y2="8" />
      <polyline points="8 21 3 16 8 11" />
      <line x1="3" y1="16" x2="21" y2="16" />
    </svg>
  );
}
function SelfIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M15 7h6M18 4l3 3-3 3" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </svg>
  );
}
function CreditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
function PayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}
function GlobalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function RechargeClientIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}
