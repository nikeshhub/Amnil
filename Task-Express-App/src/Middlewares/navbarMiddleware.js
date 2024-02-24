import jwt from "jsonwebtoken";
import { Cart } from "../db/Model/model.js";

const navbarMiddleware = async (req, res, next) => {
  //get token from cookie
  const token = req.cookies.token;
  console.log(token);
  //initialize cart lkength to 0
  let cartLength = 0;

  if (token) {
    const infoObj = await jwt.verify(token, process.env.SECRET_KEY);

    //get user id
    const userId = infoObj._id;

    const cart = await Cart.findOne({ userId });
    console.log(cart);
    // If cart exists, show length, else 0
    cartLength = cart ? cart.items.length : 0;
  }
  //navbar html
  const navbarHtml = `
    <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo on left -->
      <div class="flex items-center">
        <a href="/" class="text-white text-lg font-bold">Sapkota Ecommerce</a>
      </div>

      <!-- Navigation items in the middle -->
      <div class="flex-grow text-white text-lg">
        <ul class="flex justify-center space-x-4">
          <li><a href="/" class="hover:text-gray-300">Home</a></li>
          <li>
            <a href="/product" class="hover:text-gray-300">Products</a>
          </li>
          <li>
            <a href="/product/auction" class="hover:text-gray-300">Auction</a>
          </li>
         
        </ul>
      </div>

      <!-- Cart and user icons on right -->
      <div class="flex items-center">
        <!-- Cart -->
        <div class="relative mr-4">
          <a href="/cart" class="text-white"
            ><i class="fas fa-shopping-cart"></i
          ></a>
          <!-- Badge for cart items count -->
          <div
            class="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center"
          >
            ${cartLength}
          </div>
        </div>

        <!-- User -->
        <div class="relative">
          <a href="/user" class="text-white"><i class="fas fa-user"></i></a>
          <!-- Notification dot for new messages or notifications -->
          <div
            class="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 rounded-full h-2 w-2"
          ></div>
        </div>
      </div>
    </div>
  </nav>
    `;
  // Add the navbar HTML to response locals so that view template can access it
  res.locals.navbar = navbarHtml;
  next();
};

export default navbarMiddleware;
