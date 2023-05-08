import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CardActions } from "@mui/material";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function MyWorkouts() {
    
  const {currentUser} = useContext(AuthContext);

  const [workoutDeleted, setWorkoutDeleted] = useState(false);

  const [workoutData, setWorkoutData] = useState('');
  const [userData, setUserData] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWorkouts() {
        try{
            const data = {workoutCreatorId: currentUser.uid}
            const response = await axios.post("http://localhost:4000/exercises/getall", data)
            setWorkoutData(response.data);
        } catch(e){
            setLoading(false);
            setError(true);
            console.log(e);
        }
    }
    fetchWorkouts()
  }, [currentUser.uid, workoutDeleted])

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

  async function deleteWorkout(workoutId){
    try{
        const data = {workoutCreatorId: currentUser.uid, workoutId: workoutId}
        await axios.post("http://localhost:4000/exercises/delete", data);
        setWorkoutDeleted(!workoutDeleted);
    } catch(e){
        console.log(e);
    }
  }

  function parseWorkoutData(workoutData) {
    const parsedData = {};
  
    for (const [key, value] of Object.entries(workoutData)) {
      try {
        parsedData[key] = JSON.parse(value);
      } catch (error) {
        parsedData[key] = value;
      }
    }
    return parsedData;
  }
  
  const parsedWorkoutData = parseWorkoutData(workoutData);

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
    return(
        <div>
            <h2 style={{ display: "flex", justifyContent: "center" }}>{userData.username}'s Workouts</h2>
            <div style={{ marginLeft: "25px", marginRight: "25px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px" }}>
            {Object.keys(parsedWorkoutData).map((key, index) => {
                const { exercises, title, id } = parsedWorkoutData[key];
                return (
                <Card key={index} style={{backgroundColor: "#faebd7"}} variant="outlined" sx={{ width: 300, height: 450 }}>
                    <CardContent>
                    <h2 style={{ textAlign: "center" }}>{title}</h2>
                    <h3>Exercises:</h3>
                    {exercises.slice(0, 3).map((exercise, index) => {
                    return (
                        <h3 key={index}>{exercise.name}</h3>
                    );
                    })}
                    </CardContent>
                    <div style={{ textAlign: "center" }}>
                        <Button size="small" variant="contained" id="blueButton">
                            <NavLink to={`/myworkouts/${id}`}>Learn More</NavLink>
                        </Button>
                        <Tooltip title="Delete">
                            <IconButton style={{ display: "inline-block" }} onClick={() => { deleteWorkout(id) }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Card>
                );
            })}
            </div>
        </div>
    );
  }   
}

export default MyWorkouts