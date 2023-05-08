import React, {useContext} from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase'
import { TextField, Button } from '@mui/material';

function Login() {
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    try{
      await app.auth().signInWithEmailAndPassword(email.value, password.value);
      navigate("/feed")
    } catch(e){
      console.log(e)
      alert(e)
    }
  }

  if (currentUser){
    return <Navigate to="/feed" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <TextField               
            className='form-control'
            name='email'
            id='email'
            type='email'
            label="Email"
            required/>
        </div>
        <br/>
        <div className='form-group'>
          <TextField               
            className='form-control'
            name='password'
            type='password'
            label='Password'
            autoComplete='off'
            required/>
        </div>
        <br/>
        <Button variant='contained' id='submitButton' name='submitButton' type='submit'>Log In</Button>
      </form>
    </div>
  )
}

export default Login
