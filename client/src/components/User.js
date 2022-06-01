import React, { useEffect, useState } from 'react'
import PublicPost from './PublicPost'
import axios from 'axios'
import '../css/userCard.css'

export default function User(props) {

    const {username, _id} = props
    const [posts, setPosts] = useState([])
    const userAxios = axios.create()

    userAxios.interceptors.request.use(config => {
        const token = localStorage.getItem("token")
        config.headers.Authorization = `Bearer ${token}`
        return config
    })

    useEffect(() => {
        userAxios.get(`/api/post/user/${_id}`)
            .then(res => setPosts(res.data))
            .catch(err => console.log(err.response.data.errMsg))
    }, [])
        
    posts.sort((a, b) => (a.likes < b.likes ? 1 : -1))
    
    return (
        <div className='user-card'>
            <h1>@{username}'s Posts</h1>
            {posts.map(post => <PublicPost {...post} key={post._id}/>)}
        </div>
    )
}
