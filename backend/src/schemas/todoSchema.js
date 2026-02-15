import z from "zod";

const createTodoSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "標題必填" }).trim().min(1, "標題不能為空").max(100, "標題不能超過100個字"),
        description: z.string().max(255, "描述不能超過255個字").optional(),
        status: z.enum(['todo', 'in-progress', 'completed', 'hold']).optional(),
        due_date: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "格式必須是 YYYY-MM-DD")
            .optional()
    })
})

const updateTodoSchema = z.object({
    body: createTodoSchema.shape.body.partial(),
    params: z.object({
        id: z.string().regex(/^\d+$/, "id必須是數字")
    })
})

const deleteTodoSchema = z.object({
    params: updateTodoSchema.shape.params
})

const queryTodoSchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).default(10),
        sortBy: z.enum(['due_date', 'created_at']).default('created_at'),
        order: z.enum(['asc', 'desc']).default('desc'),
    })
})


export { createTodoSchema, updateTodoSchema, deleteTodoSchema, queryTodoSchema }