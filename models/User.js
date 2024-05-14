const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    microsoftId: {
        type: String,
        required: true,
        unique: true // Убедитесь, что значение id уникально
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    groups: {
        type: [String]
    },
    additional_info: {
        type: Map,
        of: String
    },
    // Дополнительные поля по необходимости...
});

module.exports = mongoose.model('User', UserSchema);
