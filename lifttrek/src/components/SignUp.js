import React, {useContext, useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase';
import axios from "axios";
import { TextField, Button } from '@mui/material';

function SignUp() {
    const {currentUser} = useContext(AuthContext)
    const [pwMatch, setPwMatch] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        const {userName, email, passwordOne, passwordTwo} = event.target.elements;
        console.log(userName,email,passwordOne,passwordTwo)
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Sign up</h2>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={handleSignUp}>
          <div className='form-group'>
            <TextField name='userName' type="text" id="outlined-basic" label="Username" required variant="outlined"/>
          </div>
          <br/>
          <div className='form-group'>
            <TextField name='email' type="email" id="outlined-basic" label="Email" required variant="outlined"/>
          </div>
          <br/>
          <div className='form-group'>
            <TextField name='passwordOne' type="password" id="outlined-basic" label="Password" required variant="outlined"/>
          </div>
          <br/>
          <div className='form-group'>
            <TextField name='passwordTwo' type="password" id="outlined-basic" label="Confirm Password" required variant="outlined"/>
          </div>
          <br/>
          <Button variant='contained' id='submitButton' name='submitButton' type='submit'>
            Sign Up
          </Button>
        </form>
      </div>
      <br />
    </div>
  )
}

export default SignUp
