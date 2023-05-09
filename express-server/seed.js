const uuid = require('uuid'); //for generating _id's
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
const data = require("./data");
const { createUser } = require('./data/users');
const { createWorkout } = require('./data/exercise');
const userData = data.users;
const postData = data.posts;
const exerciseData = data.exercises
client.connect().then(() => {});

//Assuming login under testuser@gmail.com, with password testing123; UID: gegaVVzZ0aYVGshYv12kxC7UKYB3 (Supplied by firebase)
const testId = 'gegaVVzZ0aYVGshYv12kxC7UKYB3'
const testUser = 'tester1';
const testEmail = 'testuser@gmail.com';

async function main(){
    try {
        await userData.createUser(testId, 'tester1', 'testuser@gmail.com');
        let ex1 = await exerciseData.getExercisesAuto('strength', ['biceps'], 'beginner');
        let wo1 = await exerciseData.createWorkout(testId, "Greatest workout", ex1);
        await postData.createWorkoutPost('My new workout!', wo1.id, {id: testId, username:testUser});
        let po1 = await postData.createTextPost("Random post!!!", "I was just feeling kinda bored so instead of studying for my final, I made this post! My smartest decision? Probably not", {id: testId, username:testUser})
        //Image files cannot be seeded because of binary data transfer. Sorry!
        await postData.addComment(po1.id, {id: testId, username:testUser}, 'youre so dumb lol');
        await postData.likePost(po1.id, testId);
        console.log("you can close me now.");
        return 0;
    } catch (e) {
        console.log(e);
    }
}

main();