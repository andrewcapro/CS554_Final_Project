import React, {useContext, useState} from 'react';
import {useNavigate, Navigate, Redirect} from 'react-router-dom'
import {AuthContext} from '../firebase/Auth'
import app from '../firebase/firebase';


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
    <button type='button' onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;