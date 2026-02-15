import z from "zod";

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "名字太短").max(20, "名字太長"),
        email: z.email("請輸入正確的email格式"),
        password: z.string().min(6, "密碼至少六碼")
    })
})


const loginSchema = z.object({
    body: z.object({
        email: z.email("請輸入正確的email格式"),
        password: z.string().min(6, "密碼至少六碼")
    })
})

export { registerSchema, loginSchema }