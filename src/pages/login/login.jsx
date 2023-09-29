import React from 'react';
import './login.css'
import {UserCircle } from 'phosphor-react'

export const Login = () => {
  return (

      <div className='logininfo'>
        <UserCircle  size={150} />
        <label>Username:</label>
        <input type='text' required/>
        <label>Password:</label>
        <input type='password' required/>
        <button>Log In</button>
        <button>Sign Up</button>
      </div>

  )
}
