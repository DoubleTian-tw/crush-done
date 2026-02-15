import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createTodo, deletedTodo, getTodo, restoreTodo, updateTodo } from '../controllers/todoControllers.js';
import validate from '../middleware/validate.js';
import { createTodoSchema, deleteTodoSchema, queryTodoSchema, updateTodoSchema } from '../schemas/todoSchema.js';
const todoRouter = express.Router();

/**
 * @openapi
 * /api/todo/create:
 *   post:
 *      summary: Create a new todo list.
 *      tags:
 *        - Todo
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/createTodo"
 *            application/xml:
 *              schema:
 *                $ref: "#/components/schemas/createTodo"
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: "#/components/schemas/createTodo"
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: The title of the todo list.
 *                  description:
 *                    type: string
 *                    description: The description of the todo list.
 *                  due_date:
 *                    type: string
 *                    description: The due date of the todo list.
 *                  user_id:
 *                    type: number
 *                    description: The user id of the todo list.
 */
todoRouter.post('/create', authMiddleware, validate(createTodoSchema), createTodo);

/**
 * @openapi
 * /api/todo/get:
 *    get:
 *      summary: Get all todo lists.
 *      tags:
 *        - Todo
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *          - in: query
 *            name: sortBy
 *            schema:
 *              type: string
 *              enum: [due_date, created_at]
 *              default: created_at
 *          - in: query
 *            name: order
 *            schema:
 *              type: string
 *              enum: [asc, desc]
 *              default: desc
 *      responses:
 *        "200": # status code
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  total:
 *                    type: number
 *                  totalPage:
 *                    type: number
 *                  currentPage:
 *                    type: number
 *                  haveNext:
 *                    type: boolean
 *                  havePrev:
 *                    type: boolean
 *                  limit:
 *                    type: number
 */
todoRouter.get('/get', authMiddleware, validate(queryTodoSchema), getTodo);


/**
 * @openapi
 * /api/todo/update/{id}:
 *    patch:
 *      summary: Update a todo list.
 *      tags:
 *        - Todo
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/updateTodo"
 *            application/xml:
 *              schema:
 *                $ref: "#/components/schemas/updateTodo"
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: "#/components/schemas/updateTodo"
 *      responses:
 *        "200": # status code
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                      title:
 *                        type: string
 *                      description:
 *                        type: string
 *                      status:
 *                        type: string
 *                      due_date:
 *                        type: string
 */
todoRouter.patch('/update/:id', authMiddleware, validate(updateTodoSchema), updateTodo);

/**
 * @openapi
 * /api/todo/delete/{id}:
 *    delete:
 *      summary: Delete a todo list.
 *      tags:
 *        - Todo
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 */
todoRouter.delete('/delete/:id', authMiddleware, validate(deleteTodoSchema), deletedTodo);

/**
 * @openapi
 * /api/todo/restore/{id}:
 *    patch:
 *      summary: Restore a todo list.
 *      tags:
 *        - Todo
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 */
todoRouter.patch('/restore/:id', authMiddleware, validate(deleteTodoSchema), restoreTodo);

export default todoRouter;
