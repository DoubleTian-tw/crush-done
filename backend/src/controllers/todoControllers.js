import db from '../config/db.js';
import createAppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const createTodo = catchAsync(async (req, res, next) => {
    //建立任務
    const { title, description, due_date = new Date() } = req.body;
    //從middleware取得user id
    const userId = req.user.id;

    //寫入資料庫
    const text = `INSERT INTO todos (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *`
    const values = [userId, title, description, due_date]
    const dbRes = await db.query(text, values);
    if (dbRes.rows.length === 0) {
        return next(createAppError('建立任務失敗', 400))
    }

    const newTask = dbRes.rows[0];
    res.status(201).json({
        data: {
            title: newTask.title,
            description: newTask.description,
            due_date: newTask.due_date,
            user_id: newTask.user_id
        },
        message: '建立任務成功'
    })
})

const getTodo = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // pagination
    const { page, limit, sortBy, order } = req.query;
    const offset = (page - 1) * limit;

    // sort by
    const allowSortFields = ['due_date', 'created_at']
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at'

    const text = `SELECT * FROM todos WHERE user_id = $1 AND deleted_at IS NULL ORDER BY ${safeSortBy} ${order} LIMIT $2 OFFSET $3`
    const values = [userId, limit, offset]
    const dbRes = await db.query(text, values)

    const countText = `SELECT COUNT(*) FROM todos WHERE user_id = $1 AND deleted_at IS NULL`
    const countValues = [userId]
    const countDbRes = await db.query(countText, countValues)
    const totalCount = parseInt(countDbRes.rows[0].count)
    const totalPage = Math.ceil(totalCount / limit)
    res.status(200).json({
        message: '取得任務成功',
        data: dbRes.rows,
        pagination: {
            total: totalCount,
            totalPage: totalPage,
            currentPage: parseInt(page),
            haveNext: parseInt(page) < totalPage,
            havePrev: parseInt(page) > 1,
            limit: parseInt(limit)
        }
    })
})

const updateTodo = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    let setClauses = [];
    let setValues = [];
    let placeholderIndex = 1;

    for (const [key, value] of Object.entries(req.body)) {
        if (value) {
            setClauses.push(`${key} = $${placeholderIndex}`)
            setValues.push(value)
            placeholderIndex++
        }
    }

    if (setClauses.length === 0) {
        return next(createAppError('請提供要更新的欄位', 400))
    }

    setValues.push(userId, taskId)
    const userIdIndex = `$${placeholderIndex}`
    const taskIdIndex = `$${placeholderIndex + 1}`


    const text = `UPDATE todos 
        SET ${setClauses.join(', ')}, updated_at = NOW()
        WHERE user_id = ${userIdIndex} AND task_id = ${taskIdIndex}
        RETURNING *
        `
    const dbRes = await db.query(text, setValues)

    if (dbRes.rows.length === 0) {
        return next(createAppError('找不到任務', 404))
    }

    const updatedTask = dbRes.rows[0];
    res.status(202).json({
        data: updatedTask,
        message: '更新任務成功'
    })
})

const deletedTodo = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const text = `UPDATE todos SET deleted_at = NOW() WHERE user_id = $1 AND task_id = $2 AND deleted_at IS NULL RETURNING *`
    const values = [userId, taskId]
    const dbRes = await db.query(text, values)

    if (dbRes.rows.length === 0) {
        return next(createAppError('找不到任務', 404))
    }

    res.status(202).json({
        message: '刪除任務成功'
    })
})

const restoreTodo = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const text = `UPDATE todos SET deleted_at = NULL WHERE user_id = $1 AND task_id = $2 RETURNING *`
    const values = [userId, taskId]
    const dbRes = await db.query(text, values)

    if (dbRes.rows.length === 0) {
        return next(createAppError('找不到任務', 404))
    }

    res.status(200).json({
        message: '還原任務成功',
        data: dbRes.rows[0]
    })
})

export { createTodo, getTodo, updateTodo, deletedTodo, restoreTodo }