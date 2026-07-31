const BASE_URL = "/api";

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
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getWallet: (token) => request("/wallet/me", { token }),
  getFavorites: (token) => request("/wallet/favorites", { token }),
  addFavorite: (token, payload) => request("/wallet/favorites", { method: "POST", body: payload, token }),
  sendMoney: (token, payload) => request("/transactions/send", { method: "POST", body: payload, token }),
  accountTransfer: (token, payload) =>
    request("/transactions/account-transfer", { method: "POST", body: payload, token }),
  getHistory: (token) => request("/transactions", { token }),
};
