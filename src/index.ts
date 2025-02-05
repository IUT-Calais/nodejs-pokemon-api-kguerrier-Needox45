import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Route pour obtenir la liste de tous les pokémons
app.get('/pokemons-cards', async (_req: Request, res: Response) => {
  const pokemons = await prisma.pokemonCard.findMany();
  res.status(200).json(pokemons);
});

// Route pour obtenir un pokémon spécifique
app.get('/pokemons-cards/:pokemonCardId', async (req: Request, res: Response) => {
  const { pokemonCardId } = req.params;
  const pokemon = await prisma.pokemonCard.findUnique({
    where: { id: parseInt(pokemonCardId) },
  });
  if (pokemon) {
    res.status(200).json(pokemon);
  } else {
    res.status(404).send(`Pokémon avec l'ID ${pokemonCardId} non trouvé`);
  }
});

// Route pour enregistrer un nouveau pokémon
app.post('/pokemons-cards', async (req: Request, res: Response) => {
  const newPokemon = req.body;
  const createdPokemon = await prisma.pokemonCard.create({
    data: newPokemon,
  });
  res.status(201).json(createdPokemon);
});

// Route pour modifier un pokémon existant
app.patch('/pokemons-cards/:pokemonCardId', async (req: Request, res: Response) => {
  const { pokemonCardId } = req.params;
  const updatedProperties = req.body;
  const updatedPokemon = await prisma.pokemonCard.update({
    where: { id: parseInt(pokemonCardId) },
    data: updatedProperties,
  });
  res.status(200).json(updatedPokemon);
});

// Route pour supprimer un pokémon
app.delete('/pokemons-cards/:pokemonCardId', async (req: Request, res: Response) => {
  const { pokemonCardId } = req.params;
  await prisma.pokemonCard.delete({
    where: { id: parseInt(pokemonCardId) },
  });
  res.status(200).send(`Pokémon avec l'ID ${pokemonCardId} supprimé`);
});