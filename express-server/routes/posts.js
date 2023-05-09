const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const gm = require('gm');
const axios = require('axios');
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
    .route("/createWorkoutPost")
    .post(async (req, res) => {
        try{
            let title = req.body.title
            let workout_id = req.body.workout_id
            let userWhoPosted = req.body.userWhoPosted
            let createdPost = await postData.createWorkoutPost(title, workout_id, userWhoPosted);
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
    .route("/post/:id/:pagenum")
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
    .route('/image/:id')
    .get(async (req, res) => {
        try{
            let id = req.params.id
            let ext = req.params.ext
            let user = await postData.getPostById(id)
            //let {data} = await axios.get(`bc279858-3147-4a04-8ec2-a7f2885c5e10.png`)
            let {data} = await axios.get(`https://cs554-lifttrek.s3.amazonaws.com/${id}.${user.image}`)
            let im = data
        // let im = Buffer.from(data, 'binary').toString('base64')
        res.status(200).json({image: im});
        }
        catch(e){
            //console.log(e)
            res.status(400).json(e)
        }
    })

router
    .route("/like/:postId")
    .post(async (req, res) => {
        try{
            let post = await postData.likePost(req.params.postId, req.body.userWhoPosted.id)
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

router
    .route("/delete_comment/:postId")
    .post(async (req, res) => {
        try{
            let post = await postData.deleteComment(req.params.postId, req.body.commentId)
            res.status(200).json(post)
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    })
module.exports = router;