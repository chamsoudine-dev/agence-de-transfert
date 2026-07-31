# Ricardo — Backend (API)

API REST pour l'application de transfert d'argent **Ricardo**, construite en **Node.js / Express** avec une base **SQL (SQLite)** via `better-sqlite3`. Aucun serveur externe n'est requis : la base de données est un simple fichier `ricardo.db` créé automatiquement.

## Installation

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Le serveur démarre sur `http://localhost:4000`.

## Endpoints principaux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte (`firstName, lastName, countryCode, phone, password`) | Non |
| POST | `/api/auth/login` | Se connecter (`phone, password`) | Non |
| GET | `/api/wallet/me` | Solde et infos du compte connecté | Oui (Bearer) |
| GET | `/api/wallet/favorites` | Liste des favoris | Oui |
| POST | `/api/wallet/favorites` | Ajouter un favori (`label, phone, countryCode`) | Oui |
| POST | `/api/transactions/send` | Envoyer de l'argent (`amount, countryCode, phone, firstName, lastName, reason`) | Oui |
| POST | `/api/transactions/account-transfer` | Transfert compte à compte entre membres Ricardo (`amount, countryCode, phone, reason`) | Oui |
| GET | `/api/transactions` | Historique des transactions | Oui |

Toutes les routes protégées attendent l'en-tête :
```
Authorization: Bearer <token>
```

## Modèle de données (SQL)

- **users** : identité et mot de passe (haché avec bcrypt)
- **wallets** : solde, numéro de compte (basé sur le téléphone), devise (CFA)
- **transactions** : historique des envois, transferts, réceptions
- **favorites** : contacts favoris par utilisateur

## Frais

Un frais simple de 1% (minimum 50 CFA) est appliqué à chaque envoi/transfert. Modifiable dans `routes/transactions.js` (`FEE_RATE`).

## Sécurité — à faire avant la production

- Changer `JWT_SECRET` dans `.env`
- Ajouter une validation plus stricte des numéros de téléphone
- Ajouter un vrai système de PIN/OTP pour confirmer les transferts
- Passer en HTTPS et ajouter un rate-limiting sur `/auth`
