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
    await client.zAdd(`${userWhoPosted.id} Posts`, {score: Date.now(), value: postId});
    return newPost;
}

async function createImagePost(title, image, userWhoPosted){
    if(!title){
        throw "Error: title not provided"
    }
    if(!image){
        throw "Error: image not provided"
    }
    if(!userWhoPosted){
        throw "Error: user not provided"
    }
    let postId = uuid.v4();
    //let newPost = {id: postId, title: title, image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", userWhoPosted: userWhoPosted, likes:[], comments:[]}
    //TODO: Add way to store images via AWS S3
    //Images uploaded via current method only last for the current session
    let newPost = {id: postId, title: title, image: image, userWhoPosted: userWhoPosted, likes:[], comments:[]}
    let storedPost = JSON.stringify(newPost);
    await client.hSet("LiftTrek Posts", postId, storedPost)
    //Need some consistent way to organize posts
    //Figured it could be done through a sorted set based on time
    await client.zAdd("LiftTrek Post Feed", {score: Date.now(), value: postId});
    await client.zAdd(`${userWhoPosted.id} Posts`, {score: Date.now(), value: postId});
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
    console.log(posts)
    return posts;
}

async function getPostById(id){
    if(!id){
        throw "id not provided"
    }
    let stringPost = await client.hGet("LiftTrek", id)
    return JSON.parse(stringPost);
}

async function getPostsByUser(pagenum, id){ //Recycled GetPosts
    let numPerPage = 20;
    if(pagenum===null || pagenum===undefined){
        throw "Error: pagenum not provided"
    }
    if(typeof(pagenum)!=="number"){
        throw "Error: provided pagenum must be a number"
    }
    let postIDs = [];
    postIDs = await client.zRange(`${id} Posts`, (pagenum-1)*numPerPage, pagenum*numPerPage, {REV: true})
    console.log(postIDs)
    let posts = []

    for(i = 0; i<postIDs.length; i++){
        stringPost = await client.hGet("LiftTrek Posts", postIDs[i])
        posts.push(JSON.parse(stringPost));
    }
    console.log(posts)
    return posts;
}

module.exports = {
    createTextPost,
    createImagePost,
    getPosts,
    getPostById,
    getPostsByUser
}