import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controller/articleController.js";

const router = express.Router();

// Routes publiques
router.get("/", async (req, res) => {
    await getAllArticles(req, res);
});

router.get("/:id", async (req, res) => {
    await getArticleById(req, res);
});

// Routes protégées (nécessitent authentification)
router.post("/", (req, res) => {
    authMiddleware(req, res, async () => {
        await createArticle(req, res);
    });
});

router.put("/:id", (req, res) => {
    authMiddleware(req, res, async () => {
        await updateArticle(req, res);
    });
});

router.delete("/:id", (req, res) => {
    authMiddleware(req, res, async () => {
        await deleteArticle(req, res);
    });
});

export default router;
