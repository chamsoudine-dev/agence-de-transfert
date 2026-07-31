import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import BottomNav from "../components/BottomNav.jsx";

const TYPE_LABELS = {
  send: "Envoi d'argent",
  account_transfer: "Transfert compte à compte",
  received: "Argent reçu",
  self: "Envoi à moi-même",
  deposit: "Dépôt",
};

export default function History() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHistory(token)
      .then((d) => setHistory(d.history))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-ricardo-red pt-6 pb-6 px-5 rounded-b-[28px] text-white">
        <h1 className="font-bold text-lg text-center">Historique</h1>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-3">
        {loading && <p className="text-center text-gray-400 mt-10">Chargement...</p>}
        {!loading && history.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Aucune transaction pour le moment.</p>
        )}
        {history.map((tx) => (
          <div key={tx.id} className="border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ricardo-blue">{TYPE_LABELS[tx.type] || tx.type}</p>
              <p className="text-xs text-gray-400">{tx.receiverName || tx.receiverPhone || "—"}</p>
              <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            <p className={`font-bold ${tx.direction === "out" ? "text-ricardo-red" : "text-green-600"}`}>
              {tx.direction === "out" ? "-" : "+"}
              {tx.amount.toLocaleString("fr-FR")} CFA
            </p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
