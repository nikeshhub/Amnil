import { Product } from "../Model/model.js";

export const createProduct = async (req, res) => {
  try {
    let { name, description, price, quantity, product_type } = req.body;
    console.log(description);
    console.log(price);
    console.log(quantity);
    console.log(product_type);

    let photos = req.files.map((value, i) => {
      return value.filename;
    });

    // let photos = req.files;
    console.log(photos);

    const data = {
      name,
      description,
      price,
      quantity,
      product_type,
      photos,
    };
    console.log(data);
    //save to database
    const product = await Product.create(data);

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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isLimited: false });
    console.log(products);
    console.log("Products:", products);
    res.render("products", { products });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const showProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({
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
  console.log("Product ID:", id);
  let { name, description, price, quantity, product_type } = req.body;
  console.log("Data:", req.body);
  const newData = {
    name,
    description,
    price,
    quantity,
    product_type,
  };
  try {
    //update
    const updatedProduct = await Product.findByIdAndUpdate(id, newData, {
      new: true,
    });
    res.send(
      `<script>alert("Product updated successfully"); window.location.href = "/admin/products";</script>`
    );

    console.log(updatedProduct);
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
    const { name, sortBy, filterBy } = req.query;

    console.log(name);
    console.log(sortBy);
    console.log(filterBy);

    //get all products
    let products = await Product.find();

    //filter products with query conditions
    if (name) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (filterBy) {
      products = products.filter(
        (product) =>
          product.product_type.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === "price") {
      products.sort((a, b) => a.price - b.price);
    } else {
      products.sort((a, b) => {
        if (a.productType[sortBy] && b.productType[sortBy]) {
          return a.productType[sortBy] - b.productType[sortBy];
        }
        // Handle cases where productType may not be there
        return 0;
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

    res.send(
      `<script> alert("Product deleted successfully"); window.location.href = document.referrer; </script>`
    );
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const makeLimitedProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        isLimited: true,
        expiryDate: new Date(Date.now() + 3 * 60 * 1000),
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bidProducts = async (req, res) => {
  try {
    const userId = req._id;
    const productId = req.params.id;
    const { bidAmount } = req.body;

    const productToBid = await Product.findById(productId);
    if (!productToBid) {
      return res.send("Product not found");
    }

    if (!productToBid.isLimited) {
      return res.send("Bidding is not available for this product");
    }

    if (bidAmount <= productToBid.highestBid.bidAmount) {
      return res.send(
        "<script>alert('Bid amount should be greater than current highest bidding amount');window.location=document.referrer;</script>"
      );
    }
    if (new Date() > productToBid.expiryDate) {
      return res.send(
        "<script>alert('Auction expired');window.location=document.referrer;</script>"
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        "highestBid.bidder": userId,
        "highestBid.bidAmount": bidAmount,
      },
      { new: true }
    );

    // Send response indicating success
    return res.send(
      "<script>alert('Bid successful');window.location=document.referrer;</script>"
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.send("Internal server error");
  }
};

export const getAuctionPage = async (req, res) => {
  try {
    const products = await Product.find({ isLimited: true });
    products.forEach((product) => {
      const timeRemaining = product.expiryDate - new Date();
      product.expiresIn = Math.max(0, Math.floor(timeRemaining / 1000));
    });
    res.render("auctionProducts", { products });
  } catch (error) {
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
    const product = await Product.findById(id);
    console.log(product);
    console.log(product.photos[0]);

    if (product) {
      res.render("auctionSingle", { product });
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
export const getSpecificProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    console.log(product.photos[0]);

    if (product) {
      res.render("singleProduct", { product });
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
