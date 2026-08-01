import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import BottomNav from "../components/BottomNav.jsx";
import AccountTransferReceipt from "../components/AccountTransferReceipt.jsx";

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
  const [me, setMe] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchHistory = () => {
    setLoading(true);
    api.getWallet(token).then((d) => setMe(d)).catch(() => {});
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

  const handleOpenReceipt = (tx) => {
    const formattedDate = tx.createdAt
      ? new Date(tx.createdAt).toISOString().replace("T", " ").substring(0, 16)
      : new Date().toISOString().replace("T", " ").substring(0, 16);

    const data = {
      amount: tx.amount,
      fee: tx.fee || 100,
      typeLabel: TYPE_LABELS[tx.type] || "Compte à Compte",
      senderFirstName: me?.firstName || "Rikardo",
      senderLastName: me?.lastName || "Abdoulaye",
      senderPhone: me?.phone || "0022787903577",
      receiverFirstName: tx.receiverName?.split(" ")[0] || "Destinataire",
      receiverLastName: tx.receiverName?.split(" ").slice(1).join(" ") || "",
      receiverPhone: tx.receiverPhone || "0022791781184",
      code: `MYNITA${tx.id}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: formattedDate,
    };
    setSelectedReceipt(data);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-24">
      {/* En-tête */}
      <div className="bg-[#E64A19] pt-6 pb-6 px-5 rounded-b-[28px] text-white shadow-lg">
        <h1 className="font-bold text-lg text-center">Historique des Transactions</h1>
        <p className="text-xs text-white/80 text-center mt-0.5">Suivi & Reçus imprimables</p>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-3">
        {loading && <p className="text-center text-gray-400 mt-10">Chargement...</p>}
        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xs">
            <p className="text-gray-400 font-medium">Aucune transaction pour le moment.</p>
          </div>
        )}

        {!loading &&
          history.map((tx) => (
            <div
              key={tx.id}
              className="bg-white shadow-xs rounded-2xl p-4 flex items-center justify-between gap-3 border border-gray-100"
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
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(tx.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <p
                  className={`font-extrabold text-base ${
                    tx.direction === "out" ? "text-[#E64A19]" : "text-green-600"
                  }`}
                >
                  {tx.direction === "out" ? "-" : "+"}
                  {tx.amount?.toLocaleString("fr-FR")} CFA
                </p>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenReceipt(tx)}
                    className="bg-[#E8EEFF] text-[#0F2C6B] hover:bg-[#D2E0FF] text-xs px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Voir le reçu de cette transaction"
                  >
                    📄 Reçu
                  </button>

                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Supprimer cette transaction"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal du reçu si sélectionné */}
      {selectedReceipt && (
        <AccountTransferReceipt
          data={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onNewTransfer={() => setSelectedReceipt(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
