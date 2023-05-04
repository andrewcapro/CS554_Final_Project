//all data functions related to individual workout posts, such as create workouts.
const uuid = require('uuid');
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

async function createTextPost(title, body, userId){
    if(!title){
        throw "title not provided"
    }
    if(!body){
        throw "body not provided"
    }
    if(!userId){
        throw "userId not provided"
    }
    
}