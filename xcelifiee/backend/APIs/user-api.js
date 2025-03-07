//create a user-api app
const exp=require('express')
const bcryptjs=require('bcryptjs')
const expAsyncHandler=require('express-async-handler')
const userApp=exp.Router()
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken.js')
const adminAuth=require('../Middlewares/adminAuth.js')
const { ObjectId } = require('mongodb');
require('dotenv').config()

//get  collection app
userApp.use((req,res,next)=>{
    usersCollection=req.app.get('usersCollection')
    publicationsCollection=req.app.get('publicationsCollection')
    patentsCollection=req.app.get('patentsCollection')
    fundingProposalsCollection=req.app.get('fundingProposalsCollection')
    next()
})

//user registration route
userApp.post('/user',expAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body
    // console.log(newUser)
    //check for duplicate user in the db based on empid
    const dbUser=await(usersCollection.findOne({empid:newUser.empid}))
    //if user is found
    if(dbUser!==null){
        res.send("User already exists")
    }
    else{
        //hash the password
        const hashedPass=await bcryptjs.hash(newUser.password,5)
        //replace plain pass with hashed pass
        newUser.password=hashedPass
        //create User
        await usersCollection.insertOne(newUser)
        //send response
        res.status(201).json({ message: 'User created successfully!' });
    }
}))

//User login
userApp.post('/login',expAsyncHandler(async(req,res)=>{
    //get the credentials from the object
    const userCred=req.body
    //check for username
    const dbUser=await usersCollection.findOne({empid:userCred.empid,userType:userCred.userType})
    if(dbUser===null){
        res.send({message:"Invalid Credentials"})
    }
    else{
        const status=await bcryptjs.compare(userCred.password,dbUser.password)
        if(status===false){
            res.send({message:"Invalid Password"})
        }
        else{
            //create jwt token and encode it
            const signedToken=jwt.sign({empid:dbUser.empid},process.env.SECRET_KEY)
            //send res
            res.send({message:"Login Successful",token:signedToken, user:dbUser})
        }
    }
}))

//display all users by according to their teamno (for hod)
userApp.get('/users/:teamid',verifyToken,expAsyncHandler(async(req,res)=>{
    // console.log(req.params)
    const teamnoFromParams=Number(req.params.teamid)
    const users=await usersCollection.find({teamno:teamnoFromParams}).toArray()
    res.send(users)
    }))

//post publications data into the database
userApp.post('/publications',verifyToken,expAsyncHandler(async(req,res)=>{
    const publicationData=req.body
    const publication=await publicationsCollection.insertOne(publicationData)
    res.send(publication)
}))

//add the titleOfPaper to the existing list of the userObj
userApp.put('/add-title',verifyToken,expAsyncHandler(async(req,res)=>{
    const { username, titleOfPaper } = req.body;
    const user = await usersCollection.findOne({ username: username });
    if (user.titleOfPaperList && user.titleOfPaperList.includes(titleOfPaper)) {
        return res.send({ message: "Title of paper already exists" });
    }
    const result = await usersCollection.updateOne(
        { username: username }, // Match the user by username
        { $push: { titleOfPaperList: titleOfPaper } } // Add the new title to the list
    );
    res.send({ message: "Title added successfully" });
}))

//post patents data into the database
userApp.post('/patents',verifyToken,expAsyncHandler(async(req,res)=>{
    const patentData=req.body
    const patent=await patentsCollection.insertOne(patentData)
    res.send(patent)
}))

//post fundprops data into the database
userApp.post('/fundprops',verifyToken,expAsyncHandler(async(req,res)=>{
    const fundpropData=req.body
    const fundprop=await fundingProposalsCollection.insertOne(fundpropData)
    res.send(fundprop)
}))

//view all publications 
userApp.get('/publicationsData',verifyToken,expAsyncHandler(async(req,res)=>{
    const publications=await publicationsCollection.find().toArray()
    res.send(publications)
}))

