import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/userController.js";

const router = express.Router();

// Route publique pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
    await getAllUsers(req, res)
});

// Route publique pour récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
    await getUserById(req, res)
});

// Route publique pour créer un utilisateur (inscription)
router.post("/", async (req, res) => {
    await createUser(req, res)
});

// Routes protégées (nécessitent authentification)
router.put("/:id", (req, res) => {
    authMiddleware(req, res, async () => {
        // Vérifier que l'utilisateur modifie son propre profil
        const id = parseInt(req.params.id);
        if (id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que votre propre profil" });
        }
        await updateUser(req, res)
    });
});

router.delete("/:id", (req, res) => {
    authMiddleware(req, res, async () => {
        // Vérifier que l'utilisateur supprime son propre compte
        const id = parseInt(req.params.id);
        if (id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez supprimer que votre propre compte" });
        }
        await deleteUser(req, res)
    });
});

export default router;