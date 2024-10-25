const express = require("express");
const router = express.Router();

const Category = require("../models/category.models");

//  get endpoints
router.get('/', async(req,res)=>{
    try{
        const categories = await Category.find();
        if(categories.length > 0){
            res.status(200).json({data: {categories}});
        }else{
            res.status(204);
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get('/:categoryId', async(req,res)=>{
    try{
        const id = req.params.categoryId;
        const category = await Category.findById(id);
        if(category){
            res.status(200).json(category);
        }else{
            res.status(404).json({message:`Category not found.`})
        }
    }catch(error){  
        res.status(500).json({error:error.message});
    }
})


// post endpoints
router.post('/', async(req,res)=>{
    try{
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({category:category})
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

module.exports = router;