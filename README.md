# ShopVerse – Complete Online Shopping Destination 🛍️

**ShopVerse** is a modern, production-style, multi-category full-stack e-commerce web application built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT**, **bcrypt**, **Multer**, **Bootstrap 5**, **HTML5**, **CSS3**, **JavaScript ES6+**, and the native **Fetch API**.

---

## 🌟 Key Features

- 👗 **18 Full Shopping Categories**: Women's Fashion, Men's Fashion, Kids & Baby, Shoes & Footwear, Bags & Luggage, Jewellery & Accessories, Beauty & Personal Care, Electronics, Mobile Accessories, Home & Kitchen, Furniture, Grocery, Sports & Fitness, Books, Toys & Games, Pet Supplies, Watches, and Dresses.
- 🔐 **Authentication & Security**: JWT-based authorization, bcrypt password hashing, session persistent logins, and protected admin routes.
- 🔍 **Live Search & Autocomplete**: Real-time MongoDB regex search with instant suggestions and search results page.
- 🎛️ **Multi-Faceted Sidebar Filters & Sorting**: Filter products by Category, Subcategory, Price Range, Brands, Ratings, Discount, and Stock availability. Sort by Popularity, Price (Low/High), Rating, Newest, and Discount.
- 🛒 **Database-Synced Shopping Cart**: Persistent MongoDB cart per user that retains items, quantities, and selected size/color options across sessions.
- ❤️ **Saved Wishlist**: Add/remove products from Wishlist with seamless "Move to Cart" action.
- 🚚 **3-Step Checkout Process**: Address Selection / Add New Address, Delivery Speed Selection (Standard vs Express), and Payment Method simulation (COD, UPI, Cards, NetBanking).
- 📦 **Order Management & Live Tracking**: Real-time order timeline tracking (`Order Placed` -> `Confirmed` -> `Packed` -> `Shipped` -> `Out for Delivery` -> `Delivered`) and cancellation functionality.
- ⭐ **Customer Ratings & Reviews**: User product reviews with star ratings and average rating recalculations.
- 👤 **My Account Profile**: User profile details, avatar management, password change, and saved address book manager.
- ⚡ **Admin Dashboard**: Real-time KPI stats (Total Revenue, Orders, Products, Customers), low-stock alert table, full Product CRUD with Multer image uploader, Order Status modifier, and User Role manager.
- 🌙 **Dark Mode**: Theme toggle saved in `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Font Awesome, Fetch API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose (with automated In-Memory MongoDB fallback) |
| **Auth & Security** | JSON Web Tokens (JWT), bcryptjs |
| **File Uploads** | Multer |

---

## 📁 Project Structure

```
ShopVerse/
│
├── frontend/
│   ├── index.html                  # Homepage
│   ├── login.html                  # Login page
│   ├── register.html               # Registration page
│   ├── products.html               # Product catalog & filters
│   ├── product-details.html        # Product details & reviews
│   ├── category.html               # Category showcase
│   ├── cart.html                   # Shopping cart
│   ├── wishlist.html               # Saved items
│   ├── checkout.html               # 3-Step Checkout
│   ├── orders.html                 # My Orders & Tracking
│   ├── order-details.html          # Order Invoice details
│   ├── profile.html                # My Account & Address Book
│   ├── admin/
│   │   ├── dashboard.html          # Admin KPI & analytics
│   │   ├── products.html           # Admin Product CRUD
│   │   ├── orders.html             # Admin Order Status Manager
│   │   └── users.html              # Admin User Manager
│   ├── css/
│   │   └── main.css                # Custom CSS & Dark mode variables
│   └── js/
│       ├── app.js                  # Core framework, API fetcher, auth & toasts
│       ├── auth.js                 # Login & Register handler
│       ├── products.js             # Catalog filter & search logic
│       ├── product-details.js      # Variant selection & review submission
│       ├── cart.js                 # Cart operations
│       ├── wishlist.js             # Saved items
│       ├── checkout.js             # Order placement
│       ├── orders.js               # Order tracking timeline
│       ├── profile.js              # User info management
│       └── admin.js                # Admin dashboard & CRUD logic
│
├── backend/
│   ├── server.js                   # Express server entry point
│   ├── config/
│   │   └── db.js                   # MongoDB connection + Memory fallback
│   ├── models/
│   │   ├── User.js                 # User schema & addresses
│   │   ├── Category.js             # Category schema
│   │   ├── Product.js              # Product schema
│   │   ├── Cart.js                 # Cart schema
│   │   ├── Wishlist.js             # Wishlist schema
│   │   ├── Order.js                # Order schema
│   │   └── Review.js               # Review schema
│   ├── routes/                     # REST API endpoints
│   ├── middleware/                 # Auth JWT & Error Handler
│   └── uploads/                    # Uploaded image files
│
├── seed.js                         # Database seeder (100+ items across 18 categories)
├── test-api.js                     # End-to-end API testing verification script
├── package.json
├── .env.example
└── README.md
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Customer** | `user@shopverse.com` | `password123` | Cart, Wishlist, Checkout, Orders |
| **Admin** | `admin@shopverse.com` | `admin123` | Admin Dashboard, Product CRUD, Order Manager, User Roles |

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopverse
JWT_SECRET=shopverse_super_secret_jwt_key_2026_production
CLIENT_URL=http://localhost:5000
```

### 3. Seed Database
Populate MongoDB with categories, 100+ sample products, and demo accounts:
```bash
npm run seed
```

### 4. Start the Application Server
```bash
npm start
```
Open your browser and navigate to: **`http://localhost:5000`**

---

## 📡 REST API Summary

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`
- **Products**: `GET /api/products`, `GET /api/products/:id`, `GET /api/products/search`, `POST /api/products` (Admin), `PUT /api/products/:id` (Admin), `DELETE /api/products/:id` (Admin)
- **Categories**: `GET /api/categories`
- **Cart**: `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId`
- **Wishlist**: `GET /api/wishlist`, `POST /api/wishlist/:productId`, `DELETE /api/wishlist/:productId`
- **Orders**: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`
- **Reviews**: `GET /api/products/:id/reviews`, `POST /api/products/:id/reviews`
- **Admin**: `GET /api/admin/dashboard`, `GET /api/admin/orders`, `PUT /api/orders/:id/status`, `GET /api/admin/users`, `PUT /api/admin/users/:id/role`
- **Upload**: `POST /api/upload` (Multer)

---
*Created as part of Full Stack Development Internship Task 1 Project.*
