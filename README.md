# 📱 Blog TP3 - Soumission Finale

## ✅ Exigences du TP3 Accomplies

### Fonctionnalités Implémentées

- ✅ **Page d'accueil** (`/`) - Affiche la liste de tous les articles
- ✅ **Page article** (`/article/:id`) - Affiche le détail d'un article avec auteur et date
- ✅ **Page connexion** (`/login`) - Authentification utilisateur
- ✅ **Page inscription** (`/register`) - Création de compte
- ✅ **Back-office CRUD** (`/backoffice`) - Gestion complète des articles (Create, Read, Update, Delete)
- ✅ **Authentification JWT** - Tokens stockés en cookies httpOnly
- ✅ **Hachage des mots de passe** - bcrypt avec 10 rounds
- ✅ **Logging de toutes les requêtes** - Format : `[DATE] - [METHOD] [PATH]`
- ✅ **Seuls les utilisateurs authentifiés** peuvent créer/éditer/supprimer des articles
- ✅ **Séquelize ORM** avec MySQL
- ✅ **Routes protégées** - Vérification d'autorisation (utilisateur peut modifier ses propres articles)

---

## �� Installation & Démarrage Rapide

### ⚠️ IMPORTANT - Configuration Sécurisée

Ce projet utilise un fichier `.env` pour stocker les variables sensibles.

**INCLUS DANS LA SOUMISSION :**
- ✅ `.env.example` - Template avec placeholders

**N'EST PAS INCLUS (pour des raisons de sécurité) :**
- ❌ `.env` - Contient les vraies identifiants (ajouté au .gitignore)
- ❌ `node_modules/` - Téléchargé via npm install

### 1. Extraire le projet
```bash
unzip "Blog-TP3.zip"
cd "TP 3 - Blog"
```

### 2. Configurer les variables d'environnement
```bash
# Copier le template
cp .env.example .env

# Éditer .env avec vos identifiants MySQL
nano .env
```

