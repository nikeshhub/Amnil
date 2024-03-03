import pool from "../../../db.js";
import logger from "../../utils/logger.js";

export let getRegisterPage = (req, res) => {
  res.render("register");
};

export let getLoginPage = (req, res) => {
  res.render("login");
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
    res.render("products", { products });
  } catch (error) {
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
    } else {
      throw new Error(`No product with the id ${id}`);
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req._id;
    console.log("UserID", userId);

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
    console.log(cartItems);

    res.render("cart", { cart: cartItems, totalPrice });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getAddProductsPage = (req, res) => {
  res.render("addProducts");
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
  } catch (error) {
    console.error("Error fetching product:", error);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSpecificAuction = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const query = `
      SELECT *
      FROM product
      WHERE id = $1;
    `;

    const { rows: products } = await pool.query(query, [id]);
    console.log(products);
    console.log(products.name);

    res.render("auctionSingle", { products: products[0] });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};
