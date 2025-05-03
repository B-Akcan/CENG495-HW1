const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Vinyls", "Antique Furniture", "GPS Sport Watches", "Running Shoes"]
    },
    name: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true,
        unique: true
    },
    description: {
        type: String,
        maxLength: 1000,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: String,
        required: true,
        match: /^[a-zA-Z][_'.,a-zA-Z0-9\s]*$/,
        minLength: 3,
        maxLength: 50
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
        maxLength: 30,
        required: false
    },
    username: {
        type: String,
        required: true,
        match: /^[_a-zA-Z][_a-zA-Z0-9]*$/,
        minLength: 3,
        maxLength: 20
    }
})

module.exports = mongoose.model("Item", itemSchema, "Item")