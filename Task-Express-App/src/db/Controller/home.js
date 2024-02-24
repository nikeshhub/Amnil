import { Product } from "../Model/model.js";

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isLimited: false });
    const featuredProducts = products.slice(0, 4);
    const auctionProducts = await Product.find({ isLimited: true });
    const auctionFeaturedProducts = auctionProducts.slice(0, 4);

    res.render("home", {
      products: featuredProducts,
      auctionProducts: auctionFeaturedProducts,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};
