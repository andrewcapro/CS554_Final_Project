import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../firebase/Auth";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, FormControl, TextField } from '@mui/material';

function EditWorkout() {

    const {currentUser} = useContext(AuthContext);
    const {id} = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [workoutData, setWorkoutData] = useState('');

    useEffect(() => {
        async function fetchWorkout() {
            try{
                const data = {workoutCreatorId: currentUser.uid, workoutId: id}
                const response = await axios.post("http://localhost:4000/exercises/get", data)
                setWorkoutData(response.data);
                setLoading(false);
                setError(false);
            } catch(e){
              setLoading(false);
              setError(true);
              console.log(e);
            }
        }
        fetchWorkout();
      }, [currentUser.uid, id])

      const handleRepsChange = (exerciseName, event) => {
        setWorkoutData(prevState => {
            const updatedExercises = prevState.exercises.map(exercise => {
                if (exercise.name === exerciseName) {
                    return {
                        ...exercise,
                        reps: event.target.value
                    };
                } else {
                    return exercise;
                }
            });
    
            return {
                ...prevState,
                exercises: updatedExercises
            };
        });
    };
    
    const handleSetsChange = (exerciseName, event) => {
        setWorkoutData(prevState => {
            const updatedExercises = prevState.exercises.map(exercise => {
                if (exercise.name === exerciseName) {
                    return {
                        ...exercise,
                        sets: event.target.value
                    };
                } else {
                    return exercise;
                }
            });
            return {
                ...prevState,
                exercises: updatedExercises
            };
        });
    };    

    async function handleSubmit(){
        try{
            const data = 
            {
                workoutCreatorId: currentUser.uid,
                workoutId: workoutData.id,
                newWorkoutObject: workoutData
            }
            await axios.post("http://localhost:4000/exercises/edit", data);
            setSuccess(true);
        } catch(e){
            console.log(e)
            setSuccess(false);
        }
    }

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
            <div className="containerWorkout">
              <div id="displayWorkout">
                <div className="headerWorkout">
                  <h2>Editing: {workoutData.title}</h2>
                </div>
                <ul>
                  {workoutData.exercises.map((exercise) => {
                    return (
                      <li key={exercise.name}>
                        <h4>
                          {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
                        </h4>
                        <FormControl sx={{ m: 1, width: 75 }}>
                          <TextField
                            required
                            id={`reps-label-${exercise.name}`}
                            label="Reps"
                            inputProps={{ min: 1 }}
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => handleRepsChange(exercise.name, e)}
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 75 }}>
                          <TextField
                            required
                            id={`sets-label-${exercise.name}`}
                            label="Sets"
                            inputProps={{ min: 1 }}
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleSetsChange(exercise.name, e)}
                          />
                        </FormControl>
                      </li>
                    );
                  })}
                </ul>

                <div style={{ textAlign: "center" }}>
                    {success &&
                    <div>
                        <br/>
                        <h3>Edit Success!</h3>
                    </div>
                    }
                    <Button variant="contained" id="blueButton" onClick={() => {handleSubmit()}}>Submit</Button>
                </div>
              </div>

            </div>
          );
        };
}

export default EditWorkout
