import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SendMoney from "./pages/SendMoney.jsx";
import TransferAccount from "./pages/TransferAccount.jsx";
import History from "./pages/History.jsx";
import Placeholder from "./pages/Placeholder.jsx";

function Private({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/connexion" replace />;
  return children;
}

export default function App() {
  return (
    <div className="phone-frame pb-16">
      <Routes>
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route
          path="/"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route
          path="/envoyer"
          element={
            <Private>
              <SendMoney />
            </Private>
          }
        />
        <Route
          path="/compte-a-compte"
          element={
            <Private>
              <TransferAccount />
            </Private>
          }
        />
        <Route
          path="/historique"
          element={
            <Private>
              <History />
            </Private>
          }
        />
        <Route
          path="/carte"
          element={
            <Private>
              <Placeholder title="Carte Visa" />
            </Private>
          }
        />
        <Route
          path="/coffre"
          element={
            <Private>
              <Placeholder title="Coffre" />
            </Private>
          }
        />
        <Route
          path="/reglages"
          element={
            <Private>
              <Placeholder title="Réglages" />
            </Private>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
