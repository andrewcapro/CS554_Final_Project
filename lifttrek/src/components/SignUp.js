import React, {useContext, useState} from 'react';
import {useNavigate, Navigate, Redirect} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase';
import axios from "axios";


function SignUp() {
    const {currentUser} = useContext(AuthContext)
    const [pwMatch, setPwMatch] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        const {userName, email, passwordOne, passwordTwo} = event.target.elements;
        if (passwordOne.value !== passwordTwo.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try{
            let ret = await app.auth().createUserWithEmailAndPassword(email.value, passwordOne.value, userName)
            await axios.post("http://localhost:4000/users/", {id: ret.user.uid, username: userName.value, email: email.value});
            navigate("/login");
        } catch(e){
            console.log(e);
            alert(e)
        }
    }

    if (currentUser){
        return <Navigate to="/feed" />
      }

  return (
    <div>
      <h1>Sign up</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label>
            Username:
            <input
              className='form-control'
              required
              name='userName'
              type='text'
              placeholder='Username'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Email:
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Confirm Password:
            <input
              className='form-control'
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <button id='submitButton' name='submitButton' type='submit'>
          Sign Up
        </button>
      </form>
      <br />
    </div>
  )
}

export default SignUp
