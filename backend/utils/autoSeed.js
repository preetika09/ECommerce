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

  // 1. Women's Fashion
  const wfItems = [
    { name: "Floral A-Line Midi Dress", brand: "Zara", price: 1899, original: 3499, sub: "Dresses", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L", "XL"], colors: ["Floral Pink", "Navy Blue"] },
    { name: "Traditional Chanderi Silk Saree", brand: "Biba", price: 2999, original: 5999, sub: "Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", sizes: ["Free Size"], colors: ["Royal Blue", "Golden Red"] },
    { name: "Embroidered Anarkali Kurti", brand: "FabIndia", price: 1499, original: 2999, sub: "Kurtis", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Emerald Green", "Maroon"] },
    { name: "Casual Cotton Ribbed Top", brand: "H&M", price: 699, original: 1299, sub: "Tops", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", sizes: ["XS", "S", "M", "L"], colors: ["White", "Black"] },
    { name: "High-Waist Stretch Denim Jeans", brand: "Levi's", price: 2199, original: 3999, sub: "Jeans", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80", sizes: ["28", "30", "32"], colors: ["Dark Wash"] }
  ];
  wfItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `High quality ${i.name} designed with premium fabric.`, category: "Women's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 15, specifications: { Fabric: "Premium Blend" } }));

  // 2. Men's Fashion
  const mfItems = [
    { name: "Classic Slim Fit Polo T-Shirt", brand: "Tommy Hilfiger", price: 1299, original: 2499, sub: "T-Shirts", img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80", sizes: ["S", "M", "L"], colors: ["Navy", "White"] },
    { name: "Formal Oxford Cotton Shirt", brand: "Arrow", price: 1599, original: 2999, sub: "Shirts", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L", "XL"], colors: ["Sky Blue"] },
    { name: "501 Original Fit Jeans", brand: "Levi's", price: 2499, original: 4499, sub: "Jeans", img: "https://images.unsplash.com/photo-1542272604-780c96856553?auto=format&fit=crop&w=600&q=80", sizes: ["30", "32", "34"], colors: ["Dark Indigo"] },
    { name: "Fleece Casual Pullover Hoodie", brand: "Nike", price: 2299, original: 3999, sub: "Hoodies", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", sizes: ["M", "L"], colors: ["Grey", "Black"] }
  ];
  mfItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Premium ${i.name} crafted for style and comfort.`, category: "Men's Fashion", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 12, specifications: { Material: "100% Cotton" } }));

  // 3. Kids & Baby
  const kidsItems = [
    { name: "Cute Animal Print Cotton Onesie", brand: "Mothercare", price: 599, original: 1199, sub: "Baby Clothing", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", sizes: ["0-3M", "3-6M"], colors: ["Yellow"] },
    { name: "Boys Party Suit Blazer Set", brand: "FirstCry", price: 1499, original: 2999, sub: "Boys Clothing", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80", sizes: ["2-3Y", "4-5Y"], colors: ["Navy Blue"] },
    { name: "Girls Floral Tulle Party Dress", brand: "Hopscotch", price: 1299, original: 2499, sub: "Girls Clothing", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80", sizes: ["3-4Y", "5-6Y"], colors: ["Soft Pink"] }
  ];
  kidsItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Gentle and vibrant ${i.name} crafted for kids.`, category: "Kids & Baby", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.2 + Math.random()*0.7).toFixed(1), stock: 20, specifications: { Material: "Organic Cotton" } }));

  // 4. Shoes & Footwear
  const shoeItems = [
    { name: "Air Max Revolution Running Shoes", brand: "Nike", price: 4299, original: 7999, sub: "Sports Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8", "UK 9"], colors: ["Red/White"] },
    { name: "Ultraboost Lightweight Sneakers", brand: "Adidas", price: 5499, original: 9999, sub: "Sneakers", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 7", "UK 8"], colors: ["All Black"] },
    { name: "Genuine Leather Formal Derby Shoes", brand: "Clarks", price: 3499, original: 6499, sub: "Formal Shoes", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80", sizes: ["UK 8", "UK 9"], colors: ["Tan Brown"] },
    { name: "Stiletto Ankle Strap High Heels", brand: "Aldo", price: 2999, original: 5999, sub: "Heels", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", sizes: ["UK 5", "UK 6"], colors: ["Nude"] }
  ];
  shoeItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `High-durability ${i.name} crafted with superior sole grip.`, category: "Shoes & Footwear", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4 + Math.random()*0.9).toFixed(1), stock: 18, specifications: { UpperMaterial: "Synthetic / Leather" } }));

  // 5. Bags & Luggage
  const bagItems = [
    { name: "Leather Structured Satchel Handbag", brand: "Michael Kors", price: 5999, original: 11999, sub: "Handbags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", sizes: ["Medium"], colors: ["Tan", "Black"] },
    { name: "15.6 Inch Water-Resistant Laptop Backpack", brand: "American Tourister", price: 1499, original: 2999, sub: "Laptop Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", sizes: ["28L"], colors: ["Navy Blue"] },
    { name: "Hard Shell Cabin Luggage Suitcase", brand: "Samsonite", price: 6499, original: 12999, sub: "Suitcases", img: "https://images.unsplash.com/photo-1565026057447-ba90a3d07d6b?auto=format&fit=crop&w=600&q=80", sizes: ["Cabin"], colors: ["Silver"] }
  ];
  bagItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Spacious and stylish ${i.name}.`, category: "Bags & Luggage", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.3 + Math.random()*0.6).toFixed(1), stock: 14, specifications: { Material: "Water Resistant Polyester" } }));

  // 6. Jewellery & Accessories
  const jewItems = [
    { name: "18K Gold Plated Zircon Stud Earrings", brand: "Giva", price: 1299, original: 2999, sub: "Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80", sizes: ["Standard"], colors: ["Gold"] },
    { name: "Polarized UV400 Aviator Sunglasses", brand: "Ray-Ban", price: 4999, original: 7999, sub: "Sunglasses", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", sizes: ["Medium"], colors: ["Black/Gold"] }
  ];
  jewItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Designer ${i.name} to elevate your style.`, category: "Jewellery & Accessories", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.4 + Math.random()*0.5).toFixed(1), stock: 15, specifications: { Material: "Gold Plated / Alloy" } }));

  // 7. Beauty & Personal Care
  const beautyItems = [
    { name: "Matte Revolution Bullet Lipstick", brand: "MAC", price: 1950, original: 2200, sub: "Lipstick", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80", colors: ["Ruby Woo", "Velvet Teddy"] },
    { name: "Vitamin C Radiance Face Serum 30ml", brand: "Mamaearth", price: 499, original: 699, sub: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", colors: ["Clear"] },
    { name: "Gentle Skin Cleanser Face Wash 250ml", brand: "Cetaphil", price: 599, original: 799, sub: "Face Wash", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", colors: ["White"] },
    { name: "Fit Me Matte + Poreless Liquid Foundation", brand: "Maybelline", price: 549, original: 749, sub: "Foundation", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", colors: ["128 Warm Nude", "220 Natural Beige"] },
    { name: "Eau De Parfum Luxury Perfume 100ml", brand: "Davidoff", price: 3499, original: 5999, sub: "Perfume", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80", colors: ["Cool Water"] },
    { name: "Hydrating Hyaluronic Acid Night Cream", brand: "L'Oreal", price: 799, original: 1199, sub: "Moisturizers", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", colors: ["White"] }
  ];
  beautyItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Dermatologically tested ${i.name} for daily beauty care.`, category: "Beauty & Personal Care", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.3 + Math.random()*0.6).toFixed(1), stock: 25, specifications: { Tested: "Yes" } }));

  // 8. Electronics
  const elecItems = [
    { name: "iPhone 15 Pro 128GB Titanium", brand: "Apple", price: 119900, original: 134900, sub: "Smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", sizes: ["128GB"], colors: ["Natural Titanium"] },
    { name: "Galaxy S24 Ultra 5G AI Phone", brand: "Samsung", price: 129999, original: 144999, sub: "Smartphones", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80", sizes: ["256GB"], colors: ["Titanium Black"] },
    { name: "MacBook Air M3 Chip 15-inch", brand: "Apple", price: 124900, original: 134900, sub: "Laptops", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", sizes: ["16GB RAM / 512GB SSD"], colors: ["Space Grey"] },
    { name: "Noise Cancelling Headphones WH-1000XM5", brand: "Sony", price: 24999, original: 29990, sub: "Headphones", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", sizes: ["Over-Ear"], colors: ["Black"] }
  ];
  elecItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Cutting-edge ${i.name} delivering supreme performance.`, category: "Electronics", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: i.sizes, colors: i.colors, rating: (4.3 + Math.random()*0.6).toFixed(1), stock: 10, specifications: { Warranty: "1 Year Brand Warranty" } }));

  // 9. Mobile Accessories
  const mobAccItems = [
    { name: "MagSafe Armor Case for iPhone 15", brand: "Spigen", price: 1199, original: 2499, sub: "Mobile Covers", img: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80", colors: ["Black", "Clear"] },
    { name: "65W Fast GaN Charger Adapter", brand: "Anker", price: 2199, original: 3999, sub: "Chargers", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "20000mAh Power Bank 22.5W Fast Charge", brand: "Mi", price: 1799, original: 2999, sub: "Power Banks", img: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80", colors: ["Black"] }
  ];
  mobAccItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `High performance ${i.name} for mobile protection and charging.`, category: "Mobile Accessories", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.2 + Math.random()*0.7).toFixed(1), stock: 30, specifications: { FastCharge: "Yes" } }));

  // 10. Home & Kitchen
  const homeItems = [
    { name: "Non-Stick Aluminium 3-Piece Cookware Set", brand: "Prestige", price: 1899, original: 3499, sub: "Cookware", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "750W 3-Jar Mixer Grinder", brand: "Philips", price: 2999, original: 4999, sub: "Kitchen Appliances", img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80", colors: ["White"] },
    { name: "Pure 100% Cotton 300 TC Double Bedsheet", brand: "Bombay Dyeing", price: 1199, original: 2299, sub: "Bedsheets", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", colors: ["Blue Floral"] }
  ];
  homeItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Elegant and functional ${i.name} for home.`, category: "Home & Kitchen", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.4 + Math.random()*0.5).toFixed(1), stock: 15, specifications: { Warranty: "1 Year" } }));

  // 11. Furniture
  const furnItems = [
    { name: "3-Seater Velvet Fabric Sofa", brand: "Urban Ladder", price: 21999, original: 38999, sub: "Sofas", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", colors: ["Emerald Green"] },
    { name: "Ergonomic High Back Mesh Office Chair", brand: "Green Soul", price: 6999, original: 14999, sub: "Chairs", img: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=600&q=80", colors: ["Black"] },
    { name: "King Size Sheesham Wooden Bed", brand: "Pepperfry", price: 28999, original: 49999, sub: "Beds", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80", colors: ["Teak"] }
  ];
  furnItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Sturdy and modern ${i.name} furniture.`, category: "Furniture", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: i.colors, rating: (4.5 + Math.random()*0.4).toFixed(1), stock: 8, specifications: { Warranty: "3 Years" } }));

  // 12. Grocery
  const groceryItems = [
    { name: "Fortune Sunlite Refined Sunflower Oil 5L", brand: "Fortune", price: 675, original: 899, sub: "Cooking Oil", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80" },
    { name: "Daawat Rozana Gold Basmati Rice 5kg", brand: "Daawat", price: 499, original: 699, sub: "Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80" },
    { name: "Tata Sampann Organic Unpolished Toor Dal 1kg", brand: "Tata", price: 169, original: 220, sub: "Pulses", img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80" },
    { name: "Nescafe Classic Instant Coffee 200g Jar", brand: "Nescafe", price: 575, original: 650, sub: "Beverages", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80" }
  ];
  groceryItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Fresh and pure ${i.name} for everyday cooking.`, category: "Grocery", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard Pack"], colors: ["Standard"], rating: (4.6 + Math.random()*0.3).toFixed(1), stock: 40, specifications: { Organic: "Yes" } }));

  // 13. Sports & Fitness
  const sportsItems = [
    { name: "TPE Extra Thick Non-Slip Yoga Mat 6mm", brand: "Cultsport", price: 899, original: 1799, sub: "Yoga Products", img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80" },
    { name: "Adjustable Rubber Dumbbells Pair 20kg", brand: "Decathlon", price: 2499, original: 4499, sub: "Gym Equipment", img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80" }
  ];
  sportsItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `High quality ${i.name} for home gym and workout.`, category: "Sports & Fitness", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: ["Multi"], rating: (4.4 + Math.random()*0.5).toFixed(1), stock: 15, specifications: { Grade: "Commercial/Home" } }));

  // 14. Books
  const bookItems = [
    { name: "Atomic Habits Hardcover by James Clear", brand: "Penguin", price: 499, original: 799, sub: "Self Help", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" },
    { name: "The Psychology of Money by Morgan Housel", brand: "Harriman", price: 299, original: 499, sub: "Self Help", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80" }
  ];
  bookItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Bestselling ${i.name}.`, category: "Books", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Hardcover/Paperback"], colors: ["Standard"], rating: (4.8 + Math.random()*0.2).toFixed(1), stock: 35, specifications: { Language: "English" } }));

  // 15. Toys & Games
  const toyItems = [
    { name: "LEGO Star Wars Millennium Falcon Set", brand: "LEGO", price: 12999, original: 16999, sub: "Educational Toys", img: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80" },
    { name: "Remote Control High-Speed Monster Truck", brand: "Hot Wheels", price: 1899, original: 3499, sub: "Remote Control Toys", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80" }
  ];
  toyItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Engaging and fun ${i.name} for children.`, category: "Toys & Games", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: ["Multi"], rating: (4.5 + Math.random()*0.4).toFixed(1), stock: 20, specifications: { Safe: "Yes" } }));

  // 16. Pet Supplies
  const petItems = [
    { name: "Pedigree Adult Dry Dog Food Chicken 10kg", brand: "Pedigree", price: 1899, original: 2399, sub: "Pet Food", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80" },
    { name: "Interactive Squeaky Chew Toy Pack", brand: "Kong", price: 599, original: 999, sub: "Pet Toys", img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80" }
  ];
  petItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Nutritious and fun ${i.name} for your beloved pets.`, category: "Pet Supplies", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: ["Multi"], rating: (4.6 + Math.random()*0.3).toFixed(1), stock: 25, specifications: { PetType: "Dogs & Cats" } }));

  // 17. Watches
  const watchItems = [
    { name: "Octane Chronograph Stainless Steel Watch", brand: "Titan", price: 6995, original: 9995, sub: "Analog Watches", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },
    { name: "Smart Fitness Tracker Watch Color Display", brand: "Fastrack", price: 1999, original: 3999, sub: "Smartwatches", img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" }
  ];
  watchItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Elegant and accurate ${i.name}.`, category: "Watches", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["Standard"], colors: ["Silver/Black"], rating: (4.4 + Math.random()*0.5).toFixed(1), stock: 18, specifications: { Movement: "Quartz / Digital" } }));

  // 18. Dresses
  const dressItems = [
    { name: "Sequined Off-Shoulder Evening Party Gown", brand: "Forever New", price: 4999, original: 8999, sub: "Party Wear", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80" },
    { name: "Boho Floral Printed Summer Maxi Dress", brand: "Mango", price: 2299, original: 4299, sub: "Maxi Dresses", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" }
  ];
  dressItems.forEach(i => prods.push({ name: i.name, brand: i.brand, description: `Stunning ${i.name} for special occasions.`, category: "Dresses", subcategory: i.sub, price: i.price, originalPrice: i.original, discount: Math.round(((i.original - i.price)/i.original)*100), images: [i.img], sizes: ["S", "M", "L"], colors: ["Floral / Metallic"], rating: (4.5 + Math.random()*0.4).toFixed(1), stock: 14, specifications: { Care: "Dry Clean Only" } }));

  return prods;
};

const autoSeedIfEmpty = async () => {
  try {
    // Check if we need to seed or force populate all categories
    const count = await Product.countDocuments();
    const distinctCategories = await Product.distinct('category');

    if (count === 0 || distinctCategories.length < 18) {
      console.log('⚡ Populating products across ALL 18 Categories...');
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

      await Product.deleteMany({});
      const productsData = generateProducts();
      const createdProds = await Product.insertMany(productsData);

      if (createdProds.length > 0) {
        await Review.deleteMany({});
        await Review.create({
          user: demoUser._id,
          product: createdProds[0]._id,
          userName: demoUser.name,
          rating: 5,
          comment: 'Outstanding quality and fast shipping!'
        });
      }

      console.log(`✅ AUTO-SEEDING COMPLETE! Populated ${createdProds.length} products across all 18 categories.`);
    }
  } catch (err) {
    console.error('Auto-seeding error:', err.message);
  }
};

module.exports = { autoSeedIfEmpty };
