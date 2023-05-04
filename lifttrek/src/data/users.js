//Functions to store some user info
const { ViewModuleSharp } = require("@mui/icons-material");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

//User information is converted to a string before being stored in redis & converted back into an object after being retrieved

async function createUser(id, username, email){
    let storedUser = {username: username, email: email}
    await client.hSet("LiftTrek Users", id, JSON.stringify(storedUser));
}

async function getUserInfoById(id){
    if(await client.hExists("LiftTrek Users", id)){
        let stringInfo = await client.hGet("LiftTrek Users", id)
        return JSON.parse(stringInfo)
    }
    else{
        throw "User not found";
    }
}

module.exports = {
    createUser,
    getUserInfoById
}