import { Cart, Order } from "../Model/model.js";

export const makeOrder = async (req, res) => {
  try {
    //get id from authentication
    const userId = req._id;
    //find cart with user id
    const cart = await Cart.findOne({ userId });
    //if there is no cart or empty cart
    if (!cart || cart.items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    //calculate total price
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    //minimum threshold logic
    const minimumThreshold = 50;
    if (totalPrice < minimumThreshold) {
      return res.json({
        success: false,
        message: `Total price must be at least $${minimumThreshold} in order to checkout.`,
      });
    }
    //save order to database
    const order = await Order.create({
      userId,
      items: cart.items,
      totalPrice,
      date: new Date(),
    });
    //clear the cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
