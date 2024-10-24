const express = require("express");
const router = express.Router();

const Category = require("../models/category.models");

router.get('/', async(req,res)=>{
    try{
        const categories = await Category.find();
        if(categories.length > 0){
            res.status(200).json({data: {categories}});
        }else{
            res.status(404).json({message:'categories list is empty'});
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

module.exports = router;