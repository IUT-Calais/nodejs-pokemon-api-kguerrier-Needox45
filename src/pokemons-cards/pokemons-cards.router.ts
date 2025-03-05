import { Router } from 'express';
import { getPokemons, getPokemonById, createPokemon, editPokemon, deletePokemon } from './pokemons-cards.controller';
import { verifyJWT } from '../common/jwt.middleware';
export const pokemoncardRouter = Router();

// Route pour obtenir la liste des utilisateurs
pokemoncardRouter.get('/', getPokemons);
pokemoncardRouter.get('/:pokemonCardId', getPokemonById);

// Route pour enregistrer un nouveau pokémon
pokemoncardRouter.post('/', verifyJWT, createPokemon);

// Route pour modifier un pokémon existant
pokemoncardRouter.patch('/:pokemonCardId', verifyJWT, editPokemon);

// Route pour supprimer un pokémon
pokemoncardRouter.delete('/:pokemonCardId', verifyJWT, deletePokemon);