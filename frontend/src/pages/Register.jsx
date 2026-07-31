import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ ...form, countryCode: "+227" });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ricardo-blue via-[#16409e] to-ricardo-red/80 flex flex-col px-6 pt-10 pb-10">
      <div className="flex justify-center mb-8">
        <Logo size="md" light />
      </div>

      <h1 className="text-white font-display font-bold text-xl text-center mb-6">Créer un compte</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Prénom"
          value={form.firstName}
          onChange={update("firstName")}
          className="bg-white rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-300 shadow-card"
          required
        />
        <input
          placeholder="Nom"
          value={form.lastName}
          onChange={update("lastName")}
          className="bg-white rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-300 shadow-card"
          required
        />
        <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-card">
          <span className="mr-2 text-lg">🇳🇪</span>
          <span className="text-ricardo-blue font-semibold mr-2">+227</span>
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            value={form.phone}
            onChange={update("phone")}
            className="flex-1 text-ricardo-blue font-semibold placeholder:text-gray-300 bg-transparent"
            required
          />
        </div>
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={update("password")}
          className="bg-white rounded-2xl px-4 py-4 font-semibold text-ricardo-blue placeholder:text-gray-300 shadow-card"
          required
        />

        {error && <p className="text-white bg-ricardo-red/90 rounded-lg px-3 py-2 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-ricardo-red text-white font-bold py-4 rounded-2xl text-lg mt-3 disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-white text-sm mt-6">
        Déjà un compte ?{" "}
        <Link to="/connexion" className="font-bold underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
