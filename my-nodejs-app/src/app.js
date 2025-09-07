const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const Redis = require('redis');
const PORT = process.env.PORT || 3005;
const redisClient = Redis.createClient();
const ExpirationTime = 3600
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
redisClient.connect().catch(console.error); 


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