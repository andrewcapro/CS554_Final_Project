const axios = require('axios');
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
const data = require("../data");
const exerciseData = data.exercises;

router
    .route('/')
    .post(async (req, res) => {
        try{
            let exerciseInfo = req.body;
            let pagenum = exerciseInfo.pagenum;
            let exerciseType = exerciseInfo.exerciseType;
            let difficulty = exerciseInfo.difficulty;
            let muscle = exerciseInfo.muscle;
            console.log(req.body);
            let tenExercises = await exerciseData.getExercises(pagenum, exerciseType, muscle, difficulty);
            res.status(200).json(tenExercises);
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })

router
    .route('/auto')
    .post(async (req, res) => {
        try{
            let exerciseInfo = req.body;
            let exerciseType = exerciseInfo.exerciseType;
            let difficulty = exerciseInfo.difficulty;
            let muscle = exerciseInfo.musclesArray;
            console.log(req.body);
            let autoExercises = await exerciseData.getExercisesAuto(exerciseType, muscle, difficulty);
            res.status(200).json(autoExercises);
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })

router
    .route('/create')
    .post(async (req, res) => {
        try{
            let exerciseInfo = req.body;
            let workoutCreatorId = exerciseInfo.workoutCreatorId;
            let title = exerciseInfo.title;
            let exercisesArray = exerciseInfo.exercisesArray;
            console.log(req.body);
            let workout = await exerciseData.createWorkout(workoutCreatorId, title, exercisesArray);
            res.status(200).json(workout);
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })

router
    .route('/edit')
    .post(async (req, res) => {
        try{
            let exerciseInfo = req.body;
            let workoutCreatorId = exerciseInfo.workoutCreatorId;
            let workoutId = exerciseInfo.workoutId;
            let newWorkoutObject = exerciseInfo.newWorkoutObject;
            console.log(req.body);
            let editedWorkout = await exerciseData.editWorkout(workoutCreatorId, workoutId, newWorkoutObject);
            res.status(200).json(editedWorkout);
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })

module.exports = router;