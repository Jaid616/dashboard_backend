const jwt = require("jsonwebtoken")
const User = require("../models/User")

const checkUserAuth = async(req,res,next)=>{
    let  authorization = req.headers.cookie   
       try {
        let token = authorization.split('=')[1]
         const {userID} = jwt.verify(token,process.env.SECRET_KEY)
         
         req.User = await User.findById(userID).select('-password')
        
         next();
         
       } catch (error) {
          
           res.status(401).json("unauthrise user")
       }
     
    
     

    
}

module.exports = checkUserAuth ;