import { Cart } from "../Model/model.js";

export const addToCart = async (req, res) => {
  try {
    //get id from authentication
    const userId = req._id;
    console.log(userId);

    const { productId, quantity, price } = req.body;

    console.log(productId);
    console.log(quantity);
    console.log(price);

    // see if user has a cart
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      // if user has a cart, push new items
      existingCart.items.push({ productId, quantity, price });
      await existingCart.save();
    } else {
      // if user doesnt have, make one
      await Cart.create({
        userId,
        items: [{ productId, quantity, price }],
      });
    }

    res.send(
      `<script>alert("Product added to cart successfully!"); window.location.href = "/product";</script>`
    );
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    //get id from authentication
    const userId = req._id;
    console.log(userId);
    //find cart for that respective user
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.render("cart", { cart: [], totalPrice: 0 });
    }
    const totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    res.render("cart", { cart: cart.items, totalPrice });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
