import pool from "../../../db.js";
import logger from "../../utils/logger.js";

export const createProduct = async (req, res) => {
  try {
    let { name, description, price, quantity, product_type } = req.body;

    let photos = req.file.filename;

    const data = [name, price, quantity, description, product_type, photos];
    const query = `INSERT INTO  "product" (name, price, quantity, description, product_type, photos)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `;
    const result = await pool.query(query, data);

    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({ success: true, data: result.rows[0] });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.send(
        `<script>alert("Product added successfully!"); window.location.href = "/admin/products";</script>`
      );
    } else {
      logger.log("error", "Invalid response type");
    }

    logger.log("info", "Product added successfully.");
  } catch (error) {
    logger.log("error", error.message);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name, sortBy, filterBy } = req.query;

    let sqlQuery = "SELECT * FROM product";

    const queryParams = [];
    if (name) {
      sqlQuery += " WHERE LOWER(name) LIKE $1";
      queryParams.push(`%${name.toLowerCase()}%`);
    }
    if (filterBy) {
      if (queryParams.length === 0) {
        sqlQuery += " WHERE";
      } else {
        sqlQuery += " AND";
      }
      sqlQuery += " LOWER(product_type) = $" + (queryParams.length + 1);
      queryParams.push(filterBy.toLowerCase());
    }

    const { rows: products } = await pool.query(sqlQuery, queryParams);

    // Sorting
    if (sortBy === "price") {
      products.sort((a, b) => a.price - b.price);
    } else {
      products.sort((a, b) => {
        const sortByA = a[sortBy] || 0;
        const sortByB = b[sortBy] || 0;
        return sortByA - sortByB;
      });
    }

    if (products.length === 0) {
      // No products found
      if (process.env.RESPONSE_TYPE === "EJS") {
        return res.render("products", {
          products: [],
          message: "No products found",
        });
      } else if (process.env.RESPONSE_TYPE === "JSON") {
        return res.json({ message: "No products found" });
      } else {
        // Handle other response types or fallback
        return res.status(400).send("Unsupported response type");
      }
    } else {
      // Products found
      if (process.env.RESPONSE_TYPE === "EJS") {
        res.render("products", { products });
      } else if (process.env.RESPONSE_TYPE === "JSON") {
        res.json({ products });
      } else {
        // Handle other response types or fallback
        return res.status(400).send("Unsupported response type");
      }
      logger.log("info", "Products fetched successfully");
    }
  } catch (error) {
    logger.log("error", error.message);
    return res.json(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  // Get id from params
  const id = req.params.id;

  try {
    // Delete product with that id
    const deleteQuery = `
      DELETE FROM product
      WHERE id = $1
      RETURNING *;
    `;
    const { rows: deletedProducts } = await pool.query(deleteQuery, [id]);

    res.send(
      `<script> alert("Product deleted successfully"); window.location.href = document.referrer; </script>`
    );
    logger.log("info", "Product deleted successfully");
  } catch (error) {
    logger.log("error", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProducts = async (req, res) => {
  // Get id from params
  const id = req.params.id;
  console.log("Product ID:", id);

  let { name, description, price, quantity, product_type } = req.body;
  console.log("Data:", req.body);

  try {
    const updateQuery = `
      UPDATE product
      SET name = $1, description = $2, price = $3, quantity = $4, product_type = $5
      WHERE id = $6
      RETURNING *;
    `;

    const { rows: updatedProduct } = await pool.query(updateQuery, [
      name,
      description,
      price,
      quantity,
      product_type,
      id,
    ]);

    if (updatedProduct.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.send(
      `<script>alert("Product updated successfully"); window.location.href = "/admin/products";</script>`
    );
    logger.log("info", "Product updated successfully");

    // console.log("Updated Product:", updatedProduct);
  } catch (error) {
    // Handle errors
    logger.log("error", error.message);
    // console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const makeLimitedProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);

    const expiry_date = new Date(Date.now() + 5 * 60 * 1000);

    const updateQuery = `
      UPDATE product
      SET is_limited = TRUE, expiry_date = $1
      WHERE id = $2
      RETURNING *;
    `;

    const { rows: updatedProduct } = await pool.query(updateQuery, [
      expiry_date,
      productId,
    ]);

    if (!updatedProduct || updatedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      data: updatedProduct[0],
    });
    logger.log("info", "Product made limited successfully");
  } catch (error) {
    logger.log("error", error.message);
    // console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const bidProducts = async (req, res) => {
  try {
    const userId = req._id;
    const productId = req.params.id;
    const { bidAmount } = req.body;

    const query = `
      SELECT *
      FROM product
      WHERE id = $1;
    `;
    const { rows: products } = await pool.query(query, [productId]);
    const productToBid = products[0];

    if (!productToBid) {
      logger.log("error", "Product not found");
      return res.send("Product not found");
    }

    if (!productToBid.is_limited) {
      logger.log("error", "Bidding is not available for this product");
      return res.send("Bidding is not available for this product");
    }

    if (bidAmount <= productToBid.highest_bid_amount) {
      logger.log(
        "error",
        "Bid amount should be greater than current highest bidding amount"
      );
      return res.send(
        "<script>alert('Bid amount should be greater than current highest bidding amount');window.location=document.referrer;</script>"
      );
    }

    if (new Date() > productToBid.expiry_date) {
      logger.log("error", "Auction expired");
      return res.send(
        "<script>alert('Auction expired');window.location=document.referrer;</script>"
      );
    }

    const updateQuery = `
      UPDATE product
      SET highest_bidder = $1, highest_bid_amount = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows: updatedProducts } = await pool.query(updateQuery, [
      userId,
      bidAmount,
      productId,
    ]);
    const updatedProduct = updatedProducts[0];

    return res.send(
      "<script>alert('Bid successful');window.location=document.referrer;</script>"
    );
    logger.log("info", "Bid successful");
  } catch (error) {
    // Handle errors
    // console.error(error);
    logger.log("error", error.message);
    return res.send("Internal server error");
  }
};
