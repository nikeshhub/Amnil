import pool from "../../../db.js";
import logger from "../../utils/logger.js";

export const addToCart = async (req, res) => {
  try {
    // Get user id from authentication
    const userId = req._id;
    console.log(userId);

    const { productId, quantity } = req.body;

    console.log(productId);
    console.log(quantity);

    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [userId, productId, quantity]
    );

    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({
        success: true,
        message: "Product added to cart successfully",
      });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.send(
        `<script>alert("Product added to cart successfully!"); window.location.href = "/product";</script>`
      );
    } else {
      logger.log("error", "Invalid response type");
    }

    logger.log("info", "Product added to cart successfully.");
  } catch (error) {
    logger.log("error", "Error adding product to cart:", error);
    res.json({ success: false, error: error.message });
  }
};
