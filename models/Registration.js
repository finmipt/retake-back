const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    eventId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    work_title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    isPresent : {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('Registration', RegistrationSchema);