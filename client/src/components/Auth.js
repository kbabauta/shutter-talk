import React, { useContext, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { UserContext } from '../context/UserContext'
import '../css/auth.css'
import background from '../assets/background-1.jpg'

export default function Auth() {
    const initInputs = {username: "", password:""}

    const [inputs, setInputs] = useState(initInputs)
    const [toggle, setToggle] = useState(false)

    const { signup, login, errMsg } = useContext(UserContext)

    function handleChange(e) {
        const { name, value } = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleSignup(e) {
        e.preventDefault()
        signup(inputs)
        console.log(inputs)
    }

    function handleLogin(e) {
        e.preventDefault()
        login(inputs)
    }
    

    return (
        <div className='auth-page'>
            <div className='auth-image'></div>
                <div className='auth-container'>
                    <h1>Shutter Talk</h1>

                    {!toggle ?
                    <>
                        <AuthForm 
                            handleChange={handleChange}
                            handleSubmit={handleSignup}
                            inputs={inputs}
                            btnText="Sign Up"
                        />
                        <p style={{color: "red"}}>{errMsg}</p>
                        <p onClick={() => setToggle(prev => !prev)}>Already a member?</p>
                    </>
                    :
                    <>
                        <AuthForm 
                            handleChange={handleChange}
                            handleSubmit={handleLogin}
                            inputs={inputs}
                            btnText="Login"
                        />
                        <p style={{color: "red"}}>{errMsg}</p>
                        <p onClick={() => setToggle(prev => !prev)}>Not a member?</p>

                    </>    
                }
            </div>
        </div>
    )
}
