const Registration = require('../models/Registration');

async function registerForEvent(req, res) {
    // Here I need to create a new registration in the database. But no more than 3 registrations per user for 1 event
    try {
        const {eventId} = req.body;
        const existingRegistration = await Registration
            .find({eventId, userId: req.body.userId})
            .countDocuments();

        if (existingRegistration > 2) { // If the user has already registered 3 times
            return res.status(400).json({message: 'You can not register more than 3 times for the same event'});
        }
        else {
            const registration = new Registration({
                ...req.body,
            });
            await registration.save();
            res.status(201).json(registration);
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }

}

async function getRegistrations(req, res) {
    try {
        const userId = req.params.userId;
        console.log('User is ', userId, ' and type is ', typeof userId);
        const registrations = await Registration
            .find({userId: req.params.userId});
        res.json(registrations);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}
async function getAllRegistrations(req, res) {
    try {
        const registrations = await Registration.find();
        res.json(registrations);
    }
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('I do not know what is wrong');
    }
}
async function getByEventAndLocation(req, res) {
    try {
        const {eventId, location} = req.params;
        console.log('Event is ', eventId, ' and location is ', location);
        const registrations = await Registration
            .find({eventId, place: location});
        res.json(registrations);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getPresence(req, res) {
    try {
        const {registrationId} = req.params;
        const registration = await Registration
            .findById(registrationId);
        res.json(registration.isPresent);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function updatePresence(req, res) {
    try {
        const {registrationId, isPresent} = req.params;
        const registration = await Registration
            .findById(registrationId);
        registration.isPresent = isPresent;
        await registration.save();
        res.json(registration);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getByUserAndEvent(req, res) {
    try {
        const {userId, eventId} = req.params;
        const registrations = await Registration
            .find({userId, eventId});
        res.json(registrations);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}
async function deleteRegistration(req, res) {
    try {
        const {registrationId} = req.params;
        const registration = await Registration
            .findByIdAndDelete(registrationId);
        res.json(registration);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    registerForEvent,
    getRegistrations,
    getAllRegistrations,
    getByEventAndLocation,
    getPresence,
    updatePresence,
    getByUserAndEvent,
    deleteRegistration
};