const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema ({
    
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imgUrl: {
        type: String,
    },

    likes: {
        type: Number
    },

    dislikes: {
        type: Number
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    userLikes: {
        type: Array
    },

    userDislikes: {
        type: Array
    }
})

module.exports = mongoose.model('Post', postSchema)