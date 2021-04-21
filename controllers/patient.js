const upload = require("../middleware/upload");
const {validationResult} = require("express-validator/check");
const Patient = require("../models/patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Psychiatrist = require("../models/psychiatrist")

exports.registerPatient = (req,res,next)=>{
    //console.log("In reg")
    //console.log(validationResult(req))
    try {
        upload(req, res).then(result=>{
          //console.log(req.body.name)
          const name = req.body.name;
          const address = req.body.address;
          const email = req.body.email;
          const phoneNumber = req.body.phoneNumber;
          const password = req.body.password;
          const userId = req.user._id;
          const fileId = req.file.id
          //console.log(req)
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
      //console.log(name,address,email,phoneNumber,password,userId,req.file.id);
}


exports.editPatient = (req,res,next) =>{
  const patientId = req.params.id;
  const name = req.body.name;
  const address = req.body.address;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  // const userId = req.user._id;
  // const fileId = req.file.id 
  Patient.findById(patientId).then(patient=>{
    //console.log(post)
    if(!patient){
      return res.status(500).json({
        error:"Patient Not Found"
      })
    }
    // if(post.creator.toString() !== req.userID){
    //     const error = new Error("Unauthorized User!!!")
    //     error.statusCode=403;
    //     throw error
    // }
    patient.name = name;
    patient.email = email;
    patient.phoneNumber = phoneNumber;
    patient.password = password;
    patient.address = address;
    return patient.save()
    }).then(result=>{
        res.json({message:"Patient Updated",patient:result})
    })
    .catch(error=>{
     if(!error.statusCode){
        error.statusCode = 500;
    }
    next(error);
})  
}


exports.getPatients = (req,res,next) =>{
  const userId = req.user._id;
  Patient.find({psychiatrist:userId}).then(patients=>{
    res.status(200).json({
      message:"Patients",
      Patients:patients
    })
  }).catch(err=>{
    console.log(err)
  })
}



exports.getStats = (req,res,next) => {
  Psychiatrist.find().then(result=>{
    const userIds = result;
    //console.log(userIds)
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
      //console.log(a)
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
  console.log(password)
  //console.log(req.body)
  let lodedUser;
  Patient.findOne({email:email}).then(user=>{
      if(!user){
          return res.status(401).send("User Not found!!")
      }
      lodedUser=user;
      //console.log(lodedUser)
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
          //console.log(token)
          //console.log(lodedUser._id)
          res.status(200).json({token:token,userId:lodedUser._id.toString()})
      }).catch(err=>{
          next(err);
      })
  })
  .catch(err=>{
      if(!err.statusCode){
          err.statusCode = 500;
      }
  next(err);
  })
} 