import pool from "../../../db.js";
import logger from "../../utils/logger.js";

export const getDashboard = async (req, res) => {
  try {
    const userCountQuery = await pool.query(`SELECT COUNT(*) FROM "user"`);
    const productCountQuery = await pool.query("SELECT COUNT(*) FROM product");
    const orderCountQuery = await pool.query(`SELECT COUNT(*) FROM "order"`);

    const userCount = userCountQuery.rows[0].count;
    const productCount = productCountQuery.rows[0].count;
    const orderCount = orderCountQuery.rows[0].count;

    res.render("dashboard", { userCount, productCount, orderCount });
    logger.log("info", "Dashboard loaded successfully.");
  } catch (error) {
    logger.log("error", "Error fetching counts:", error);
    // console.error("Error fetching counts:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUsers = async (req, res) => {
  try {
    const role = "customer";
    const usersQuery = await pool.query(
      `SELECT * FROM "user" WHERE role = $1`,
      [role]
    );
    const users = usersQuery.rows;
    // console.log("users");
    res.render("adminUsers", { users });
    logger.log("info", "Users loaded successfully.");
  } catch (error) {
    logger.log("error", "Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};
export const getProducts = async (req, res) => {
  try {
    const productsQuery = await pool.query("SELECT * FROM product");
    const products = productsQuery.rows;
    res.render("adminProducts", { products });
    logger.log("info", "Products loaded successfully.");
  } catch (error) {
    logger.log("error", "Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getOrders = async (req, res) => {
  try {
    const ordersQuery = `
        SELECT
          o.id AS order_id,
          u.name AS user_name,
          u.address AS user_address,
          o.total_price,
          jsonb_agg(jsonb_build_object(
              'product_name', p.name,
              'quantity', oi.quantity
          )) AS order_items
        FROM
          "order" o
        JOIN
          "user" u ON o.user_id = u.id
        JOIN
          order_items oi ON o.id = oi.order_id
        JOIN
          product p ON oi.product_id = p.id
        GROUP BY
          o.id, u.name, u.address, o.total_price;
      `;

    const { rows: orders } = await pool.query(ordersQuery);

    // Log order_items for each order
    orders.forEach((order) => {
      console.log("Order ID:", order.order_id);
      console.log("Order Items:", order.order_items);
    });

    res.render("adminOrders", { orders });
    logger.log("info", "Orders loaded successfully.");
  } catch (error) {
    // console.error(error);
    logger.log("error", "Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
};
