import pool from "../../../db.js";

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

    res.send(
      `<script>alert("Product added to cart successfully!"); window.location.href = "/product";</script>`
    );
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
