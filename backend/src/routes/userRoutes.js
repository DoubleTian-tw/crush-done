import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: '歡迎進入profile',
        user: req.user
    })
})

export default userRouter;