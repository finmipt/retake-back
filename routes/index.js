var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'MSAL Node & Express Web App',
    isAuthenticated: req.session.isAuthenticated,
    username: req.session.account?.username,
  });
});

router.get('/logout', (req, res) => {
  // Clear JWT token cookie
  res.clearCookie('jwt');

  // Redirect to another route, for example, the login page
  res.redirect('auth/signout');
});

module.exports = router;