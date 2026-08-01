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

  const cleanPhone = phone.trim().replace(/\s/g, "").replace(/^\+227/, "");
  const receiverUser = db.prepare("SELECT * FROM users WHERE phone = ? OR phone = ? OR phone = ?").get(phone, cleanPhone, `+227${cleanPhone}`);
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
  const cleanPhone = phone.trim().replace(/\s/g, "").replace(/^\+227/, "");
  const receiverUser = db.prepare("SELECT * FROM users WHERE phone = ? OR phone = ? OR phone = ?").get(phone, cleanPhone, `+227${cleanPhone}`);

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

// POST /api/transactions/recharge -> Rechargement de compte client
router.post("/recharge", (req, res) => {
  const { amount, method } = req.body;

  const amt = Number(amount);
  if (!amt || amt < 100) {
    return res.status(400).json({ error: "Le montant minimum de rechargement est 100 CFA." });
  }

  const VALID_METHODS = ["orange", "moov", "carte", "agent"];
  if (!method || !VALID_METHODS.includes(method)) {
    return res.status(400).json({ error: "Méthode de rechargement invalide." });
  }

  const wallet = getWalletByUser(req.userId);

  const tx = db.transaction(() => {
    // Créditer le portefeuille
    db.prepare("UPDATE wallets SET balance = balance + ? WHERE id = ?").run(amt, wallet.id);

    // Enregistrer la transaction
    db.prepare(`
      INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, status)
      VALUES (NULL, ?, 'deposit', ?, 0, ?, 'completed')
    `).run(wallet.id, amt, `Rechargement via ${method}`);
  });

  tx();
  const updatedWallet = getWalletByUser(req.userId);

  res.status(201).json({
    message: "Compte rechargé avec succès.",
    amount: amt,
    method,
    newBalance: updatedWallet.balance,
  });
});

// POST /api/transactions/recharge-client -> Recharger le compte d'un client par son téléphone
router.post("/recharge-client", (req, res) => {
  const { phone, amount, method, note } = req.body;
  const amt = Number(amount);

  if (!phone) {
    return res.status(400).json({ error: "Le numéro de téléphone du client est requis." });
  }
  if (!amt || amt < 100) {
    return res.status(400).json({ error: "Le montant minimum est 100 CFA." });
  }

  const cleanPhone = phone.trim().replace(/\s/g, "").replace(/^\+227/, "");
  const targetUser = db.prepare("SELECT * FROM users WHERE phone = ? OR phone = ?").get(cleanPhone, `+227${cleanPhone}`);

  let receiverWalletId = null;
  let clientName = "Client";

  if (targetUser) {
    const targetWallet = getWalletByUser(targetUser.id);
    if (targetWallet) {
      receiverWalletId = targetWallet.id;
      clientName = `${targetUser.first_name} ${targetUser.last_name}`;
      // Créditer directement le compte du client !
      db.prepare("UPDATE wallets SET balance = balance + ? WHERE id = ?").run(amt, targetWallet.id);
    }
  } else {
    // Si l'utilisateur n'existe pas encore dans la DB, créditer l'agent
    const agentWallet = getWalletByUser(req.userId);
    receiverWalletId = agentWallet.id;
    clientName = `Client (${cleanPhone})`;
  }

  const result = db.prepare(`
    INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type, amount, fee, reason, receiver_phone, receiver_name, status)
    VALUES (?, ?, 'deposit', ?, 0, ?, ?, ?, 'completed')
  `).run(
    req.userId,
    receiverWalletId,
    amt,
    note || `Rechargement via ${method || 'Agent'}`,
    phone,
    clientName
  );

  const updatedAgentWallet = getWalletByUser(req.userId);

  res.status(201).json({
    message: "Rechargement effectué avec succès.",
    transactionId: result.lastInsertRowid,
    reference: `MN-${Date.now()}`,
    clientName,
    newBalance: updatedAgentWallet.balance,
  });
});

// DELETE /api/transactions/:id -> Supprimer une transaction / rechargement effectué
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID de transaction invalide." });
  }

  const tx = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
  if (!tx) {
    return res.status(404).json({ error: "Transaction introuvable." });
  }

  db.prepare("DELETE FROM transactions WHERE id = ?").run(id);

  res.json({ message: "Transaction supprimée avec succès.", deletedId: id });
});

// GET /api/transactions -> historique
router.get("/", (req, res) => {
  const wallet = getWalletByUser(req.userId);

  const rows = db.prepare(`
    SELECT * FROM transactions
    WHERE sender_wallet_id = ? OR receiver_wallet_id = ? OR sender_wallet_id IS NULL
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
