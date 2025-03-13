const express = require("express")
const mongoose = require("mongoose")
const config = require("./utils/config")
const middleware = require("./utils/middleware")
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/user")

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log("connection successful")
  })
  .catch(() => {
    console.log("connection failed")
  })

app.use(express.json())
app.use("/login", loginRouter)
app.use("/users", userRouter)
app.use(middleware.unknownEndpoint)

module.exports = app