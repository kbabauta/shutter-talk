const mongoose = require('mongoose')
require('dotenv').config()

const MongoURI = process.env.MONGO_URI

const connectDB = async () => {
    const connection = await mongoose.connect(MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`mongoDB connected: ${connection.connection.host}`)
}

module.exports = connectDB