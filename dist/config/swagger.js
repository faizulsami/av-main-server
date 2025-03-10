"use strict";
// First create a new file: src/config/swagger.ts
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API Documentation',
        version: '1.0.0',
        description: 'Documentation for Express REST API',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};
const swaggerOptions = {
    swaggerDefinition,
    apis: [
        './src/app/modules/**/*.route.ts',
        './src/app/modules/**/*.swagger.ts'
    ]
};
exports.default = swaggerOptions;
