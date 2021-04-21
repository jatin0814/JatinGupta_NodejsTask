const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');
const Psychiatrist = require("./models/psychiatrist");
const upload = require("./middleware/upload");

const patientRoute = require('./router/patient')
const psychiatristRoute = require("./router/psychiatrist")

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
//upload(req, res);

var g = require('dyson-generators');
    var imageData;
    g.image.base64({width:200, height: 200}).then(image=>{
        imageData = image
    })
const mongoDbUrl = process.env.MONGODBURL;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //req.file=imageData
    next();
});

app.use((req,res,next)=>{
    Psychiatrist.findById("60801b2d1b04440b2c8b8d0e").then(user=>{
        req.user = user 
        //console.log(user)
        next();
    })
})

// const fileStorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"image")
//     },
//     filename:(req,file,cb)=>{
//         cb(null,uuidv4()+"-"+file.originalname)
//     }
// })

// const fileFilter = (req,file,cb)=>{
//     if(file.mimetype==='image/png' || file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' )
//     {
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
// }

// app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))


app.use("/patient",patientRoute)
app.use("/",psychiatristRoute)
//mongoose.mongo.GridFSBucket()

const PORT = process.env.PORT;

mongoose.connect(mongoDbUrl).then(result=>{
    //console.log(result.connections[0].db)
    app.listen(PORT)
    console.log("App is running and connected to database!!")
}).catch(err=>{
    console.log(err)
})

