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
                res.status(400).json({ error: 'Email déjà utilisé' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const createdUser = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });

                res.status(201).json(createdUser);
            }
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur', detail: error });
        }
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
};

export const getUserById = async (req: Request, res: Response) => {
    const { UserId } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(UserId) },
    });
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send(`User avec l'ID ${UserId} non trouvé`);
    }
};

export const editUser = async (req: Request, res: Response) => {
    const { UserId } = req.params;
    const updatedProperties = req.body;
    try {
        if (updatedProperties.password) {
            updatedProperties.password = await bcrypt.hash(updatedProperties.password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(UserId) },
            data: updatedProperties,
        });
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', detail: error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { UserId } = req.params;
    await prisma.user.delete({
        where: { id: parseInt(UserId) },
    });
    res.status(200).send(`Utilisateur avec l'ID ${UserId} supprimé`);
};




export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe sont requis' });
    } else {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
            } else {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    res.status(400).json({ error: 'Mot de passe incorrect' });
                } else {
                    const token = jwt.sign(
                        { id: user.id, email: user.email },
                        process.env.JWT_SECRET as jwt.Secret, // Secret
                        //{ expiresIn: process.env.JWT_EXPIRATION } // Expiration
                        { expiresIn: '1d' } // Expiration
                    );

                    res.status(201).json({ token });
                }
            }
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la connexion' });
        }
    }
};
