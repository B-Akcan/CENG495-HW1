const userRouter = require("express").Router()
const argon2 = require("argon2")
const User = require("../models/user")
const middleware = require("../utils/middleware")

userRouter.post("/", async (req, res) => {
    const body = req.body

    const passwordHash = await argon2.hash(body.password)

    const user = new User({
        username: body.username,
        passwordHash
    })

    await user.save()
    return res.status(201).json({ info: `Successfully created user '${user.username}'.` })
})

userRouter.get("/:username", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || user.username !== req.params.username) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const userToReturn = {
        username: user.username,
        ratings: user.ratings,
        reviews: user.reviews
    }
    return res.status(200).json(userToReturn)
})

userRouter.delete("/:username", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || user.username !== req.params.username) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    await User.findByIdAndDelete(user._id.toString())
    return res.status(200).json({ info: `User '${user.username}' was deleted.` })
})

module.exports = userRouter