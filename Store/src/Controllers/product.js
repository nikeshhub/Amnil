import { Product, Store } from "../Models/model.js";

export const createProduct = async (req, res) => {
  try {
    const userId = req._id;
    const store = await Store.findOne({ owner: userId });
    const storeId = store._id;

    const { name, price, quantity, description } = req.body;
    const productImage = `localhost:8000/${req.file.filename}`;
    const productData = {
      name,
      price,
      quantity,
      description,
      productImage,
      store: storeId,
    };
    const result = await Product.create(productData);
    res.json({
      success: true,
      message: "product added successfully!",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getProductsByStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const productsByStore = await Product.find({ store: storeId });

    res.json({
      success: true,
      message: `Products of store ${storeId} fetched successfully`,
      data: productsByStore,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
