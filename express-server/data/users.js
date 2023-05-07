//Functions to store some user info
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

//User information is converted to a string before being stored in redis & converted back into an object after being retrieved

async function createUser(id, username, email){
    let storedUser = {id: id, username: username, email: email, description: "", image: ""}
    await client.hSet("LiftTrek Users", id, JSON.stringify(storedUser));
    let createdUser = await client.hGet("LiftTrek Users", id)
    return JSON.parse(createdUser)
}

async function addProfilePicture(id, image){
    let storedUser = await client.hGet('LiftTrek Users', id);
    let storedUserJ = JSON.parse(storedUser);
    storedUserJ.image = image;
    await client.hSet("LiftTrek Users", id, JSON.stringify(storedUserJ));
    let createdUser = await client.hGet("LiftTrek Users", id)
    return JSON.parse(createdUser)
}

async function editDescription(id, description){
    let storedUser = await client.hGet('LiftTrek Users', id);
    let storedUserJ = JSON.parse(storedUser);
    storedUserJ.description = description;
    await client.hSet("LiftTrek Users", id, JSON.stringify(storedUserJ));
    let createdUser = await client.hGet("LiftTrek Users", id)
    return JSON.parse(createdUser)
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
    getUserInfoById,
    addProfilePicture,
    editDescription
}