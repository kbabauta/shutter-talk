const express = require('express')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')
const User = require("../models/User")

userRouter.get("/", (req, res, next) => {
    User.find (
        {},
        (err, users) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send(users)
        }
    )
})

module.exports = userRouter