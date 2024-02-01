import fs from "fs/promises";
const jsonPath = "./src/fs/Controllers/product.json";

// Read all products
const readProducts = async () => {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Existing data couldn't be fetched");
  }
};

//Write product
const writeProducts = async (data) => {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing data to the file");
  }
};

export const createProduct = async (req, res) => {
  try {
    const newData = req.body;
    console.log(newData);

    //read previous products
    let existingData = await readProducts();

    const id = Date.now();
    const updatedData = [...existingData, { id: id, ...newData }];

    console.log(id);

    //write new product
    await writeProducts(updatedData);

    res.json({
      success: true,
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
    const products = await readProducts();
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

//Get products that are out of stock
export const getOutOfStock = async (req, res) => {
  try {
    const products = await readProducts();
    console.log(products);
    //filter products having quantity less than 1
    const outOfStock = products.filter((value) => value.quantity < 1);
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

//Update products information
export const updateProducts = async (req, res) => {
  //change id to integer
  const id = parseInt(req.params.id);
  const newData = req.body;
  try {
    const products = await readProducts();
    //get index of product to update
    const productIndex = products.indexOf((value) => value.id === id);
    console.log(productIndex);

    //update with new data
    products[productIndex] = { ...products[productIndex], ...newData };

    //save to file
    await writeProducts(products);

    res.json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Change quantity of product
export const changeQuantity = async (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  try {
    const products = await readProducts();
    const productIndex = products.findIndex((value) => value.id === id);

    //change quantity of that specific product
    products[productIndex].quantity = quantity;

    // save new quantity
    await writeProducts(products);

    res.json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//search, sort and filter products
export const searchProducts = async (req, res) => {
  try {
    //get from query
    const { name, description, sortBy, filterBy } = req.query;

    const products = await readProducts();
    //array to store filtered products
    let filteredProducts = [];

    //filter based on name
    if (name) {
      filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    //filter based on description
    if (description) {
      filteredProducts = products.filter((p) =>
        p.description.toLowerCase().includes(description.toLowerCase())
      );
    }
    //sort from low to high
    if (sortBy) {
      filteredProducts.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }
    //filter by type
    if (filterBy) {
      filteredProducts = products.filter(
        (p) => p.product_type.toLowerCase() === filterBy.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: filteredProducts,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    const products = await readProducts();
    //get count length to delete all products
    const deleteCount = products.length;
    products.splice(0, deleteCount);
    await writeProducts(products);
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

//Delete specific product
export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const products = await readProducts();
    const productIndex = products.findIndex((value) => value.id === id);

    // Delete the specific product needed to delete
    products.splice(productIndex, 1);

    // Save remaining producs to file
    await writeProducts(products);

    res.json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Get specific product
export const getSpecificProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  try {
    const products = await readProducts();
    console.log(products);
    const product = products.find((value) => value.id === id);
    console.log(product);
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
