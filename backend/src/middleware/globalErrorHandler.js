const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.name === 'ZodError') {
        const errMsg = err.issues.map(i => i.message).join(', ')
        return res.status(400).json({
            status: 'error',
            message: errMsg
        })
    }
    if (err.code === '23505') {
        return res.status(400).json({
            status: 'error',
            message: '該資訊已被佔用，請嘗試其他內容！'
        })
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

export default globalErrorHandler;