import { Cart } from "../modules/cart.js";

const createCartActive = async ({ userId }) => {
  const cartActive = await Cart.create({ userId,totalAmount:0 });
  return cartActive;
};


export const getActiveCart=async({userId})=>{
    let cart=await Cart.findOne({userId,status:"Active"});

    if(!cart){
        cart=await createCartActive({userId});
    }

    return cart;
}
