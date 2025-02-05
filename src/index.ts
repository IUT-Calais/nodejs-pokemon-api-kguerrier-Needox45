import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { pokemoncardRouter } from './pokemons-cards/pokemons-cards.router';
import { userRouter } from './user/user.router';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());
app.use('/pokemons-cards', pokemoncardRouter);
app.use('/users', userRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}