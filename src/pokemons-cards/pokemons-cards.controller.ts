import{ Request, Response } from 'express';
import prisma from '../client';

 

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

export const createPokemon = async (req: Request, res: Response): Promise<void> => {
    const { name, pokedexId, typeName, lifePoints, size, weight, imageUrl } = req.body;

    // Vérifiez si typeName est défini
    if (!typeName) {
        res.status(400).send('Le champ typeName est requis');
        return;
    }

    // Trouver le typeId correspondant au typeName
    const type = await prisma.type.findUnique({
        where: { name: typeName },
    });

    if (!type) {
        res.status(404).send(`Type ${typeName} non trouvé`);
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