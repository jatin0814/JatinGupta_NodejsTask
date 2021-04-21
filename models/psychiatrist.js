const mongoose = require("mongoose")

const Schema = mongoose.Schema

const psychiatristSchema = new Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    hospital:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:false
    },
    pincode:{
        type:Number,
        require:false
    },
    state:{
        type:String,
        require:false
    }, email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Psychiatrist",psychiatristSchema);