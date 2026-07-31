const express = require("express");
const db = require("../db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

// GET /api/wallet/me
router.get("/me", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  const wallet = db.prepare("SELECT * FROM wallets WHERE user_id = ?").get(req.userId);

  if (!user || !wallet) {
    return res.status(404).json({ error: "Compte introuvable." });
  }

  res.json({
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    countryCode: user.country_code,
    accountNumber: wallet.account_number,
    balance: wallet.balance,
    currency: wallet.currency,
  });
});

// GET /api/wallet/favorites
router.get("/favorites", (req, res) => {
  const favorites = db
    .prepare("SELECT * FROM favorites WHERE owner_user_id = ? ORDER BY created_at DESC")
    .all(req.userId);
  res.json({ favorites });
});

// POST /api/wallet/favorites
router.post("/favorites", (req, res) => {
  const { label, phone, countryCode } = req.body;
  if (!label || !phone) {
    return res.status(400).json({ error: "Nom et téléphone requis." });
  }
  const result = db
    .prepare("INSERT INTO favorites (owner_user_id, label, phone, country_code) VALUES (?, ?, ?, ?)")
    .run(req.userId, label, phone, countryCode || "+227");

  res.status(201).json({ id: result.lastInsertRowid, label, phone, countryCode: countryCode || "+227" });
});

// GET /api/wallet/users -> Obtenir la liste de tous les comptes enregistrés
router.get("/users", (req, res) => {
  const users = db
    .prepare(
      `SELECT u.id, u.first_name, u.last_name, u.phone, u.country_code, w.balance, w.currency
       FROM users u
       JOIN wallets w ON w.user_id = u.id
       ORDER BY u.first_name ASC`
    )
    .all();

  res.json({
    users: users.map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      countryCode: u.country_code,
      balance: u.balance,
      currency: u.currency,
    })),
  });
});

// GET /api/wallet/find-user?phone=... -> Trouver un compte par téléphone
router.get("/find-user", (req, res) => {
  const phone = (req.query.phone || "").trim().replace(/\s/g, "").replace(/^\+227/, "");

  if (!phone) {
    return res.status(400).json({ error: "Numéro de téléphone requis." });
  }

  const user = db.prepare("SELECT * FROM users WHERE phone = ? OR phone = ?").get(phone, `+227${phone}`);
  if (!user) {
    return res.json({ found: false, message: "Aucun compte My Nita trouvé avec ce numéro." });
  }

  const wallet = db.prepare("SELECT * FROM wallets WHERE user_id = ?").get(user.id);

  res.json({
    found: true,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      countryCode: user.country_code,
      balance: wallet ? wallet.balance : 0,
      currency: wallet ? wallet.currency : "CFA",
    },
  });
});

module.exports = router;
