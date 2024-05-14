const express = require('express');
const router = express.Router();
const eventControllers = require('../controllers/eventControllers');
const {isVerified} = require("../jwt/jwt");


router.post('/create', eventControllers.createEvent);
router.get('/get', eventControllers.getEvents);
router.get('/get/:id', eventControllers.getEventById);
router.get('/get_locations/:event_id', eventControllers.getLocationsByEventId);
router.put('/update/:id', eventControllers.updateEvent);
router.delete('/delete/:id', eventControllers.deleteEvent);

module.exports = router;