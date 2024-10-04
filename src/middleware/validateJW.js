import jwt from "jsonwebtoken";
import { userModel } from "../modules/users.js";

export const validateJWT = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization) {
    res.status(403).send("You Have No Authorization");
    return;
  }
  console.log(authorization);
  const token = authorization.split(" ")[1];
  if (!token) {
    res.status(403).send("Bearer Token Not Found");
    return;
  }
  jwt.verify(token, "77D954A5CBBC9BDAE7FD75C16C59A", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid Token");
      return;
    }
    if (!payload || !payload.data) {
      res.status(403).send("Invalid Payload");
      return;
    }
    const user = await userModel.findOne({ email: payload.data.email });
    if (!user) {
      res.status(403).send("User Not Found");
      return;
    }
    req.user = user;
    next();
  });
};
