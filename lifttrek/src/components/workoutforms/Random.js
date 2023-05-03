import React, { useState } from 'react';
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button
} from '@mui/material';

function Random() {
  const [selectedOptions, setSelectedOptions] = useState({
    exerciseType: 'any',
    category: 'any',
    difficulty: 'any'
  });

  const handleChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: event.target.value
    });
  };

  const handleRandomize = () => {
    console.log(selectedOptions); // or do whatever you need to do with the selected options
  };

  return (
    <div>
      <h3 style={{ marginLeft: '10px' }}>Random</h3>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="exerciseType-label">Exercise Type</InputLabel>
        <Select
          name="exerciseType"
          value={selectedOptions.exerciseType}
          label="exerciseType" id="exerciseType-select"
          onChange={handleChange}
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="powerlifting">Powerlifting</MenuItem>
          <MenuItem value="strength">Strength</MenuItem>
          <MenuItem value="olympic_weightlifting">Olympic Weightlifting</MenuItem>
          <MenuItem value="strongman">Strongman</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          name="category"
          value={selectedOptions.category}
          label="category" id="catagory"
          onChange={handleChange}
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="push">Push</MenuItem>
          <MenuItem value="pull">Pull</MenuItem>
          <MenuItem value="legs">Legs</MenuItem>
          <MenuItem value="upper">Upper</MenuItem>
          <MenuItem value="lower">Lower</MenuItem>
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
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="expert">Expert</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <Button
        style={{ marginLeft: '10px' }}
        variant="contained"
        onClick={handleRandomize}
        id="blueButton3"
      >
        Randomize
      </Button>
    </div>
  );
}

export default Random;
