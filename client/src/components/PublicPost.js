import React, { useState, useEffect } from 'react'
import Comment from "../components/Comment"
import axios from 'axios'


export default function PublicPost(props) {
    
    const { title, description, imgUrl, _id, likes, dislikes, user, username } = props

    const userAxios = axios.create()

    userAxios.interceptors.request.use(config => {
        const token = localStorage.getItem("token")
        config.headers.Authorization = `Bearer ${token}`
        return config
    })

    const [votes, setVotes] = useState ({ likes: likes || 0, dislikes: dislikes || 0 })
    const [voteErrMsg, setVoteErr] = useState("")
    const [commentToggle, setCommentToggle] = useState(false)
    const [comments, setComments] = useState([])
    const [postObject, setPostObject] = useState({ comment: "", postId: _id })

    useEffect(
        () => {
            userAxios.get(`/api/comments/${_id}`)
                .then(res => setComments(res.data))
                .catch(err => console.log(err))
        },
    [])

    function like(postId) {
        userAxios.put(`/api/post/likes/${postId}`)
            .then(res => setVotes(prevVotes => ({
                ...prevVotes, likes: res.data.likes ||
                prevVotes.likes
            })))
            .catch(err => setVoteErr(err.response.data.errMsg))
    }

    function dislike(postId) {
        userAxios.put(`/api/post/dislikes/${postId}`)
            .then(res => setVotes(prevVotes => ({
                ...prevVotes, dislikes: res.data.dislikes
            })))
            .catch(err => setVoteErr(err.response.data.errMsg))
    }

    function handleChange(e) {
        const { name, value } = e.target
        setPostObject(prevPostObject => ({
            ...prevPostObject,
            [name]: value
        }))
    }

    function addComment(e) {
        e.preventDefault()
        userAxios.post("/api/comments", postObject)
            .then(res => {
                setComments(prevComments => [...prevComments, res.data])
            })
            .catch(err => console.log(err))

            setPostObject(prevPostObject => ({
                ...prevPostObject,
                comment: ""
            }))
    }

    function deleteComment(commentId) {
        userAxios.delete(`/api/comments/${commentId}`)
            .then(res => setComments(prevState => prevState.filter(comment => comment._id !== commentId)))
            .catch(err => console.log(err))
        
    }

    return (

        !commentToggle?
        <div className='post'>
            <h4>{username}</h4>
            <h1>{title}</h1>
            <h3>{description}</h3>
            <img src={imgUrl} alt="" width={300}/>
            <button onClick={() => like(_id)}>🔺{votes.likes}</button>
            <button onClick={() => dislike(_id)}>🔻{votes.dislikes}</button>
            <button onClick={() => setCommentToggle(prevToggle => !prevToggle)}>💬</button>
            <p style={{color: "red"}}>{voteErrMsg}</p>
        </div>

        :

        <div className='post'>
            <form className='comment-form' onSubmit={addComment}>
                <textarea 
                    type='text'
                    name='comment'
                    value={postObject.comment}
                    onChange={handleChange}
                    placeholder="Type your comment here..."
                />
                <button>Add Comment</button>
            </form>
            {comments.map(comment => <Comment {...comment} deleteComment={deleteComment}/>)}
            <br/>
            <button onClick={() => setCommentToggle (prevToggle => !prevToggle)}>Hide Comments</button>
        </div>
    )
}
