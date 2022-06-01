import React from 'react'
import '../css/comment.css'

export default function Comment(props) {
  return (
    <div className='comment'>
        <div className='comment-content'>
            <h4>@{props.username} said</h4>
            <p>"{props.comment}"</p>
        </div>
        <button onClick={() => props.deleteComment(props._id)}>Delete Comment</button>
    </div>
  )
}
