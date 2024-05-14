const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    registrationId: {
        type: String,
        required: true
    },
    isPresent: {
        type: Boolean,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);