import { Cart } from "../Model/model.js";

export const addToCart = async (req, res) => {
  try {
    //get id from authentication
    const userId = req._id;
    console.log(userId);

    const { productId, quantity, price } = req.body;

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

    res.json({
      success: true,
      message: "Product added to cart successfully",
    });
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
    const cart = await Cart.findOne({ userId });
    console.log(cart);
    // console.log(cart.items);
    //if no cart, return empty array
    if (!cart) {
      return res.json([]);
    }

    res.json({ success: true, data: cart.items });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
