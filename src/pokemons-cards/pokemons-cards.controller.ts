import{ Request, Response } from 'express';
import prisma from '../client';
import { error } from 'console';
import jwt from 'jsonwebtoken';
 

export const getPokemons = async (_req: Request, res: Response) => {
    const pokemons = await prisma.pokemonCard.findMany();
    res.status(200).send({ success : pokemons}); 
}

export const getPokemonById = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const pokemon = await prisma.pokemonCard.findUnique({
        where: { id: parseInt(pokemonCardId) },
    });
    if (pokemon) {
        res.status(200).send({ success : pokemon});
    } else {
        res.status(404).send({error : `Pokemon avec ID ${pokemonCardId} non trouve`});
    }
};

export const createPokemon = async (req: Request, res: Response): Promise<void> => {
    const { name, pokedexId, typeName, lifePoints, size, weight, imageUrl } = req.body;

    // Verifiez si typeName est defini
    if (!typeName) {
        res.status(400).send({ error : 'Le champ typeName est requis'});
        return;
    }

    // Trouver le typeId correspondant au typeName
    const type = await prisma.type.findUnique({
        where: { name: typeName },
    });

    if (!type) {
        res.status(404).send({error : `Type ${typeName} non trouve`});
        return;
    }

    const createdPokemon = await prisma.pokemonCard.create({
        data: {
            name: name,
            pokedexId: pokedexId,
            typeId: type.id,
            lifePoints: lifePoints,
            size: size,
            weight: weight,
            imageUrl: imageUrl,
        },
    });

    res.status(201).json(createdPokemon);
};





export const editPokemon = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const updatedProperties = req.body;

    // Verifie si la carte Pokemon existe
    const existingPokemon = await prisma.pokemonCard.findUnique({
        where: { id: parseInt(pokemonCardId) },
    });

    if (!existingPokemon) {
        res.status(404).send({ error: `Pokemon avec ID ${pokemonCardId} non trouve` });
        return;
    }

    // Si la carte existe, met à jour
    const updatedPokemon = await prisma.pokemonCard.update({
        where: { id: parseInt(pokemonCardId) },
        data: updatedProperties,
    });

    res.status(200).send({ success: updatedPokemon });
};


export const deletePokemon = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;

    // Verifie si la carte Pokemon existe
    const existingPokemon = await prisma.pokemonCard.findUnique({
        where: { id: parseInt(pokemonCardId) },
    });

    if (!existingPokemon) {
        res.status(404).send({ error: `Pokemon avec ID ${pokemonCardId} non trouve` });
        return;
    }

    // Supprime la carte Pokemon
    await prisma.pokemonCard.delete({
        where: { id: parseInt(pokemonCardId) },
    });

    res.status(200).send({ success: `Pokemon avec ID ${pokemonCardId} supprime` });
};