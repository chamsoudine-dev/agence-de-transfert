import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import BottomNav from "../components/BottomNav.jsx";

const TYPE_LABELS = {
  send: "Envoi d'argent",
  account_transfer: "Transfert compte à compte",
  received: "Argent reçu",
  self: "Envoi à moi-même",
  deposit: "Rechargement / Dépôt",
};

export default function History() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    api
      .getHistory(token)
      .then((d) => setHistory(d.history || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette transaction / rechargement ?")) return;
    try {
      await api.deleteTransaction(token, id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-24">
      {/* En-tête */}
      <div className="bg-ricardo-red pt-6 pb-6 px-5 rounded-b-[28px] text-white shadow-lg">
        <h1 className="font-bold text-lg text-center">Historique des Transactions</h1>
        <p className="text-xs text-white/70 text-center mt-0.5">Suivi & suppression des rechargements</p>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-3">
        {loading && <p className="text-center text-gray-400 mt-10">Chargement...</p>}
        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            <p className="text-gray-400 font-medium">Aucune transaction pour le moment.</p>
          </div>
        )}

        {!loading &&
          history.map((tx) => (
            <div
              key={tx.id}
              className="bg-white shadow-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F2C6B]">
                    {TYPE_LABELS[tx.type] || tx.type}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                    #{tx.id}
                  </span>
                </div>
                {tx.receiverName && (
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Client : <span className="font-bold">{tx.receiverName}</span>
                  </p>
                )}
                {tx.receiverPhone && (
                  <p className="text-xs text-gray-400">{tx.receiverPhone}</p>
                )}
                <p className="text-[11px] text-gray-300 mt-1">
                  {new Date(tx.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p
                  className={`font-extrabold text-base ${
                    tx.direction === "out" ? "text-ricardo-red" : "text-green-600"
                  }`}
                >
                  {tx.direction === "out" ? "-" : "+"}
                  {tx.amount?.toLocaleString("fr-FR")} CFA
                </p>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition-colors"
                  title="Supprimer cette transaction"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>

      <BottomNav />
    </div>
  );
}
