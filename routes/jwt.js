const express = require('express');
const {isVerified, checkLogIn} = require("../jwt/jwt");
const router = express.Router();

router.get('/check', checkLogIn);

module.exports = router;