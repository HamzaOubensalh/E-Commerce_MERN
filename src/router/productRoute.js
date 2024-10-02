import express from 'express';
import { productModel } from '../modules/products.js';

const app=express.Router();

app.get('/',async(req,res)=>{
    try{
        const Products=await productModel.find();
        res.status(200).send(Products);
    }catch{
        res.status(404).send('Fetching Data Failed');
    }
})

app.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const findProduct=await productModel.findById(id);
    if(findProduct){
        return res.status(200).send(findProduct);
    }
    res.status(404).send('Data Fetchind Failed');
})

export default app;