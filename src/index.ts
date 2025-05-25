import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { pokemoncardRouter } from './pokemons-cards/pokemons-cards.router';
import { userRouter } from './user/user.router';
import apiDocsRouter from './api-docs/api-docs.router';
import prisma from '../src/client';

export const app = express();
//const prisma = new PrismaClient();
const port = 3000;
app.use('/api-docs', apiDocsRouter);
app.use(express.json());
app.use('/pokemons-cards', pokemoncardRouter);
app.use('/users', userRouter);
app.use('/', userRouter);



export const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export function stopServer() {
  server.close();
}