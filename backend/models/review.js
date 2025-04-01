const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: /^[_a-zA-Z][_a-zA-Z0-9]*$/,
        minLength: 3,
        maxLength: 20
    },
    itemName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    review: {
        type: String,
        minLength: 3,
        maxLength: 500,
        required: true
    }
})

module.exports = mongoose.model("Review", reviewSchema, "Review")