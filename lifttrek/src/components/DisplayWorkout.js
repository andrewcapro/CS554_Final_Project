import { Button } from '@mui/material'
import React from 'react'

function DisplayWorkout() {

  const test = 
  {
    title:"Totally cool workout",
    userwhopostedit: "q5nhygq4onhroitnhoirn",
    exercises: [
      {
        name: 'Cross-body hammer curl',
        type: 'strength',
        muscle: 'biceps',
        equipment: 'dumbbell',
        difficulty: 'beginner',
        reps: "12",
        sets: "3",
        instructions: 'Stand up straight with a dumbbell in each hand. Your hands should be down at your side with your palms facing in. While keeping your palms facing in and without twisting your arm, curl the dumbbell of the right arm up towards your left shoulder as you exhale. Touch the top of the dumbbell to your shoulder and hold the contraction for a second. Slowly lower the dumbbell along the same path as you inhale and then repeat the same movement for the left arm. Continue alternating in this fashion until the recommended amount of repetitions is performed for each arm.  Variations: You can also perform this exercise in between two pulleys using the end of a rope attachment on each arm.'
      },
      {
        name: 'Cross-body hammer curl',
        type: 'strength',
        muscle: 'biceps',
        equipment: 'dumbbell',
        difficulty: 'beginner',
        reps: "12",
        sets: "3",
        instructions: 'Stand up straight with a dumbbell in each hand. Your hands should be down at your side with your palms facing in. While keeping your palms facing in and without twisting your arm, curl the dumbbell of the right arm up towards your left shoulder as you exhale. Touch the top of the dumbbell to your shoulder and hold the contraction for a second. Slowly lower the dumbbell along the same path as you inhale and then repeat the same movement for the left arm. Continue alternating in this fashion until the recommended amount of repetitions is performed for each arm.  Variations: You can also perform this exercise in between two pulleys using the end of a rope attachment on each arm.'
      }
    ]
  } 

  return (
    <div className='containerWorkout'>
      <div id='displayWorkout'>
        <div class='headerWorkout'>
          <h3>{test.title}</h3>
          <h4>Created by: {test.userwhopostedit}</h4>
          <h4>Exercises:</h4>
        </div>
        <ul>
        {test.exercises.map((exercise) => {
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
        <div class='headerWorkout'>
          <Button style={{
              fontSize: "18px"
          }}
          id='blueButton'
          variant='contained'>Edit Workout</Button>
          <Button style={{
              fontSize: "18px",
              marginLeft: "5px"
          }}
          id='blueButton2'
          variant='contained'>Post Workout</Button>
        </div>
      </div>
    </div>
  )
}
    

export default DisplayWorkout
