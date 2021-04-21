const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const Psychiatrist = require("./models/psychiatrist");
const multer = require("multer");

const patientRoute = require('./router/patient')
const psychiatristRoute = require("./router/psychiatrist")

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());



const mongoDbUrl = process.env.MONGODBURL;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use((req,res,next)=>{
//     Psychiatrist.findById("60801b2d1b04440b2c8b8d0e").then(user=>{
//         req.user = user 
//         next();
//     })
// })

app.use("/patient",patientRoute)
app.use("/",psychiatristRoute)

const PORT = process.env.PORT;

mongoose.connect(mongoDbUrl).then(result=>{
    app.listen(PORT)
    console.log("App is running and connected to database!!")
}).catch(err=>{
    console.log(err)
})

