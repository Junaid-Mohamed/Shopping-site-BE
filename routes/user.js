const express = require("express");
const router = express.Router();

const User = require("../models/user.models");

// get endpoint

router.get('/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
                        .populate('wishlist')
                        .populate('cart.product');
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({error: `User not found, ${error.message}`})
        }
    }catch(error){
        res.status(500).json({error:error.message})
    }
})


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
                res.status(200).json({message:'User authenticated successfully.', userId: user._id})
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

//  wishlist management

router.get('/wishlist/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({error:'User not found, to fetch wishlist items'})
        return res.status(200).json(user.wishlist);
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

router.post('/wishlist/add-to-wishlist',async(req,res)=>{
    console.log(req.body);
    const {userId, productId} = req.body;
    console.log(userId, productId)
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:'User not found'})
        // check if product is already not in the wishlist.
        if(!user.wishlist.includes(productId)){
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({message:'Product added to wishlist'})
        }else{
            return res.status(400).json({message: 'Product already in wihslist'})
        }
    }catch(error){
        res.status(500).json({message: 'Failed to add product to wishlist', error: error.message})
    }
})

router.post('/wishlist/remove-from-wishlist', async(req,res)=>{
    const {userId, productId} = req.body;
    try{    
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:'User not found'});
        // remove product from wishlist
        user.wishlist = user.wishlist.filter(id=> id.toString !== productId);
        await user.save();
        return res.status(200).json({message:"Product removed from wishlist"})
    }catch(error){
        res.status(500).json({message : 'Failed to remove product from wishlist', error: error.message})
    }
})