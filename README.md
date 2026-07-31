# Ricardo — Application de transfert d'argent

Application full-stack inspirée de la structure des apps de transfert d'argent de la région (écrans : connexion, accueil, envoi d'argent, transfert compte à compte, historique), avec une identité visuelle **bleu / rouge** et le nom **Ricardo**.

- **Backend** : Node.js / Express + SQL (SQLite via `better-sqlite3`), authentification JWT, gestion des soldes et des transactions.
- **Frontend** : React + Vite + Tailwind CSS, mobile-first.

## Démarrage rapide

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
→ API disponible sur `http://localhost:4000`

### 2. Frontend
Dans un second terminal :
```bash
cd frontend
npm install
npm run dev
```
→ Application disponible sur `http://localhost:5173` (le frontend appelle automatiquement l'API via un proxy Vite).

## Ce qui est fonctionnel

- Inscription / connexion avec numéro de téléphone + mot de passe
- Tableau de bord avec solde réel (masquable) et menu d'actions
- Envoi d'argent vers un numéro (destinataire Ricardo ou externe)
- Transfert compte à compte entre membres Ricardo
- Historique des transactions en temps réel, stocké en base SQL
- Frais de transfert calculés automatiquement (1%, modifiable)

## Pour aller plus loin (à faire avant une mise en production réelle)

- Vérification du numéro par OTP/SMS à l'inscription
- Code PIN pour confirmer chaque transfert
- Vrais moyens de dépôt/retrait (mobile money, agents, carte bancaire)
- Écrans Carte Visa, Coffre et Réglages (actuellement en attente, prêts à être complétés)
- Déploiement : backend sur un serveur Node (Render, Railway, VPS...) + base PostgreSQL/MySQL en prod, frontend buildé (`npm run build`) sur un hébergeur statique ou packagé en app mobile (Capacitor/React Native)

Voir `backend/README.md` pour le détail de l'API.
