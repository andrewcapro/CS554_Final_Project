const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const gm = require('gm');

client.connect().then(() => {});
const data = require("../data");
const postData = data.posts;
const {uploadFile} = require("../s3")
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
            const {image} = req.files;
            if (!image.data) throw "Error: File not uploaded."
            console.log(image);
            // image.mv(name)
            let title = req.body.title
            // let image = req.body.image  
            // userWhoPosted: {id: currentUser.uid, username: data.username}
            let userWhoPosted = {id: req.body.currentUser, username: req.body.username}
            let createdPost = await postData.createImagePost(title, image.mimetype.split("/")[1], userWhoPosted);
            console.log(createdPost.id)
            //await uploadFile(createdPost.id, image);
            gm(image.data).resize(500, 500, "!").toBuffer(async function (err, buff){
                if (err) throw err
                if (!err) await uploadFile(createdPost.id+"."+image.mimetype.split("/")[1], buff);
                //await uploadFile(createdPost.id, image);
            })
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
            if(!post){
                throw "Error: Post not found"
            }
            res.status(200).json(post)
        }
        catch(e){
            console.log(e)
            res.status(404).json(e)
        }
    })

router
    .route("/like/:postId/:userId")
    .post(async (req, res) => {
        try{
            let post = await postData.likePost(req.params.postId, req.params.userId)
            res.status(200).json(post)
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)  
        }
    })

router
    .route("/comment/:postId")
    .post(async (req, res) => {
        try{
            let post = await postData.addComment(req.params.postId, req.body.userWhoPosted, req.body.body)
            res.status(200).json(post)
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })

module.exports = router;