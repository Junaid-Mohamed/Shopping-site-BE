const express = require("express");
const router = express.Router();

const User = require("../models/user.models");

// get endpoint



// post endpoints

router.post('/', async(req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).json({messagee:"User created successfully."})
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

router.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            if(user.password === password){
                res.status(200).json({message:'User authenticated successfully.'})
            }else{
                res.status(401).json({message:'Password incorrect, please try again.'})
            }
        } else{
            res.status(404).json({message:"User not found."})
        }
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

module.exports = router;