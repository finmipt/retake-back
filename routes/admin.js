const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminControllers = require('../controllers/adminControllers');
const {isVerified} = require("../jwt/jwt");

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }
    next();
};

router.get('/employees', adminControllers.getEmployees);

module.exports = router;