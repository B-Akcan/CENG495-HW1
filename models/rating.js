const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema({
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
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        enum: Array(10).fill().map((_, i) => i + 1),
        required: true
    }
})

module.exports = mongoose.model("Rating", ratingSchema, "Rating")