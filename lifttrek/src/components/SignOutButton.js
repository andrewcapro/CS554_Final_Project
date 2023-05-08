import React from 'react';
import {useNavigate } from 'react-router-dom'
import app from '../firebase/firebase';
import { Button } from '@mui/material';


const SignOutButton = () => {
    const navigate = useNavigate()
    
    const handleSignOut = async (event) => {
        try {
            app.auth().signOut()
            navigate("/")
        } catch(e){
            console.log(e);
            alert(e);
        }
    }

  return (
    <Button id="signoutButton" variant="contained" type='button' onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;