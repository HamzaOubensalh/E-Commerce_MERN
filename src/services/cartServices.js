import { Cart } from "../modules/cart.js";
import { orderModel } from "../modules/order.js";
import { productModel } from "../modules/products.js";

const createCartActive = async ({ userId }) => {
  const cartActive = await Cart.create({ userId, totalAmount: 0 });
  return cartActive;
};

export const getActiveCart = async ({ userId }) => {
  let cart = await Cart.findOne({ userId, status: "Active" });

  if (!cart) {
    cart = await createCartActive({ userId });
  }

  return cart;
};

export const deleteAllProduct = async ({ userId }) => {
  const cart = await getActiveCart({ userId });
  cart.items = [];
  const newCart = cart.save();
  return { data: newCart, statusCode: 200 };
};

export const addItemToCart = async ({ userId, productId, quantity }) => {
  try{
    const cart = await getActiveCart({ userId });

  console.log(cart);

  //Does The Item Exists In The Cart
  const ExistingItem = cart.items.find(
    (p) => p.product === productId
  );
  console.log(ExistingItem);
  if (ExistingItem) {
    return { data: "That Item Has Already Exist", statusCode: 400 };
  }
  //Fetch Product
  console.log(productId);
  const Product = await productModel.findById(productId);
  console.log(Product)

  if (!Product) {
    return { data: "Product Not Found", statusCode: 404 };
  }
  cart.items.push({
    product: productId,
    quantity: parseInt(quantity),
    price: Product.price,
  });

  cart.totalAmount += Product.price;

  const UpdatedCart = await cart.save();
  return { data: UpdatedCart, statusCode: 201 };
  }catch(err){
    console.log(err)
  }
  
};

export const updateProductInCart = async ({ userId, productId, quantity }) => {
  const cart = await getActiveCart({ userId });
  const ExistingItem = cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (!ExistingItem) {
    return { data: "The Item Does Not Exist In Cart", statusCode: 400 };
  }
  ExistingItem.quantity = quantity;

  //Total Of Other Items In The Cart
  const otherItemsTotal = cart.items.filter(
    (p) => p.product.toString() !== productId
  );
  console.log(otherItemsTotal);

  let totalOtherItems = otherItemsTotal.reduce((accu, product) => {
    accu += product.quantity * product.price;
    return accu;
  }, 0);
  console.log(totalOtherItems);
  totalOtherItems += ExistingItem.quantity * ExistingItem.price;
  console.log(ExistingItem.quantity * ExistingItem.price);
  cart.totalAmount = totalOtherItems;
  console.log(cart.totalAmount);

  const UpdatedCart = await cart.save();
  return { data: UpdatedCart, statusCode: 201 };
};

export const deleteProductFromCart = async ({ userId, productId }) => {
  const cart = await getActiveCart({ userId });
  const ExistingItem = cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (!ExistingItem) {
    return { data: "That Item Is Not In Cart", statusCode: 400 };
  }
  const otherItems = cart.items.filter(
    (product) => product.product.toString() !== productId
  );
  const totalAmount = otherItems.reduce((accu, product) => {
    accu += product.quantity * product.price;
    return accu;
  }, 0);

  cart.totalAmount = totalAmount;
  cart.items = otherItems;
  let NewCart = await cart.save();
  return { data: NewCart, statusCode: 202 };
};

export const checkout = async ({ userId, address }) => {
  const cart = await getActiveCart({ userId });

  const orderItems = [];

  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    const orderItem = {
      productTitle: product.name,
      productImage: product.image,
      unitPrice: product.price,
      quantity: item.quantity,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems: orderItems,
    address: address,
    total: cart.totalAmount,
    userId: userId,
  });
  await order.save();
  cart.status = "Completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};
