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

module.exports = router;
