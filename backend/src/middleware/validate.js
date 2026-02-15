const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    } catch (error) {
        console.log(error)
        next(error)
        // const errorMsg = error.issues.map(err => ({
        //     field: err.path.join('.'),
        //     message: err.message
        // }))
        // return res.status(400).json({
        //     message: '輸入格式錯誤',
        //     error: errorMsg
        // })
    }
}

export default validate