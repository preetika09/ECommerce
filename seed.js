const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./backend/models/User');
const Category = require('./backend/models/Category');
const Product = require('./backend/models/Product');
const Cart = require('./backend/models/Cart');
const Wishlist = require('./backend/models/Wishlist');
const Order = require('./backend/models/Order');
const Review = require('./backend/models/Review');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopverse';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB for Seeding...');
  } catch (err) {
    console.log('Using In-Memory MongoDB for Seeding...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  }
};

const categories = [
  {
    name: "Women's Fashion",
    slug: "womens-fashion",
    description: "Trendy clothing, ethnic wear, dresses, kurtis, and activewear for women.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Dresses", "Sarees", "Kurtis", "Tops", "Jeans", "Ethnic Wear", "Jackets", "Activewear", "Nightwear"]
  },
  {
    name: "Men's Fashion",
    slug: "mens-fashion",
    description: "Stylish t-shirts, formal shirts, denim jeans, suits, hoodies, and ethnic wear for men.",
    image: "https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?auto=format&fit=crop&w=600&q=80",
    subcategories: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Hoodies", "Suits", "Ethnic Wear", "Activewear"]
  },
  {
    name: "Kids & Baby",
    slug: "kids-baby",
    description: "Cute apparel for boys & girls, baby care, diapers, toys, and school essentials.",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Girls Clothing", "Boys Clothing", "Baby Clothing", "Kids Shoes", "School Bags", "Baby Care"]
  },
  {
    name: "Shoes & Footwear",
    slug: "shoes-footwear",
    description: "Sneakers, sports shoes, heels, formal shoes, sandals, and boots for all.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Sneakers", "Sports Shoes", "Formal Shoes", "Heels", "Sandals", "Boots", "Slippers"]
  },
  {
    name: "Bags & Luggage",
    slug: "bags-luggage",
    description: "Handbags, laptop backpacks, travel suitcases, tote bags, and sleek wallets.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Handbags", "Backpacks", "Laptop Bags", "Travel Bags", "Suitcases", "Wallets", "Clutches"]
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    description: "Designer earrings, necklaces, luxury watches, sunglasses, rings, and hair accessories.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Earrings", "Necklaces", "Bracelets", "Rings", "Sunglasses", "Belts"]
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Makeup, skincare, perfumes, face washes, moisturizers, and hair grooming products.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Makeup", "Lipstick", "Skincare", "Face Wash", "Moisturizers", "Perfume", "Hair Care"]
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smartphones, laptops, wireless earbuds, smartwatches, cameras, and audio gear.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Smartphones", "Laptops", "Tablets", "Headphones", "Earbuds", "Smart Watches", "Cameras"]
  },
  {
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Protective cases, fast chargers, power banks, cables, and screen guards.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Mobile Covers", "Chargers", "Power Banks", "Cables", "Screen Guards", "Phone Stands"]
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Premium cookware, kitchen appliances, luxury bedsheets, curtains, and lighting.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Cookware", "Kitchen Appliances", "Storage", "Home Decor", "Lighting", "Bedsheets"]
  },
  {
    name: "Furniture",
    slug: "furniture",
    description: "Modern sofas, ergonomic chairs, dining tables, wooden beds, and wardrobes.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Sofas", "Chairs", "Tables", "Beds", "Wardrobes", "Study Tables"]
  },
  {
    name: "Grocery",
    slug: "grocery",
    description: "Fresh fruits, vegetables, daily snacks, beverages, organic pulses, oils, and spices.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Snacks", "Beverages", "Rice", "Pulses", "Spices", "Cooking Oil", "Packaged Foods"]
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Gym equipment, yoga mats, sportswear, cricket equipment, and cycling accessories.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Gym Equipment", "Yoga Products", "Sportswear", "Cricket", "Football", "Badminton"]
  },
  {
    name: "Books",
    slug: "books",
    description: "Bestselling fiction novels, academic textbooks, self-help guides, and tech manuals.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Novels", "Academic Books", "Self Help", "Technology", "Children Books"]
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Fun educational toys, strategy board games, dolls, action figures, and RC cars.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Educational Toys", "Board Games", "Dolls", "Action Figures", "Remote Control Toys"]
  },
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    description: "Nutritious pet food, chew toys, grooming kits, collars, and pet beds.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Pet Food", "Pet Toys", "Pet Accessories", "Pet Care"]
  },
  {
    name: "Watches",
    slug: "watches",
    description: "Elegant wristwatches, smart fitness watches, chronograph analogs, and luxury timepieces.",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Analog Watches", "Smartwatches", "Digital Watches", "Luxury Watches"]
  },
  {
    name: "Dresses",
    slug: "dresses",
    description: "Elegant party dresses, casual summer maxis, floral prints, and cocktail gowns.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    subcategories: ["Party Wear", "Maxi Dresses", "Casual Dresses", "Cocktail Gowns"]
  }
];

