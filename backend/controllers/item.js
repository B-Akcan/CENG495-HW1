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

    if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "You are not authorized to do this." })
    }

    const body = req.body

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

    try {
        await item.save()
    } catch (e) {
        return res.status(400).json({ error: "Item could not be validated." })
    }
    
    return res.status(201).json({ info: `Successfully created item '${item.name}'.` })
})

itemRouter.get("/", async (req, res) => {
    const items = await Item.find({}, {name: 1, price: 1, seller: 1, image: 1 })
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
    const ratings = await Rating.find({ itemName: item.name }, { rating: 1 })
    const len = ratings.length
    const avgRating = ratings.reduce((a, b) => a + b, 0) / len
    item.averageRating = avgRating
    return res.status(200).json(item)
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
    const rating = await Rating.find({ username: user.username, itemName: item.name })
    if (rating.length === 0) {
        const newRating = new Rating({
            username: user.username,
            itemName: item.name,
            rating: req.body.rating
        })

        try {
            await newRating.save()
        } catch (e) {
            return res.status(400).json({ error: "Rating must be between 1 and 10." })
        }
        
    } else {
        try {
            await Rating.findOneAndUpdate({ username: user.username, itemName: item.name }, { rating: req.body.rating }, { runValidators: true })
        } catch (e) {
            return res.status(400).json({ error: "Rating must be between 1 and 10." })
        }
    }
    
    return res.status(200).json({ info: `Item with id '${req.params.id}' was rated as '${req.body.rating}'.` })
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
    const review = await Review.find({ username: user.username, itemName: item.name })
    if (review.length === 0) {
        const newReview = new Review({
            username: user.username,
            itemName: item.name,
            review: req.body.review
        })

        try {
            await newReview.save()
        } catch (e) {
            return res.status(400).json({ error: "Review length must be between 3 and 500 characters." })
        }
        
    } else {
        try {
            await Review.findOneAndUpdate({ username: user.username, itemName: item.name }, { review: req.body.review }, { runValidators: true })
        } catch (e) {
            return res.status(400).json({ error: "Review length must be between 3 and 500 characters." })
        }
    }
    
    return res.status(200).json({ info: `Item with id '${req.params.id}' was reviewed.` })
})

itemRouter.delete("/:id", async (req, res) => {
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

    const itemId = req.params.id
    const item = await Item.findById(itemId)
    await Rating.deleteMany({ itemName: item.name })
    await Review.deleteMany({ itemName: item.name })
    await Item.findByIdAndDelete(itemId)

    return res.status(200).json({ info: `Successfully deleted item with id '${req.params.id}'.` })
})

module.exports = itemRouter