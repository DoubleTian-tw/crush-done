import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const verifyToken = (req, res, next) => {
    try {
        const auth = req.headers['authorization'];
        const token = auth && auth.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: '請提供Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Token驗證失敗',
                    error: err
                })
            }
            req.user = decoded;
            next();
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'Token驗證失敗'
        })
    }
}

export default verifyToken