//get all publications sort by empid
userApp.get('/publicationsSortData',verifyToken,expAsyncHandler(async(req,res)=>{
    const publications=await publicationsCollection.find().sort({empid:1}).toArray()
    res.send(publications)
}))

//get patents sort by teamno
userApp.get('/patentsSortData',verifyToken,expAsyncHandler(async(req,res)=>{
    const patents=await patentsCollection.find().sort({teamno:1}).toArray()
    res.send(patents)
}))

//get fundingPropsData sort by teamno
userApp.get('/fundingPropsSortData',verifyToken,expAsyncHandler(async(req,res)=>{
    const fundingProps=await fundingProposalsCollection.find().sort({teamno:1}).toArray()
    res.send(fundingProps)
}))

//get all publications sort by teamno
userApp.get('/publicationsSortTeamData',verifyToken,expAsyncHandler(async(req,res)=>{
    const publications=await publicationsCollection.find().sort({teamno:1}).toArray()
    res.send(publications)
}))

//get allusers data sort by teamnos
userApp.get('/usersSortData',verifyToken,expAsyncHandler(async(req,res)=>{
    const users=await usersCollection.find().sort({teamno:1}).toArray()
    res.send(users)
}))

//delete user based on empid (admin Route)
userApp.delete('/deleteUser/:empid',verifyToken,expAsyncHandler(async(req,res)=>{
    const empid=req.params.empid
    const query={empid:empid}
    const result=await usersCollection.deleteOne(query)
    res.send(result)
}))

//delete publications based on empid
userApp.delete('/deletePublications/:empid',verifyToken,expAsyncHandler(async(req,res)=>{
    const empid=req.params.empid
    const query={empid:empid}
    const result=await publicationsCollection.deleteMany(query)
    res.send(result)
}))

//delete publications based on titleOfPaper
userApp.delete('/deletePublications/:titleOfPaper',verifyToken,expAsyncHandler(async(req,res)=>{
    const titleOfPaper=req.params.titleOfPaper
    const query={titleOfPaper:titleOfPaper}
    const result=await publicationsCollection.deleteMany(query)
    res.send(result)
}))

//edit forms data according to empid
userApp.put('/editForms/:empid',verifyToken, expAsyncHandler(async (req, res) => {
    const empid = req.params.empid;
    const query = { empid: empid };
    const updateData = req.body;

    // If password exists in the update data, hash it
    if (updateData.password) {
        const salt = await bcrypt.genSalt(5); // Generate salt with 10 rounds
        updateData.password = await bcrypt.hash(updateData.password, salt); // Hash the password
    }

    const options = { upsert: true }; // Insert document if it does not exist
    const result = await usersCollection.updateOne(query, { $set: updateData }, options);

    res.send(result); // Send the result back to the client
}));

//get all publications when teamno is passed
userApp.get('/getPublications/:teamno',verifyToken,expAsyncHandler(async(req,res)=>{
    const teamno=JSON.parse(req.params.teamno)
    const query={teamno:teamno}
    const result=await publicationsCollection.find(query).toArray()
    res.send(result)
}))

//get all patents when teamno is passed
userApp.get('/getPatents/:teamno',verifyToken,expAsyncHandler(async(req,res)=>{
    const teamno=req.params.teamno
    const query={teamno:teamno}
    const result=await patentsCollection.find(query).toArray()
    res.send(result)
}))

//get all fundingProposals when teamno is passed
userApp.get('/getFundingProposals/:teamno',verifyToken,expAsyncHandler(async(req,res)=>{
    const teamno=req.params.teamno
    const query={teamno:teamno}
    const result=await fundingProposalsCollection.find(query).toArray()
    res.send(result)
}))

//update publications data acc to _id
userApp.put('/updatePublications/:_id',verifyToken,expAsyncHandler(async(req,res)=>{
    const id=req.params._id
    const query={_id:ObjectId(id)}
    const updateData=req.body
    const options={upsert:true}
    const result=await publicationsCollection.updateOne(query,{ $set:updateData },options)
    res.send(result)
}))

//export userApp
module.exports = userApp