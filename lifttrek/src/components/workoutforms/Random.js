import React from 'react'
import { FormControl, MenuItem, InputLabel, Select, Button } from '@mui/material'

function Random() {
  return (
    <div>
      <h3 style={{marginLeft: '10px'}}>Random</h3>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          // value={age}
          label="Type"
          // onChange={handleChange}
        >
          <MenuItem value='any'>Any</MenuItem>
          <MenuItem value='powerlifting'>Powerlifting</MenuItem>
          <MenuItem value='strength'>Strength</MenuItem>
          <MenuItem value='olyimpic_weightlifting'>Olyimpic Weightlifting</MenuItem>
          <MenuItem value='strongmna'>Strongman</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-label">Catagory</InputLabel>
        <Select
          // value={age}
          label="Catagory"
          // onChange={handleChange}
        >
          <MenuItem value='any'>Any</MenuItem>
          <MenuItem value='push'>Push</MenuItem>
          <MenuItem value='pull'>Pull</MenuItem>
          <MenuItem value='legs'>Legs</MenuItem>
          <MenuItem value='upper'>Upper</MenuItem>
          <MenuItem value='lower'>Lower</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          // value={age}
          label="Difficulty"
          // onChange={handleChange}
        >
          <MenuItem value='any'>Any</MenuItem>
          <MenuItem value='beginner'>Beginner</MenuItem>
          <MenuItem value='intermediate'>Intermediate</MenuItem>
          <MenuItem value='expert'>Expert</MenuItem>
        </Select>
      </FormControl>
      <br/>
      <Button style={{marginLeft: '10px'}} id='blueButton' variant='contained'>Randomize</Button>
    </div>
  )
}

export default Random
