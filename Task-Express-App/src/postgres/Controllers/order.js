import pool from "../../../db.js";
import logger from "../../utils/logger.js";

export const makeOrder = async (req, res) => {
  try {
    const userId = req._id;

    const cartItemsQuery =
      "SELECT c.product_id, p.price, c.quantity FROM cart c JOIN product p ON c.product_id = p.id WHERE c.user_id = $1";
    const { rows: cartItems } = await pool.query(cartItemsQuery, [userId]);

    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in the cart" });
    }

    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Insert order into the orders table
    const orderInsertQuery = `INSERT INTO "order" (user_id, total_price) VALUES ($1, $2) RETURNING id`;
    const orderInsertValues = [userId, totalPrice];
    const {
      rows: [order],
    } = await pool.query(orderInsertQuery, orderInsertValues);
    const orderId = order.id;

    // Insert order items into the order_items table
    const orderItemsInsertQuery =
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)";
    for (const item of cartItems) {
      const orderItemsInsertValues = [orderId, item.product_id, item.quantity];
      await pool.query(orderItemsInsertQuery, orderItemsInsertValues);
    }

    const deleteCartQuery = "DELETE FROM cart WHERE user_id = $1";
    await pool.query(deleteCartQuery, [userId]);

    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({ success: true, message: "Order placed successfully" });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.send(
        `<script>alert("Thank you for your order! We have received your order. We will notify you again with the shipping times."); window.location.href = "/product";</script>`
      );
    } else {
      logger.log("error", "Invalid response type");
    }

    logger.log("info", "Order placed successfully.");
  } catch (error) {
    logger.log("error", "Error placing order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
