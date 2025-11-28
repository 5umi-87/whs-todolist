// scripts/generate-swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

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
      },
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The unique identifier for the todo'
            },
            title: {
              type: 'string',
              description: 'The title of the todo'
            },
            content: {
              type: 'string',
              description: 'The content/description of the todo'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'The start date of the todo'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'The due date of the todo'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed or not'
            },
            deleted: {
              type: 'boolean',
              description: 'Whether the todo is soft deleted or not'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the todo was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the todo was last updated'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'The ID of the user who owns this todo'
            }
          }
        },
        Holiday: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The unique identifier for the holiday'
            },
            title: {
              type: 'string',
              description: 'The title of the holiday'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'The date of the holiday'
            },
            description: {
              type: 'string',
              description: 'The description of the holiday'
            },
            isRecurring: {
              type: 'boolean',
              description: 'Whether the holiday is recurring or not'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the holiday was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the holiday was last updated'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ],
};

// Generate the swagger specs
const specs = swaggerJsdoc(options);

// Write the specs to a file
const swaggerOutputPath = path.join(__dirname, '../swagger/swagger.json');

fs.writeFileSync(swaggerOutputPath, JSON.stringify(specs, null, 2));

console.log(`Swagger JSON file generated at: ${swaggerOutputPath}`);