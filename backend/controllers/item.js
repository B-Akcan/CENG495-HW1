const itemRouter = require("express").Router()
const middleware = require("../utils/middleware")
const Item = require("../models/item")
const Rating = require("../models/rating")
const Review = require("../models/review")

itemRouter.post("/", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const body = req.body

    try {
        const item = new Item({
            category: body.category,
            name: body.name,
            description: body.description,
            price: body.price,
            seller: body.seller,
            image: body.image
        })
    
        if ("batteryLife" in body)
            item.batteryLife = body.batteryLife
        if ("age" in body)
            item.age = body.age
        if ("size" in body)
            item.size = body.size
        if ("material" in body)
            item.material = body.material

        await item.save()
        return res.status(201).json({ info: `Successfully created item '${item.name}'.` })
    } catch {
        return res.status(400).json({ error: "Item could not be validated." })
    }
})

itemRouter.get("/", async (req, res) => {
    const items = await Item.find({}, {name: 1, price: 1, seller: 1, image: 1, category: 1 })
    items.forEach(async (elem, idx) => {
        const ratings = await Rating.find({ itemName: elem.name }, { rating: 1 })
        const len = ratings.length
        const avgRating = ratings.reduce((a, b) => a + b, 0) / len
        items[idx].averageRating = avgRating
    })
    return res.status(200).json(items)
})

itemRouter.get("/:id", async (req, res) => {
    const item = await Item.findById(req.params.id, {_id: 0, __v: 0})
    const phoneNumber = await User.findOne({ username: item.username }, { _id: 0, __v: 0, phoneNumber: 1 })
    const result = Object.assign({}, item, phoneNumber)
    return res.status(200).json(result)
})

itemRouter.get("/:id/ratings", async (req, res) => {
    const item = await Item.findById(req.params.id)
    const ratings = await Rating.find({ itemName: item.name }, { _id: 0, username: 1, rating: 1 })
    return res.status(200).json(ratings)
})

itemRouter.get("/:id/reviews", async (req, res) => {
    const item = await Item.findById(req.params.id)
    const reviews = await Review.find({ itemName: item.name }, { _id: 0, username: 1, review: 1, createdAt: 1 })
    return res.status(200).json(reviews)
})

itemRouter.put("/:id/ratings", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const item = await Item.findById(req.params.id)
    const rating = await Rating.findOne({ username: user.username, itemName: item.name })
    if (rating === null) {
        const newRating = new Rating({
            username: user.username,
            itemName: item.name,
            rating: req.body.rating
        })

        try {
            await newRating.save()
            return res.status(200).json(newRating)
        } catch (e) {
            return res.status(400).json({ error: "Rating must be between 1 and 10." })
        }
        
    } else {
        try {
            rating.rating = req.body.rating
            await rating.save()
            return res.status(200).json(rating)
        } catch (e) {
            return res.status(400).json({ error: "Rating must be between 1 and 10." })
        }
    }
})

itemRouter.put("/:id/reviews", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const item = await Item.findById(req.params.id)
    const review = await Review.findOne({ username: user.username, itemName: item.name })
    if (review === null) {
        const newReview = new Review({
            username: user.username,
            itemName: item.name,
            review: req.body.review,
            createdAt: Date.now()
        })

        try {
            await newReview.save()
            return res.status(200).json(newReview)
        } catch (e) {
            return res.status(400).json({ error: "Review length can be at most 500 characters." })
        }
        
    } else {
        try {
            review.review = req.body.review
            review.createdAt = Date.now()
            await review.save()
            return res.status(200).json(review)
        } catch (e) {
            return res.status(400).json({ error: "Review length can be at most 500 characters." })
        }
    }
})

itemRouter.delete("/:id", async (req, res) => {
    const token = middleware.extractToken(req)
    let user
    try {
        user = await middleware.extractUser(token)
    } catch (e) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    if (!user) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const itemId = req.params.id
    const item = await Item.findById(itemId)

    if (!user.isAdmin && item.username != user.username) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    await Rating.deleteMany({ itemName: item.name })
    await Review.deleteMany({ itemName: item.name })
    await Item.findByIdAndDelete(itemId)

    return res.status(200).json({ info: `Successfully deleted item with id '${req.params.id}'.` })
})

module.exports = itemRouter