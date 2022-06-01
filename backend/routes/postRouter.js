const express = require('express')
const postRouter = express.Router()
const Post = require('../models/Post')
const { post } = require('./authRouter')

// Get all posts
postRouter.get("/", (req, res, next) => {
    Post.find (
        (err, posts) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send(posts)
        }
    )
})

// Get by posts user
postRouter.get("/user", (req, res, next) => {
    Post.find({ user: req.auth._id }, (err, posts) => {
        if (err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// Get Posts by user ID
postRouter.get("/user/:userId", (req, res, next) => {
    Post.find({ user: req.params.userId }, (err, posts) => {
        if (err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// Get post by post ID
postRouter.get("/:postId", (req, res, next) => {
    Post.find({ _id: req.params.postId }, (err, posts) => {
        if(err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// Add Like
postRouter.put("/likes/:postId", (req, res, next) => {
    Post.findOneAndUpdate (
        { _id: req.params.postId },
        { $inc: {likes: 1}},
        { new: true },
        (err, post) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            if(!post.userLikes.includes(req.auth._id)){
                Post.findOneAndUpdate(
                    { _id: req.params.postId },
                    { $push: { userLikes: req.auth._id } },
                    { new: true },
                    (err, issue) => {
                        if (err) {
                            res.status(500)
                            return next(err)
                        }
                        console.log(post)
                        return res.status(200).send(post)
                    })
            } else {
                res.status(500)
                Post.findOneAndUpdate (
                    { _id: req.params.postId },
                    {$inc: {userLikes: -1}},
                    {new: true},
                    (err, post) => {
                        if (err) {
                            res.status(500)
                            return next(err)
                        }
                        return
                    }
                )
                return next(new Error("You already liked this post!"))
            }
        })
})

// Dislike
postRouter.put("/dislikes/:postId", (req, res, next) => {
    post.findOneAndUpdate (
        {_id: req.params.postId},
        {$inc: {userDislikes: 1}},
        {new: true},
        (err, post) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            if (!post.userDislikes.includes(req.auth._id)) {
                Post.findOneAndUpdate (
                    {_id: req.params.postId},
                    {$push: {userDislikes: req.auth._id}},
                    {new: true},
                    (err, post) => {
                        if (err) {
                            res.status(500)
                            return next(err)
                        }
                        console.log(post)
                        return res.status(200).send(post)
                    })
            } else {
                res.status(500)
                post.findOneAndUpdate (
                    {_id: req.params.postId},
                    {$inc: {userDislikes: -1}},
                    {new: true},
                    (err, post) => {
                        if (err) {
                            res.status(500)
                            return next(err)
                        }
                        return
                    })
                return next(new Error("You already disliked this post!"))
            }
        }
    )
})

// Add new post
postRouter.post("/", (req, res, next) => {
    req.body.user = req.auth._id
    const newPost = new Post(req.body)
    newPost.save((err, savedPost) => {
        if (err) {
            res.status(500)
            return next(err)
        }
        return res.status(201).send(savedPost)
    })
})

// Delete Post
postRouter.delete("/:postId", (req, res, next) => {
    Post.findOneAndDelete (
        {_id: req.params.postId, auth: req.auth._id},
        (err, deletedPost) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send("Successfully removed post from the database")
        }
    )
})

// Update Post
postRouter.put("/:postId", (req, res, next) => {
    Post.findOneAndUpdate (
        {_id: req.params.postId, auth: req.auth._id},
        req.body,
        {new: true},
        (err, updatedPost) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedPost)
        }
    )
})

module.exports = postRouter