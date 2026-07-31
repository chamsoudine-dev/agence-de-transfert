import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(phone, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
          className="bg-white/90 text-ricardo-blue text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
        >
          Aide ?
        </button>
        <button
          id="btn-service-client"
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
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 text-ricardo-blue font-semibold placeholder:text-gray-300 bg-transparent text-base ml-1"
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
              className="flex-1 text-gray-600 placeholder:text-gray-300 bg-transparent text-base"
              required
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-white bg-ricardo-red/90 rounded-xl px-3 py-2 text-sm text-center">
              {error}
            </p>
          )}

          {/* Mot de passe oublié */}
          <div className="text-right -mt-1">
            <a href="#" className="text-gray-600 text-sm underline underline-offset-2">
              Mot de passe oublié ?
            </a>
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
          Version : 1.0.0
        </p>
      </div>
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
