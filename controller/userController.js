import db from "../models/index.cjs";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }
    
    try {
        const user = await db.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        user ? res.json(user) : res.status(404).json({ error: "Utilisateur non trouvé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "Cet email est déjà utilisé" });
        }
        
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await db.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }
    
    const { firstName, lastName, email, password } = req.body;
    
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        
        const updatedUser = await user.update(updateData);
        
        res.json({
            success: true,
            message: "Utilisateur mis à jour",
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
}

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "Requête invalide" })
    }
    
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        await user.destroy();
        res.json({
            success: true,
            message: "Utilisateur supprimé"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression" });
    }
}

export {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};