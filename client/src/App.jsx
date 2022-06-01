import React, { useContext } from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import { UserContext } from './context/UserContext'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Public from './components/Public'

export default function App() {

  const { token, logout } = useContext(UserContext)
  return (
    <div className='app'>
      {token && <Navbar logout={logout}/>}
        <Routes>

          <Route 
            path="/"
            element={token ? <Navigate to="/profile"/> : <Auth/>}
          />

          <Route 
            path='/profile'
            element={token ? <Profile/> : <Auth/>}
          />

          <Route 
            path='/public'
            element={token ? <Public /> : <Auth />}
          />

        </Routes>
    </div>
  )
}

