const Psychiatrist = require("../models/psychiatrist")
const bcrypt = require("bcryptjs");

exports.regPsychiatrist =  (req,res,next) => {
    console.log("vdsfv")
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const hospital = req.body.hospital;
    const phoneNumber = req.body.phoneNumber || null;
    const pincode = req.body.pincode || null;
    const state = req.body.state || null;
    const password = req.body.password;
    const email = req.body.email;
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
    return psychiatrist.save()
})
    .then(result=>{
        console.log(result)
        res.status(201).json({
            message:"User Created",
            user:result
        })
    }).catch(err=>{
        console.log(err)
    })
}


exports.login=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    //console.log(password)
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

