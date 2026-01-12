import db from "../models/index.cjs";

const getAllArticles = async (req, res) => {
    try {
        const articles = await db.Article.findAll({
            include: [{
                model: db.User,
                as: 'author',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });
        res.json(articles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
}

const getArticleById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }
    try {
        const article = await db.Article.findByPk(id, {
            include: [{
                model: db.User,
                as: 'author',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });

        article ? res.json(article) : res.status(404).json({ error: "Article non trouvé" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

const createArticle = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Authentification requise", success: false });
    }

    if (!title || !content) {
        return res.status(400).json({ error: "Titre et contenu sont requis" });
    }

    try {
        const newArticle = await db.Article.create({
            title,
            content,
            userId
        });
        res.status(201).json({
            success: true,
            message: "Article créé avec succès",
            article: newArticle
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
}

const updateArticle = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }

    const { title, content } = req.body;
    const userId = req.user?.id;

    try {
        const article = await db.Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }

        // Vérifier que l'utilisateur est l'auteur
        if (article.userId !== userId) {
            return res.status(403).json({ error: "Non autorisé à modifier cet article" });
        }

        const updatedArticle = await article.update({
            title: title || article.title,
            content: content || article.content
        });

        res.json({
            success: true,
            message: "Article mis à jour",
            article: updatedArticle
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
}

const deleteArticle = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }

    const userId = req.user?.id;

    try {
        const article = await db.Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }

        // Vérifier que l'utilisateur est l'auteur
        if (article.userId !== userId) {
            return res.status(403).json({ error: "Non autorisé à supprimer cet article" });
        }

        await article.destroy();
        res.json({
            success: true,
            message: "Article supprimé"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression" });
    }
}

export {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
