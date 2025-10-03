require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}  

const initDB = async () => {
    await Listing.deleteMany({});

    for(let obj of initData.data) {
        let response = await geocodingClient.forwardGeocode({
            query: obj.location,
            limit: 1
        }).send();

        obj.geometry = response.body.features[0].geometry;  // Set geometry field
        obj.owner = "68cc2f9f88dff4b40b4f2419";         
    }
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialize");
}

initDB();