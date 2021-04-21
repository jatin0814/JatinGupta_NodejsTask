const Psychiatrist = require("../models/psychiatrist")
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator/check");
const jwt = require("jsonwebtoken")

exports.regPsychiatrist =  (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message:"Validation Failed!!"});
    }
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const hospital = req.body.hospital;
    const phoneNumber = req.body.phoneNumber || null;
    const pincode = req.body.pincode || null;
    const state = req.body.state || null;
    const password = req.body.password;
    const email = req.body.email;
    Psychiatrist.findOne({email:email}).then(user=>{
        if(user){
            return res.status(409).json({message:"User Already exists Please try with another email address!!"})
        }
        bcrypt.hash(password,12).then(hashedPw=>{
            const psychiatrist = new Psychiatrist({
                firstname:firstname,
                lastname:lastname,
                hospital:hospital,
                phoneNumber:phoneNumber,
                pincode:pincode,
                state:state,
                password:hashedPw,
                email:email
            });
            psychiatrist.save().then(result=>{
                //console.log(result)
                return res.status(201).json({
                    message:"User Created",
                    user:result
                })
            })
        }).catch(err=>{
                console.log(err)
            })
    })
    
}


exports.login=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let lodedUser;
    Psychiatrist.findOne({email:email}).then(user=>{
        if(!user){
            return res.status(401).send("User Not found!!")
        }
        lodedUser=user;
        console.log(password)
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
            console.log(err)
            res.status(500).json({message:"Internal Server Error"})
        })
    })
    .catch(err=>{
        res.status(500).json({message:"Internal Server Error"})
    })
  } 

