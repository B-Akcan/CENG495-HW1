const jwt = require("jsonwebtoken")
const User = require("../models/user")

const extractToken = (req) => {
    const authorization = req.get("authorization")
    if (authorization && authorization.startsWith("Bearer "))
        return authorization.substring(7)
    return null
}

const extractUser = async (token) => {
    const decodedToken = jwt.verify(token, "secret")
    const user = await User.findById(decodedToken.data.id)
    return user
}

const unknownEndpoint = (req, res) => {
    return res.status(404).send({ error: "unknown endpoint" })
}

module.exports = {
    extractToken,
    extractUser,
    unknownEndpoint
}