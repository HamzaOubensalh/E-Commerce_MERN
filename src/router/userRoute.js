import { userModel } from "../modules/users.js";
import express from "express";
import { login, register } from "../services/usersServices.js";

const app = express.Router();

app.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new userModel({ username, email, password });
  await user.save();
  res.status(201).send(user);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const users = await userModel.findOne(id);
  if (users) {
    return res.status(200).send(users);
  }
  return res.status(404).send("User Not Found");
});

app.post('/register',async(req,res)=>{
  const {username,email,password}=req.body;
  const {data,statusCode}=await register({username,email,password});
  return res.status(statusCode).send(data);
})

app.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  const {data,statusCode}=await login({email,password});
  return res.status(statusCode).send(data);
})

export default app;
