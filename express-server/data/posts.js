//all data functions related to individual workout posts, such as create workouts.
const uuid = require('uuid');
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

async function createTextPost(title, body, userWhoPosted){
    if(!title){
        throw "Error: title not provided"
    }
    if(!body){
        throw "Error: body not provided"
    }
    if(!userWhoPosted){
        throw "Error: user not provided"
    }
    let postId = uuid.v4();
    let newPost = {id: postId, title: title, body: body, userWhoPosted: userWhoPosted, likes:[], comments:[]}
    let storedPost = JSON.stringify(newPost);
    await client.hSet("LiftTrek Posts", postId, storedPost)
    //Need some consistent way to organize posts
    //Figured it could be done through a sorted set based on time
    await client.zAdd("LiftTrek Post Feed", {score: Date.now(), value: postId});
    return newPost;
}

//pagenum is an integer >=1
async function getPosts(pagenum){
    let numPerPage = 20;
    if(pagenum===null || pagenum===undefined){
        throw "Error: pagenum not provided"
    }
    if(typeof(pagenum)!=="number"){
        throw "Error: provided pagenum must be a number"
    }
    let postIDs = [];
    postIDs = await client.zRange("LiftTrek Post Feed", (pagenum-1)*numPerPage, pagenum*numPerPage, {REV: true})
    console.log(postIDs)
    let posts = []

    for(i = 0; i<postIDs.length; i++){
        stringPost = await client.hGet("LiftTrek Posts", postIDs[i])
        posts.push(JSON.parse(stringPost));
    }
    return posts;
}

async function getPostById(id){
    if(!id){
        throw "id not provided"
    }
    let stringPost = await client.hGet("LiftTrek", id)
    return JSON.parse(stringPost);
}

module.exports = {
    createTextPost,
    getPosts,
    getPostById
}