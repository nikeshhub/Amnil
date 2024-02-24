const sidebarMiddleware = async (req, res, next) => {
  //get token from cookie

  //navbar html
  const sideBarHTML = `
  <aside class="bg-gray-800 h-full w-64 fixed">
  <div class="p-4">
      <h2 class="text-white text-lg font-semibold mb-4">Admin Dashboard</h2>

      <ul>
  <li>
    <a href="/admin" class="block py-2 text-white hover:bg-gray-700">
      <i class="fas fa-tachometer-alt mr-2 text-white hover:text-gray-300"></i> <!-- Dashboard Icon -->
      Dashboard
    </a>
  </li>
  <li>
    <a href="/admin/products" class="block py-2 text-white hover:bg-gray-700">
      <i class="fas fa-box mr-2 text-white hover:text-gray-300"></i> <!-- Products Icon -->
      Products
    </a>
  </li>
  <li>
    <a href="/admin/customers" class="block py-2 text-white hover:bg-gray-700">
      <i class="fas fa-users mr-2 text-white hover:text-gray-300"></i> <!-- Customers Icon -->
      Customers
    </a>
  </li>
  <li>
    <a href="/admin/orders" class="block py-2 text-white hover:bg-gray-700">
      <i class="fas fa-shopping-cart mr-2 text-white hover:text-gray-300"></i> <!-- Orders Icon -->
      Orders
    </a>
  </li>
</ul>

    
  </div>
</aside>
    `;
  // Add the navbar HTML to response locals so that view template can access it
  res.locals.sidebar = sideBarHTML;
  next();
};

export default sidebarMiddleware;
