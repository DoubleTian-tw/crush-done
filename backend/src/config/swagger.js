import swaggerJsdoc from 'swagger-jsdoc';
import z from 'zod';
import { createTodoSchema, queryTodoSchema, updateTodoSchema } from '../schemas/todoSchema.js';
import { loginSchema, registerSchema } from '../schemas/userSchema.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Crush Done API',
            version: '1.0.0',
            description: 'Crush Done is a todo app',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: '請輸入 Bearer JWT token'
                }
            },
            schemas: {
                createTodo: z.toJSONSchema(createTodoSchema.shape.body),
                getTodo: z.toJSONSchema(queryTodoSchema.shape.query),
                updateTodo: z.toJSONSchema(updateTodoSchema.shape.body),
                register: z.toJSONSchema(registerSchema.shape.body),
                login: z.toJSONSchema(loginSchema.shape.body),
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
export default openapiSpecification;