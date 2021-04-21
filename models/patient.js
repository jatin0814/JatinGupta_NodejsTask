const mongoose = require("mongoose")

const Schema = mongoose.Schema

const patientSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:false
    },
    password:{
        type:String,
        require:true
    },
    psychiatrist:{
        type:Schema.Types.ObjectId,
        ref:"Psychiatrist",
        require:true
    },fileId:{
        type:Schema.Types.ObjectId,
        require:true
    }
})

module.exports = mongoose.model("Patient",patientSchema);