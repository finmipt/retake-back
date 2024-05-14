const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    locations: {
        type: [Array],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // here ia the field which is used to show days before the event when the registration is open
    registrationOpens: {
        type: Date,
        required: true
    },
    registrationCloses: {
        type: Date,
        required: true
    },
    responsivePerson: {
        type: String,
        required: false
    },
    createdBy: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    status : {
        type: String,
        default: 'active',
        required: true
    }

});

module.exports = mongoose.model('Event', EventSchema);