const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');

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
  const wfItems = [
    { name: "Floral A-Line Midi Dress", brand: "Zara", price: 1899, original: 3499, sub: "Dresses", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Floral Pink", "Navy Blue"] },
    { name: "Traditional Chanderi Silk Saree", brand: "Biba", price: 2999, original: 5999, sub: "Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["Royal Blue", "Golden Red"] },
    { name: "Embroidered Anarkali Kurti", brand: "FabIndia", price: 1499, original: 2999, sub: "Kurtis", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Emerald Green", "Maroon"] },
    { name: "Casual Cotton Ribbed Top", brand: "H&M", price: 699, original: 1299, sub: "Tops", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", sizes: ["XS", "S", "M", "L"], colors: ["White", "Black", "Olive"] },
    { name: "High-Waist Stretch Denim Jeans", brand: "Levi's", price: 2199, original: 3999, sub: "Jeans", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80", sizes: ["28", "30", "32", "34"], colors: ["Dark Wash", "Light Blue"] },
    { name: "Faux Leather Moto Jacket", brand: "Mango", price: 3499, original: 6999, sub: "Jackets", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Black", "Brown"] },
    { name: "Seamless Workout Leggings Set", brand: "Puma", price: 1799, original: 2999, sub: "Activewear", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Charcoal"] },
    { name: "Satin Printed Nightwear Set", brand: "Enamor", price: 1199, original: 1999, sub: "Nightwear", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Rose Gold"] },
    { name: "Designer Georgette Party Gown", brand: "Biba", price: 4499, original: 8999, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["Teal Blue"] },
    { name: "Chiffon Pleated A-Line Skirt", brand: "Forever 21", price: 999, original: 1799, sub: "Tops", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M"], colors: ["Beige"] }
  ];
  wfItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `High quality ${i.name} designed with premium fabric and precision detail for comfortable all-day wearing.`,
      category: "Women's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 15,
      specifications: { Fabric: "Premium Cotton Blend", Pattern: "Modern", Care: "Machine Wash Cold" }
    });
  });

  const mfItems = [
    { name: "Classic Slim Fit Polo T-Shirt", brand: "Tommy Hilfiger", price: 1299, original: 2499, sub: "T-Shirts", img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Navy", "White"] },
    { name: "Formal Oxford Cotton Shirt", brand: "Arrow", price: 1599, original: 2999, sub: "Shirts", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Sky Blue"] },
    { name: "501 Original Fit Jeans", brand: "Levi's", price: 2499, original: 4499, sub: "Jeans", img: "https://images.unsplash.com/photo-1542272604-780c96856553?auto=format&fit=crop&w=600&q=80", sizes: ["30", "32", "34"], colors: ["Dark Indigo"] },
    { name: "Fleece Casual Pullover Hoodie", brand: "Nike", price: 2299, original: 3999, sub: "Hoodies", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["Grey", "Black"] },
    { name: "Tailored 2-Piece Formal Suit", brand: "Raymond", price: 6999, original: 12999, sub: "Suits", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80", sizes: ["38R", "40R"], colors: ["Charcoal Grey"] },
    { name: "Cotton Blend Festive Kurta Pyjama", brand: "Manyavar", price: 2499, original: 4999, sub: "Ethnic Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["Maroon"] }
  ];
  mfItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Premium ${i.name} meticulously crafted for style, durability, and comfort.`,
      category: "Men's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 12,
      specifications: { Material: "100% Premium Cotton", Fit: "Regular / Slim" }
    });
  });

  const shoeItems = [
    { name: "Air Max Revolution Running Shoes", brand: "Nike", price: 4299, original: 7999, sub: "Sports Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["Red/White"] },
    { name: "Ultraboost Lightweight Sneakers", brand: "Adidas", price: 5499, original: 9999, sub: "Sneakers", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8"], colors: ["All Black"] },
    { name: "Genuine Leather Formal Derby Shoes", brand: "Clarks", price: 3499, original: 6499, sub: "Formal Shoes", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9"], colors: ["Tan Brown"] },
    { name: "Stiletto Ankle Strap High Heels", brand: "Aldo", price: 2999, original: 5999, sub: "Heels", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 5", "UK 6"], colors: ["Nude"] }
  ];
  shoeItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `High-durability ${i.name} crafted with superior sole grip.`,
      category: "Shoes & Footwear", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 18,
      specifications: { UpperMaterial: "Synthetic / Leather", Sole: "Rubber Grip" }
    });
  });

  const elecItems = [
    { name: "iPhone 15 Pro 128GB Titanium", brand: "Apple", price: 119900, original: 134900, sub: "Smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", sizes: ["128GB"], colors: ["Natural Titanium"] },
    { name: "Galaxy S24 Ultra 5G AI Phone", brand: "Samsung", price: 129999, original: 144999, sub: "Smartphones", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", sizes: ["256GB"], colors: ["Titanium Black"] },
    { name: "MacBook Air M3 Chip 15-inch", brand: "Apple", price: 124900, original: 134900, sub: "Laptops", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", sizes: ["16GB RAM / 512GB SSD"], colors: ["Space Grey"] },
    { name: "Noise Cancelling Headphones WH-1000XM5", brand: "Sony", price: 24999, original: 29990, sub: "Headphones", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", sizes: ["Over-Ear"], colors: ["Black"] },
    { name: "AirPods Pro (2nd Gen) USB-C", brand: "Apple", price: 21900, original: 24900, sub: "Earbuds", img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80", sizes: ["In-Ear"], colors: ["White"] }
  ];
  elecItems.forEach(i => {
    prods.push({
      name: i.name, brand: i.brand, description: `Cutting-edge ${i.name} delivering supreme performance.`,
      category: "Electronics", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100),
      images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.3 + Math.random()*0.6).toFixed(1), stock: 10,
      specifications: { Warranty: "1 Year Brand Warranty" }
    });
  });

  return prods;
};

const autoSeedIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('⚡ Database empty! Auto-seeding initial categories & products...');
      await Category.deleteMany({});
      await Category.insertMany(categories);

      const userSalt = await bcrypt.genSalt(10);
      const userPasswordHash = await bcrypt.hash('password123', userSalt);
      const adminPasswordHash = await bcrypt.hash('admin123', userSalt);

      await User.deleteMany({ email: { $in: ['user@shopverse.com', 'admin@shopverse.com'] } });
      const demoUser = await User.create({
        name: 'Alex Johnson',
        username: 'alexjohnson',
        email: 'user@shopverse.com',
        phone: '+1 9876543210',
        password: userPasswordHash,
        role: 'user'
      });

      await User.create({
        name: 'ShopVerse Admin',
        username: 'shopverseadmin',
        email: 'admin@shopverse.com',
        phone: '+1 1234567890',
        password: adminPasswordHash,
        role: 'admin'
      });

      const productsData = generateProducts();
      const createdProds = await Product.insertMany(productsData);

      await Review.create({
        user: demoUser._id,
        product: createdProds[0]._id,
        userName: demoUser.name,
        rating: 5,
        comment: 'Outstanding quality and fast shipping!'
      });

      console.log(`✅ AUTO-SEEDING COMPLETE! Created ${createdProds.length} products & 18 categories.`);
    }
  } catch (err) {
    console.error('Auto-seeding error:', err.message);
  }
};

module.exports = { autoSeedIfEmpty };
