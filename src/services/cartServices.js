import { Cart } from "../modules/cart.js";
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

export const addItemToCart = async ({ userId, productId, quantity }) => {
  const cart = await getActiveCart({ userId });

  console.log(cart);

  //Does The Item Exists In The Cart
  const ExistingItem = cart.items.find((p) => p.product === productId);
  console.log(ExistingItem);
  if (ExistingItem) {
    return { data: "That Item Has Already Exist", statusCode: 400 };
  }
  //Fetch Product
  console.log(productId);
  const Product = await productModel.findById(productId);

  if (!Product) {
    return { data: "Product Not Found", statusCode: 404 };
  }
  cart.items.push({
    product: productId,
    quantity: parseInt(quantity),
    price: Product.price,
  });

  const UpdatedCart = await cart.save();
  return { data: UpdatedCart, statusCode: 201 };
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
  const otherItemsTotal = cart.items.filter((p) => p.product.toString() !== productId);
  console.log(otherItemsTotal)

  let totalOtherItems = otherItemsTotal.reduce((accu, product) => {
    accu += (product.quantity * product.price);
    return accu;
  }, 0);
  console.log(totalOtherItems)
  totalOtherItems += (ExistingItem.quantity * ExistingItem.price);
  console.log(ExistingItem.quantity * ExistingItem.price)
  cart.totalAmount = totalOtherItems;
  console.log(cart.totalAmount)

  const UpdatedCart = await cart.save();
  return { data: UpdatedCart, statusCode: 201 };
};
