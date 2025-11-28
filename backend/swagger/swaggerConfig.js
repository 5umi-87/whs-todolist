// swagger/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WHS-TodoList API',
      version: '1.0.0',
      description: 'API documentation for the WHS-TodoList application backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token received from login/register'
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',   // Path to route files with JSDoc comments
    './src/controllers/*.js' // Path to controller files with JSDoc comments
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;