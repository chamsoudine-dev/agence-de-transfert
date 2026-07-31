import BottomNav from "../components/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Placeholder({ title }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col">
      <div className="bg-ricardo-red pt-6 pb-6 px-5 rounded-b-[28px] text-white">
        <h1 className="font-bold text-lg text-center">{title}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-gray-400">Cette section « {title} » arrive bientôt sur Ricardo.</p>
        {title === "Réglages" && (
          <button onClick={logout} className="bg-ricardo-red text-white font-bold px-6 py-3 rounded-2xl">
            Se déconnecter
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
