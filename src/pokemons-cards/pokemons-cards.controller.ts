import{ Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 

export const getPokemons = async (_req: Request, res: Response) => {
    const pokemons = await prisma.pokemonCard.findMany();
    res.status(200).send(pokemons);
}

export const getPokemonById = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const pokemon = await prisma.pokemonCard.findUnique({
        where: { id: parseInt(pokemonCardId) },
    });
    if (pokemon) {
        res.status(200).send(pokemon);
    } else {
        res.status(404).send(`Pokémon avec l'ID ${pokemonCardId} non trouvé`);
    }
};

export const createPokemon = async (req: Request, res: Response) => {
    const { typeName, ...newPokemon } = req.body;
    // Trouver le typeId correspondant au typeName
    const type = await prisma.type.findUnique({
        where: { name: typeName },
    });
    if (!type) {
        res.status(404).send(`Type ${typeName} non trouvé`);
    }
    else {
    const createdPokemon = await prisma.pokemonCard.create({
        data: {
            ...newPokemon,
            typeId: type.id,
        },
    });
    res.status(201).json(createdPokemon);
    }
};


export const editPokemon = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const updatedProperties = req.body;
    const updatedPokemon = await prisma.pokemonCard.update({
        where: { id: parseInt(pokemonCardId) },
        data: updatedProperties,
    });
    res.status(200).send(updatedPokemon);
};


export const deletePokemon = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    await prisma.pokemonCard.delete({
        where: { id: parseInt(pokemonCardId) },
    });
    res.status(200).send(`Pokémon avec l'ID ${pokemonCardId} supprimé`);
};