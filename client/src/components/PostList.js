import React from 'react'
import Post from './Post'
import '../css/post.css'


export default function PostList(props) {
    const { posts } = props

    return (
        <div className='post-list'>
            { posts.map(post => <Post {...post} key={post._id} />) }
        </div>
    )
}
