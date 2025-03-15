const itemRouter = require("express").Router()
const middleware = require("../utils/middleware")
const Item = require("../models/item")

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

    const item = new Item({
        category: body.category,
        name: body.name,
        description: body.description,
        price: body.price,
        seller: user.username,
        image: body.image
    })

    if (batteryLife in body)
        item.batteryLife = body.batteryLife
    if (age in body)
        item.age = body.age
    if (size in body)
        item.size = body.size
    if (material in body)
        item.material = body.material

    await item.save()
    return res.status(201).json({ info: `Successfully created item '${item.name}'.` })
})