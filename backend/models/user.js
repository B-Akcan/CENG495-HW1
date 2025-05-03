const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[_a-zA-Z][_a-zA-Z0-9]*$/,
        minLength: 3,
        maxLength: 20
    },
    passwordHash: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10,10}$/,
        minLength: 10,
        maxLength: 10
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema, "User")