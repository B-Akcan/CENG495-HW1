const mongoose = require("mongoose")
const { Rating, Review } = require("./commonModels")

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
    isAdmin: {
        type: Boolean,
        default: false
    },
    ratings: {
        type: [Rating],
        default: []
    },
    reviews: {
        type: [Review],
        default: []
    }
})

module.exports = mongoose.model("User", userSchema, "User")