**Contenu du `.env` :**
```
DB_HOST=localhost          # Hôte MySQL
DB_PORT=3306              # Port MySQL (défaut)
DB_NAME=blog              # Nom de la base de données
DB_USERNAME=root          # Utilisateur MySQL
DB_PASSWORD=votre_motdepasse  # MOT DE PASSE MYSQL (à remplir)
NODE_ENV=development
PORT=3200
JWT_SECRET=your_jwt_secret_key_change_this
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Exécuter les migrations (crée les tables)
```bash
npm run migrate
```

### 5. Lancer le serveur
```bash
npm run dev
```

✅ Le serveur écoute sur **http://localhost:3200**

---

## 📋 Architecture

```
TP 3 - Blog/
├── page/                          # Pages HTML
│   ├── home.html                 # Accueil (catalogue articles)
│   ├── login.html                # Connexion
│   ├── register.html             # Inscription
│   ├── article.html              # Détail article
│   ├── create-article.html       # Création/édition article
│   └── backoffice.html           # Gestion articles utilisateur
│
├── public/                        # Fichiers statiques
│   └── js/                       # Scripts JavaScript client
│       ├── home.js               # Logique page d'accueil
│       ├── login.js              # Logique connexion
│       ├── register.js           # Logique inscription
│       ├── article.js            # Logique page article
│       ├── create-article.js     # Logique création/édition
│       └── backoffice.js         # Logique back-office
│
├── routes/                        # Routes Express
│   ├── user.js                   # Endpoints utilisateurs
│   └── article.js                # Endpoints articles
│
├── controller/                    # Logique métier
│   ├── userController.js         # Gestion utilisateurs
│   └── articleController.js      # Gestion articles
│
├── models/                        # Modèles Sequelize
│   ├── user.cjs                  # Modèle User
│   ├── article.cjs               # Modèle Article
│   └── index.cjs                 # Configuration Sequelize
│
├── migrations/                    # Migrations Sequelize
│   ├── 20260108091232-create-user.cjs
│   └── 20260111120000-create-article.cjs
│
├── middleware/                    # Middlewares Express
│   ├── authmiddleware.js         # Vérification JWT
│   └── logger.js                 # Logging des requêtes
│
├── config/                        # Configuration
│   └── config.json               # Config base de données
│
├── .env.example                  # Template variables (À COPIER EN .env)
├── .gitignore                    # Exclusions Git
├── server.js                     # Serveur principal (port 3200)
├── package.json                  # Dépendances npm
└── [Fichiers de documentation]
```

---

## 🔒 Sécurité

- **Mots de passe hachés** avec bcrypt (10 rounds)
- **JWT en httpOnly cookies** (non accessible via JS malveillant)
- **CSRF protection** via sameSite: strict
- **Authentification requise** pour write operations
- **Autorisation vérifiée** : utilisateur ne peut modifier que ses propres articles
- **Fichier .env protégé** : ajouté au .gitignore, jamais commité

---

## 📡 API Endpoints

### Authentification
- `POST /api/login` - Connexion (retourne JWT en cookie)
- `GET /logout` - Déconnexion (efface cookie)
- `GET /api/users/me` - Infos utilisateur connecté

### Utilisateurs
- `POST /api/users` - Inscription
- `GET /api/users` - Lister tous (sans mots de passe)
- `PUT /api/users/:id` - Modifier profil
- `DELETE /api/users/:id` - Supprimer compte

### Articles (Publics en lecture, privés en écriture)
- `GET /api/articles` - Lister tous (public)
- `GET /api/articles/:id` - Détail article (public)
- `POST /api/articles` - Créer (authentifié)
- `PUT /api/articles/:id` - Modifier (auteur uniquement)
- `DELETE /api/articles/:id` - Supprimer (auteur uniquement)

---

## 🧪 Test du Projet

### Via le navigateur (recommandé)
1. Allez sur **http://localhost:3200**
2. Cliquez sur **"Inscription"** → créez un compte
3. Cliquez sur **"Connexion"** → connectez-vous
4. Cliquez sur **"Créer un article"** → écrivez un article
5. Cliquez sur l'article → modifiez/supprimez via le formulaire
6. Allez sur **"/backoffice"** → gérez vos articles
7. Cliquez sur **"Déconnexion"** → vérifiez la redirection

### Via curl (optionnel)
```bash
# S'inscrire
curl -X POST http://localhost:3200/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"pass123"}'

# Se connecter (cookie sauvegardé)
curl -c cookies.txt -X POST http://localhost:3200/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Créer un article
curl -b cookies.txt -X POST http://localhost:3200/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon article","content":"Contenu de l'article"}'

# Lister les articles
curl http://localhost:3200/api/articles | python3 -m json.tool
```

---

## 📊 Technologie Utilisée

- **Backend** : Node.js + Express.js
- **Base de données** : MySQL + Sequelize ORM
- **Authentification** : JWT (jsonwebtoken) + bcrypt
- **Frontend** : HTML5 + CSS + Vanilla JavaScript
- **Outils** : npm, nodemon, sequelize-cli

---

## 📚 Documentation Supplémentaire

- `INSTALLATION.md` - Guide d'installation détaillé
- `API_DOCUMENTATION.md` - Référence complète API
- `TESTS.md` - Guide de test (12 scénarios)
- `TROUBLESHOOTING.md` - Dépannage et erreurs courantes

---

## ✨ État Actuel

**🟢 COMPLET ET TESTÉ**

Toutes les fonctionnalités du TP3 sont implémentées et validées :
- ✅ Inscription/Connexion
- ✅ CRUD articles
- ✅ Back-office
- ✅ Authentification JWT
- ✅ Hachage bcrypt
- ✅ Logging
- ✅ Routes protégées
- ✅ Séquelize + MySQL

**Prêt pour soumission avant le 13 janvier 2026 à 20h00**

---

## 👤 Auteur

À compléter (voir package.json)

---

## 📝 Notes

- Le serveur écoute sur le port **3200** (configurable dans `.env`)
- Les JWT expirent en **24 heures**
- Les articles sont **publics en lecture, privés en écriture**
- Les logs sont affichés en console lors du démarrage du serveur
