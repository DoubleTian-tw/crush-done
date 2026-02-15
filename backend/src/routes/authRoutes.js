import express from 'express';
import { login, register } from '../controllers/authControllers.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/userSchema.js';
const router = express.Router();


/**
 * @openapi
 * /api/auth/register:
 *    post:
 *      summary: Register a new user.
 *      tags:
 *        - Auth
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/register"
 *            application/xml:
 *              schema:
 *                $ref: "#/components/schemas/register"
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: "#/components/schemas/register"
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userId:
 *                    type: number
 *                    description: The user id of the todo list.
 *                  message:
 *                    type: string
 *                    description: The message of the todo list.
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *    post:
 *      summary: Login a user.
 *      tags:
 *        - Auth
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/login"
 *            application/xml:
 *              schema:
 *                $ref: "#/components/schemas/login"
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: "#/components/schemas/login"
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                        description: The user id of the todo list.
 *                      name:
 *                        type: string
 *                        description: The name of the todo list.
 *                  token:
 *                    type: string
 *                    description: The token of the todo list.
 *                  message:
 *                    type: string
 *                    description: The message of the todo list.
 */
router.post('/login', validate(loginSchema), login);

export default router;