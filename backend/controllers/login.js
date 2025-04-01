const jwt = require("jsonwebtoken")
const argon2 = require("argon2")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false : await argon2.verify(user.passwordHash, password)

    if (!(user && passwordCorrect))
        return res.status(401).json({ error: "Invalid username or password." })

    const token = jwt.sign({
        data: { username: user.username, id: user._id }
    }, "secret", { expiresIn: "1h" })

    return res.status(200).json({ username, token })
})

module.exports = loginRouter