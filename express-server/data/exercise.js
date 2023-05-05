//data functions for exercises, such as get exercises
const uuid = require('uuid'); //for generating _id's
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
const helpers = require("../helpers")
client.connect().then(() => {});
//api key is iGRxf9pYAh83bTP5KywCyA==Hb8XgNsIPGXjcPu8

/**
 * 
 * @param {Number} pageNum pageNum must be supplied as an integer, and starts from 0 (in otherwords, the first page is page 0).
 * @param {string} exerciseType exerciseType must be one of the possible catagories from exercises API. Cardio, stretching, and plyometrics not supported. Determines default sets and reps. Make sure it is lowercase.
 * @param {string} muscle Muscle must be one of the possible options from the exercises API. Make sure it is lowercase.
 * @param {difficulty} difficulty Difficulty must be possible options from the exercises API. Make sure it is lowercase.
 * @returns Array of exercise objects, iterable with for of or map. The returned object is stored in redis under PagenumExercisetypeMuscleDifficulty. The storage type is a hashset, where each odd number is the name of the exercise and each even number is the corresponding object as a string
 */
async function getExercises(pageNum=0, exerciseType = '', muscle = '', difficulty = ''){
    if (pageNum < 0) throw "Error: Page number for exercise retrevial cannot be less than 0 for retrieval.";
    if (exerciseType === "cardio") throw "Error: Cardio workouts currently not supported for retrieval."
    if (exerciseType === "plyometrics") throw "Error: Plyometric workouts currently not supported for retrieval.";
    if (exerciseType === "stretching") throw "Error: Stretching workouts currently not supported for retrieval.";

    let options = {
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/exercises?offset=${pageNum}&type=${exerciseType}&muscle=${muscle}&difficulty=${difficulty}`,
        headers: { 
            'X-Api-Key': 'iGRxf9pYAh83bTP5KywCyA==Hb8XgNsIPGXjcPu8'
        }
    };

    let sets;
    let reps;

    if (exerciseType === "olympic_weightlifting"){
        sets = "5"
        reps = "3"
    }
    else if (exerciseType === "power"){
        sets = "5"
        reps = "5"
    }
    else if (exerciseType === "strength"){
        sets = "3"
        reps = "10"
    }
    else if (exerciseType === "strongman"){
        sets = "3";
        reps = "3";
    }
    else {
        sets = "5";
        reps = "5";
    }

    let combinedName = pageNum.toString() + exerciseType + muscle + difficulty;
    //console.log(combinedName);

    try {
        let inCache = await client.EXISTS(combinedName);
        if (!inCache){
            let {data} = await axios.request(options);
            console.log("Storing exercises in cache as: " + combinedName);
            if (data.length === 0){
                //console.log("hi")
                throw "Error: No exercise of those specifications exist, or they do not exist on this page.";
            }
            for (const exercise of data){
                exercise.sets = sets;
                exercise.reps = reps;
                await client.HSET(combinedName, exercise.name, JSON.stringify(exercise));
            }
            return data;
        } 
        else {
            console.log("Retrieving exercises from cache, from under: " + combinedName);
            let data = await client.HGETALL(combinedName);
            let answerArray = [];
            for (let exercise in data){
                //console.log(data[exercise])
                answerArray.push(JSON.parse(data[exercise]));
            }
            return answerArray;
        }
    } catch (e){
        if (e.response){
            throw `Internal Server Error: ${e.response.data.error}`;
        } else {
            throw e;
        }
    }
}

/**
 * 
 * @param {string} exerciseType exerciseType must be one of the possible catagories from exercises API. Cardio, stretching, and plyometrics not supported. Determines default sets and reps. Make sure it is lowercase.
 * @param {Array<string>} musclesArray Array of muscles for one random workout to be selected for each.
 * @param {string} difficulty Difficulty must be possible options from the exercises API. Make sure it is lowercase.
 * @return Array of exercise objects, with one random exercise for each given muscle in the musclesArray, following the other filters.
 */
async function getExercisesAuto(exerciseType='', musclesArray, difficulty=''){ //use getExercises for a specified number of exercises; Then from that returned array, pick a random number from 1-10, and push array[randNum] to answerArray. return array at the end. do not store result in redis, it is random.
    if (!musclesArray) throw "Error: Array of muscles to target must be given for auto-generation.";
    if (exerciseType === "cardio") throw "Error: Cardio workouts currently not supported for auto-generation."
    if (exerciseType === "plyometrics") throw "Error: Plyometric workouts currently not supported for auto-generation.";
    if (exerciseType === "stretching") throw "Error: Stretching workouts currently not supported for auto-generation.";
    if (!Array.isArray(musclesArray)) throw "Error: musclesArray must be an array for auto-generation.";

    let sets;
    let reps;

    if (exerciseType === "olympic_weightlifting"){
        sets = "5"
        reps = "3"
    }
    else if (exerciseType === "power"){
        sets = "5"
        reps = "5"
    }
    else if (exerciseType === "strength"){
        sets = "3"
        reps = "10"
    }
    else if (exerciseType === "strongman"){
        sets = "3";
        reps = "3";
    } 
    else {
        sets = "5";
        reps = "5";
    }


    let rand1;
    let rand2;
    let pageNumMax = 100;
    let currentPage;
    let answerArray= [];
    for (let i = 0; i < musclesArray.length; i++){
        rand1 = Math.floor(Math.random() * pageNumMax); //random page from first 100 pages
        rand2 = Math.floor(Math.random() * 10);

        try {
            currentPage = await getExercises(rand1, exerciseType, musclesArray[i], difficulty);
        } catch (e) {
            if (e === "Error: No exercise of those specifications exist, or they do not exist on this page."){
                if (rand1 === 0) throw "Error: No exercise of those specifications exist."; //Basically means there are no workouts
                //console.log("actually working")
                pageNumMax = rand1 - 1; //reduce possible range
                i -= 1; 
                continue; //effectively reset current iteration
            }
            else {
                throw e;
            }
        }

        //console.log(currentPage[rand2]);

        if (currentPage[rand2]){
            currentPage[rand2].sets = sets;
            currentPage[rand2].reps = reps;
            answerArray.push(currentPage[rand2]);
        } 
        else { //if random number does not exist, simply take last exercise of the current page
            currentPage[currentPage.length-1].sets = sets;
            currentPage[currentPage.length-1].reps = reps;
            answerArray.push(currentPage[currentPage.length-1])
        }
        //console.log("current array length:" + answerArray.length)
    }

    return answerArray;
}

/**
 * 
 * @param {id} workoutCreatorId Id of user who created workout
 * @param {String} title Title of the workout
 * @param {Array<Object>} exercisesArray Array of exercise objects, containing exercise name, difficulty, type, reps, sets, instructions, and equipment.
 * THIS FUNCTION NEEDS TO HAVE A GETUSER IMPLEMENTED TO MAKE WORKOUTCREATOR BE THE NAME OF THE USER, NOT THEIR ID
 * @returns Workout object including id, title, workoutcreator's id, and an exercisesArray composed of exercise objects
 */ 
async function createWorkout(workoutCreatorId, title, exercisesArray){ //store workout under hashset named by userIdworkouts, with odds as title and evens as workout object as a string
    if (!workoutCreatorId) throw "Error: User ID must be provided for workout creation.";
    if (!title) throw "Error: Title must be provided for workout creation.";
    if (helpers.containsSpec(title)) throw "Error: Title cannot contain special characters.";
    if (!helpers.containsAlpha(title)) throw "Error: Title must contain alphabetical characters.";
    if (!exercisesArray) throw "Error: Exercises must be provided for workout creation.";
    if (!Array.isArray(exercisesArray)) throw "Error: Exercises must be in an array for workout creation."

    // GET USERNAME FUNCTION HERE PROBABLY
    let workout = {
        id: uuid.v4(),
        workoutCreator: workoutCreatorId, //THIS PART NEEDS TO BE MODIFIED ONCE WE HAVE USERS FIGURED OUT
        title: title,
        exercises: exercisesArray
    }

    let hashName = workoutCreatorId + "workouts";

    try {
        let workoutS = JSON.stringify(workout);
        console.log(`Storing workout in cache under user ${workoutCreatorId} with title value ${title}`)
        await client.HSET(hashName, workout.id, workoutS)
    } catch (e) {
        throw e;
    }

    return workout; //Currently untested and no documentation
}

/**
 * 
 * @param {ID} workoutCreatorId User ID of who created the workout
 * @param {ID} workoutId ID of workout
 * @returns 
 */
async function getWorkout(workoutCreatorId, workoutId){
    if (!workoutCreatorId) throw "Error: Workout creator ID must be provided for workout retrieval.";
    if (!workoutId) throw "Error: Workout ID must be provided for workout retrieval.";

    try {
        let workout = await client.HGET(`${workoutCreatorId}workouts`, workoutId);
        if (workout === NULL) throw "Error: Attempt to workout that does not belong to current user.";
        return(JSON.parse(workout)); //Must parse because it is a string
    } catch (e) {
        throw e;
    }
}

async function editWorkout(workoutCreatorId, workoutId, newWorkoutObject){
    if (!workoutCreatorId) throw "Error: Workout creator ID must be provided for workout editing.";
    if (!workoutId) throw "Error: Workout ID must be provided for workout editing.";
    if (!newWorkoutObject) throw "Error: Workout object must be provided for workout editing.";
    
    let oldWorkout = await getWorkout(workoutCreatorId, workoutId); //gets workout object

    if (newWorkoutObject.title){
        oldWorkout.title = newWorkoutObject.title;
    }
    if (newWorkoutObject.exercisesArray){
        oldWorkout.exercisesArray = newWorkoutObject.exercisesArray;
    }

    try {
        await client.HSET(`${workoutCreatorId}workouts`, workoutId, JSON.stringify(oldWorkout));
    } catch (e) {
        throw e;
    }

    return oldWorkout;
}

//for testing

// async function main(){
//     try {
//         let exercises = await getExercisesAuto('strength', ['biceps'], 'beginner');
//         let exercises2 = await getExercises(0, 'strength', 'biceps', 'beginner')
//         console.log(exercises);
//     } catch (e){
//         console.log(e);
//     }
// }

// main();

module.exports = {
    getExercises,
    createWorkout,
    getExercisesAuto,
    getWorkout,
    editWorkout
}