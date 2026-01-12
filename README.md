#  Blog TP3 — Blog

Ce projet est une application web de type **blog**, développée dans le cadre du **TP3**, permettant la gestion d’articles avec authentification utilisateur et back-office sécurisé.

L’application propose une **lecture publique des articles** et réserve les opérations de création, modification et suppression aux **utilisateurs authentifiés**, avec une gestion stricte des autorisations.

---

##  Fonctionnalités

* Page d’accueil listant tous les articles
* Consultation du détail d’un article (auteur, date)
* Inscription et connexion des utilisateurs
* Authentification sécurisée via **JWT (cookies httpOnly)**
* Back-office utilisateur avec **CRUD complet des articles**
* Autorisation : un utilisateur ne peut modifier que ses propres articles
* Mots de passe hachés avec **bcrypt**
* Logging de toutes les requêtes HTTP
* API REST sécurisée

---

##  Stack Technique

* **Backend** : Node.js, Express.js
* **Base de données** : MySQL
* **ORM** : Sequelize
* **Authentification** : JWT + bcrypt
* **Frontend** : HTML, CSS, JavaScript (Vanilla)
* **Outils** : npm, nodemon, sequelize-cli

---

##  Sécurité

* Mots de passe chiffrés avec bcrypt (10 rounds)
* JWT stocké en cookies httpOnly
* Accès protégé aux routes sensibles
* Variables d’environnement sécurisées via `.env`
* Suppression des utilisateurs anonymes

---

##  Installation et Lancement

### Prérequis

* Node.js
* MySQL
* npm

### Installation

```bash
git clone <repository_url>
cd TP-3-Blog
cp .env.example .env
npm install
npm run migrate
npm run dev
```

 Le serveur démarre sur **[http://localhost:3200](http://localhost:3200)**

---

##  API

* Authentification (login / logout)
* Gestion des utilisateurs
* Gestion des articles

  * Lecture publique
  * Écriture protégée (authentification requise)


##  Auteur

Nick Bekolo

