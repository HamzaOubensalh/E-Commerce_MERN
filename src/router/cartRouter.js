import express from "express";
import { getActiveCart } from "../services/cartServices.js";
import { validateJWT } from "../middleware/validateJW.js";
import { addItemToCart } from "../services/cartServices.js";
import { updateProductInCart } from "../services/cartServices.js";

const app = express.Router();

app.get("/", validateJWT, async (req, res) => {
  const userId = req.user._id;
  const Cart = await getActiveCart({ userId });
  res.status(200).send(Cart);
});

app.post("/item", validateJWT, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  const Response = await addItemToCart({ userId, productId, quantity });
  res.status(Response.statusCode).send(Response.data);
});

app.put("/item", validateJWT, async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const Response = await updateProductInCart({ userId, productId, quantity });
  res.status(Response.statusCode).send(Response.data);
});

export default app;
