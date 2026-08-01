const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { firstName, lastName, countryCode, phone, password } = req.body;

  if (!firstName || !lastName || !phone || !password) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 4 caractères." });
  }

  const cc = countryCode || "+227";
  const cleanPhone = phone.trim().replace(/\s/g, "").replace(/^\+227/, "");
  const fullPhone = `${cc}${cleanPhone}`;

  const existing = db.prepare("SELECT id FROM users WHERE phone = ? OR phone = ? OR phone = ?").get(phone, cleanPhone, fullPhone);
  if (existing) {
    return res.status(409).json({ error: "Ce numéro de téléphone est déjà utilisé." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const insertUser = db.prepare(`
    INSERT INTO users (first_name, last_name, country_code, phone, password_hash)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = insertUser.run(firstName, lastName, cc, cleanPhone, passwordHash);
  const userId = result.lastInsertRowid;

  const accountNumber = `${cc.replace("+", "")}${cleanPhone}`;
  db.prepare(`
    INSERT INTO wallets (user_id, account_number, balance, currency)
    VALUES (?, ?, 10000000, 'CFA')
  `).run(userId, accountNumber);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({
    token,
    user: { id: userId, firstName, lastName, phone: cleanPhone, countryCode: cc },
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Téléphone et mot de passe requis." });
  }

  const cleanPhone = phone.trim().replace(/\s/g, "").replace(/^\+227/, "");
  const user = db.prepare("SELECT * FROM users WHERE phone = ? OR phone = ? OR phone = ?").get(phone, cleanPhone, `+227${cleanPhone}`);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Numéro ou mot de passe incorrect." });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      countryCode: user.country_code,
    },
  });
});

module.exports = router;
