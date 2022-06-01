const express = require('express')
const app = express()

require('dotenv').config()

const morgan = require('morgan')
const {expressjwt: jwt} = require('express-jwt')

const connectDB = require('./db-atlas')

app.use(express.json())
app.use(morgan('dev'))

connectDB()

app.use("/auth", require("./routes/authRouter"))
app.use("/api", jwt({secret: process.env.SECRET, algorithms: ['HS256']}))
app.use("/api/post", require("./routes/postRouter"))
app.use("/api/users", require("./routes/userRouter"))
app.use("/api/comments", require("./routes/commentRouter"))

app.use((err, req, res, next)=> {
    console.log(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
}) 

app.listen(9000, () => {
    console.log("Server is running on local port 9000")
})