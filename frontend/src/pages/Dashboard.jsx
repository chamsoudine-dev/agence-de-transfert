import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BottomNav from "../components/BottomNav.jsx";

const menuItems = [
  { label: "Envoyer de l'argent", icon: "🡥", to: "/envoyer", bg: "bg-ricardo-blue/10", color: "text-ricardo-blue" },
  { label: "Compte à compte", icon: "⇄", to: "/compte-a-compte", bg: "bg-blue-50", color: "text-blue-500" },
  { label: "Envoi à moi-même", icon: "👤", to: "/envoyer", bg: "bg-orange-50", color: "text-ricardo-red" },
  { label: "Encaisser un envoi", icon: "👛", to: "/historique", bg: "bg-pink-50", color: "text-pink-500" },
  { label: "Achat de crédit", icon: "📱", to: "#", bg: "bg-green-50", color: "text-green-600" },
  { label: "Services Paiement", icon: "🎫", to: "#", bg: "bg-indigo-50", color: "text-indigo-500" },
  { label: "Transfert bancaire", icon: "🏛️", to: "#", bg: "bg-rose-50", color: "text-rose-500" },
  { label: "Transfert international", icon: "🌍", to: "#", bg: "bg-orange-50", color: "text-orange-500" },
];

export default function Dashboard() {
  const { wallet, refreshWallet } = useAuth();
  const [hidden, setHidden] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-ricardo-red pt-6 pb-14 px-5 rounded-b-[28px]">
        <div className="flex items-center justify-between text-white mb-4">
          <div>
            <p className="font-display italic text-lg leading-tight">Ricardo</p>
            <p className="text-xs text-white/80">Bienvenue</p>
            <p className="font-bold">{wallet ? `${wallet.firstName} ${wallet.lastName}`.toUpperCase() : "..."}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <span className="text-xl">📞</span>
            <span className="bg-white/20 rounded-full px-2 py-1 text-xs">fr ⌄</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ricardo-red font-bold">Solde principal</p>
            <button onClick={refreshWallet} className="text-ricardo-blue text-lg">
              ⟳
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-2xl font-display font-extrabold text-ricardo-blue tracking-widest">
              {hidden ? "•••••••••" : `${wallet?.balance?.toLocaleString("fr-FR") ?? 0} ${wallet?.currency ?? "CFA"}`}
            </p>
            <button onClick={() => setHidden((h) => !h)} className="text-gray-400">
              👁
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-ricardo-blue font-semibold">
              +{wallet?.countryCode?.replace("+", "")}
              {wallet?.phone}
            </p>
            <div className="flex gap-3 text-ricardo-blue text-lg">
              <span>⇄</span>
              <span>▦</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 grid grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.to} className="flex flex-col items-center gap-2 text-center">
            <div className={`w-14 h-14 rounded-full ${item.bg} ${item.color} flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-medium text-ricardo-blue leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
