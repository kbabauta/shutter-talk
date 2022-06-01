import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import PostForm from "./PostForm"
import PostList from "./PostList"
import '../css/profile.css'

export default function Profile() {

    const {
        user: {
            username
        },
        getUserPosts,
        addPost,
        posts
    } = useContext(UserContext)

    useEffect(getUserPosts, [])

    return (
        <div className='profile'>
            <h1>Welcome { username } </h1>
            <h3>Post Something</h3>
                <PostForm addPost={addPost} />
            <h3>Your Posts</h3>
                <PostList posts={posts} />
        </div>
    )
}
