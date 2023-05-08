const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const gm = require('gm');
const fs = require('fs');
const imageMagick = gm.subClass({ imageMagick: true });

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

        const {image} = req.files;
        
        // imageMagick()
        console.log(image);
        const name = __dirname + '\\uploads\\'+image.name
        
        // const edited = __dirname + '/uploads/edited'+image.name
        image.mv(name)
        imageMagick(name).size(function (err, size){
            if (!err){
            console.log(size);
            }
            else {
                console.log(err);
            }
        })
        // gm(name).resize(300, 300, "!").write(__dirname+"/uploads/", function (err){
        //     if (!err) console.log("done")
        // })
        // //const buf = fs.readFileSync(__dirname + '\\uploads\\'+image.name)
        // fs.rename(name, edited, function(){
        //     gm(edited).resize(50, 50).write(edited, function(){
        //         console.log("idk")
        //     });
        // })
        //gm(buf).resize(400, 400)
        //image.mv(__dirname + '/uploads/'+image.name);
        // gm(__dirname + '/uploads/'+image.name).resize(400, 400)
        try{
            let title = req.body.title
            // let image = req.body.image  
            // userWhoPosted: {id: currentUser.uid, username: data.username}
            let userWhoPosted = {id: req.body.currentUser, username: req.body.username}
            let createdPost = await postData.createImagePost(title, userWhoPosted);
            console.log(createdPost.id)
            //await uploadFile(createdPost.id, image);
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