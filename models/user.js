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
    ratings: [{
        type: Map,
        of: {
            type: Number,
            enum: Array(10).fill().map((_, i) => i + 1)
        },
        default: []
    }],
    reviews: [{
        type: Map,
        of: {
            type: String,
            minLength: 3,
            maxLength: 500
        },
        default: []
    }]
})

module.exports = mongoose.model("User", userSchema, "User")