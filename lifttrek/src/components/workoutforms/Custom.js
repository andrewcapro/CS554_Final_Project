import React, { useState } from 'react';
import { FormControl, MenuItem, InputLabel, Select, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function Custom({ formData, handleExerciseTypeChange, handleMuscleChange, handleDifficultyChange, handleExerciseChange }) {
  const { exerciseType, muscle, difficulty, exercise } = formData;

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exerciseType-label">Exercise Type</InputLabel>
        <Select value={exerciseType} label="exerciseType" id="exerciseType-select" onChange={handleExerciseTypeChange}>
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="powerlifting">Powerlifting</MenuItem>
          <MenuItem value="strength">Strength</MenuItem>
          <MenuItem value="olyimpic_weightlifting">Olyimpic Weightlifting</MenuItem>
          <MenuItem value="strongmna">Strongman</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="muscle-label">Muscle</InputLabel>
        <Select value={muscle} label="Muscle" id="muscle-select" onChange={handleMuscleChange}>
          <MenuItem value='any'>Any</MenuItem>
          <MenuItem value='abdominals'>Abdominals</MenuItem>
          <MenuItem value='abductors'>Abductors</MenuItem>
          <MenuItem value='adductors'>Adductors</MenuItem>
          <MenuItem value='biceps'>Biceps</MenuItem>
          <MenuItem value='calves'>Calves</MenuItem>
          <MenuItem value='chest'>Chest</MenuItem>
          <MenuItem value='forearms'>Forearms</MenuItem>
          <MenuItem value='glutes'>Glutes</MenuItem>
          <MenuItem value='hamstrings'>Hamstrings</MenuItem>
          <MenuItem value='lats'>Lats</MenuItem>
          <MenuItem value='lower_back'>Lower Back</MenuItem>
          <MenuItem value='middle_back'>Middle Back</MenuItem>
          <MenuItem value='neck'>Neck</MenuItem>
          <MenuItem value='quadriceps'>Quadriceps</MenuItem>
          <MenuItem value='traps'>Traps</MenuItem>
          <MenuItem value='triceps'>Triceps</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id='difficulty-label'>Difficulty</InputLabel>
        <Select value={difficulty} label="Difficulty" id='difficulty-select' onChange={handleDifficultyChange}>
          <MenuItem value='any'>Any</MenuItem>
          <MenuItem value='beginner'>Beginner</MenuItem>
          <MenuItem value='intermediate'>Intermediate</MenuItem>
          <MenuItem value='expert'>Expert</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exercise-label">Exercise</InputLabel>
        <Select value={exercise} label="Exercise" id="exercise-select" onChange={handleExerciseChange}>
          <MenuItem value="any">Any</MenuItem>
        </Select>
      </FormControl>
      <br />
    </div>
  );
}

function FormContainer() {
  const [formDataList, setFormDataList] = useState([{ exerciseType: 'any', muscle: 'any', difficulty: 'any', exercise: 'any' }]);

  function handleAddForm() {
    setFormDataList([...formDataList, { exerciseType: 'any', muscle: 'any', difficulty: 'any', exercise: 'any' }]);
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

  function handleSubmit() {
    const selectedExercises = formDataList.map((formData) => formData.exercise);
    console.log(selectedExercises);
  }
  

  return (
    <div>
      <h3 style={{ marginLeft: '10px' }}>Custom</h3>
      {formDataList.map((formData, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Custom 
            formData={formData} 
            handleExerciseTypeChange={(event) => handleExerciseTypeChange(event, index)}
            handleMuscleChange={(event) => handleMuscleChange(event, index)}
            handleDifficultyChange={(event) => handleDifficultyChange(event, index)}
            handleExerciseChange={(event) => handleExerciseChange(event, index)}
          />
          <Tooltip title="Delete">
            <IconButton style={{ display: 'inline-block' }} onClick={() => handleRemoveForm(index)}>
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
        style={{ marginLeft: '10px' }}
        onClick={handleAddForm}
        id="blueButton3"
      >
        Add Exercise
      </Button>
      <Button style={{ marginLeft: '10px' }} id="submitButton" variant="contained" onClick={handleSubmit}>
        Submit Workout
      </Button>
    </div>
  );
}


export default FormContainer;
