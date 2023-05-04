const axios = require('axios');
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
const data = require("../data");
const userData = data.users;

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
            res.status(500).json(e)
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

module.exports = router;