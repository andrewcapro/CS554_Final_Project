import { Button } from '@mui/material'
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function DisplayWorkout() {

  const {currentUser} = useContext(AuthContext);
  const {id} = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [workoutData, setWorkoutData] = useState('');
  const [userData, setUserData] = useState('');

  useEffect(() => {
    async function fetchWorkout() {
        try{
            const data = {workoutCreatorId: currentUser.uid, workoutId: id}
            const response = await axios.post("http://localhost:4000/exercises/get", data)
            setWorkoutData(response.data);
        } catch(e){
          setLoading(false);
          setError(true);
          console.log(e);
        }
    }
    fetchWorkout();
  }, [currentUser.uid, id])

  useEffect(() => {
    async function fetchUser(){
      try{
        const data = currentUser.uid;
        const response = await axios.get(`http://localhost:4000/users/${data}`)
        setUserData(response.data);
        setLoading(false);
        setError(false);
      } catch(e){
        setLoading(false);
        setError(true);
        console.log(e);
      }
    }
    fetchUser();
  }, [currentUser.uid])

  if(loading){
    return (
      <div>Loading...</div>
    )
  } 
  else if(error){
    return (
      <div>Error</div>
    )
  }
  else{
    return (
      <div className='containerWorkout'>
        <div id='displayWorkout'>
          <div className='headerWorkout'>
            <h2>{workoutData.title}</h2>
            <h3>Created by: {userData.username}</h3>
            <h3>Exercises:</h3>
          </div>
          <ul>
          {workoutData.exercises.map((exercise) => {
            return (
                <li key={exercise.name}>
                  <h4>{exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}</h4>
                  <p>Type: {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}</p>
                  <p>Muscle: {exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}</p>
                  <p>Equipment: {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}</p>
                  <p>Difficulty: {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}</p>
                  <p>{exercise.sets} sets of {exercise.reps} reps</p>
                  <p>Instructions: {exercise.instructions}</p>
                </li>
              )
          })}
          </ul>
          <br/>
          <div className='headerWorkout'>
            <Button style={{
                fontSize: "18px"
            }}
            id='blueButton'
            variant='contained'>
              <NavLink to={`/editworkout/${id}`}>Edit Workout</NavLink>
            </Button>
            <Button style={{
                fontSize: "18px",
                marginLeft: "5px"
            }}
            id='blueButton2'
            variant='contained'>
              <NavLink to={`/editworkout/${id}`}>Post Workout</NavLink>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
    
export default DisplayWorkout