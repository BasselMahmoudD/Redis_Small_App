const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const Redis = require('redis');
const PORT = process.env.PORT || 3005;
const redisClient = Redis.createClient();
const pubClient = Redis.createClient();
const subClient = Redis.createClient();
const ExpirationTime = 3600


Promise.all([
     redisClient.connect(),
    pubClient.connect(),
    subClient.connect()
]).catch(console.error);

// GET /photos - fetch all photos
app.get("/photos", async (req, res) => {
   try {
        const photos = await getOrSetCache("/photos"  ,async ()=>{
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos`);
        return data;
        })
        res.json(photos)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch photos", details: error.message });
    }
});

// GET /photos/:id - fetch photo by id
app.get("/photos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const photos = await getOrSetCache("/photos:${id}"  ,async ()=>{
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`);
        return data;
        })
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch photo", details: error.message });
    }
});

//publish message by Redis
try{
    setInterval(()=>
{
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
pubClient.publish("Chat" , "Hello Basel , Date :" + formattedDate)
},3000)
}catch(error) {console.log(error);}


//subscribe message by Redis

try{subClient.subscribe("Chat" , (message)=>{
    console.log("New message :" , message);
})}catch(error){
console.log(error);

}

//Cache Function to get and set

async function getOrSetCache(key, cb) {
    const cachedData = await redisClient.get(key);
    if (cachedData != null) {
        return JSON.parse(cachedData);
    }
    const freshData = await cb();
    await redisClient.setEx(key, ExpirationTime, JSON.stringify(freshData));
    return freshData;
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});