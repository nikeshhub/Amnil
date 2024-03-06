import pool from "../../../db.js";
import logger from "../../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

export let getRegisterPage = (req, res) => {
  res.render("register");
  logger.log("info", "Register page loaded successfully");
};

export let getLoginPage = (req, res) => {
  res.render("login");
  logger.log("info", "Login page loaded successfully");
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "product" `);
    const products = result.rows;
    // products.forEach((product) => {
    //   console.log(`Photos for product ${product.id}:`, product.photos);
    // });

    res.render("home", {
      products: products,
      // auctionProducts: auctionFeaturedProducts,
    });
    logger.log("info", "Products fetched successfully");
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
    logger.log("error", error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "product" WHERE is_limited = false;`
    );
    const products = result.rows;
    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({ success: true, products });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.render("products", { products });
    } else {
      logger.log("error", "Invalid response type");
    }
    logger.log("info", "Products fetched successfully");
  } catch (error) {
    logger.log("error", error.message);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getSpecificProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);
    const product = result.rows[0];

    if (product) {
      res.render("singleProduct", { product });
      logger.log("info", "Product fetched successfully");
    } else {
      logger.log("error", "No product with the id");
      throw new Error(`No product with the id ${id}`);
    }
  } catch (error) {
    logger.log("error", error.message);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req._id;
    // console.log("UserID", userId);

    const query = `
      SELECT p.photos, p.name, p.price, c.quantity
      FROM cart c
      JOIN product p ON c.product_id = p.id
      WHERE c.user_id = $1
    `;

    const { rows: cartItems } = await pool.query(query, [userId]);

    if (cartItems.length === 0) {
      return res.render("cart", { cart: [], totalPrice: 0 });
    }

    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // console.log(cartItems);

    res.render("cart", { cart: cartItems, totalPrice });
    logger.log("info", "Cart fetched successfully");
  } catch (error) {
    logger.log("error", error.message);
    res.json({ success: false, error: error.message });
  }
};

export const getAddProductsPage = (req, res) => {
  res.render("addProducts");
  logger.log("info", "Add products page loaded successfully");
};

export const getEditProductsPage = async (req, res) => {
  try {
    const productId = req.params.id;
    const query = `
      SELECT *
      FROM product
      WHERE id = $1;
    `;
    const { rows: products } = await pool.query(query, [productId]);

    if (products.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.render("editProducts", { products: products[0] });
    logger.log("info", "Edit products page loaded successfully");
  } catch (error) {
    logger.log("error", error.message);
    // console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAuctionPage = async (req, res) => {
  try {
    const query = `
      SELECT *,
      EXTRACT(EPOCH FROM (expiry_date - NOW())) AS expires_in_seconds
      FROM product
      WHERE is_limited = TRUE;
    `;
    const { rows: products } = await pool.query(query);

    products.forEach((product) => {
      product.expires_in_seconds = Math.max(
        0,
        Math.floor(product.expires_in_seconds)
      );
    });

    res.render("auctionProducts", { products });
    logger.log("info", "Auction page loaded successfully");
  } catch (error) {
    logger.log("error", error.message);
    // console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSpecificAuction = async (req, res) => {
  const id = req.params.id;
  // console.log(id);

  try {
    const query = `
      SELECT *
      FROM product
      WHERE id = $1;
    `;

    const { rows: products } = await pool.query(query, [id]);
    // console.log(products);
    // console.log(products.name);

    res.render("auctionSingle", { products: products[0] });
    logger.log("info", "Auction fetched successfully");
  } catch (error) {
    logger.log("error", error.message);
    // console.error(error);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};
