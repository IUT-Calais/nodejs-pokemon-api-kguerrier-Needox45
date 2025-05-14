import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
import express from 'express';
import { getPokemons, getPokemonById, createPokemon, editPokemon, deletePokemon } from '../src/pokemons-cards/pokemons-cards.controller';
import prisma from '../src/client';


describe('PokemonCard API', () => {

  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {

      const mockPokemonCards = [
       {id : 1, name : "Pikachu", pokedexId : 25, typeId : 1, lifePoints : 35, size : 4, weight : 60, imageUrl : "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png"},
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');


      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success : mockPokemonCards});
    });
  });


  //page 46 cours


  // pour mettre un tocken lors du resultat
  //.set ('Authorization', `Bearer ${token}`)

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        id: 1,
        name: "Pikachu",
        pokedexId: 25,
        typeId: 1,
        lifePoints: 35,
        size: 4,
        weight: 60,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success :mockPokemonCard});
    });

    it('should return 404 if PokemonCard is not found', async () => {
      
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error : 'Pokemon avec ID 999 non trouve' });
    });

  });
  });


  

  describe('POST /pokemon-cards', () => {
      it('should create a new PokemonCard', async () => {
      const token = 'mockedToken';

      const createdPokemonCard = {
          name: "Pikachu",
          pokedexId: 25,
          typeName: "Electric", // Remplacez typeId par typeName
          lifePoints: 35,
          size: 0.4,
          weight: 6,
          imageUrl: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png"
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 23, name: "Electric" }); // Mock du type
      prismaMock.pokemonCard.create.mockResolvedValue({
          id: 1,
          ...createdPokemonCard,
          typeId: 23,
      });

      const response = await request(app)
          .post('/pokemons-cards')
          .set('Authorization', `Bearer ${token}`)
          .send(createdPokemonCard);

      // Verifie que findUnique a ete appelee avec les bons arguments
      expect(prismaMock.type.findUnique).toHaveBeenCalledWith({
          where: { name: "Electric" },
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
          id: 1,
          ...createdPokemonCard,
          typeId: 23,
        });
      });
    });




  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const token = 'mockedToken';

      const updatedPokemonCard = {
          id: 1,
          name: "Pikachutchou",
          pokedexId: 25,
          typeId: 23,
          lifePoints: 35,
          size: 0.4,
          weight: 6,
          imageUrl: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png"
      };

      // Simule une carte existante
      prismaMock.pokemonCard.findUnique.mockResolvedValue(updatedPokemonCard);

      // Simule la mise à jour de la carte
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
          .patch('/pokemons-cards/1')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedPokemonCard);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: updatedPokemonCard });
      });


    it('should return 404 if PokemonCard to update is not found', async () => {
    const token = 'mockedToken';

    prismaMock.pokemonCard.findUnique.mockResolvedValue(null); // Simule une carte inexistante

    const updatedPokemonCard = {
        name: "Pikachutchou",
        pokedexId: 25,
        typeId: 23,
        lifePoints: 35,
        size: 0.4,
        weight: 6,
        imageUrl: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png"
    };

    const response = await request(app)
        .patch('/pokemons-cards/9999') // ID inexistant
        .set('Authorization', `Bearer ${token}`)
        .send(updatedPokemonCard);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Pokemon avec ID 9999 non trouve' });
    });
  });

  





  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard not find', async () => {
      
    const token = 'mockedToken';

    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

        const response = await request(app)
            .delete('/pokemons-cards/999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Pokemon avec ID 999 non trouve' });
    });

    it('should delete a PokemonCard successfully', async () => {
      const token = 'mockedToken';

      const deletePokemonCard = {
        id: 1,
        name: "Pikachu",
        pokedexId: 25,
        typeId: 23,
        lifePoints: 35,
        size: 0.4,
        weight: 6,
        imageUrl: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png"
    };

    prismaMock.pokemonCard.findUnique.mockResolvedValue(deletePokemonCard); // Simule une carte existante
    prismaMock.pokemonCard.delete.mockResolvedValue(deletePokemonCard); // Simule la suppression

    const response = await request(app)
        .delete('/pokemons-cards/1')
        .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: 'Pokemon avec ID 1 supprime' });
  });
});


  

