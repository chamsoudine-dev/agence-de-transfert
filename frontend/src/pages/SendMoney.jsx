import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

const REASONS = ["Aide familiale", "Frais scolaires", "Commerce", "Loyer", "Autre"];

export default function SendMoney() {
  const { token, refreshWallet } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.sendMoney(token, {
        amount: Number(amount),
        countryCode: "+227",
        phone,
        firstName,
        lastName,
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
          <h1 className="font-bold text-lg flex items-center gap-2">🡥 Envoyer de l'argent</h1>
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
        <input
          placeholder="Numéro du destinataire"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-400"
          required
        />
        <input
          placeholder="Prénom destinataire"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-400"
        />
        <input
          placeholder="Nom destinataire"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-400"
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
          {loading ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
