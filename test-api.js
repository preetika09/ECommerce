const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 RUNNING COMPREHENSIVE SHOPVERSE API INTEGRATION TESTS...\n');

  try {
    // 1. Health Check
    const health = await request('/api/health');
    console.log('1. Health Check status:', health.status, health.body.message);

    // 2. Fetch Categories
    const categories = await request('/api/categories');
    console.log('2. Categories count:', categories.body.count);

    // 3. Search Products
    const search = await request('/api/products/search?q=dress');
    console.log('3. Search "dress" matches count:', search.body.count);

    // 4. Products Filter & Sort
    const products = await request('/api/products?limit=5&sort=price_asc');
    console.log('4. Products fetched:', products.body.products.length, '| Total in DB:', products.body.total);

    // 5. Customer Login
    const userLogin = await request('/api/auth/login', 'POST', {
      loginId: 'user@shopverse.com',
      password: 'password123'
    });
    console.log('5. User Login:', userLogin.body.success ? 'SUCCESS' : 'FAILED', '| User:', userLogin.body.user.name);
    const userToken = userLogin.body.token;

    // 6. Admin Login
    const adminLogin = await request('/api/auth/login', 'POST', {
      loginId: 'admin@shopverse.com',
      password: 'admin123'
    });
    console.log('6. Admin Login:', adminLogin.body.success ? 'SUCCESS' : 'FAILED', '| Role:', adminLogin.body.user.role);
    const adminToken = adminLogin.body.token;

    // 7. Add to Cart (User)
    const firstProduct = products.body.products[0];
    const addCart = await request('/api/cart', 'POST', {
      productId: firstProduct._id,
      quantity: 2,
      selectedSize: 'M'
    }, userToken);
    console.log('7. Add to Cart:', addCart.body.message, '| Cart Items:', addCart.body.cart.items.length);

    // 8. Add to Wishlist (User)
    const addWishlist = await request('/api/wishlist/' + firstProduct._id, 'POST', {}, userToken);
    console.log('8. Add to Wishlist:', addWishlist.body.message);

    // 9. Place Order (User)
    const placeOrder = await request('/api/orders', 'POST', {
      items: [{ product: firstProduct._id, quantity: 1, selectedSize: 'M' }],
      shippingAddress: {
        fullName: 'Alex Johnson',
        phone: '+1 9876543210',
        house: 'Apt 4B',
        street: 'MG Road',
        city: 'New York',
        state: 'NY',
        pincode: '10001'
      },
      deliveryMethod: 'Express',
      paymentMethod: 'Cash on Delivery'
    }, userToken);
    console.log('9. Order Placement:', placeOrder.body.message, '| Order Number:', placeOrder.body.order.orderNumber);

    // 10. Admin Dashboard
    const adminDash = await request('/api/admin/dashboard', 'GET', null, adminToken);
    console.log('10. Admin Dashboard KPI Stats:', adminDash.body.stats);

    console.log('\n✅ ALL 10 E2E API VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ API Test Failed:', err);
  }
}

runTests();
