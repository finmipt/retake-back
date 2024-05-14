const Attendance = require('../models/Attendance');

async function createOrUpdateAttendance(req, res) {
    try {
        const { userId, registrationId, isPresent, comment } = req.body;
        let attendance = await Attendance.findOne({ userId, registrationId });
        if (!attendance) {
            attendance = new Attendance({ userId, registrationId, isPresent, comment });
            await attendance.save();
        } else {
            await Attendance.updateOne({ userId, registrationId }, { isPresent, comment });
        }
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAttendanceByRegistrationId(req, res) {
    try {
        const attendance = await Attendance.find({ registrationId: req.params.registrationId });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createOrUpdateAttendance,
    getAttendanceByRegistrationId
};