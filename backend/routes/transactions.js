const express = require("express");
const db = require("../db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

const FEE_RATE = 0.01; // 1% de frais, exemple simple
function computeFee(amount) {
  return Math.max(50, Math.round(amount * FEE_RATE));
}

function getWalletByUser(userId) {
  return db.prepare("SELECT * FROM wallets WHERE user_id = ?").get(userId);
}

// POST /api/transactions/send  -> Envoyer de l'argent (par téléphone, destinataire externe ou interne)
router.post("/send", (req, res) => {
  const { amount, countryCode, phone, firstName, lastName, reason } = req.body;

  const amt = Number(amount);
  if (!amt || amt <= 0) {
    return res.status(400).json({ error: "Montant invalide." });
  }
  if (!phone) {
    return res.status(400).json({ error: "Le numéro du destinataire est requis." });
  }

  const senderWallet = getWalletByUser(req.userId);
  const fee = computeFee(amt);
  const total = amt + fee;

  if (senderWallet.balance < total) {
    return res.status(400).json({ error: "Solde insuffisant." });
  }

  // Le destinataire est-il déjà un utilisateur Ricardo ?
  const receiverUser = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  const receiverWallet = receiverUser ? getWalletByUser(receiverUser.id) : null;

  const tx = db.transaction(() => {
    db.prepare("UPDATE wallets SET balance = balance - ? WHERE id = ?").run(total, senderWallet.id);

    if (receiverWallet) {
      db.prepare("UPDATE wallets SET balance = balance + ? WHERE id = ?").run(amt, receiverWallet.id);
    }

    const result = db.prepare(`
      INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, receiver_phone, receiver_name, status)
      VALUES (?, ?, 'send', ?, ?, ?, ?, ?, 'completed')
    `).run(
      senderWallet.id,
      receiverWallet ? receiverWallet.id : null,
      amt,
      fee,
      reason || null,
      `${countryCode || "+227"}${phone}`,
      `${firstName || ""} ${lastName || ""}`.trim()
    );

    if (receiverWallet) {
      db.prepare(`
        INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, status)
        VALUES (?, ?, 'received', ?, 0, ?, 'completed')
      `).run(senderWallet.id, receiverWallet.id, amt, reason || null);
    }

    return result.lastInsertRowid;
  });

  const transactionId = tx();
  const updatedWallet = getWalletByUser(req.userId);

  res.status(201).json({
    message: "Transfert effectué avec succès.",
    transactionId,
    fee,
    newBalance: updatedWallet.balance,
  });
});

// POST /api/transactions/account-transfer -> Transfert compte à compte (entre membres Ricardo)
router.post("/account-transfer", (req, res) => {
  const { amount, countryCode, phone, reason } = req.body;

  const amt = Number(amount);
  if (!amt || amt <= 0) {
    return res.status(400).json({ error: "Montant invalide." });
  }
  if (!phone) {
    return res.status(400).json({ error: "Le numéro du destinataire est requis." });
  }

  const senderWallet = getWalletByUser(req.userId);
  const receiverUser = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);

  if (!receiverUser) {
    return res.status(404).json({ error: "Ce numéro n'est pas encore inscrit sur Ricardo." });
  }
  if (receiverUser.id === req.userId) {
    return res.status(400).json({ error: "Impossible de transférer vers votre propre compte de cette façon." });
  }

  const receiverWallet = getWalletByUser(receiverUser.id);
  const fee = computeFee(amt);
  const total = amt + fee;

  if (senderWallet.balance < total) {
    return res.status(400).json({ error: "Solde insuffisant." });
  }

  const tx = db.transaction(() => {
    db.prepare("UPDATE wallets SET balance = balance - ? WHERE id = ?").run(total, senderWallet.id);
    db.prepare("UPDATE wallets SET balance = balance + ? WHERE id = ?").run(amt, receiverWallet.id);

    db.prepare(`
      INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, receiver_phone, receiver_name, status)
      VALUES (?, ?, 'account_transfer', ?, ?, ?, ?, ?, 'completed')
    `).run(
      senderWallet.id,
      receiverWallet.id,
      amt,
      fee,
      reason || null,
      `${countryCode || "+227"}${phone}`,
      `${receiverUser.first_name} ${receiverUser.last_name}`
    );

    db.prepare(`
      INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, status)
      VALUES (?, ?, 'received', ?, 0, ?, 'completed')
    `).run(senderWallet.id, receiverWallet.id, amt, reason || null);
  });

  tx();
  const updatedWallet = getWalletByUser(req.userId);

  res.status(201).json({
    message: "Transfert compte à compte effectué avec succès.",
    fee,
    newBalance: updatedWallet.balance,
  });
});

// GET /api/transactions -> historique
router.get("/", (req, res) => {
  const wallet = getWalletByUser(req.userId);

  const rows = db.prepare(`
    SELECT * FROM transactions
    WHERE sender_wallet_id = ? OR receiver_wallet_id = ?
    ORDER BY created_at DESC
    LIMIT 100
  `).all(wallet.id, wallet.id);

  const history = rows.map((r) => ({
    id: r.id,
    type: r.type,
    amount: r.amount,
    fee: r.fee,
    reason: r.reason,
    receiverName: r.receiver_name,
    receiverPhone: r.receiver_phone,
    status: r.status,
    createdAt: r.created_at,
    direction: r.sender_wallet_id === wallet.id && r.type !== "received" ? "out" : "in",
  }));

  res.json({ history });
});

module.exports = router;
