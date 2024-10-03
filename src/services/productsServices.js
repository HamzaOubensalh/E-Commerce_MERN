import { productModel } from "../modules/products.js";

export const getAllProduct = async () => {
  return await productModel.find();
};

export const seedingProducts = async() => {
  const products = [
    {
      name: "Dell Laptop",
      description: "Is A Laptop",
      price: 4000,
      image: "image1.png",
    },
    {
      name: "PC Gamer",
      description: "Is A PC Gamer",
      price: 15000,
      image: "image2.png",
    },
    {
      name: "IPhone 15 pro Max",
      description: "Is A Cell Phone",
      price: 10000,
      image: "image3.png",
    },
  ];

  const existingProduct=await getAllProduct();

  if(existingProduct.length===0){
    await productModel.insertMany(products);
  }
};
