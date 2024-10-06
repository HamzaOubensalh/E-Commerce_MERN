import mongoose, { Schema } from "mongoose";


const orderItemsSchema=new Schema({
    productTitle:{type:String,required:true},
    productImage:{type:String,required:true},
    unitPrice:{type:Number,required:true},
    quantity:{type:Number,required:true},
})

const orderSchema=new Schema({
    orderItems:[orderItemsSchema],
    address:{type:String,required:true},
    total:{type:Number,required:true},
    userId:{type:String,required:true},
})

export const orderModel=mongoose.model('order',orderSchema);