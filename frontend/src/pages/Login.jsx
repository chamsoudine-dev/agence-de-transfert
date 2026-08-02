import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
import { api } from "../api.js";

/**
 * Page de connexion — design fidèle à MyNita
 * Fond dégradé bleu/orange, logo avec cercles concentriques,
 * champ téléphone + mot de passe, bouton Face ID, version
 */
export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- Modal Mot de passe oublié ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPhone, setResetPhone] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      await login(phone, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const openResetModal = () => {
    setResetPhone(phone);
    setResetNewPassword("");
    setResetConfirmPassword("");
    setResetError("");
    setResetSuccess("");
    setShowResetModal(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetPhone.trim()) {
      setResetError("Veuillez saisir votre numéro de téléphone.");
      return;
    }
    if (resetNewPassword.length < 4) {
      setResetError("Le nouveau mot de passe doit contenir au moins 4 caractères.");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await api.resetPassword({ phone: resetPhone, newPassword: resetNewPassword });
      setResetSuccess(res.message || "Mot de passe réinitialisé avec succès !");
      // Pré-remplir les champs de connexion
      setPhone(resetPhone);
      setPassword(resetNewPassword);
      setSuccessMsg("Mot de passe modifié ! Cliquez sur Se connecter.");
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess("");
      }, 1800);
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col px-5 pt-5 pb-8"
      style={{
        background:
          "linear-gradient(160deg, #c0d4f7 0%, #a8bef5 15%, #e8edf8 35%, #f7d8c8 65%, #f0a080 80%, #e87040 100%)",
      }}
    >
      {/* Header : Aide + Service Client */}
      <div className="flex justify-between items-center mb-4">
        <button
          id="btn-aide"
          type="button"
          className="bg-white/90 text-ricardo-blue text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
        >
          Aide ?
        </button>
        <button
          id="btn-service-client"
          type="button"
          className="bg-ricardo-red text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
        >
          <PhoneIcon />
          Service Client
        </button>
      </div>

      {/* Zone logo + formulaire */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Logo avec cercles concentriques */}
        <Logo size="lg" light />

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
          {/* Champ Téléphone */}
          <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-card gap-2">
            <span className="text-lg">🇳🇪</span>
            <span className="text-ricardo-blue font-semibold text-sm">+227</span>
            <ChevronDownIcon />
            <input
              id="input-phone"
              type="tel"
              placeholder="N° de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 text-ricardo-blue font-semibold placeholder:text-gray-300 bg-transparent text-base ml-1 outline-none"
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-card gap-2">
            <LockIcon />
            <input
              id="input-password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-gray-600 placeholder:text-gray-300 bg-transparent text-base outline-none"
              required
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <p className="text-white bg-ricardo-red/90 rounded-xl px-3 py-2 text-sm text-center">
              {error}
            </p>
          )}
          {/* Message de succès (après reset mdp) */}
          {successMsg && (
            <p className="text-white bg-emerald-600/90 rounded-xl px-3 py-2 text-sm text-center font-medium">
              {successMsg}
            </p>
          )}

          {/* Mot de passe oublié — lien fonctionnel */}
          <div className="text-right -mt-1">
            <button
              type="button"
              onClick={openResetModal}
              className="text-gray-600 text-sm underline underline-offset-2 hover:text-ricardo-blue transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton Se connecter */}
          <button
            id="btn-login"
            type="submit"
            disabled={loading}
            className="bg-ricardo-blue text-white font-bold py-4 rounded-2xl text-lg mt-1 shadow-lg disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Bouton Face ID */}
        <button
          id="btn-faceid"
          type="button"
          className="w-14 h-14 rounded-full bg-ricardo-red flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <FaceIdIcon />
        </button>

        {/* Créer un compte */}
        <p className="text-center text-gray-700 text-sm mt-1">
          Vous n&apos;avez pas de compte ?{" "}
          <Link to="/inscription" className="font-bold text-ricardo-blue underline">
            Créer un compte
          </Link>
        </p>

        {/* Version */}
        <p className="text-center text-ricardo-red text-xs font-medium">
          Version : 3.3.0
        </p>
      </div>

      {/* ─── Modal Mot de passe oublié ─── */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            {/* En-tête */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold text-ricardo-blue flex items-center gap-2">
                <LockIcon /> Réinitialiser le mot de passe
              </h3>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Saisissez votre numéro de téléphone et choisissez un nouveau mot de passe.
            </p>

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-3">
              {/* Numéro de téléphone */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-3 gap-2">
                <span className="text-lg">🇳🇪</span>
                <span className="text-ricardo-blue font-semibold text-sm">+227</span>
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value)}
                  className="flex-1 font-semibold text-ricardo-blue bg-transparent text-base outline-none"
                  required
                />
              </div>

              {/* Nouveau mot de passe */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-3 gap-2">
                <LockIcon />
                <input
                  type={showResetPwd ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="flex-1 text-gray-700 bg-transparent text-base outline-none"
                  required
                />
                <button type="button" onClick={() => setShowResetPwd((s) => !s)}>
                  {showResetPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Confirmer mot de passe */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-3 gap-2">
                <LockIcon />
                <input
                  type={showResetPwd ? "text" : "password"}
                  placeholder="Confirmer le nouveau mot de passe"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="flex-1 text-gray-700 bg-transparent text-base outline-none"
                  required
                />
              </div>

              {/* Erreur */}
              {resetError && (
                <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl px-3 py-2 text-sm text-center font-medium">
                  {resetError}
                </div>
              )}
              {/* Succès */}
              {resetSuccess && (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-center font-medium">
                  {resetSuccess}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-3 bg-ricardo-blue text-white font-bold rounded-2xl shadow-md disabled:opacity-60 hover:bg-ricardo-blue/90 transition-colors"
                >
                  {resetLoading ? "Modification..." : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Icônes ─────────────────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.24 1.07h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function FaceIdIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="9" cy="10" r="1" fill="white" />
      <circle cx="15" cy="10" r="1" fill="white" />
      <path d="M9 15a3.5 3.5 0 0 0 6 0" />
    </svg>
  );
}
