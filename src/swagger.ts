import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import express from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PlaylistEngine API',
      version: '1.0.0',
      description: 'API documentation for PlaylistEngine',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const specs = swaggerJsDoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
