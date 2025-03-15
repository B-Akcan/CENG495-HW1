const mongoose = require("mongoose")

const Rating = new mongoose.Schema({
    type: Map,
    of: {
        type: Number,
        enum: Array(10).fill().map((_, i) => i + 1)
    }
})

const Review = new mongoose.Schema({
    type: Map,
    of: {
        type: String,
        minLength: 3,
        maxLength: 500
    }
})

module.exports = { Rating, Review }