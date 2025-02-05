import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
            res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' });
        }
    }
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
                        process.env.JWT_SECRET!,
                        { expiresIn: process.env.JWT_EXPIRATION }
                    );

                    res.status(201).json({ token });
                }
            }
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la connexion' });
        }
    }
};