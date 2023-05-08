import React, { useEffect, useState, useContext } from "react";
import { FormControl, MenuItem, InputLabel, Select, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

function Custom({ formData, handleExerciseTypeChange, handleMuscleChange, handleDifficultyChange, handleExerciseChange, handleRepsChange, handleSetsChange }) {
  const { exerciseType, muscle, difficulty, exercise, reps, sets } = formData;
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = {
          exerciseType: exerciseType,
          muscle: muscle,
          difficulty: difficulty
        };
        const response = await axios.post("http://localhost:4000/exercises", data);
        setExerciseData(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  
    fetchExercises();
  }, [exerciseType, muscle, difficulty]);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exerciseType-label">Exercise Type</InputLabel>
        <Select value={exerciseType} label="exerciseType" id="exerciseType-select" onChange={handleExerciseTypeChange}>
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="powerlifting">Powerlifting</MenuItem>
          <MenuItem value="strength">Strength</MenuItem>
          <MenuItem value="olympic_weightlifting">Olyimpic Weightlifting</MenuItem>
          <MenuItem value="strongman">Strongman</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="muscle-label">Muscle</InputLabel>
        <Select value={muscle} label="Muscle" id="muscle-select" onChange={handleMuscleChange}>
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="abdominals">Abdominals</MenuItem>
          <MenuItem value="abductors">Abductors</MenuItem>
          <MenuItem value="adductors">Adductors</MenuItem>
          <MenuItem value="biceps">Biceps</MenuItem>
          <MenuItem value="calves">Calves</MenuItem>
          <MenuItem value="chest">Chest</MenuItem>
          <MenuItem value="forearms">Forearms</MenuItem>
          <MenuItem value="glutes">Glutes</MenuItem>
          <MenuItem value="hamstrings">Hamstrings</MenuItem>
          <MenuItem value="lats">Lats</MenuItem>
          <MenuItem value="lower_back">Lower Back</MenuItem>
          <MenuItem value="middle_back">Middle Back</MenuItem>
          <MenuItem value="neck">Neck</MenuItem>
          <MenuItem value="quadriceps">Quadriceps</MenuItem>
          <MenuItem value="traps">Traps</MenuItem>
          <MenuItem value="triceps">Triceps</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select value={difficulty} label="Difficulty" id="difficulty-select" onChange={handleDifficultyChange}>
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="expert">Expert</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exercise-label">Exercise</InputLabel>
        <Select required value={exercise} label="Exercise" id="exercise-select" onChange={handleExerciseChange}>
          <MenuItem value="any">Any</MenuItem>
          {exerciseData.map((exercise, index) => {
            return(
              <MenuItem key={index} value={JSON.stringify(exercise)}>{exercise.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 75 }}>
        <TextField required
          value={reps}
          id="reps-label"
          label="Reps"
          inputProps={{ min: 1 }}
          type="number"
          onChange={handleRepsChange}
          />
      </FormControl>
      <FormControl sx={{ m: 1, width: 75 }}>
        <TextField required
          value={sets}
          id="sets-label"
          label="Sets"
          inputProps={{ min: 1 }}
          type="number"
          onChange={handleSetsChange}
          />
      </FormControl>
      <br />
    </div>
  );
}

function FormContainer() {

  const {currentUser} = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Successfully created workout!');

  const [formDataList, setFormDataList] = useState([{ exerciseType: "any", muscle: "any", difficulty: "any", exercise: "any", reps: "1", sets: "1" }]);

  const [title, setTitle] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleAddForm() {
    setFormDataList([...formDataList, { exerciseType: "any", muscle: "any", difficulty: "any", exercise: "any", reps: "1", sets: "1" }]);
  }

  function handleRemoveForm(index) {
    const newList = [...formDataList];
    newList.splice(index, 1);
    setFormDataList(newList);
  }

  function handleExerciseTypeChange(event, index) {
    const newList = [...formDataList];
    newList[index].exerciseType = event.target.value;
    setFormDataList(newList);
  }

  function handleMuscleChange(event, index) {
    const newList = [...formDataList];
    newList[index].muscle = event.target.value;
    setFormDataList(newList);
  }

  function handleDifficultyChange(event, index) {
    const newList = [...formDataList];
    newList[index].difficulty = event.target.value;
    setFormDataList(newList);
  }

  function handleExerciseChange(event, index) {
    const newList = [...formDataList];
    newList[index].exercise = event.target.value;
    setFormDataList(newList);
  }

  function handleRepsChange(event, index) {
    const newList = [...formDataList];
    newList[index].reps = event.target.value;
    setFormDataList(newList);
  }

  function handleSetsChange(event, index) {
    const newList = [...formDataList];
    newList[index].sets = event.target.value;
    setFormDataList(newList);
  }

  async function handleSubmit() {
    try{
      //add submitted reps to the array
      const submitInfo = formDataList.map((item) => {
        if (item.exercise === 'any') {
          throw new Error('Pick an exercise');
        }
        const exerciseObj = JSON.parse(item.exercise);
        return {
            ...exerciseObj,
            reps: item.reps,
            sets: item.sets,
          };
      });
      if (title === "") {
        throw new Error('Name workout');
      }
      //creating workout
      const postDetails = {
        workoutCreatorId: currentUser.uid,
        title: title,
        exercisesArray: submitInfo
      }
      await axios.post("http://localhost:4000/exercises/create", postDetails);
      setError(false);
      setSuccess(true);
    } catch(e){
      console.log(e)
      setError(true);
      setSuccess(false);
      setErrorMsg(e.message);
    }
  }
  
  return (
    <div>
      <h3>Custom</h3>
      <TextField style={{ marginBottom: "10px" }} id="outlined-basic" label="Workout Title" required variant="outlined" onChange={handleTitleChange}/>
      {formDataList.map((formData, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <Custom 
            formData={formData} 
            handleExerciseTypeChange={(event) => handleExerciseTypeChange(event, index)}
            handleMuscleChange={(event) => handleMuscleChange(event, index)}
            handleDifficultyChange={(event) => handleDifficultyChange(event, index)}
            handleExerciseChange={(event) => handleExerciseChange(event, index)}
            handleRepsChange={(event) => handleRepsChange(event, index)}
            handleSetsChange={(event) => handleSetsChange(event, index)}
          />
          <Tooltip title="Delete">
            <IconButton style={{ display: "inline-block" }} onClick={() => handleRemoveForm(index)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ))}
      <br />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddForm}
        id="blueButton3"
      >
        Add Exercise
      </Button>
      <Button style={{ marginLeft: "10px" }} id="submitButton" variant="contained" onClick={handleSubmit}>
        Submit Workout
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
        <h3>{errorMsg}</h3>
      </div>
      }
    </div>
  );
}

export default FormContainer;
