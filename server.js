const express = require('express')
const app = express()
require('dotenv').config()

const path = require("path")
const port = process.env.PORT || 9000
const MongoURI = process.env.MONGO_URI



const morgan = require('morgan')
const {expressjwt: jwt} = require('express-jwt')
const mongoose = require('mongoose')

const connectDB = async () => {
    const connection = await mongoose.connect(MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log(`Connected to local server ${connection.connection.host}`)
}

connectDB().then(async() => console.log(`Connected to the server`))

app.use(express.json())
app.use(morgan('dev'))



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

//Heroku Middleware
app.use(express.static(path.join(__dirname, '/client/build')))


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', "index.html"))
})


app.listen(port, () => {
    console.log(`Server is running on local port ${port}`)
})