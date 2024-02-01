import { Product } from "../Model/model.js";

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    //save to database
    const product = await Product.create(data);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getOutOfStock = async (req, res) => {
  try {
    //get products having quantity less than 1
    const outOfStock = await Product.find({ quantity: { $lt: 1 } });
    res.json({
      success: true,
      data: outOfStock,
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Error getting out-of-stock products",
    });
  }
};

export const updateProducts = async (req, res) => {
  //get id from params
  const id = req.params.id;
  const newData = req.body;
  try {
    //update
    const updatedProduct = await Product.findByIdAndUpdate(id, newData, {
      new: true,
    });
    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const changeQuantity = async (req, res) => {
  //get id from params
  const id = req.params.id;
  const { quantity } = req.body;
  try {
    //update quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { quantity },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name, description, sortBy, filterBy } = req.query;
    //get all products
    const products = await Product.find();
    //filter products with query conditions
    const filteredProducts = products
      .filter((product) => {
        // Filter by name
        if (name && !product.name.toLowerCase().includes(name.toLowerCase())) {
          return false;
        }

        // Filter by description
        if (
          description &&
          !product.description.toLowerCase().includes(description.toLowerCase())
        ) {
          return false;
        }

        // Filter by productType
        if (
          filterBy &&
          product.productType.toLowerCase() !== filterBy.toLowerCase()
        ) {
          return false;
        }
        // finally add into list
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") {
          return a.price - b.price;
        } else {
          return a.productType[sortBy] - b.productType[sortBy];
        }
      });

    if (filteredProducts.length === 0) {
      // No products found based on the search criteria
      res.json({
        success: false,
        error: "No products found matching the specified criteria.",
      });
    } else {
      // Products found
      res.json({
        success: true,
        data: filteredProducts,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    //delete all
    await Product.deleteMany({});
    res.json({
      success: true,
      message: "All products deleted successfully.",
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  //get id from params
  const id = req.params.id;

  try {
    //delete product with that id
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      data: deletedProduct,
    });
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
    const product = await Product.findById(id);

    if (product) {
      res.json({
        success: true,
        data: product,
      });
    } else {
      throw Error;
    }
  } catch (error) {
    res.json({
      success: false,
      error: `No product with the id ${id}`,
    });
  }
};
