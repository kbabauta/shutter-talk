const express = require('express')
const app = express()

const path = require("path")
const port = process.env.PORT || 9000


require('dotenv').config()

const morgan = require('morgan')
const {expressjwt: jwt} = require('express-jwt')

const connectDB = async () => {
    const connection = await mongoose.connect(Mongo_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`mongoDB connected: ${connection.connection.host}`)
}

app.use(express.json())
app.use(morgan('dev'))

await connectDB().then(async() => console.log('Connected to the server!'))

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