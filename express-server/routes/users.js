const axios = require('axios');
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
const data = require("../data");
const userData = data.users;
const {uploadFile} = require("../s3")
const gm = require('gm');

router
    .route('/')
    .post(async (req, res) => {
        try{
            userInfo = req.body;
            id = userInfo.id
            username = userInfo.username
            email = userInfo.email
            console.log(req.body);
            createdUser = await userData.createUser(id, username, email);
            res.status(200).json(createdUser);
        }
        catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    })

router
    .route('/:id')
    .get(async (req, res) => {
        try{
            user = await userData.getUserInfoById(req.params.id);
            res.status(200).json(user);
        }
        catch(e){
            console.log(e)
            res.status(404).json(e)
        }
    })

router
    .route('/:id/image')
    .post(async (req, res) => {


        try{
            const {image} = req.files;
            userInfo = req.body;
            id = req.params.id
            
            createdUser = await userData.addProfilePicture(id, image.mimetype.split("/")[1]);
            gm(image.data).resize(300, 300, "!").toBuffer(async function (err, buff){
                if (err) throw err
                if (!err) await uploadFile(createdUser.id+"."+image.mimetype.split("/")[1], buff);
                //await uploadFile(createdPost.id, image);
            })
            console.log(createdUser);
            res.status(200).json(createdUser);
        }
        catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    })

router
    .route('/:id/image')
    .get(async (req, res) => {


        try{
            let id = req.params.id
            let ext = req.params.ext
            let user = await userData.getUserInfoById(id)
            console.log(user);
            //let {data} = await axios.get(`bc279858-3147-4a04-8ec2-a7f2885c5e10.png`)
            let {data} = await axios.get(`https://cs554-lifttrek.s3.amazonaws.com/${id}.${user.image}`)
            let im = data;
        // let im = Buffer.from(data, 'binary').toString('base64')
        res.status(200).json({image: im});
        }
        catch(e){
            //console.log(e)
            res.status(400).json(e)
        }
    })

router
    .route('/:id/description')
    .post(async (req, res) => {
        try{
            userInfo = req.body;
            id = req.params.id
            description = userInfo.description
            createdUser = await userData.editDescription(id, description);
            res.status(200).json(createdUser);
        }
        catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    })

module.exports = router;