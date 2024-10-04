import { userModel } from "../modules/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const register = async ({ username, email, password }) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "That User Already Exists", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new userModel({ username, email, password: hashedPassword });
  await user.save();
  return { data: generateToken(user), statusCode: 200 };
};

export const login = async ({ email, password }) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "Email Or Password Not Correct", statusCode: 400 };
  }
  const PassowrdFinder =await bcrypt.compare(password, findUser.password);
  if (PassowrdFinder) {
    return { data: generateToken(findUser), statusCode: 200 };
  }
  return { data: "Email Or Password Not Correct", statusCode: 400 };
};

const generateToken=(data)=>{
  return jwt.sign({data},'77D954A5CBBC9BDAE7FD75C16C59A');
}
