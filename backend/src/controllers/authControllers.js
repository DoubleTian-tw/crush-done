import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import catchAsync from '../utils/catchAsync.js';

const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // 產生雜湊密碼
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 寫入資料庫
    const text = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`
    const values = [name, email, hashedPassword]
    const dbRes = await db.query(text, values)

    const newId = dbRes.rows[0].id
    res.status(201).json({
        userId: newId,
        message: '註冊成功',
    })
    console.log(`使用者${newId} ${name} 註冊成功`)
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 先用email去資料庫找
    const text = `SELECT * FROM users WHERE email = $1`
    const userResult = await db.query(text, [email])

    if (userResult.rows.length === 0) {
        return next(createAppError('帳號或密碼錯誤', 401))
    }

    const user = userResult.rows[0]
    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) {
        return next(createAppError('帳號或密碼錯誤', 401))
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(200).json({
        user: {
            id: user.id,
            name: user.name
        },
        token,
        message: '登入成功'
    })
})

export { register, login }