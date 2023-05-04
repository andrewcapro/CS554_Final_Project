import React, {useContext} from 'react'
import {useNavigate, Navigate, Redirect} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase'

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
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label>
            Email:
            <input
              className='form-control'
              name='email'
              id='email'
              type='email'
              placeholder='Email'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <input
              className='form-control'
              name='password'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <button type='submit'>Log in</button>
      </form>
    </div>
  )
}

export default Login
