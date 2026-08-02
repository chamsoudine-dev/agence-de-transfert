const BASE_URL = typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname === "127.0.0.1")
  ? "/api"
  : "https://agence-de-transfert.onrender.com/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
}

export const api = {
  request,
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getWallet: (token) => request("/wallet/me", { token }),
  getFavorites: (token) => request("/wallet/favorites", { token }),
  addFavorite: (token, payload) => request("/wallet/favorites", { method: "POST", body: payload, token }),
  sendMoney: (token, payload) => request("/transactions/send", { method: "POST", body: payload, token }),
  accountTransfer: (token, payload) =>
    request("/transactions/account-transfer", { method: "POST", body: payload, token }),
  getHistory: (token) => request("/transactions", { token }),
  getUsers: (token) => request("/wallet/users", { token }),
  findUserByPhone: (token, phone) => request(`/wallet/find-user?phone=${encodeURIComponent(phone)}`, { token }),
  rechargeClient: (token, payload) => request("/transactions/recharge-client", { method: "POST", body: payload, token }),
  deleteTransaction: (token, id) => request(`/transactions/${id}`, { method: "DELETE", token }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
};
