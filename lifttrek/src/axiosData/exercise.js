const axios = require("axios");

async function getExercises(pagenum, exerciseType, muscle, difficulty){
    try{
        const {data} = await axios.post("http://localhost:4000/exercises/", {
            data: {
            pagenum: pagenum, 
            exerciseType: exerciseType,
            difficulty: difficulty,
            muscle: muscle
            }
        })
        return data;
    } catch (e){
        if (e.response.data) throw e.response.data;
        throw e;
    }
}

async function getExercisesAuto(exerciseType, muscle, difficulty){
    try{
        const {data} = await axios.post("http://localhost:4000/exercises/auto", {
            data : {
            exerciseType: exerciseType,
            difficulty: difficulty,
            muscle: muscle
            }
        })
        return data;
    } catch (e){
        if (e.response.data) throw e.response.data;
        throw e;
    }
}

async function createWorkout(workoutCreatorId, title, exercisesArray){
    try{
        const {data} = await axios.post("http://localhost:4000/exercises/create", {
            
            workoutCreatorId: workoutCreatorId,
            title: title,
            exercisesArray: exercisesArray
            
        })
        return data;
    } catch (e){
        if (e.response.data) throw e.response.data;
        throw e;
    }
}

async function editWorkout(workoutCreatorId, workoutId, newWorkoutObject){
    try{
        const {data} = await axios.post("http://localhost:4000/exercises/edit", {
            workoutCreatorId: workoutCreatorId,
            workoutId: workoutId,
            newWorkoutObject: newWorkoutObject
        })
        return data;
    } catch (e){
        if (e.response.data) throw e.response.data;
        throw e;
    }
}

// async function main(){
//     try {
//         let exercises = await getExercisesAuto('strength', ['biceps'], 'beginner');
//         let exercises2 = await getExercises(1, 'strength', 'biceps', 'beginner')
//         let exercise3 = await createWorkout("1235452435", "Sweet Workout", exercises);
//         console.log(exercises2);
//     } catch (e){
//         console.log(e);
//     }
// }

// main();

module.exports = {
    getExercises,
    getExercisesAuto,
    createWorkout,
    editWorkout
}