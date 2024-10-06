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
  const secret = process.env.JWT_SECRET || "F1AD4A54BEF596923FFCF5DBFB1ED";
  jwt.verify(token, secret, async (err, payload) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).send("Token Expired");
        return
      } else {
        res.status(403).send("Invalid Token");
        return;
      }
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
