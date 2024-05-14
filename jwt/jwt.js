// jwt/jwt.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'yourSecretKey'; // Используйте тот же ключ, что и для создания JWT

const isVerified = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Предполагаем формат "Bearer [token]"
        req.user = jwt.verify(token, SECRET_KEY);
        console.log(req.user)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Permission denied' });
        res.redirect('/api/logout');
    }
};

const checkLogIn = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, SECRET_KEY);
        res.json(user)
        console.log('This is checkLogIn response',user)
    } catch (error) {
        res.status(401).json({ message: 'Permission denied' });
        res.redirect('/api/logout');
    }
}


module.exports = {
    isVerified,
    checkLogIn
};
