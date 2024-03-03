import pool from "../../../db.js";

export const createProduct = async (req, res) => {
  try {
    let { name, description, price, quantity, product_type } = req.body;
    console.log("Description", description);
    console.log(price);
    console.log(quantity);
    console.log(product_type);

    let photos = req.file.filename;

    // let photos = req.files;

    console.log(photos);

    const data = [name, price, quantity, description, product_type, photos];
    console.log(data);
    const query = `INSERT INTO  "product" (name, price, quantity, description, product_type, photos)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `;
    const result = await pool.query(query, data);

    console.log(result.rows[0]);

    // console.log(product);

    res.send(
      `<script>alert("Product added successfully!"); window.location.href = "/admin/products";</script>`
    );
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name, sortBy, filterBy } = req.query;

    console.log(name);
    console.log(sortBy);
    console.log(filterBy);

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
      return res.render("products", {
        products: [],
        message: "No products found",
      });
    } else {
      // Products found
      return res.render("products", { products });
    }
  } catch (error) {
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
  } catch (error) {
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

    console.log("Updated Product:", updatedProduct);
  } catch (error) {
    // Handle errors
    console.error("Error updating product:", error);
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
  } catch (error) {
    console.error(error);
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
      return res.send("Product not found");
    }

    if (!productToBid.is_limited) {
      return res.send("Bidding is not available for this product");
    }

    if (bidAmount <= productToBid.highest_bid_amount) {
      return res.send(
        "<script>alert('Bid amount should be greater than current highest bidding amount');window.location=document.referrer;</script>"
      );
    }

    if (new Date() > productToBid.expiry_date) {
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
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.send("Internal server error");
  }
};
