const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')

const config = require("./utils/config")
const middleware = require("./utils/middleware")
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/user")
const itemRouter = require("./controllers/item")

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log("Database connection successful")
  })
  .catch(() => {
    console.log("Database connection failed")
  })

const db = mongoose.connection
db.collections.Rating.createIndex({ username: 1, itemName: 1 })
db.collections.Review.createIndex({ username: 1, itemName: 1 })

app.use(cors({
  origin: true
}))
app.use(express.json())
app.use(express.static("dist"))
app.use("/login", loginRouter)
app.use("/users", userRouter)
app.use("/items", itemRouter)
app.use(middleware.unknownEndpoint)

module.exports = app