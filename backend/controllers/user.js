const userRouter = require("express").Router()
const argon2 = require("argon2")
const User = require("../models/user")
const Rating = require("../models/rating")
const Review = require("../models/review")
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

userRouter.get("/", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const users = await User.find({}, { _id: 0, username: 1 })
    return res.status(200).json(users)
})

userRouter.get("/:username", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || (!user.isAdmin && user.username !== req.params.username)) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const username = user.username
    const ratings = await Rating.find({ username: username }, { itemName: 1, rating: 1 })
    const len = ratings.length
    const avgRating = ratings.map(rating => rating.rating).reduce((a, b) => a + b, 0) / len
    const reviews = await Review.find({ username: username }, { itemName: 1, review: 1 })
    const userToReturn = {
        username,
        ratings,
        avgRating,
        reviews,
        isAdmin: user.isAdmin
    }
    return res.status(200).json(userToReturn)
})

userRouter.get("/:username/ratings", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || (!user.isAdmin && user.username !== req.params.username)) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const ratings = await Rating.find({ username: req.params.username }, { _id: 0, itemName: 1, rating: 1 })
    return res.status(200).json(ratings)
})

userRouter.get("/:username/reviews", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || (!user.isAdmin && user.username !== req.params.username)) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }
    
    const reviews = await Review.find({ username: req.params.username }, { _id: 0, itemName: 1, review: 1, createdAt: 1 })
    return res.status(200).json(reviews)
})

userRouter.delete("/:username", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user || (!user.isAdmin && user.username !== req.params.username)) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    await Rating.deleteMany({ username: req.params.username })
    await Review.deleteMany({ username: req.params.username })
    await User.deleteOne({ username: req.params.username })
    
    return res.status(200).json({ info: `User '${req.params.username}' was deleted.` })
})

module.exports = userRouter