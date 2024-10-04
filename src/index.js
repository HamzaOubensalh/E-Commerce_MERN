import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from './router/userRoute.js';
import productRoute from './router/productRoute.js';
import cartRoute from './router/cartRouter.js';
import { seedingProducts } from "./services/productsServices.js";


const app = express();

app.use(express.json());
app.use(cors());


mongoose
.connect("mongodb://localhost:27017/EcommerceStore")
.then(() => console.log("Database Connection"));

app.use('/users',userRoute);


seedingProducts()
app.use('/products',productRoute);
app.use('/cart',cartRoute)

// app.get("/product", async (req, res) => {
//   try{

//     let Products = await productModel.find();
//     res.status(200).send(Products);
//   }catch(error){
//     res.status(404).send('Data Fetching Failed')
//   }
// });

// app.get("/product/:id", async (req, res) => {
//   const id = req.params.id;
//   const FindProduct = await productModel.findById(id);
//   if (!FindProduct) {
//     return res.status(404).send({ message: "Product not found" });
//   }
//   res.status(200).send(FindProduct);
// });

// app.post("/users", async (req, res) => {
//   try{
//     const { username, email, password } = req.body;
//   const user = await userModel({ username, email, password });
//   user.save();
//   res.status(201).send(user);
//   }catch{
//     res.status(400).send({ message: "Invalid request" });
//   }
  
// });

// app.get('/users/:id',async(req,res)=>{
//   try{
//     const id=req.params.id;
//   const FindUser=await userModel.findById(id);
//   if(!FindUser){
//     res.status(404).send('User Not Found')
//   }else{
//     res.status(200).send(FindUser)
//   }
//   }catch{
//     res.status(400).send({ message: "Invalid request" });
//   }
// })


const PORT = 5000;

app.listen(PORT, () => {
  console.log("Listening In The 5000 Port");
});
