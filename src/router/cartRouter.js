import express from 'express';
import { getActiveCart } from '../services/cartServices.js';
import { validateJWT } from '../middleware/validateJW.js';

const app=express.Router();


app.get('/',validateJWT,async(req,res)=>{
    const userId=req.user._id
    const Cart=await getActiveCart({userId});
    res.status(200).send(Cart)
})

export default app;