//data functions for exercises, such as get exercises
const uuid = require('uuid'); //for generating _id's
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
client.connect().then(() => {});
//api key is iGRxf9pYAh83bTP5KywCyA==Hb8XgNsIPGXjcPu8

/**
 * 
 * @param {Number} pageNum pageNum must be supplied as an integer, and starts from 0 (in otherwords, the first page is page 0).
 * @param {string} exerciseType exerciseType must be one of the possible catagories from exercises API. Cardio, stretching, and plyometrics not supported. Make sure it is lowercase.
 * @param {string} muscle Muscle must be one of the possible options from the exercises API. Make sure it is lowercase.
 * @param {difficulty} difficulty Difficulty must be possible options from the exercises API. Make sure it is lowercase.
 * @returns Array of exercise objects, iterable with for of or map. The returned object is stored in redis under PagenumExercisetypeMuscleDifficulty. The storage type is a hashset, where each odd number is the name of the exercise and each even number is the corresponding object as a string
 */
async function getExercises(pageNum, exerciseType = '', muscle = '', difficulty = ''){
    if (!pageNum && pageNum != 0) throw "Error: Page number must be provided for exercise retrieval.";
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
                await client.HSET(combinedName, exercise.name, JSON.stringify(exercise));
            }
            return data;
        } 
        else {
            console.log("Retrieving exercises from cache, from under: " + combinedName);
            let data = await client.HGETALL(combinedName);
            let answerArray = [];
            for (exercise in data){
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
 * @param {string} exerciseType exerciseType must be one of the possible catagories from exercises API. Cardio, stretching, and plyometrics not supported. Make sure it is lowercase.
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
            answerArray.push(currentPage[rand2]);
        } 
        else { //if random number does not exist, simply take last exercise of the current page
            answerArray.push(currentPage[currentPage.length-1])
        }
        //console.log("current array length:" + answerArray.length)
    }

    return answerArray;
}

async function createWorkout(){

}

//for testing

// async function main(){
//     try {
//         let exercises = await getExercisesAuto('strength', ['biceps'], 'beginner');
//         console.log(exercises);
//     } catch (e){
//         console.log(e);
//     }
// }

// main();

module.exports = {
    getExercises,
    createWorkout
}