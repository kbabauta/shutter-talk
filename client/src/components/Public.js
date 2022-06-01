import React, { useEffect, useState } from 'react'
import User from './User'
import axios from 'axios'

export default function Public() {

    const userAxios = axios.create()

    userAxios.interceptors.request.use(config => {
        const token = localStorage.getItem("token")
        config.headers.Authorization = `Bearer ${token}`
        return config
    })

    const [users, setUsers] = useState([])

    useEffect(() => {userAxios.get("/api/users")
        .then(res => setUsers(res.data))
        .catch(err => console.log(err.resposne.data.errMsg))
    }, [])
    
    console.log(users)

    return (
        <div>
            {users.map(user => <User {...user} key={user._id} />)}
        </div>
    )
}
