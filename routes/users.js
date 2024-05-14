// users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {isVerified} = require("../jwt/jwt");

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }
    next();
};

router.get('/id', isAuthenticated, userController.getId);

router.get('/profile', isAuthenticated, userController.getProfile); // delete

router.get('/redirect', isAuthenticated, userController.handleMicrosoftRedirect);

router.get('/user', isVerified, userController.getUser)

router.get('/user_by_id/:id', userController.getUserById)

router.get('/menu-items', isVerified, userController.getMenuItemsForRole)

router.get('/user-roles', isVerified, userController.getUserRoles)

// Роут для получения групп пользователя по его ID
router.get('/:id/groups', userController.getUserGroups);

router.get('/data', isAuthenticated, userController.getData)

router.delete('/delete/:id', isAuthenticated, userController.deleteUser)

module.exports = router;
