const express = require("express");
const router = express.Router();

const Product = require("../models/product.models");

//  get endpoints

router.get('/', async(req,res)=>{
    try{
        const products = await Product.find();
        if(products.length > 0){
            res.status(200).json({data:{products}})
        }else{
            res.status(204);
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

router.get('/:productId', async(req,res)=>{
    try{
        const id = req.params.productId;
        const product = await Product.findById(id);
        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({message:`Product not found.`})
        }
    }catch(error){  
        res.status(500).json({error:error.message});
    }
})

// post endpoints

router.post('/', async(req,res)=>{
    try{
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({product:product})
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

module.exports = router;