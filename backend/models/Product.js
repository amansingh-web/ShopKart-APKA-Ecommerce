const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    avatar:  { type: String },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: [true, 'Product name is required'], trim: true },
    slug:          { type: String, unique: true, lowercase: true },
    description:   { type: String, required: [true, 'Description is required'] },
    shortDesc:     { type: String, default: '' },
    price:         { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, default: 0 },
    discount:      { type: Number, default: 0 },
    category:      { type: String, required: [true, 'Category is required'] },
    subCategory:   { type: String, default: '' },
    brand:         { type: String, default: '' },
    images:        [{ url: String, public_id: String }],
    stock:         { type: Number, required: true, default: 0 },
    sold:          { type: Number, default: 0 },
    reviews:       [reviewSchema],
    numReviews:    { type: Number, default: 0 },
    rating:        { type: Number, default: 0 },
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
    tags:          [String],
    specifications:{ type: Map, of: String },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-calculate discount
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
