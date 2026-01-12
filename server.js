import express from "express";
import users from "./routes/user.js";
import articles from "./routes/article.js";
import logger from "./middleware/logger.js";
import { connectDatabase } from "./db.js";
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import db from "./models/index.cjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authmiddleware.js";
import cookieParser from "cookie-parser";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
//body parser middleware
app.use(express.json());

// //urlencoded middleware
app.use(express.urlencoded({extended : false}));

app.use(express.static(path.join(__dirname, 'public')));

// Servir les fichiers HTML depuis /page/
app.use('/page', express.static(path.join(__dirname, 'page')));

app.use(logger);

// ======================= PAGES HTML =======================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'home.html'))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'login.html'))
})

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'register.html'))
})

app.get("/article/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'article.html'))
})

app.get("/create-article", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'create-article.html'))
})

app.get("/backoffice", authMiddleware, (req, res, next) => {
    next();
}, (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'backoffice.html'))
})

// ======================= API ROUTES =======================

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis", success: false })
    }
    
    try {
        const user = await db.User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé", success: false })
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ error: "Mot de passe incorrect", success: false })
        }

        const token = jwt.sign({
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        }, process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 24H
        })
        
        res.status(200).json({ success: true, message: "Connexion réussie" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur", success: false })
    }
})

// Logout
app.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ success: true, message: "Déconnexion réussie" });
})

// Get current user
app.get("/api/users/me", authMiddleware, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
})

// API Routes
app.use("/api/users", users);
app.use("/api/articles", articles);

app.listen(PORT, async () => {
    await connectDatabase();
    console.log(`Blog now listen on http://localhost:${PORT}`)
})

