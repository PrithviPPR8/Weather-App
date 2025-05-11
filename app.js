const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const https = require("https");
require('dotenv').config();

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
    // console.log(__dirname);
});

app.post("/", function(req, res){
    var cityName = req.body.city;
    // console.log(cityName);

    const api_key = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=metric`;
    
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            // console.log(weatherData);

            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const description = weatherData.weather[0].description;

            const icon = weatherData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            const day_night = icon.charAt(2);
            // console.log(day_night);

            res.write(`<p>The current weather is ${description}</p>`);
            res.write(`<h3>The temperature in ${city} is ${temp} degrees Celcius</h3>`);
            res.write(`<img src=${iconUrl}>`);

            if(day_night === "d") {
                res.write(`<p>It's currently Day time in ${city}</p>`);
            } else if(day_night === "n") {
                res.write(`<p>It's currently Night time in ${city}</p>`);
            }
            
            res.send(); 
        })
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});