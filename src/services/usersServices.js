import { userModel } from "../modules/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

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


// Function to generate a token
const generateToken = (userData) => {
  const secret = process.env.JWT_SECRET || "F1AD4A54BEF596923FFCF5DBFB1ED";
  return jwt.sign({ data: userData }, secret, { expiresIn: '1h' }); // Token valid for 1 hour
};

