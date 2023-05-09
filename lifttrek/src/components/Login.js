import React, {useContext} from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase'
import { TextField, Button, FormControl, InputLabel, FormHelperText } from '@mui/material';

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
        <FormControl>
            <InputLabel htmlFor="email" shrink={true}>Email</InputLabel>
            <TextField name='email' type="email" id="email" required variant="filled"/>
            <FormHelperText id="email-helper-text" aria-live="polite">
              Type your email
            </FormHelperText>
          </FormControl>
        </div>
        <br/>
        <div className='form-group'>
          <FormControl>
            <InputLabel htmlFor="password" shrink={true}>Password</InputLabel>
            <TextField name='password' type="password" id="password" autoComplete='off' required variant="filled"/>
            <FormHelperText id="password-helper-text" aria-live="polite">
              Type your password
            </FormHelperText>
          </FormControl>
        </div>
        <br/>
        <Button variant='contained' id='submitButton' name='submitButton' type='submit'>Log In</Button>
      </form>
    </div>
  )
}

export default Login
