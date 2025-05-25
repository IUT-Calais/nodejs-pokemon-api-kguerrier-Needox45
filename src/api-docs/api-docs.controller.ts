import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NodeJS Pokemon API',
      version: '1.0.0',
      description: 'Documentation de l\'API Pokemon',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  apis: [
    './src/user/user.router.ts',
    './src/pokemons-cards/pokemons-cards.router.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerDocument);
