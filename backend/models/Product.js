const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 10 },
  specifications: { type: Map, of: String, default: {} }
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', description: 'text', category: 'text', subcategory: 'text' });

module.exports = mongoose.model('Product', productSchema);
