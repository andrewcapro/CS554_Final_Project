const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
const data = require("../data");
const postData = data.posts;

router
    .route("/createTextPost")
    .post(async (req, res) => {
        try{
            let title = req.body.title
            let body = req.body.body  
            let userWhoPosted = req.body.userWhoPosted
            let createdPost = await postData.createTextPost(title, body, userWhoPosted);
            res.status(200).json(createdPost);
        }
        catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    })

    router
    .route("/createImagePost")
    .post(async (req, res) => {
        try{
            let title = req.body.title
            let image = req.body.image  
            let userWhoPosted = req.body.userWhoPosted
            let createdPost = await postData.createImagePost(title, image, userWhoPosted);
            res.status(200).json(createdPost);
        }
        catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    })

router
    .route("/page/:pagenum")
    .get(async (req, res) => {
        try{
            let pagenum = parseInt(req.params.pagenum)
            let posts; 
            posts = await postData.getPosts(pagenum);
            if(posts.length<1){
                throw "Error: no posts found"
            }
            res.status(200).json(posts)
        }
        catch(e){
            console.log(e)
            res.status(404).json(e)
        }
    })

router
    .route("/:id/:pagenum")
    .get(async (req, res) => {
        try{
            let pagenum = parseInt(req.params.pagenum)
            let id = req.params.id
            let posts; 
            posts = await postData.getPostsByUser(pagenum, id);
            if(posts.length<1){
                throw "Error: no posts found"
            }
            res.status(200).json(posts)
        }
        catch(e){
            console.log(e)
            res.status(404).json(e)
        }
    })

router    
    .route("/:id")
    .get(async (req, res) => {
        try{
            let post = await postData.getPostById(req.params.id)
            res.status(200).json(post)
        }
        catch(e){
            console.log(e)
            res.status(404).json(e)
        }
    })

module.exports = router;