import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

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
    <div className="min-h-screen bg-gradient-to-br from-ricardo-blue via-[#16409e] to-ricardo-red/80 flex flex-col px-6 pt-8 pb-10">
      <div className="flex justify-between items-center">
        <button className="bg-white/90 text-ricardo-blue text-sm font-semibold px-4 py-2 rounded-full">
          Aide ?
        </button>
        <button className="bg-ricardo-red text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
          <PhoneIcon /> Service Client
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-10 py-8">
        <Logo size="lg" light />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-card">
            <span className="mr-2 text-lg">🇳🇪</span>
            <span className="text-ricardo-blue font-semibold mr-2">+227</span>
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 text-ricardo-blue font-semibold placeholder:text-gray-300 bg-transparent"
              required
            />
          </div>

          <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-card">
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 ml-2 text-ricardo-blue font-semibold placeholder:text-gray-300 bg-transparent"
              required
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              <EyeIcon />
            </button>
          </div>

          {error && <p className="text-white bg-ricardo-red/90 rounded-lg px-3 py-2 text-sm text-center">{error}</p>}

          <div className="text-right">
            <a href="#" className="text-white text-sm underline underline-offset-2">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-ricardo-blue text-white font-bold py-4 rounded-2xl text-lg mt-2 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      <p className="text-center text-white text-sm">
        Vous n'avez pas de compte ?{" "}
        <Link to="/inscription" className="font-bold underline">
          Créer un compte
        </Link>
      </p>
      <p className="text-center text-white/70 text-xs mt-3">Version : 1.0.0</p>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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
