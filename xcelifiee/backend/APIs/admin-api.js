const { ObjectId } = require('mongodb');
const exp=require("express")
const adminApp=exp.Router()


adminApp.use(exp.json());

// admin deletes a user by _id
adminApp.delete('/user/:_id',async(req,res)=>{
    //get usersCollection
    const usersCollection= req.app.get('usersCollection')
    const paramId=req.params._id
    // console.log(paramId)
    let dbRes=await usersCollection.deleteOne({ _id: new ObjectId(paramId) })
    // console.log(dbRes)
    if(dbRes.deletedCount===1){
        res.send({message:"User deleted"})
    }else{
        res.send({message:"No user deleted"})
    }
})


//admin delete any publication
adminApp.delete('/publication/:_id',async(req,res)=>{
    //get publicationsCollection
    const usersCollection= req.app.get('publicationsCollection')
    const paramId=req.params._id
    // console.log(paramId)
    let dbRes=await usersCollection.deleteOne({ _id: new ObjectId(paramId) })
    // console.log(dbRes)
    if(dbRes.deletedCount===1){
        res.send({message:"publication deleted"})
    }else{
        res.send({message:"No publication deleted"})
    }
})


//admin delete any patent
adminApp.delete('/patent/:_id',async(req,res)=>{
    //get patentsCollection
    const usersCollection= req.app.get('patentsCollection')
    const paramId=req.params._id
    // console.log(paramId)
    let dbRes=await usersCollection.deleteOne({ _id: new ObjectId(paramId) })
    // console.log(dbRes)
    if(dbRes.deletedCount===1){
        res.send({message:"patent deleted"})
    }else{
        res.send({message:"No patent deleted"})
    }
})

//admin delete any fundingProposal
adminApp.delete('/fundingProposal/:_id',async(req,res)=>{
    //get fundingProposalsCollection
    const usersCollection= req.app.get('fundingProposalsCollection')
    const paramId=req.params._id
    // console.log(paramId)
    let dbRes=await usersCollection.deleteOne({ _id: new ObjectId(paramId) })
    // console.log(dbRes)
    if(dbRes.deletedCount===1){
        res.send({message:"fundingProposal deleted"})
    }else{
        res.send({message:"No fundingProposal deleted"})
    }
})

//admin updating publications
adminApp.put('/publication',async(req,res)=>{
    //get publicationsCollection
    const publicationsCollection= req.app.get('publicationsCollection')
    //get modifieduserobj from req.body
    const modifieduser=req.body
    //update
    let dbRes=await publicationsCollection.updateOne({username:modifieduser.username},{$set:{...modifieduser}})
    if(dbRes.modifiedCount===1){
        res.send({message:"modified user"})
    }else{
        res.send({message:"not modified"})
    }
})

//admin updating patent
adminApp.put('/patent',async(req,res)=>{
    //get patentsCollection
    const patentsCollection= req.app.get('patentsCollection')
    //get modifieduserobj from req.body
    const modifieduser=req.body
    //update
    let dbRes=await patentsCollection.updateOne({username:modifieduser.username},{$set:{...modifieduser}})
    if(dbRes.modifiedCount===1){
        res.send({message:"modified user"})
    }else{
        res.send({message:"not modified"})
    }
})


//admin updating funding
adminApp.put('/funding',async(req,res)=>{
    //get fundingProposalsCollection
    const fundingProposalsCollection= req.app.get('fundingProposalsCollection')
    //get modifieduserobj from req.body
    const modifieduser=req.body
    //update
    let dbRes=await fundingProposalsCollection.updateOne({username:modifieduser.username},{$set:{...modifieduser}})
    if(dbRes.modifiedCount===1){
        res.send({message:"modified user"})
    }else{
        res.send({message:"not modified"})
    }
})



module.exports=adminApp