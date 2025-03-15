const mongoose = require("mongoose")
const { Rating, Review } = require("./commonModels")

const itemSchema = new mongoose.Schema({
    category: {
        type: Map,
        of: {
            type: String,
            enum: ["Vinyls", "Antique Furniture", "GPS Sport Watches", "Running Shoes"]
        }
    },
    name: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    description: {
        type: String,
        minLength: 3,
        maxLength: 500,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: String,
        required: true,
        match: /^[_a-zA-Z][_a-zA-Z0-9]*$/,
        minLength: 3,
        maxLength: 20
    },
    image: {
        type: String,
        required: true
    },
    batteryLife: {
        type: Number,
        min: 1,
        required: false
    },
    age: {
        type: Number,
        min: 0,
        required: false
    },
    size: {
        type: Number,
        min: 30,
        max: 50,
        required: false
    },
    material: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: false
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

module.exports = mongoose.model("Item", itemSchema, "Item")