const generateProducts = () => {
  const prods = [];

  // 1. Women's Fashion (15 Products)
  const wfItems = [
    { name: "Floral A-Line Midi Dress", brand: "Zara", price: 1899, original: 3499, sub: "Dresses", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Floral Pink", "Navy Blue"] },
    { name: "Traditional Chanderi Silk Saree", brand: "Biba", price: 2999, original: 5999, sub: "Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["Royal Blue", "Golden Red"] },
    { name: "Embroidered Anarkali Kurti", brand: "FabIndia", price: 1499, original: 2999, sub: "Kurtis", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Emerald Green", "Maroon"] },
    { name: "Casual Cotton Ribbed Top", brand: "H&M", price: 699, original: 1299, sub: "Tops", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", sizes: ["XS", "S", "M", "L"], colors: ["White", "Black", "Olive"] },
    { name: "High-Waist Stretch Denim Jeans", brand: "Levi's", price: 2199, original: 3999, sub: "Jeans", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80", sizes: ["28", "30", "32", "34"], colors: ["Dark Wash", "Light Blue"] },
    { name: "Faux Leather Moto Jacket", brand: "Mango", price: 3499, original: 6999, sub: "Jackets", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Black", "Brown"] },
    { name: "Seamless Workout Leggings & Top Set", brand: "Puma", price: 1799, original: 2999, sub: "Activewear", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Charcoal", "Burgundy"] },
    { name: "Satin Printed Nightwear Set", brand: "Enamor", price: 1199, original: 1999, sub: "Nightwear", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Rose Gold", "Navy"] },
    { name: "Designer Georgette Party Gown", brand: "Biba", price: 4499, original: 8999, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Teal Blue", "Magenta"] },
    { name: "Chiffon Pleated A-Line Skirt", brand: "Forever 21", price: 999, original: 1799, sub: "Tops", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Beige", "Black"] },
    { name: "Casual Denim Overalls Dress", brand: "Roadster", price: 1299, original: 2499, sub: "Dresses", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Blue Denim"] },
    { name: "Knitted Oversized Winter Sweater", brand: "ONLY", price: 1699, original: 2999, sub: "Jackets", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["Cream", "Mustard"] },
    { name: "Casual Striped Cotton T-Shirt", brand: "Max", price: 499, original: 899, sub: "Tops", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["White/Navy"] },
    { name: "Banarasi Art Silk Dupatta Set", brand: "W for Woman", price: 1899, original: 3299, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["Golden Yellow"] },
    { name: "Formal Tailored Blazer", brand: "Allen Solly", price: 2999, original: 4999, sub: "Jackets", img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Black", "Grey"] }
  ];
  wfItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `High quality ${i.name} designed with premium fabric and precision detail for comfortable all-day wearing.`,
      category: "Women's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 15,
      specifications: { Fabric: "Premium Cotton Blend", Pattern: "Modern", Care: "Machine Wash Cold" }
    });
  });

  // 2. Men's Fashion (15 Products)
  const mfItems = [
    { name: "Classic Slim Fit Polo T-Shirt", brand: "Tommy Hilfiger", price: 1299, original: 2499, sub: "T-Shirts", img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Navy", "White", "Red"] },
    { name: "Formal Oxford Cotton Shirt", brand: "Arrow", price: 1599, original: 2999, sub: "Shirts", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL", "XXL"], colors: ["Sky Blue", "White"] },
    { name: "501 Original Fit Jeans", brand: "Levi's", price: 2499, original: 4499, sub: "Jeans", img: "https://images.unsplash.com/photo-1542272604-780c96856553?auto=format&fit=crop&w=600&q=80", sizes: ["30", "32", "34", "36"], colors: ["Dark Indigo", "Washed Blue"] },
    { name: "Fleece Casual Pullover Hoodie", brand: "Nike", price: 2299, original: 3999, sub: "Hoodies", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Grey", "Black"] },
    { name: "Tailored 2-Piece Formal Suit", brand: "Raymond", price: 6999, original: 12999, sub: "Suits", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80", sizes: ["38R", "40R", "42R"], colors: ["Charcoal Grey", "Black"] },
    { name: "Cotton Blend Festive Kurta Pyjama", brand: "Manyavar", price: 2499, original: 4999, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Off-White", "Maroon"] },
    { name: "Lightweight Puffer Winter Jacket", brand: "Columbia", price: 3499, original: 6499, sub: "Jackets", img: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Black", "Olive"] },
    { name: "Slim Fit Stretch Chino Trousers", brand: "Dockers", price: 1799, original: 2999, sub: "Trousers", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80", sizes: ["30", "32", "34"], colors: ["Khaki", "Beige"] },
    { name: "Graphic Printed Crewneck Tee", brand: "Puma", price: 699, original: 1299, sub: "T-Shirts", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"] },
    { name: "Casual Linen Short Sleeve Shirt", brand: "US Polo", price: 1399, original: 2399, sub: "Shirts", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Olive Green", "Salmon"] },
    { name: "Athletic Dri-FIT Training Track Pants", brand: "Adidas", price: 1599, original: 2799, sub: "Activewear", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Black", "Navy"] },
    { name: "Classic Denim Button-Down Shirt", brand: "Wrangler", price: 1699, original: 2999, sub: "Shirts", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Light Blue Denim"] },
    { name: "V-Neck Merino Wool Sweater", brand: "Van Heusen", price: 1899, original: 3499, sub: "Hoodies", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Navy Blue", "Burgundy"] },
    { name: "Casual Bermuda Cargo Shorts", brand: "Roadster", price: 899, original: 1599, sub: "Trousers", img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80", sizes: ["30", "32", "34"], colors: ["Camouflage", "Khaki"] },
    { name: "Nehru Jacket Waistcoat Set", brand: "Peter England", price: 2199, original: 3999, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", sizes: ["38", "40", "42"], colors: ["Royal Blue", "Golden"] }
  ];
  mfItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Premium ${i.name} meticulously crafted for style, durability, and comfort.`,
      category: "Men's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 12,
      specifications: { Material: "100% Premium Cotton", Fit: "Regular / Slim", WashCare: "Machine Washable" }
    });
  });

  // 3. Kids & Baby (15 Products)
  const kidsItems = [
    { name: "Cute Animal Print Cotton Onesie", brand: "Mothercare", price: 599, original: 1199, sub: "Baby Clothing", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", sizes: ["0-3M", "3-6M", "6-12M"], colors: ["Yellow", "White"] },
    { name: "Boys Party Suit Blazer Set", brand: "FirstCry", price: 1499, original: 2999, sub: "Boys Clothing", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80", sizes: ["2-3Y", "4-5Y", "6-7Y"], colors: ["Navy Blue"] },
    { name: "Girls Floral Tulle Party Dress", brand: "Hopscotch", price: 1299, original: 2499, sub: "Girls Clothing", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80", sizes: ["3-4Y", "5-6Y", "7-8Y"], colors: ["Soft Pink"] },
    { name: "Ergonomic Primary School Backpack", brand: "Skybags Kids", price: 899, original: 1799, sub: "School Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", sizes: ["Standard"], colors: ["Superhero Blue", "Unicorn Pink"] },
    { name: "Hypoallergenic Baby Wipes (Pack of 3)", brand: "Pampers", price: 399, original: 699, sub: "Baby Care", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80", sizes: ["Pack of 3"], colors: ["White"] },
    { name: "Toddler Light-Up Running Sneakers", brand: "Skechers Kids", price: 1899, original: 3299, sub: "Kids Shoes", img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80", sizes: ["UK 6K", "UK 7K", "UK 8K"], colors: ["Multicolor"] },
    { name: "Soft Cotton Sleepsuits 3-Pack", brand: "Carter's", price: 1199, original: 2199, sub: "Baby Clothing", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80", sizes: ["3-6M", "6-9M"], colors: ["Pastel Blue", "Mint Green"] },
    { name: "Girls Denim Dungaree Shorts", brand: "Max Kids", price: 799, original: 1499, sub: "Girls Clothing", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80", sizes: ["4-5Y", "6-7Y"], colors: ["Light Blue"] },
    { name: "Boys Marvel Avengers T-Shirt", brand: "Marvel", price: 449, original: 899, sub: "Boys Clothing", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80", sizes: ["5-6Y", "7-8Y", "9-10Y"], colors: ["Red", "Black"] },
    { name: "Ultra-Soft Newborn Baby Blanket", brand: "LuvLap", price: 499, original: 999, sub: "Baby Care", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["Sky Blue", "Pink"] },
    { name: "Pampers Active Baby Diapers (74 Count)", brand: "Pampers", price: 999, original: 1499, sub: "Baby Care", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["White"] },
    { name: "Kids Canvas Slip-On Shoes", brand: "Bata Kids", price: 599, original: 1099, sub: "Kids Shoes", img: "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?auto=format&fit=crop&w=600&q=80", sizes: ["UK 9K", "UK 10K"], colors: ["Red", "Navy"] },
    { name: "Silicone Baby Feeding Bottle Set", brand: "Avent", price: 899, original: 1599, sub: "Baby Care", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", sizes: ["260ml"], colors: ["Transparent"] },
    { name: "Cute Teddy Bear Printed Hooded Towel", brand: "Chicco", price: 649, original: 1199, sub: "Baby Care", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["White", "Yellow"] },
    { name: "Boys Hooded Tracksuit Set", brand: "Allen Solly Junior", price: 1399, original: 2599, sub: "Boys Clothing", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80", sizes: ["6-7Y", "8-9Y"], colors: ["Grey/Black"] }
  ];
  kidsItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Gentle and vibrant ${i.name} crafted keeping kids' safety and comfort top priority.`,
      category: "Kids & Baby", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 20,
      specifications: { Material: "Non-Toxic Organic Cotton", Safety: "BPA Free", Wash: "Gentle Cycle" }
    });
  });

  // 4. Shoes & Footwear (15 Products)
  const shoeItems = [
    { name: "Air Max Revolution Running Shoes", brand: "Nike", price: 4299, original: 7999, sub: "Sports Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9", "UK 10"], colors: ["Red/White", "Black"] },
    { name: "Ultraboost Lightweight Sneakers", brand: "Adidas", price: 5499, original: 9999, sub: "Sneakers", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["All Black", "Grey"] },
    { name: "Genuine Leather Formal Derby Shoes", brand: "Clarks", price: 3499, original: 6499, sub: "Formal Shoes", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9", "UK 10"], colors: ["Tan Brown", "Black"] },
    { name: "Stiletto Ankle Strap High Heels", brand: "Aldo", price: 2999, original: 5999, sub: "Heels", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 4", "UK 5", "UK 6"], colors: ["Nude", "Red"] },
    { name: "Classic Suede Chelsea Boots", brand: "Woodland", price: 3899, original: 6999, sub: "Boots", img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9", "UK 10"], colors: ["Camel Brown", "Black"] },
    { name: "Casual Comfort Slip-On Loafers", brand: "Bata", price: 1299, original: 2299, sub: "Sandals", img: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["Brown", "Black"] },
    { name: "Retro Unisex Canvas High-Tops", brand: "Converse", price: 2499, original: 3999, sub: "Sneakers", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80", sizes: ["UK 6", "UK 7", "UK 8", "UK 9"], colors: ["Classic Black", "White"] },
    { name: "Cushioned Memory Foam Walking Shoes", brand: "Puma", price: 2199, original: 3999, sub: "Sports Shoes", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["Navy Blue", "Grey"] },
    { name: "Chic Block Heel Gladiator Sandals", brand: "Metro", price: 1599, original: 2999, sub: "Sandals", img: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80", sizes: ["UK 5", "UK 6", "UK 7"], colors: ["Gold", "Silver"] },
    { name: "Waterproof Hiking Trekking Boots", brand: "Decathlon", price: 3199, original: 5499, sub: "Boots", img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9", "UK 10"], colors: ["Khaki", "Grey"] },
    { name: "Slip-Resistant Beach Flip-Flops", brand: "Crocs", price: 999, original: 1999, sub: "Slippers", img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["Navy", "Black"] },
    { name: "Women's Comfort Cushioned Flat Sandals", brand: "Red Tape", price: 899, original: 1799, sub: "Sandals", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 5", "UK 6", "UK 7"], colors: ["Tan", "White"] },
    { name: "Monk Strap Italian Leather Shoes", brand: "Louis Philippe", price: 4499, original: 7999, sub: "Formal Shoes", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9"], colors: ["Burgundy", "Black"] },
    { name: "Breathable Mesh Gym Shoes", brand: "Reebok", price: 2699, original: 4999, sub: "Sports Shoes", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9", "UK 10"], colors: ["Black/Neon", "Grey"] },
    { name: "Plush Indoor Bedroom Slippers", brand: "Solethreads", price: 499, original: 999, sub: "Slippers", img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8"], colors: ["Grey", "Navy"] }
  ];
  shoeItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `High-durability ${i.name} crafted with superior sole grip and ergonomic arch support.`,
      category: "Shoes & Footwear", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 18,
      specifications: { UpperMaterial: "Synthetic / Leather", Sole: "Rubber Grip", Warranty: "6 Months" }
    });
  });

  // 5. Bags & Luggage (15 Products)
  const bagItems = [
    { name: "Leather Structured Satchel Handbag", brand: "Michael Kors", price: 5999, original: 11999, sub: "Handbags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", sizes: ["Medium"], colors: ["Tan", "Black"] },
    { name: "15.6 Inch Water-Resistant Laptop Backpack", brand: "American Tourister", price: 1499, original: 2999, sub: "Laptop Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", sizes: ["28L"], colors: ["Navy Blue", "Black"] },
    { name: "Hard Shell Cabin Luggage Suitcase", brand: "Samsonite", price: 6499, original: 12999, sub: "Suitcases", img: "https://images.unsplash.com/photo-1565026057447-ba90a3d07d6b?auto=format&fit=crop&w=600&q=80", sizes: ["55 cm (Cabin)"], colors: ["Silver", "Teal"] },
    { name: "Canvas Everyday Tote Bag", brand: "Baggit", price: 899, original: 1699, sub: "Tote Bags", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", sizes: ["Large"], colors: ["Beige", "Striped"] },
    { name: "Genuine Leather Bifold Wallet", brand: "Fossil", price: 1299, original: 2499, sub: "Wallets", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80", sizes: ["Standard"], colors: ["Dark Brown", "Black"] },
    { name: "Large Duffle Travel Gym Bag", brand: "Puma", price: 1199, original: 2299, sub: "Travel Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", sizes: ["35L"], colors: ["Black/Red"] },
    { name: "Chic Metallic Evening Party Clutch", brand: "Lavie", price: 999, original: 1999, sub: "Clutches", img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80", sizes: ["Small"], colors: ["Rose Gold", "Silver"] },
    { name: "Anti-Theft Commuter Backpack", brand: "Wildcraft", price: 1799, original: 3299, sub: "Backpacks", img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80", sizes: ["30L"], colors: ["Grey", "Black"] },
    { name: "Vegan Leather Sling Crossbody Bag", brand: "Caprese", price: 1399, original: 2699, sub: "Handbags", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", sizes: ["Compact"], colors: ["Mustard", "Coral"] },
    { name: "Check-in Trolley Suitcase Set of 2", brand: "Safari", price: 7999, original: 15999, sub: "Suitcases", img: "https://images.unsplash.com/photo-1565026057447-ba90a3d07d6b?auto=format&fit=crop&w=600&q=80", sizes: ["Medium + Large"], colors: ["Blue", "Red"] },
    { name: "Convertible Briefcase Messenger Bag", brand: "Tommy Hilfiger", price: 2999, original: 5499, sub: "Laptop Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", sizes: ["15 Inch"], colors: ["Brown"] },
    { name: "Printed Boho Shoulder Bag", brand: "FabIndia", price: 799, original: 1499, sub: "Handbags", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", sizes: ["Medium"], colors: ["Multi"] },
    { name: "Minimalist RFID Blocking Card Holder", brand: "Titan", price: 599, original: 999, sub: "Wallets", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80", sizes: ["Slim"], colors: ["Black"] },
    { name: "Lightweight Trekking Rucksack 55L", brand: "Quechua", price: 2799, original: 4999, sub: "Backpacks", img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80", sizes: ["55L"], colors: ["Orange/Grey"] },
    { name: "Designer Shoulder Hobo Bag", brand: "Lino Perros", price: 1699, original: 3199, sub: "Handbags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", sizes: ["Medium"], colors: ["Cream", "Black"] }
  ];
  bagItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Spacious, durable, and stylish ${i.name} equipped with sturdy zippers and organized compartments.`,
      category: "Bags & Luggage", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 14,
      specifications: { Material: "Water Resistant Polyester / Leather", Warranty: "1 Year International" }
    });
  });

  // 6. Electronics (15 Products)
  const elecItems = [
    { name: "iPhone 15 Pro 128GB Titanium", brand: "Apple", price: 119900, original: 134900, sub: "Smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", sizes: ["128GB", "256GB"], colors: ["Natural Titanium", "Blue"] },
    { name: "Galaxy S24 Ultra 5G AI Phone", brand: "Samsung", price: 129999, original: 144999, sub: "Smartphones", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", sizes: ["256GB", "512GB"], colors: ["Titanium Black", "Violet"] },
    { name: "MacBook Air M3 Chip 15-inch", brand: "Apple", price: 124900, original: 134900, sub: "Laptops", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", sizes: ["16GB RAM / 512GB SSD"], colors: ["Space Grey", "Midnight"] },
    { name: "Noise Cancelling Headphones WH-1000XM5", brand: "Sony", price: 24999, original: 29990, sub: "Headphones", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", sizes: ["Over-Ear"], colors: ["Black", "Silver"] },
    { name: "AirPods Pro (2nd Gen) USB-C", brand: "Apple", price: 21900, original: 24900, sub: "Earbuds", img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80", sizes: ["In-Ear"], colors: ["White"] },
    { name: "Galaxy Watch 6 Classic 47mm LTE", brand: "Samsung", price: 28999, original: 36999, sub: "Smart Watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", sizes: ["47mm"], colors: ["Silver", "Black"] },
    { name: "EOS R6 Mark II Mirrorless Camera", brand: "Canon", price: 189999, original: 215000, sub: "Cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80", sizes: ["Body Only"], colors: ["Black"] },
    { name: "Charge 5 Portable Bluetooth Speaker", brand: "JBL", price: 14999, original: 18999, sub: "Speakers", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80", sizes: ["Standard"], colors: ["Black", "Squad Camo"] },
    { name: "iPad Air 11-inch M2 128GB", brand: "Apple", price: 59900, original: 64900, sub: "Tablets", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80", sizes: ["128GB WiFi"], colors: ["Starlight", "Space Grey"] },
    { name: "ROG Strix G16 Gaming Laptop i7", brand: "Asus", price: 114990, original: 139990, sub: "Laptops", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", sizes: ["16GB RAM / 1TB SSD"], colors: ["Eclipse Grey"] },
    { name: "OnePlus 12 5G 256GB", brand: "OnePlus", price: 64999, original: 69999, sub: "Smartphones", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80", sizes: ["12GB / 256GB"], colors: ["Flowy Emerald", "Black"] },
    { name: "Wireless Mechanical Gaming Keyboard", brand: "Logitech", price: 8999, original: 12999, sub: "Headphones", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80", sizes: ["Full Size"], colors: ["RGB Black"] },
    { name: "MX Master 3S Ergonomic Mouse", brand: "Logitech", price: 7995, original: 10995, sub: "Headphones", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80", sizes: ["Right Handed"], colors: ["Graphite", "Pale Grey"] },
    { name: "True Wireless ANC Buds Nord 3", brand: "OnePlus", price: 2999, original: 3999, sub: "Earbuds", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80", sizes: ["In-Ear"], colors: ["Thunder Grey"] },
    { name: "27-inch 4K UHD IPS Monitor", brand: "Dell", price: 24999, original: 32000, sub: "Laptops", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80", sizes: ["27-inch"], colors: ["Black/Silver"] }
  ];
  elecItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Cutting-edge ${i.name} delivering supreme performance, exceptional battery backup, and premium build quality.`,
      category: "Electronics", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.2 + Math.random()*0.7).toFixed(1), stock: 8,
      specifications: { Warranty: "1 Year Brand Warranty", Connectivity: "Bluetooth / WiFi 6E / 5G" }
    });
  });

  // 7. Beauty & Personal Care (10 Products)
  const beautyItems = [
    { name: "Matte Revolution Bullet Lipstick", brand: "MAC", price: 1950, original: 2200, sub: "Lipstick", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80", colors: ["Ruby Woo", "Velvet Teddy"] },
    { name: "Vitamin C Radiance Face Serum 30ml", brand: "Mamaearth", price: 499, original: 699, sub: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", colors: ["Clear"] },
    { name: "Gentle Skin Cleanser Face Wash 250ml", brand: "Cetaphil", price: 599, original: 799, sub: "Face Wash", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", colors: ["White"] },
    { name: "Fit Me Matte + Poreless Liquid Foundation", brand: "Maybelline", price: 549, original: 749, sub: "Foundation", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", colors: ["128 Warm Nude", "220 Natural Beige"] },
    { name: "Eau De Parfum Luxury Perfume 100ml", brand: "Davidoff", price: 3499, original: 5999, sub: "Perfume", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80", colors: ["Cool Water"] },
    { name: "Hydrating Hyaluronic Acid Night Cream", brand: "L'Oreal", price: 799, original: 1199, sub: "Moisturizers", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", colors: ["White"] },
    { name: "Argan Oil Hair Nourishing Shampoo 400ml", brand: "Tresemme", price: 449, original: 699, sub: "Hair Care", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80", colors: ["Black Bottle"] },
    { name: "All-in-One Cordless Beard Trimmer", brand: "Philips", price: 1299, original: 1999, sub: "Hair Care", img: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "Sun Protect Ultra-Light Gel SPF 50", brand: "Neutrogena", price: 649, original: 899, sub: "Skincare", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", colors: ["White"] },
    { name: "Natural Rose Water Facial Toner 200ml", brand: "Kama Ayurveda", price: 425, original: 550, sub: "Skincare", img: "https://images.unsplash.com/photo-1608248597359-0e6930ca9994?auto=format&fit=crop&w=600&q=80", colors: ["Pink"] }
  ];
  beautyItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Dermatologically tested ${i.name} formulated to enhance natural beauty and radiance.`,
      category: "Beauty & Personal Care", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.1 + Math.random()*0.8).toFixed(1), stock: 25,
      specifications: { Formulation: "Dermatologically Tested", ParabenFree: "Yes" }
    });
  });

  // 8. Home & Kitchen (10 Products)
  const homeItems = [
    { name: "Non-Stick Aluminium 3-Piece Cookware Set", brand: "Prestige", price: 1899, original: 3499, sub: "Cookware", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", colors: ["Black", "Red"] },
    { name: "750W 3-Jar Mixer Grinder", brand: "Philips", price: 2999, original: 4999, sub: "Kitchen Appliances", img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80", colors: ["White/Blue"] },
    { name: "Pure 100% Cotton 300 TC Double Bedsheet", brand: "Bombay Dyeing", price: 1199, original: 2299, sub: "Bedsheets", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", colors: ["Blue Floral", "Beige"] },
    { name: "Smart Digital Air Fryer 4.1L", brand: "Havells", price: 4999, original: 8999, sub: "Kitchen Appliances", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "Stainless Steel Air-Tight Storage Containers (Set of 6)", brand: "Milton", price: 999, original: 1799, sub: "Storage", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80", colors: ["Silver"] },
    { name: "Modern Ceramic Table Lamp", brand: "IKEA", price: 1499, original: 2499, sub: "Lighting", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80", colors: ["Warm White"] },
    { name: "Blackout Window Curtains (Set of 2)", brand: "Story@Home", price: 899, original: 1699, sub: "Home Decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", colors: ["Grey", "Navy"] },
    { name: "Robotic Vacuum Cleaner with Mopping", brand: "Ecovacs", price: 19999, original: 34999, sub: "Kitchen Appliances", img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "Thermal Insulated Stainless Steel Flask 1L", brand: "Borosil", price: 799, original: 1299, sub: "Storage", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80", colors: ["Steel Silver"] },
    { name: "Aromatherapy Essential Oil Diffuser", brand: "Home Centre", price: 899, original: 1499, sub: "Home Decor", img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80", colors: ["Wood Grain"] }
  ];
  homeItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Functional and elegant ${i.name} built to transform your living experience.`,
      category: "Home & Kitchen", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.3 + Math.random()*0.6).toFixed(1), stock: 16,
      specifications: { Warranty: "1 Year Standard", Material: "Food Grade Steel / Cotton" }
    });
  });

  // 9. Grocery (10 Products)
  const groceryItems = [
    { name: "Fortune Sunlite Refined Sunflower Oil 5L", brand: "Fortune", price: 675, original: 899, sub: "Cooking Oil", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80" },
    { name: "Daawat Rozana Gold Basmati Rice 5kg", brand: "Daawat", price: 499, original: 699, sub: "Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80" },
    { name: "Tata Sampann Organic Unpolished Toor Dal 1kg", brand: "Tata", price: 169, original: 220, sub: "Pulses", img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80" },
    { name: "Kellogg's Real Almond & Honey Corn Flakes 650g", brand: "Kellogg's", price: 349, original: 450, sub: "Packaged Foods", img: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80" },
    { name: "Nescafe Classic Instant Coffee 200g Jar", brand: "Nescafe", price: 575, original: 650, sub: "Beverages", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80" },
    { name: "Cadbury Celebrations Premium Silk Box", brand: "Cadbury", price: 399, original: 500, sub: "Snacks", img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80" },
    { name: "Organic Extra Virgin Cold Pressed Coconut Oil 500ml", brand: "Disano", price: 329, original: 499, sub: "Cooking Oil", img: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=80" },
    { name: "Everest Whole Spices Garam Masala 100g", brand: "Everest", price: 85, original: 105, sub: "Spices", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80" },
    { name: "Tetley Green Tea Lemon & Honey (100 Bags)", brand: "Tetley", price: 440, original: 550, sub: "Beverages", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
    { name: "Roasted Salted Premium California Almonds 500g", brand: "Happilo", price: 449, original: 699, sub: "Snacks", img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&w=600&q=80" }
  ];
  groceryItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Fresh, pure, and hygienically packed ${i.name} for daily wholesome nutrition.`,
      category: "Grocery", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: ["Standard Pack"], colors: ["Standard"], rating: (4.5 + Math.random()*0.4).toFixed(1), stock: 50,
      specifications: { ShelfLife: "12 Months", Purity: "100% Organic Quality" }
    });
  });

  // 10. Furniture (10 Products)
  const furnItems = [
    { name: "3-Seater Velvet Fabric Sofa", brand: "Urban Ladder", price: 21999, original: 38999, sub: "Sofas", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", colors: ["Emerald Green", "Blue"] },
    { name: "Ergonomic High Back Mesh Office Chair", brand: "Green Soul", price: 6999, original: 14999, sub: "Chairs", img: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "King Size Sheesham Wooden Bed with Storage", brand: "Pepperfry", price: 28999, original: 49999, sub: "Beds", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80", colors: ["Teak Finish"] },
    { name: "4-Seater Solid Wood Dining Table Set", brand: "Wakefit", price: 14999, original: 25999, sub: "Tables", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80", colors: ["Walnut"] },
    { name: "Modern Minimalist Study Desk", brand: "IKEA", price: 4499, original: 7999, sub: "Study Tables", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80", colors: ["White", "Oak"] },
    { name: "3-Door Wooden Wardrobe with Mirror", brand: "Godrej Interio", price: 18999, original: 32999, sub: "Wardrobes", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", colors: ["Dark Brown"] },
    { name: "Recliner Armchair in Leatherette", brand: "Durian", price: 16999, original: 29999, sub: "Chairs", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80", colors: ["Chocolate Brown"] },
    { name: "Solid Wood Coffee Centre Table", brand: "HomeTown", price: 4999, original: 8999, sub: "Tables", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80", colors: ["Natural Wood"] },
    { name: "Foldable Wall Mounted Study Table", brand: "Invisible Bed", price: 2299, original: 4500, sub: "Study Tables", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80", colors: ["Wenge"] },
    { name: "Queen Size Orthopedic Memory Foam Mattress", brand: "Sleepwell", price: 11999, original: 19999, sub: "Beds", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80", colors: ["White"] }
  ];
  furnItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Premium sturdy ${i.name} crafted for maximum durability and contemporary interior aesthetics.`,
      category: "Furniture", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: ["Standard Dimension"], colors: i.colors, rating: (4.4 + Math.random()*0.5).toFixed(1), stock: 6,
      specifications: { FrameMaterial: "Solid Sheesham / Engineered Wood", Warranty: "3 Years Structural Warranty" }
    });
  });

  // 11-18. Other categories (Jewellery, Mobile Accessories, Sports, Books, Toys, Pet Supplies, Watches, Dresses)
  const miscItems = [
    { name: "18K Gold Plated Zircon Stud Earrings", brand: "Giva", category: "Jewellery & Accessories", sub: "Earrings", price: 1299, original: 2999, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" },
    { name: "Polarized UV400 Aviator Sunglasses", brand: "Ray-Ban", category: "Jewellery & Accessories", sub: "Sunglasses", price: 4999, original: 7999, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
    { name: "MagSafe Armor Case for iPhone 15", brand: "Spigen", category: "Mobile Accessories", sub: "Mobile Covers", price: 1199, original: 2499, img: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80" },
    { name: "65W Fast GaN Charger Adapter", brand: "Anker", category: "Mobile Accessories", sub: "Chargers", price: 2199, original: 3999, img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80" },
    { name: "TPE Extra Thick Non-Slip Yoga Mat 6mm", brand: "Cultsport", category: "Sports & Fitness", sub: "Yoga Products", price: 899, original: 1799, img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80" },
    { name: "Adjustable Rubber Dumbbells Pair 20kg", brand: "Decathlon", category: "Sports & Fitness", sub: "Gym Equipment", price: 2499, original: 4499, img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80" },
    { name: "Atomic Habits Hardcover by James Clear", brand: "Penguin", category: "Books", sub: "Self Help", price: 499, original: 799, img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" },
    { name: "The Psychology of Money by Morgan Housel", brand: "Harriman", category: "Books", sub: "Self Help", price: 299, original: 499, img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80" },
    { name: "LEGO Star Wars Millennium Falcon Set", brand: "LEGO", category: "Toys & Games", sub: "Educational Toys", price: 12999, original: 16999, img: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80" },
    { name: "Remote Control High-Speed Monster Truck", brand: "Hot Wheels", category: "Toys & Games", sub: "Remote Control Toys", price: 1899, original: 3499, img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80" },
    { name: "Pedigree Adult Dry Dog Food Chicken & Rice 10kg", brand: "Pedigree", category: "Pet Supplies", sub: "Pet Food", price: 1899, original: 2399, img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80" },
    { name: "Interactive Squeaky Chew Toy Pack for Dogs", brand: "Kong", category: "Pet Supplies", sub: "Pet Toys", price: 599, original: 999, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80" },
    { name: "Octane Chronograph Stainless Steel Watch", brand: "Titan", category: "Watches", sub: "Analog Watches", price: 6995, original: 9995, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },
    { name: "Smart Fitness Tracker Watch Color Display", brand: "Fastrack", category: "Watches", sub: "Smartwatches", price: 1999, original: 3999, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" },
    { name: "Sequined Off-Shoulder Evening Party Gown", brand: "Forever New", category: "Dresses", sub: "Party Wear", price: 4999, original: 8999, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80" },
    { name: "Boho Floral Printed Summer Maxi Dress", brand: "Mango", category: "Dresses", sub: "Maxi Dresses", price: 2299, original: 4299, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" }
  ];
  miscItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Authentic ${i.name} crafted to highest industry quality standards.`,
      category: i.category, subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: ["Standard"], colors: ["Multi"], rating: (4.2 + Math.random()*0.7).toFixed(1), stock: 15,
      specifications: { Quality: "Verified Grade A", Warranty: "Standard Manufacturer" }
    });
  });

  return prods;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('Seeding Categories...');
    await Category.insertMany(categories);

    console.log('Seeding Demo Users & Admin...');
    const userSalt = await bcrypt.genSalt(10);
    const userPasswordHash = await bcrypt.hash('password123', userSalt);
    const adminPasswordHash = await bcrypt.hash('admin123', userSalt);

    const demoUser = await User.create({
      name: 'Alex Johnson',
      username: 'alexjohnson',
      email: 'user@shopverse.com',
      phone: '+1 9876543210',
      password: userPasswordHash,
      role: 'user',
      addresses: [
        {
          fullName: 'Alex Johnson',
          phone: '+1 9876543210',
          house: 'Apartment 4B, Parkview Heights',
          street: '5th Avenue, MG Road',
          city: 'New York',
          state: 'NY',
          pincode: '10001',
          isDefault: true
        }
      ]
    });

    const demoAdmin = await User.create({
      name: 'ShopVerse Admin',
      username: 'shopverseadmin',
      email: 'admin@shopverse.com',
      phone: '+1 1234567890',
      password: adminPasswordHash,
      role: 'admin'
    });

    console.log('Seeding 100+ Products...');
    const productsData = generateProducts();
    const createdProducts = await Product.insertMany(productsData);

    console.log('Seeding Initial Reviews...');
    const sampleProduct1 = createdProducts[0];
    const sampleProduct2 = createdProducts[1];

    await Review.create({
      user: demoUser._id,
      product: sampleProduct1._id,
      userName: demoUser.name,
      rating: 5,
      comment: 'Absolutely outstanding quality! The fit is perfect and the fabric feels premium.'
    });

    await Review.create({
      user: demoUser._id,
      product: sampleProduct2._id,
      userName: demoUser.name,
      rating: 4,
      comment: 'Vibrant color and speedy delivery. Very satisfied with my purchase.'
    });

    console.log(`✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`--------------------------------------------------`);
    console.log(`Categories Created : ${categories.length}`);
    console.log(`Products Created   : ${createdProducts.length}`);
    console.log(`Demo Customer User : user@shopverse.com / password123`);
    console.log(`Demo Admin User    : admin@shopverse.com / admin123`);
    console.log(`--------------------------------------------------`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
};

seedDatabase();
