import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { api } from "../api.js";

const RECHARGE_METHODS = [
  {
    id: "cash",
    label: "Espèces (Cash Agent)",
    description: "Dépôt physique au guichet",
    color: "#2E7D32",
    bg: "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
    icon: <CashIcon />,
  },
  {
    id: "orange",
    label: "Orange Money",
    description: "Rechargement via Orange",
    color: "#FF6B00",
    bg: "linear-gradient(135deg,#FFF3E0,#FFE0B2)",
    icon: <OrangeIcon />,
  },
  {
    id: "moov",
    label: "Moov Money",
    description: "Rechargement via Moov",
    color: "#009688",
    bg: "linear-gradient(135deg,#E0F2F1,#B2DFDB)",
    icon: <MoovIcon />,
  },
  {
    id: "carte",
    label: "Carte Bancaire",
    description: "Visa / Mastercard",
    color: "#1565C0",
    bg: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
    icon: <CardIcon />,
  },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000, 50000, 100000];

export default function RechargeClient() {
  const navigate = useNavigate();
  const { token, wallet, refreshWallet } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [recentRecharges, setRecentRecharges] = useState([]);

  // Form states
  const [phone, setPhone] = useState("");
  const [clientUser, setClientUser] = useState(null); // Found user object or null
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(RECHARGE_METHODS[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Load all accounts and history on mount
  useEffect(() => {
    loadAccounts();
    loadHistory();
  }, [token]);

  const loadAccounts = async () => {
    try {
      const data = await api.getUsers(token);
      setUsersList(data.users || []);
    } catch (err) {
      console.error("Erreur chargement des comptes", err);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getHistory(token);
      setRecentRecharges((data.history || []).filter((t) => t.type === "deposit"));
    } catch (err) {
      console.error("Erreur chargement historique", err);
    }
  };

  // Real-time lookup when phone changes
  const handlePhoneChange = async (val) => {
    setPhone(val);
    setSearchError("");
    setSuccessData(null);

    const clean = val.replace(/\s/g, "").replace(/^\+227/, "");
    if (clean.length < 4) {
      setClientUser(null);
      return;
    }

    setSearching(true);
    try {
      const res = await api.findUserByPhone(token, clean);
      if (res && res.found) {
        setClientUser(res.user);
        setSearchError("");
      } else {
        setClientUser(null);
        setSearchError("Aucun compte My Nita trouvé pour ce numéro.");
      }
    } catch (err) {
      setClientUser(null);
    } finally {
      setSearching(false);
    }
  };

  // Select account directly from list
  const handleSelectUserFromList = (user) => {
    setPhone(user.phone);
    setClientUser(user);
    setSearchError("");
    setSuccessData(null);
  };

  // Perform recharge
  const handleRecharge = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("Veuillez saisir un numéro de téléphone.");
      return;
    }
    const amt = Number(amount);
    if (!amt || amt < 100) {
      setError("Le montant minimum est de 100 CFA.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.rechargeClient(token, {
        phone,
        amount: amt,
        method: selectedMethod.id,
        note,
      });

      await refreshWallet();
      await loadAccounts();
      await loadHistory();

      setSuccessData({
        clientName: clientUser
          ? `${clientUser.firstName} ${clientUser.lastName}`
          : res.clientName || "Client",
        phone,
        amount: amt,
        reference: res.reference || `MN-${Date.now()}`,
      });

      // Reset form
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err.message || "Erreur lors du rechargement.");
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce rechargement de l'historique ?")) return;
    try {
      await api.deleteTransaction(token, id);
      setRecentRecharges((prev) => prev.filter((item) => item.id !== id));
      await refreshWallet();
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-28">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="bg-ricardo-red px-5 pt-5 pb-8 rounded-b-[28px] shadow-lg text-white">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <BackIcon />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-lg leading-tight">Rechargement de Compte</h1>
            <p className="text-xs text-white/75 mt-0.5">My Nita • Créditer un client</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-6">

        {/* ═══ SECTION 1 : LISTE DES COMPTES REGISTRÉS ══════════ */}
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="font-bold text-gray-800 text-sm">Comptes My Nita Disponibles</h2>
            </div>
            <span className="bg-blue-50 text-ricardo-blue text-xs font-extrabold px-2.5 py-1 rounded-full">
              {usersList.length} comptes
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Cliquez sur un client ci-dessous pour recharger son compte instantanément :
          </p>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {usersList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Aucun compte trouvé dans la base.</p>
            ) : (
              usersList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUserFromList(u)}
                  className={`p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                    phone === u.phone
                      ? "border-ricardo-red bg-orange-50/50 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0F2C6B] text-white font-bold text-xs rounded-full flex items-center justify-center">
                      {(u.firstName?.[0] || "C").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-800">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        +{u.countryCode?.replace("+", "") || "227"} {u.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-green-600 block">
                      {u.balance?.toLocaleString("fr-FR")} {u.currency}
                    </span>
                    <span className="text-[10px] text-ricardo-red font-semibold">Sélectionner →</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ═══ SECTION 2 : RECHERCHE ET RECHARGEMENT ════════════ */}
        <form onSubmit={handleRecharge} className="bg-white rounded-3xl shadow-card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-xl">📱</span>
            <h2 className="font-bold text-gray-800 text-sm">Effectuer un rechargement</h2>
          </div>

          {/* Saisie du téléphone */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Numéro de téléphone du compte My Nita :
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-3 gap-2 focus-within:border-ricardo-blue">
              <span className="text-lg">🇳🇪</span>
              <span className="text-[#0F2C6B] font-bold text-sm">+227</span>
              <input
                id="input-recharge-phone"
                type="tel"
                placeholder="Ex: 97000000"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="flex-1 text-[#0F2C6B] font-bold text-base bg-transparent outline-none"
                required
              />
              {searching && (
                <span className="w-4 h-4 border-2 border-ricardo-red/30 border-t-ricardo-red rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* CARTE D'IDENTIFICATION DU CLIENT RETROUVÉ */}
          {clientUser && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Compte My Nita trouvé :</p>
                  <p className="font-extrabold text-gray-800 text-sm">
                    {clientUser.firstName} {clientUser.lastName}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    Solde actuel : <span className="font-bold">{clientUser.balance?.toLocaleString("fr-FR")} CFA</span>
                  </p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                C&apos;est lui ✓
              </span>
            </div>
          )}

          {searchError && (
            <p className="bg-amber-50 text-amber-700 text-xs rounded-xl px-3 py-2 border border-amber-200">
              ⚠️ {searchError} (Un rechargement vers ce numéro reste possible).
            </p>
          )}

          {/* Mode de règlement */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Mode de paiement :
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RECHARGE_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setSelectedMethod(m)}
                  className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${
                    selectedMethod.id === m.id
                      ? "border-ricardo-red bg-orange-50/60 font-bold"
                      : "border-gray-100 bg-gray-50 text-gray-600"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: m.bg, color: m.color }}
                  >
                    {m.icon}
                  </div>
                  <span className="text-xs truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Saisie du montant */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Montant à créditer (CFA) :
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center">
              <input
                id="input-recharge-amount"
                type="number"
                placeholder="Ex: 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-2xl font-extrabold text-[#0F2C6B] bg-transparent outline-none"
                min="100"
                required
              />
              <span className="text-gray-400 font-bold text-sm">CFA</span>
            </div>

            {/* Montants rapides */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    amount === String(val)
                      ? "bg-ricardo-red text-white border-ricardo-red shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Note optionnelle */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Raison / Note (optionnel) :</label>
            <input
              type="text"
              placeholder="Ex : Rechargement espèces"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          {error && <p className="bg-red-50 text-red-600 text-xs rounded-xl p-3 text-center">{error}</p>}

          {/* Bouton de confirmation */}
          <button
            type="submit"
            disabled={loading || !phone || !amount}
            className="w-full bg-[#0F2C6B] text-white font-bold py-4 rounded-2xl text-base shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Traitement du rechargement...
              </>
            ) : (
              <>
                ⚡ Valider et Créditer le compte
              </>
            )}
          </button>
        </form>

        {/* ═══ MESSAGE DE SUCCÈS ═══════════════════════════════ */}
        {successData && (
          <div className="bg-emerald-600 text-white rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <h3 className="font-bold text-lg">Rechargement Réussi !</h3>
                <p className="text-xs text-white/80">Le solde a été immédiatement crédité sur le compte.</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 text-xs flex flex-col gap-1 font-mono">
              <p>Client : <span className="font-bold text-white">{successData.clientName}</span></p>
              <p>Téléphone : <span className="font-bold text-white">+{successData.phone.replace("+", "")}</span></p>
              <p>Montant : <span className="font-bold text-amber-300 text-sm">{successData.amount?.toLocaleString("fr-FR")} CFA</span></p>
              <p>Référence : {successData.reference}</p>
            </div>
          </div>
        )}

        {/* ═══ SECTION 3 : HISTORIQUE DES RECHARGEMENTS (SUPPRESSION POSSIBLE) ═══ */}
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h2 className="font-bold text-gray-800 text-sm">Derniers Rechargements Effectués</h2>
            </div>
            <span className="text-xs text-gray-400 font-medium">{recentRecharges.length} opérations</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentRecharges.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Aucun rechargement récent.</p>
            ) : (
              recentRecharges.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-gray-50/70 rounded-2xl p-3 flex items-center justify-between border border-gray-100"
                >
                  <div>
                    <p className="font-bold text-xs text-[#0F2C6B]">
                      {tx.receiverName || tx.receiverPhone || "Rechargement Client"}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {tx.receiverPhone ? `+${tx.receiverPhone.replace("+", "")}` : "Nita Client"} • {new Date(tx.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-xs text-green-600">
                      +{tx.amount?.toLocaleString("fr-FR")} CFA
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1"
                      title="Supprimer cette recharge"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}

/* ─── Icônes ─────────────────────────────────────────────── */
function CashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function OrangeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function MoovIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
