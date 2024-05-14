const express = require('express');
const router = express.Router();
const registrationControllers = require('../controllers/registrationControllers');
const {isVerified} = require("../jwt/jwt");

const checkRequest = (req, res, next) => {
    console.log('Request received at registration router GET ');
    next();
}

router.post('/create', registrationControllers.registerForEvent);
router.get('/getAll', isVerified, registrationControllers.getAllRegistrations);
router.get('/get/:userId', registrationControllers.getRegistrations);
router.get('/get_by_user_and_event/:userId/:eventId', registrationControllers.getByUserAndEvent);
router.get('/get_by_event/:eventId/:location', registrationControllers.getByEventAndLocation);
router.get('/get_presence/:registrationId', registrationControllers.getPresence);
router.put('/update_presence/:registrationId/:isPresent', registrationControllers.updatePresence);
router.delete('/delete/:registrationId', registrationControllers.deleteRegistration);

module.exports = router;