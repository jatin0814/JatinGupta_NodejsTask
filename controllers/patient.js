const upload = require("../middleware/upload");
const {validationResult,body} = require("express-validator/check");
const Patient = require("../models/patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Psychiatrist = require("../models/psychiatrist")

exports.registerPatient = (req,res,next)=>{
    try {
        upload(req, res).then(result=>{
          var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(req.body.email === undefined && req.body.password === undefined && req.body.name === undefined && req.body.address === undefined && req.body.phoneNumber === undefined){
            return res.status(422).json({message:"Validation Failed!!"});
          }
          if(!req.body.email.match(mailformat))
          {
            return res.status(422).json({message:"Invalid email address!"});
          }
          var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
          if(req.body.password.length >15){
            return res.status(422).json({message:"Validation Failed!!"});   
        }else{
          if(!(req.body.password.match(passwordFormat)))
          {
            return res.status(422).json({message:"Validation Failed!!"});
          }
        }
          
          if(req.body.name < 3 && req.body.address < 10 && req.body.phoneNumber < 10)
          {
            return res.status(422).json({message:"Validation Failed!!"});
          }

          
          const name = req.body.name;
          const address = req.body.address;
          const email = req.body.email;
          const phoneNumber = req.body.phoneNumber;
          const password = req.body.password;
          const userId = req.userID;
          const fileId = req.file.id
          if (req.file == undefined) {
            return res.send(`You must select a file.`);
          }
          bcrypt.hash(password,12).then(hashedPw=>{
            const patient = new Patient({
              name:name,
              address:address,
              email:email,
              phoneNumber:phoneNumber,
              password:hashedPw,
              psychiatrist:userId,
              fileId:fileId
            })
            return patient.save()
          })
          .then(result=>{
            res.status(201).json({
              message:"Patient register successfully",
              patient:result
            })
          }).catch(err=>{
            console.log(err)
          })
        })
      } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload image: ${error}`);
      }
}


exports.editPatient = (req,res,next) =>{
  const patientId = req.params.id;
  const name = req.body.name;
  const address = req.body.address;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const userId = req.userID;
  Patient.findById(patientId).then(patient=>{
    if(!patient){
      return res.status(500).json({
        error:"Patient Not Found"
      })
    }
    if(patient.psychiatrist.toString() !== req.userID){
        return res.status(403).json({message:"Unauthorized User!!!"})
    }
    let oldFileId = patient.fileId;
    patient.name = name;
    patient.email = email;
    patient.phoneNumber = phoneNumber;
    patient.password = password;
    patient.address = address;
    patient.psychiatrist = userId;
    patient.fileId = oldFileId;
    return patient.save()
    }).then(result=>{
        res.json({message:"Patient Updated",patient:result})
    })
    .catch(error=>{
     if(!error.statusCode){
        error.statusCode = 500;
        res.status(500).json({message:"Error in Updating Patient Details"})
    }
    next(error);
})  
}


exports.getPatients = (req,res,next) =>{
  const userId = req.userID;
  Patient.find({psychiatrist:userId}).then(patients=>{
    res.status(200).json({
      message:"Patients",
      Patients:patients
    })
  }).catch(err=>{
    res.status(404).json({
      message:"Error while fetching Patients"
    })
  })
}



exports.getStats = (req,res,next) => {
  Psychiatrist.find().then(result=>{
    const userIds = result;
    const a = []
    Patient.find().then(patients=>{
      for(var i=0;i<userIds.length;i++){
        let count = 0;
        patients.map(patient=>{
              if(patient.psychiatrist.toString() === userIds[i]._id.toString()){
                count++;
              }
         })
         a.push({
          psychiatristId:userIds[i]._id,
          firstname:userIds[i].firstname,
          lastname:userIds[i].lastname,
          hospital:userIds[i].hospital,
          count:count
        })
      }
      res.json({
        message:"Stats of Patients",
        Stats:a
      })
    })
  })
}


exports.login=(req,res,next)=>{
  const email=req.body.email;
  const password=req.body.password;
  let lodedUser;
  Patient.findOne({email:email}).then(user=>{
      if(!user){
          return res.status(401).send("User Not found!!")
      }
      lodedUser=user;
      bcrypt.compare(password,user.password)
      .then(isEqual=>{
          console.log(isEqual)
          if(!isEqual){
            return res.status(401).send("Wrong Password!!")
          }
          const token = jwt.sign({email:lodedUser.email,_id:lodedUser._id},
              "secret",{
                  expiresIn:"1h"
              }
          )
          res.status(200).json({token:token,userId:lodedUser._id.toString()})
      }).catch(err=>{
        res.status(500).json({message:"Internal Server Error"})
      })
  })
  .catch(err=>{
    res.status(500).json({message:"Internal Server Error"})
  })
} 