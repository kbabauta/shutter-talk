import React, { useState, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import '../css/post.css'


export default function PostEdit(props) {

    const initInputs = {
        title: props.title || "",
        description: props.description || "",
        imgUrl: props.imgUrl || ""
    }

    const [ inputs, setInputs ] = useState(initInputs)
    const { editPost } = useContext(UserContext)

    function handleChange(e) {
        const { name, value } = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [ name ]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        editPost(inputs, props._id)
        props.toggleEdit(prevState => !prevState)
    }

    const { title, description, imgUrl } = inputs
    
    return (
        <form className='post-edit' onSubmit={handleSubmit}>
            <input 
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="Title"
            />
            <textarea 
                type="textarea"
                cols="20"
                rows="5"
                name='description'
                value={description}
                onChange={handleChange}
                placeholder="Description"
            />
            <input 
                type="text"
                name='imgUrl'
                value={imgUrl}
                onChange={handleChange}
                placeholder="Image URL"
            />
            <button>Save Changes</button>
        </form>
    )
}
