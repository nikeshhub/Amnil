import { Order, Product, User } from "../Model/model.js";

export const getDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const orders = await Order.find();

    res.render("dashboard", { userCount, productCount, orderCount, orders });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" });
    console.log(users);
    res.render("adminUsers", { users });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("adminProducts", { products });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("userId");
    console.log(orders);

    // console.log(orders.userId);

    orders.forEach((order) => {
      console.log("Order items:", order.items);
    });
    res.render("adminOrders", { orders });
    // console.log(orders);
    console.log("Order items", orders.items);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getAddProductsPage = (req, res) => {
  res.render("addProducts");
};

export const getEditProductsPage = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    console.log(products);
    res.render("editProducts", { products });
  } catch (error) {}
};
