import express from 'express';
import { getAllProduct } from '../services/productsServices.js';

const app=express.Router();

app.get('/',async(req,res)=>{
    const products=await getAllProduct();
    res.status(200).send(products);
})

export default app;