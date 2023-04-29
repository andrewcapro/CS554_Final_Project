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
    if (!pageNum && pageNum != 0) throw "Error: Page number must be provided for exercise retrevial.";
    if (pageNum < 0) throw "Error: Page number for exercise retrevial cannot be less than 0.";
    if (exerciseType === "cardio") throw "Error: Cardio workouts currently not supported."
    if (exerciseType === "plyometrics") throw "Error: Plyometric workouts currently not supported.";
    if (exerciseType === "stretching") throw "Error: Stretching workouts currently not supported.";

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

//for testing

async function main(){
    try {
        let exercises = await getExercises(0, 'strength', 'biceps', 'beginner');
        console.log(exercises);
    } catch (e){
        console.log(e);
    }
}

main();

module.exports = {
    getExercises
}