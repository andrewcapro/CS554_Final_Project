import React, { useState, useContext } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";
const uuid = require("uuid")

function Random() {
  
  const {currentUser} = useContext(AuthContext);

  const push = ["chest", "triceps","traps","shoulders","chest"];
  const pull = ["lats", "middle_back", "biceps", "lower_back", "forearms"];
  const legs = ["quadriceps", "hamstrings", "glutes", "calves"];
  const upper = ["chest", "lats", "middle_back", "triceps", "biceps"];
  const lower = ["quadriceps", "hamstrings", "glutes", "abductors", "adductors"];

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Successfully created workout!');

  const [selectedOptions, setSelectedOptions] = useState({
    exerciseType: "strength",
    musclesArray: JSON.stringify(push),
    difficulty: "intermediate"
  });

  const handleChange = (event) => {
    let value = event.target.value;
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: value
    });
  };

  async function handleRandomize() {
    try {
      //getting workout & user info
      let axiosData = {
        ...selectedOptions,
        musclesArray: JSON.parse(selectedOptions.musclesArray)
      };
      const randId = uuid.v4();
      //generate random workout
      const workout = await axios.post("http://localhost:4000/exercises/auto", axiosData);
      //create workout
      const postDetails = {
        workoutCreatorId: currentUser.uid,
        title: `Random ${randId}`,
        exercisesArray: workout.data
      }
      await axios.post("http://localhost:4000/exercises/create", postDetails);
      setError(false);
      setSuccess(true);
    } catch(e){
      setError(true);
      setSuccess(false);
      console.log(e);
    }
  };


  return (
    <div>
      <h3 style={{ marginLeft: "10px" }}>Random</h3>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exerciseType-label">Exercise Type</InputLabel>
        <Select
          name="exerciseType"
          value={selectedOptions.exerciseType}
          label="exerciseType" id="exerciseType-select"
          onChange={handleChange}
        >
          <MenuItem value="powerlifting">Powerlifting</MenuItem>
          <MenuItem value="strength">Strength</MenuItem>
          <MenuItem value="olympic_weightlifting">Olympic Weightlifting</MenuItem>
          <MenuItem value="strongman">Strongman</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="musclesArray-label">Category</InputLabel>
        <Select
          name="musclesArray"
          value={selectedOptions.musclesArray}
          label="musclesArray" id="musclesArray"
          onChange={handleChange}
        >
          <MenuItem value={JSON.stringify(push)}>Push</MenuItem>
          <MenuItem value={JSON.stringify(pull)}>Pull</MenuItem>
          <MenuItem value={JSON.stringify(legs)}>Legs</MenuItem>
          <MenuItem value={JSON.stringify(upper)}>Upper</MenuItem>
          <MenuItem value={JSON.stringify(lower)}>Lower</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          name="difficulty"
          value={selectedOptions.difficulty}
          label="difficulty" id="difficulty"
          onChange={handleChange}
        >
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="expert">Expert</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <Button
        style={{ marginLeft: "10px" }}
        variant="contained"
        onClick={handleRandomize}
        id="blueButton3"
      >
        Randomize
      </Button>
      {success &&
      <div>
        <br/>
        <h3>{successMsg}</h3>
      </div>
      }
      {error &&
      <div>
        <br/>
        <h3>This combination does not work, try a different one</h3>
      </div>
      }
    </div>
  );
}

export default Random;
