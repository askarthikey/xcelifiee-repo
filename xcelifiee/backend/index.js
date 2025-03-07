//create express app
const exp=require('express')
const exportApp = require('./APIs/export-api');
const mongoClient=require('mongodb').MongoClient;
require('dotenv').config()
const app=exp()
const cors = require('cors');

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:5173", // The allowed origin
  credentials: true, // Allow credentials (optional, based on use case)
};

// Apply CORS middleware with options
app.use(cors(corsOptions));


//to parse the body
app.use(exp.json())
app.use('/export-api', exportApp);

//connect to database
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get db object
    const xdb=client.db('xcelifiee')
    //get collection Object
    const usersCollection= xdb.collection('usersCollection')
    const publicationsCollection=xdb.collection('publicationsCollection')
    const patentsCollection=xdb.collection('patentsCollection')
    const fundingProposalsCollection=xdb.collection('fundingProposalsCollection')
    //share collection object with express app
    app.set('usersCollection',usersCollection)
    app.set('publicationsCollection',publicationsCollection)
    app.set('patentsCollection',patentsCollection)
    app.set('fundingProposalsCollection',fundingProposalsCollection)
    //confirm db connection status
    console.log("DB Connection Successful")
})
.catch(err=>console.log("Error in connection of database",err))

//import API routes
const userApp=require('./APIs/user-api')
const adminApp=require('./APIs/admin-api')

//if path starts with user-api send req to userApp
app.use('/user-api',userApp)
// //if path starts with admin-api send req to adminApp
app.use('/admin-api',adminApp)

//express error handler
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message})
})

//assign Port number
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server is running on port ${port}`))