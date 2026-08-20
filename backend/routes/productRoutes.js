const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products/search
// Live search autocomplete & search result handler
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ success: true, products: [] });
    }

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subcategory: regex },
        { description: regex }
      ]
    }).limit(10);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products
// Filtered, sorted, paginated product list
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      inStock,
      size,
      color,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (category) {
      const cleanCat = decodeURIComponent(category).replace(/&amp;/g, '&').trim();
      query.category = { $regex: new RegExp(`^${cleanCat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }
    if (subcategory) {
      query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
    }
    if (brand) {
      const brandsArray = Array.isArray(brand) ? brand : brand.split(',');
      query.brand = { $in: brandsArray.map(b => new RegExp(b.trim(), 'i')) };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    if (minDiscount) {
      query.discount = { $gte: Number(minDiscount) };
    }
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    if (size) {
      query.sizes = size;
    }
    if (color) {
      query.colors = { $regex: new RegExp(color, 'i') };
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subcategory: regex },
        { description: regex }
      ];
    }

    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'discount') sortOptions = { discount: -1 };
    else if (sort === 'popularity') sortOptions = { numReviews: -1, rating: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Fetch distinct brands for sidebar filters
    const availableBrands = await Product.distinct('brand', category ? { category: query.category } : {});

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      availableBrands,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch similar products in same category
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(6);

    res.json({
      success: true,
      product,
      similarProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin CRUD Endpoints
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
