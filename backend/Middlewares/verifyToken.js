const jwt=require('jsonwebtoken')
require('dotenv').config()


function verifyToken(req,res,next){
    // console.log(req.headers)
    //get bearer token from headers of req
    const bearerToken=req.headers.authorization
    // console.log(bearerToken)
    //if bearer token not availabale
    if(!bearerToken){
        return res.send({message:"unauthorized access. Please login to continue"})
    }
    //extract token from bearer token
    const token=bearerToken.split(' ')[1]
    try{
        jwt.verify(token, process.env.SECRET_KEY)
        next()
        // console.log("success")
    }
    catch(err){
        next(err)
    }
    // console.log(token)
}

module.exports=verifyToken