import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import AccountTransferReceipt from "../components/AccountTransferReceipt.jsx";

const REASONS = ["Aide familiale", "Frais scolaires", "Commerce", "Loyer", "Autre"];
const AVATAR_COLORS = ["bg-blue-600", "bg-green-500", "bg-purple-600", "bg-lime-500", "bg-rose-500"];

export default function TransferAccount() {
  const { token, refreshWallet } = useAuth();
  const navigate = useNavigate();

  // Logged-in user sender details
  const [me, setMe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [toEncaisser, setToEncaisser] = useState(false);

  // Recipient live lookup states
  const [receiverUser, setReceiverUser] = useState(null);
  const [searchingReceiver, setSearchingReceiver] = useState(false);

  const [error, setError] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current user profile
    api.getWallet(token).then((d) => setMe(d)).catch(() => {});
    // Load favorites
    api.getFavorites(token).then((d) => setFavorites(d.favorites)).catch(() => {});
  }, [token]);

  // Real-time lookup as phone number is entered
  const handlePhoneChange = async (val) => {
    setPhone(val);
    setError("");
    const clean = val.trim().replace(/\s/g, "").replace(/^\+227/, "");

    if (clean.length < 4) {
      setReceiverUser(null);
      return;
    }

    setSearchingReceiver(true);
    try {
      const res = await api.findUserByPhone(token, clean);
      if (res.found && res.user) {
        setReceiverUser(res.user);
      } else {
        setReceiverUser(null);
      }
    } catch (err) {
      setReceiverUser(null);
    } finally {
      setSearchingReceiver(false);
    }
  };

  const handleSelectFavorite = (favPhone) => {
    handlePhoneChange(favPhone);
  };

  const handleSyncAccounts = async () => {
    setSearchingReceiver(true);
    try {
      await api.getUsers(token);
      if (phone) {
        handlePhoneChange(phone);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingReceiver(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0) {
      setError("Veuillez saisir un montant valide.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.accountTransfer(token, {
        amount: numAmt,
        countryCode: "+227",
        phone,
        reason,
      });

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const rec = {
        amount: numAmt,
        fee: res.fee !== undefined ? res.fee : Math.max(50, Math.round(numAmt * 0.01)),
        typeLabel: "Compte à Compte",
        senderFirstName: me?.firstName || "Rikardo",
        senderLastName: me?.lastName || "Abdoulaye",
        senderPhone: me?.phone || "0022787903577",
        receiverFirstName: receiverUser?.firstName || "Abo",
        receiverLastName: receiverUser?.lastName || "Monique",
        receiverPhone: phone.startsWith("00227") ? phone : `00227${phone.replace(/^\+227/, "")}`,
        code: `MYNITA${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        date: dateStr,
      };

      setReceiptData(rec);
      await refreshWallet();
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors du transfert.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransfer = () => {
    setReceiptData(null);
    setAmount("");
    setPhone("");
    setReason("");
    setReceiverUser(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* En-tête */}
      <div className="bg-[#E64A19] pt-6 pb-8 px-5 rounded-b-[28px] text-white shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg hover:bg-white/30 transition-colors"
          >
            ←
          </button>
          <h1 className="font-bold text-lg text-center flex items-center gap-2">⇄ Transfert Compte à Compte</h1>
          <button
            onClick={() => navigate("/historique")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
            title="Historique"
          >
            🕘
          </button>
        </div>
        <p className="text-center text-sm mb-2 text-white/90">Entrer le montant</p>
        <div className="bg-white/15 border border-white/40 rounded-2xl flex items-center justify-center gap-2 py-4">
          <span className="font-semibold text-xl">CFA</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10 000"
            className="bg-transparent text-3xl font-display font-extrabold w-48 text-center text-white placeholder:text-white/50 focus:outline-hidden"
            required
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 -mt-4 bg-white rounded-t-3xl pt-6 pb-24 flex flex-col gap-4 relative z-10">
        
        {/* Favoris */}
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {favorites.map((f, i) => (
            <button
              type="button"
              key={f.id}
              onClick={() => handleSelectFavorite(f.phone)}
              className="flex flex-col items-center gap-1 shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span
                className={`w-11 h-11 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white font-bold flex items-center justify-center shadow-xs`}
              >
                {f.label[0]}
              </span>
              <span className="text-[11px] text-[#0F2C6B] font-semibold">{f.label.split(" ")[0]}</span>
            </button>
          ))}
          
          <button
            type="button"
            onClick={handleSyncAccounts}
            className="flex flex-col items-center gap-1 shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            title="Synchroniser la liste des comptes"
          >
            <span className="w-11 h-11 rounded-full bg-[#E64A19] text-white flex items-center justify-center text-xl shadow-xs">
              🔄
            </span>
            <span className="text-[11px] text-[#0F2C6B] font-semibold">Sync Comptes</span>
          </button>
        </div>

        {/* Champ Numéro Destinataire */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              placeholder="Numéro du compte destinataire"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-[#0F2C6B] placeholder:text-gray-400 focus:border-[#0F2C6B] focus:outline-hidden transition-colors"
              required
            />
            {searchingReceiver && (
              <span className="absolute right-4 top-4 text-xs text-gray-400 font-medium">Recherche...</span>
            )}
          </div>

          {/* Tag de confirmation du compte trouvé */}
          {receiverUser && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-green-800 font-bold mt-1">
              <span className="text-base">✓</span>
              <span>Compte trouvé : {receiverUser.firstName} {receiverUser.lastName}</span>
            </div>
          )}

          {!receiverUser && phone.replace(/\s/g, "").length >= 4 && !searchingReceiver && (
            <p className="text-[11px] text-amber-600 font-medium px-1">
              💡 Le nom s&apos;affichera automatiquement si ce numéro est inscrit.
            </p>
          )}
        </div>

        {/* Motif */}
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-[#0F2C6B] bg-white focus:border-[#0F2C6B] focus:outline-hidden"
        >
          <option value="">Choisir un motif</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Option à encaisser */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[#0F2C6B] font-semibold text-sm">À encaisser ?</span>
          <button
            type="button"
            onClick={() => setToEncaisser((s) => !s)}
            className={`w-11 h-6 rounded-full transition ${toEncaisser ? "bg-[#E64A19]" : "bg-gray-200"} relative cursor-pointer`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${toEncaisser ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>

        {error && <p className="text-white bg-[#E64A19] rounded-xl px-4 py-3 text-sm text-center font-medium shadow-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0F2C6B] hover:bg-[#0A1E4A] text-white font-bold py-4 rounded-2xl text-lg mt-2 shadow-md disabled:opacity-60 transition-colors cursor-pointer"
        >
          {loading ? "Transfert en cours..." : "Envoyer"}
        </button>
      </form>

      {/* MODAL DU REÇU CONFORME À L'IMAGE DE L'UTILISATEUR */}
      {receiptData && (
        <AccountTransferReceipt
          data={receiptData}
          onClose={() => setReceiptData(null)}
          onNewTransfer={handleNewTransfer}
        />
      )}
    </div>
  );
}
