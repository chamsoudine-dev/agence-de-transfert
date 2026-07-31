import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { api } from "../api.js";

/**
 * Page Rechargement de compte — My Nita
 * Permet aux clients de recharger leur solde via différents moyens
 */

const RECHARGE_METHODS = [
  {
    id: "orange",
    label: "Orange Money",
    description: "Recharger via Orange Money",
    color: "#FF6B00",
    bg: "#FFF3E0",
    icon: <OrangeIcon />,
  },
  {
    id: "moov",
    label: "Moov Money",
    description: "Recharger via Moov Money",
    color: "#009688",
    bg: "#E0F2F1",
    icon: <MoovIcon />,
  },
  {
    id: "carte",
    label: "Carte Bancaire",
    description: "Visa / Mastercard",
    color: "#1565C0",
    bg: "#E3F2FD",
    icon: <CardBankIcon />,
  },
  {
    id: "agent",
    label: "Dépôt Agent",
    description: "Déposer chez un agent My Nita",
    color: "#6A1B9A",
    bg: "#F3E5F5",
    icon: <AgentIcon />,
  },
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

export default function Recharge() {
  const navigate = useNavigate();
  const { wallet, refreshWallet } = useAuth();
  const [step, setStep] = useState("method"); // 'method' | 'amount' | 'confirm' | 'success'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setStep("amount");
  };

  const handleQuickAmount = (val) => {
    setAmount(String(val));
  };

  const handleConfirm = async () => {
    setError("");
    const amt = Number(amount);
    if (!amt || amt < 100) {
      setError("Le montant minimum est 100 CFA.");
      return;
    }
    setLoading(true);
    try {
      await api("/transactions/recharge", "POST", { amount: amt, method: selectedMethod.id });
      await refreshWallet();
      setStep("success");
    } catch (err) {
      setError(err.message || "Erreur lors du rechargement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-24">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="bg-ricardo-red px-5 pt-5 pb-8 rounded-b-[28px] shadow-lg">
        <div className="flex items-center gap-3 text-white">
          <button
            id="btn-back-recharge"
            onClick={() => (step === "method" ? navigate("/") : setStep(step === "amount" ? "method" : "amount"))}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <BackIcon />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              {step === "success" ? "Rechargement réussi" : "Recharger mon compte"}
            </h1>
            {wallet && (
              <p className="text-xs text-white/70 mt-0.5">
                Solde actuel : {wallet.balance?.toLocaleString("fr-FR")} {wallet.currency}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        {/* ─── ÉTAPE 1 : Choix de la méthode ─────────────────── */}
        {step === "method" && (
          <>
            <p className="text-gray-500 text-sm mb-4 font-medium">
              Choisissez votre mode de rechargement :
            </p>
            <div className="flex flex-col gap-3">
              {RECHARGE_METHODS.map((method) => (
                <button
                  key={method.id}
                  id={`btn-method-${method.id}`}
                  onClick={() => handleSelectMethod(method)}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card active:scale-[0.98] transition-transform text-left"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: method.bg, color: method.color }}
                  >
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base">{method.label}</p>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                  <ChevronRightIcon />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ─── ÉTAPE 2 : Saisie du montant ───────────────────── */}
        {step === "amount" && selectedMethod && (
          <>
            {/* Méthode sélectionnée */}
            <div
              className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card mb-5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selectedMethod.bg, color: selectedMethod.color }}
              >
                {selectedMethod.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800">{selectedMethod.label}</p>
                <p className="text-gray-400 text-xs">{selectedMethod.description}</p>
              </div>
            </div>

            {/* Saisie montant */}
            <div className="bg-white rounded-2xl p-5 shadow-card mb-4">
              <p className="text-gray-500 text-sm mb-2 font-medium">Montant à recharger (CFA)</p>
              <div className="flex items-center border-b-2 border-ricardo-red pb-2 mb-4">
                <input
                  id="input-amount-recharge"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 text-3xl font-extrabold text-[#0F2C6B] bg-transparent outline-none"
                  min="100"
                />
                <span className="text-gray-400 font-semibold ml-2">CFA</span>
              </div>

              {/* Montants rapides */}
              <p className="text-xs text-gray-400 mb-2 font-medium">Montants rapides :</p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    id={`btn-quick-${val}`}
                    onClick={() => handleQuickAmount(val)}
                    className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      amount === String(val)
                        ? "bg-ricardo-red text-white border-ricardo-red"
                        : "bg-gray-50 text-gray-700 border-gray-100 hover:border-ricardo-red"
                    }`}
                  >
                    {val.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm text-center mb-3">
                {error}
              </p>
            )}

            <button
              id="btn-next-amount"
              onClick={() => {
                if (!amount || Number(amount) < 100) {
                  setError("Le montant minimum est 100 CFA.");
                  return;
                }
                setError("");
                setStep("confirm");
              }}
              className="w-full bg-[#0F2C6B] text-white font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-[0.98] transition-transform"
            >
              Continuer
            </button>
          </>
        )}

        {/* ─── ÉTAPE 3 : Confirmation ─────────────────────────── */}
        {step === "confirm" && selectedMethod && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-card mb-4">
              <h2 className="font-bold text-gray-700 text-base mb-4 text-center">
                Récapitulatif du rechargement
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Mode</span>
                  <span className="font-bold text-gray-800">{selectedMethod.label}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Montant</span>
                  <span className="font-bold text-[#0F2C6B] text-xl">
                    {Number(amount).toLocaleString("fr-FR")} CFA
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Frais</span>
                  <span className="font-semibold text-green-600">Gratuit</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Total crédité</span>
                  <span className="font-extrabold text-ricardo-red text-xl">
                    {Number(amount).toLocaleString("fr-FR")} CFA
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <p className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm text-center mb-3">
                {error}
              </p>
            )}

            <button
              id="btn-confirm-recharge"
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-ricardo-red text-white font-bold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-60 active:scale-[0.98] transition-transform"
            >
              {loading ? "Traitement en cours..." : "Confirmer le rechargement"}
            </button>

            <button
              onClick={() => setStep("amount")}
              className="w-full text-gray-500 text-sm font-medium py-3 mt-2"
            >
              Modifier
            </button>
          </>
        )}

        {/* ─── ÉTAPE 4 : Succès ───────────────────────────────── */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-12 gap-6">
            {/* Icône succès */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon />
            </div>

            <div className="text-center">
              <h2 className="font-bold text-2xl text-[#0F2C6B] mb-2">Rechargement réussi !</h2>
              <p className="text-gray-500 text-base">
                <span className="font-extrabold text-ricardo-red text-xl">
                  {Number(amount).toLocaleString("fr-FR")} CFA
                </span>{" "}
                ont été crédités sur votre compte.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 w-full shadow-card text-center">
              <p className="text-gray-400 text-sm mb-1">Nouveau solde</p>
              <p className="font-extrabold text-2xl text-[#0F2C6B]">
                {wallet?.balance?.toLocaleString("fr-FR")} {wallet?.currency}
              </p>
            </div>

            <button
              id="btn-back-home"
              onClick={() => navigate("/")}
              className="w-full bg-[#0F2C6B] text-white font-bold py-4 rounded-2xl text-lg shadow-lg"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

/* ─── Icônes ─────────────────────────────────────────────── */
function OrangeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function MoovIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CardBankIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  );
}
function AgentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
