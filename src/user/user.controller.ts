import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe sont requis' });
    } else {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                res.status(400).json({ error: 'Email dejà utilise' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const createdUser = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });

                res.status(200).json({ success : createdUser});
            }
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la creation de l\'utilisateur', detail: error });
        }
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.status(200).send({ success :users});
};

export const getUserById = async (req: Request, res: Response) => {
    const { UserId } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(UserId) },
    });
    if (user) {
        res.status(200).send({ success: user });
    } else {
        res.status(404).json({ error: `User avec ID ${UserId} non trouve` });
    }
};

export const editUser = async (req: Request, res: Response) => {
    const { UserId } = req.params;
    const updatedProperties = req.body;

    try {
        // Verifiez si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(UserId) },
        });

        if (!existingUser) {
            res.status(404).json({ error: `Utilisateur avec ID ${UserId} non trouve` });
            return;
        }

        // Si l'utilisateur existe, mettez-le à jour
        if (updatedProperties.password) {
            updatedProperties.password = await bcrypt.hash(updatedProperties.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(UserId) },
            data: updatedProperties,
        });

        res.status(200).send({ success: updatedUser });
    } catch (error) {
        res.status(400).json({ error: `Erreur lors de la mise à jour du user ${UserId}` });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { UserId } = req.params;

    try {
        // Verifiez si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(UserId) },
        });

        if (!existingUser) {
            res.status(404).json({ error: `Utilisateur avec ID ${UserId} non trouve` });
            return;
        }

        // Supprimez l'utilisateur
        await prisma.user.delete({
            where: { id: parseInt(UserId) },
        });

        res.status(200).send({ success: `Utilisateur avec ID ${UserId} supprime` });
    } catch (error) {
        res.status(400).json({ error: `Erreur lors de la suppression de l'utilisateur ${UserId}`, detail: error });
    }
};



export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe sont requis' });
        return;
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouve' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'Mot de passe incorrect' });
            return;
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: '1d' }
        );
        res.status(201).json({ token });
        return;
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la connexion' });
        return;
    }
};
