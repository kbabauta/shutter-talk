import React, {useState} from 'react'
import axios from 'axios'

const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

function UserContextProvider(props) {

    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || "",
        token: localStorage.getItem("token") || "",
        posts: []
    }
    const [userState, setUserState] = useState(initState)

    function signup(credentials) {
        axios.post("/auth/signup", credentials)
            .then (res => {
                const {user, token} = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthError(err.response.data.errMsg))
    }

    function login(credentials) {
        axios.post("/auth/login", credentials)
            .then(res => {
                const {user, token} = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                getUserPosts()
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthError(err.response.data.errMsg))
    }

    function getUserPosts() {
        userAxios.get("/api/post/user")
            .then(res => {
                setUserState(prevState => ({
                    ...prevState,
                    posts: res.data
                }))
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    function logout(credentials) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            posts: []
        })
    }

    function addPost(newPost) {
        userAxios.post("/api/post", newPost)
            .then(res => {
                setUserState(prevState => ({
                    ...prevState,
                    posts: [...prevState.posts, res.data]
                }))
            })
    }

    function handleAuthError(errMsg) {
        setUserState(prevState => ({
            ...prevState,
            errMsg
        }))
    }

    function deletePost(postId) {
        userAxios.delete(`/api/post/${postId}`)
            .then(res => setUserState(prevState => ({
                ...prevState,
                posts: prevState.posts.filter(post => post._id !== postId)
            })))

            .catch(err => console.log(err))
            return getUserPosts()
    }

    function editPost(newEntry, postId) {
        userAxios.put(`/api/post/${postId}`, newEntry)
            .then(res => setUserState(prevState => ({
                ...prevState,
                posts: prevState.posts.map(post => post._id !== postId ? post : res.data)
            })))
    }

    return (
        <UserContext.Provider
            value={{
                ...userState,
                signup,
                login,
                logout,
                getUserPosts,
                addPost,
                deletePost,
                editPost
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
    
}




export {UserContext, UserContextProvider}