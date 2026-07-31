import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

const REASONS = ["Aide familiale", "Frais scolaires", "Commerce", "Loyer", "Autre"];
const AVATAR_COLORS = ["bg-blue-600", "bg-green-500", "bg-purple-600", "bg-lime-500", "bg-rose-500"];

export default function TransferAccount() {
  const { token, refreshWallet } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [toEncaisser, setToEncaisser] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getFavorites(token).then((d) => setFavorites(d.favorites)).catch(() => {});
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.accountTransfer(token, {
        amount: Number(amount),
        countryCode: "+227",
        phone,
        reason,
      });
      setSuccess(res);
      await refreshWallet();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-ricardo-red pt-6 pb-8 px-5 rounded-b-[28px] text-white">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            ←
          </button>
          <h1 className="font-bold text-lg text-center flex items-center gap-2">⇄ Transfert Compte à Compte</h1>
          <button onClick={() => navigate("/historique")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            🕘
          </button>
        </div>
        <p className="text-center text-sm mb-2">Entrer le montant</p>
        <div className="bg-white/10 border border-white/40 rounded-2xl flex items-center justify-center gap-2 py-4">
          <span className="font-semibold">CFA</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10 000"
            className="bg-transparent text-3xl font-display font-extrabold w-40 text-center placeholder:text-white/50"
            required
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 -mt-4 bg-white rounded-t-3xl pt-6 pb-24 flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {favorites.map((f, i) => (
            <button
              type="button"
              key={f.id}
              onClick={() => setPhone(f.phone)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <span
                className={`w-11 h-11 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white font-bold flex items-center justify-center`}
              >
                {f.label[0]}
              </span>
              <span className="text-[11px] text-ricardo-blue font-medium">{f.label.split(" ")[0]}</span>
            </button>
          ))}
          <span className="flex flex-col items-center gap-1 shrink-0">
            <span className="w-11 h-11 rounded-full bg-ricardo-red text-white flex items-center justify-center text-xl">+</span>
            <span className="text-[11px] text-ricardo-blue font-medium">Favoris</span>
          </span>
        </div>

        <input
          placeholder="Numéro du compte destinataire"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-400"
          required
        />
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-ricardo-blue"
        >
          <option value="">Choisir un motif</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between px-1">
          <span className="text-ricardo-blue font-semibold text-sm">À encaisser ?</span>
          <button
            type="button"
            onClick={() => setToEncaisser((s) => !s)}
            className={`w-11 h-6 rounded-full transition ${toEncaisser ? "bg-ricardo-red" : "bg-gray-200"} relative`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${toEncaisser ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>

        {error && <p className="text-white bg-ricardo-red rounded-lg px-3 py-2 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-white bg-green-600 rounded-lg px-3 py-2 text-sm text-center">
            {success.message} (frais : {success.fee} CFA)
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-ricardo-blue text-white font-bold py-4 rounded-2xl text-lg mt-2 disabled:opacity-60"
        >
          {loading ? "Transfert en cours..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
