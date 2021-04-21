const jwt = require("jsonwebtoken");


module.exports = (req,res,next) => {
    const token = req.get("Authorization");
    //console.log(token)
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,"secret")
        //console.log(decodedToken)
    }catch(err){
        return res.status(401).json({message:"User unauthenticated!!"})
    }
    if(!decodedToken){
        return res.status(401).json({message:"User unauthenticated!!"})
    }
    req.userID=decodedToken._id;
    next()
}