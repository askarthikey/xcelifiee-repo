const adminAuth=(req,res,next)=>{
    console.log(req.body)
    const userType=req.userType
    console.log(userType)
    if(userType==="admin"){
        next()
    }
    else{
        res.status(403).json({ message: 'Access denied. Admins only.' })
    }
}
module.exports=adminAuth