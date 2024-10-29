const express = require("express");
const router = express.Router();

const User = require("../models/user.models");

const Product = require("../models/product.models");

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

// get cart details

router.get('/cart/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
                                .populate('cart.product');
        
        if(user){
            const cartDetails = user.cart.map((item)=>(
                {
                product: item.product,
                quantity: item.quantity
            }));

            res.status(200).json(cartDetails);
        }else{
            res.status(404).json({error: 'User not found'})
        }
    }catch(error){
        res.status(500).json({error: error.message})
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

// address management
// add a address
router.put('/:userId/address', async(req,res)=>{
    const address = req.body;
    try{
        const user = await User.findByIdAndUpdate(req.params.userId, {
            $push: {address: address }},
            {new:true});
            if(user) res.status(200).json({message:"address added successfully.", user:user})
            else res.status(400).json({message:"address not updated"})
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

// update an address
router.put('/:userId/address/:addressId', async(req,res)=>{
    const {userId, addressId} = req.params;
    const updatedAddress = req.body;

    try{

        const user = await User.findOneAndUpdate(
            {_id:userId, 'address._id':addressId},
            {
                $set: {
                "address.$.street": updatedAddress.street,
                "address.$.city": updatedAddress.city,
                "address.$.state": updatedAddress.state,
                "address.$.postalCode": updatedAddress.postalCode,
                "address.$.isDefault": updatedAddress.isDefault,
                }
            }, 
            {new: true}
        );
        res.status(200).json({message:"address updated successfully", user:user})

    }catch(error){
        res.status(500).json({error:error.message});
    }
})

// delete an address

router.delete('/:userId/address/:addressId', async (req,res)=>{
    const {userId, addressId} = req.params;
    try{
        const user = await User.findByIdAndDelete(
            userId,
            {$pull: {address:{_id:addressId}}},
            {new:true}
        )

        res.status(200).json({message:'address deleted successfully', user:user})
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
    const {userId, productId} = req.body;
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

// delete items from wishlist

router.delete('/wishlist/remove-from-wishlist', async(req,res)=>{
    const {userId, productId} = req.body;
    console.log(userId, productId);
    try{    
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:'User not found'});
        // remove product from wishlist
        user.wishlist = user.wishlist.filter(id=> id.toString() !== productId.toString());
        await user.save();
        return res.status(200).json({message:"Product removed from wishlist"})
    }catch(error){
        res.status(500).json({message : 'Failed to remove product from wishlist', error: error.message})
    }
})

// add item to cart or increase quantity if it already exists.

router.post('/cart/add-to-cart', async(req,res)=>{
    try{
        const {userId, productId} = req.body;
        const user = await User.findById(userId)
                        .populate('cart.product')
        if(!user) return res.status(404).json({message:"User not found, to add item to cart"})
        
        const cartItem = user.cart.find((item)=> item.product._id?.toString() === productId.toString());
        
        if(cartItem){
            cartItem.quantity +=1;
        }
        else{
            const product = await Product.findById(productId);
            user.cart.push({product: product, quantity: 1});
        }

        await user.save()
        return res.status(200).json(user.cart)
    }catch(error){
        res.status(500).json({error: 'Error adding product to cart.', error: error.message})
    }
})

//  delete item from cart

router.delete('/cart/remove-from-cart', async(req,res)=>{
    const {userId, productId} = req.body;
    try{
        const user = await User.findById(userId)
                            .populate('cart.product')
        if(!user) return res.status(404).json({error:'User not found'});
        // remove product from cart
        const cartItem = user.cart.find((item)=> item.product._id?.toString() === productId.toString());
        
        if(cartItem){
            cartItem.quantity +=1;
        }
        user.cart = user.cart.filter(item=> item.product._id.toString() !== productId.toString());
        await user.save();
        return res.status(200).json(user.cart)
    }catch(error){
        res.status(500).json({error: 'Error removing product'})
    }
})