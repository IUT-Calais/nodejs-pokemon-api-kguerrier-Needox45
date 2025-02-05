import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.type.deleteMany();
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  const types = await prisma.type.findMany();

  await prisma.pokemonCard.createMany({
    data: [
      {
        name: 'Pikachu',
        pokedexId: 25,
        typeId: types.find(type => type.name === 'Electric')?.id!,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png',
      },
      {
        name: 'Salameche',
        pokedexId: 4,
        typeId: types.find(type => type.name === 'Fire')?.id!,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png',
      },
      {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: types.find(type => type.name === 'Grass')?.id!,
        lifePoints: 44,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png',
      },
      {
        name: 'Carapuce',
        pokedexId: 7,
        typeId: types.find(type => type.name === 'Water')?.id!,
        lifePoints: 45,
        size: 0.6,
        weight: 9.0,
        imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png',
      },
    ],
  });

  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: 'admin',
    },
  });

}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
