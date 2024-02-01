import fs from "fs/promises";
const jsonPath = "./orders.json";

const carts = {};

const readOrders = async () => {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Existing data couldn't be fetched");
  }
};

//Write product
const writeOrders = async (data) => {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing data to the file");
  }
};

export const addToCart = async (req, res) => {
  try {
    const id = req.id;

    const { productId, quantity, price } = req.body;

    // Add your validation logic for id, productId, quantity, and price

    // Check if the user has a cart, if not, create one
    if (!carts[id]) {
      carts[id] = [];
    }

    const item = { productId, quantity, price };
    carts[id].push(item);

    res.json({
      success: true,
      message: "Product added to cart successfully",
      data: carts[id],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API to view the cart
export const getCart = async (req, res) => {
  try {
    const id = req.id;

    // Check if the user has a cart, if not, create an empty one
    if (!carts[id]) {
      carts[id] = [];
    }

    res.json(carts[id]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const makeOrder = async (req, res) => {
  try {
    const id = req.id;
    console.log(id);
    console.log(carts[id]);

    // Check if the user has a cart or if cart is empty
    if (!carts[id] || carts[id].length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // Calculate total price
    const totalPrice = carts[id].reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Check if total price meets the minimum threshold (e.g., $50)
    const minimumThreshold = 50;
    if (totalPrice < minimumThreshold) {
      return res.json({
        success: false,
        message: `Total price must be at least $${minimumThreshold} in order to checkout.`,
      });
    }

    const orderId = Date.now();

    // Create an order
    const order = {
      orderId,
      products: carts[id],
      totalPrice,
      date: new Date(),
      // status: "pending",
    };

    // Save the order
    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Clear the user's cart
    delete carts[id];

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await readOrders();
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
