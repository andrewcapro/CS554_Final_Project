//all data functions related to individual workout posts, such as create workouts.
const uuid = require('uuid');
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});
const workoutFunctions = require('./exercise')

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

async function createImagePost(title, imageExt, userWhoPosted){
    if(!title){
        throw "Error: title not provided"
    }
    if(!imageExt){
        throw "Error: image not provided"
    }
    if(!userWhoPosted){
        throw "Error: user not provided"
    }
    let postId = uuid.v4();
    //let newPost = {id: postId, title: title, image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", userWhoPosted: userWhoPosted, likes:[], comments:[]}
    //TODO: Add way to store images via AWS S3
    //Images uploaded via current method only last for the current session
    let newPost = {id: postId, title: title, userWhoPosted: userWhoPosted, image: imageExt, likes:[], comments:[]}
    let storedPost = JSON.stringify(newPost);
    await client.hSet("LiftTrek Posts", postId, storedPost)
    //Need some consistent way to organize posts
    //Figured it could be done through a sorted set based on time
    await client.zAdd("LiftTrek Post Feed", {score: Date.now(), value: postId});
    await client.zAdd(`${userWhoPosted.id} Posts`, {score: Date.now(), value: postId});
    return newPost;
}

async function createWorkoutPost(title, workout_id, userWhoPosted){
    if(!title){
        throw "Error: title not provided"
    }
    if(!workout_id){
        throw "Error: workout_id not provided"
    }
    if(!userWhoPosted){
        throw "Error: user not provided"
    }
    let postId = uuid.v4();
    let workout = ''
    try {
        workout = await workoutFunctions.getWorkout(userWhoPosted.id, workout_id)
    }
    catch (e) {
        throw "Error in create workout post data func - " + e;
    }
    let newPost = {id: postId, title: title, workout: workout, userWhoPosted: userWhoPosted, likes:[], comments:[]}
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
    let stringPost = await client.hGet("LiftTrek Posts", id)
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

async function likePost(postId, userId){
    if(!postId){
        throw "postId not provided"
    }
    if(!userId){
        throw "userId not provided"
    }
    try{
        let stringPost = await client.hGet("LiftTrek Posts", postId)
        post = JSON.parse(stringPost);
        if(!post.likes.includes(userId)){
            post.likes.push(userId);
        }
        else{
            let toRemove = post.likes.indexOf(userId);
            post.likes.splice(toRemove, 1)
        }
        let newStringPost = JSON.stringify(post);
        await client.hSet("LiftTrek Posts", postId, newStringPost)
        return post;
    }
    catch(e){
        throw "Error: could not like post"
    }
}

async function addComment(postId, userWhoPosted, body){
    if(!postId){
        throw "postId not provided"
    }
    if(!userWhoPosted.id){
        throw "userId not provided"
    }
    if(!body){
        throw "body not provided"
    }
    try{
        let stringPost = await client.hGet("LiftTrek Posts", postId)
        post = JSON.parse(stringPost);
        post.comments.unshift({id: uuid.v4(), userWhoPosted: userWhoPosted, body: body})
        let newStringPost = JSON.stringify(post);
        await client.hSet("LiftTrek Posts", postId, newStringPost)
        return post
    }
    catch(e){
        throw "Error: could not comment on post"
    }

}

async function deleteComment(postId, commentId) {
    if (!postId) {
        throw "postId not provided";
    }
    if (!commentId) {
        throw "commentId not provided";
    }
    try {
        let stringPost = await client.hGet("LiftTrek Posts", postId);
        curpost = JSON.parse(stringPost);
        let commentIndex = null;
        for (let i = 0; i < curpost.comments.length; i++) {
            if (curpost.comments[i].id == commentId) {
                commentIndex = i;
                break;
            }
        }
        if (commentIndex == null) {
            throw "Specified comment ID not in given post"
        } else {
            curpost.comments.splice(commentIndex, 1);
            let newStringPost = JSON.stringify(curpost);
            await client.hSet("LiftTrek Posts", postId, newStringPost);
            return curpost;
        }
    } catch (e) {
        throw "Error in deleteComment: " + e
    }
}

module.exports = {
    createTextPost,
    createImagePost,
    createWorkoutPost,
    getPosts,
    getPostById,
    getPostsByUser,
    likePost,
    addComment,
    deleteComment
}