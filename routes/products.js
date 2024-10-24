const express = require("express");
const router = express.Router();

const Product = require("../models/product.models");

router.get('/', async(req,res)=>{
    try{
        const products = await Product.find();
        if(products.length > 0){
            res.status(200).json({data:{products}})
        }else{
            res.status(404).json({message:'Products list is empty'})
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

module.exports = router;