const Product = require('../models/Product');
const slugify = require('slugify');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildFilter = (query) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.brand)    filter.brand = { $regex: query.brand, $options: 'i' };
  if (query.search)   filter.$text = { $search: query.search };

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.rating) filter.rating = { $gte: Number(query.rating) };
  if (query.inStock === 'true') filter.stock = { $gt: 0 };

  return filter;
};

// @desc    Get all products (with filters, sort, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip  = (page - 1) * limit;

    const filter = buildFilter(req.query);

    const sortOptions = {
      newest:       { createdAt: -1 },
      'price-low':  { price: 1 },
      'price-high': { price: -1 },
      rating:       { rating: -1 },
      popular:      { sold: -1 },
    };
    const sort = sortOptions[req.query.sort] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).select('-reviews'),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId
      ? { _id: req.params.id, isActive: true }
      : { slug: req.params.id, isActive: true };

    const product = await Product.findOne(query).populate('reviews.user', 'name avatar');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).select('-reviews');
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, image: { $first: { $arrayElemAt: ['$images.url', 0] } } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    const product = await Product.create({ ...req.body, slug, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    product.reviews.push({
      user:    req.user._id,
      name:    req.user.name,
      avatar:  req.user.avatar,
      rating:  Number(rating),
      comment,
    });

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4).select('-reviews');

    res.json({ success: true, products: related });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin stats
// @route   GET /api/products/admin/stats
// @access  Admin
exports.getProductStats = async (req, res, next) => {
  try {
    const [total, outOfStock, featured, byCategory] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0, isActive: true }),
      Product.countDocuments({ isFeatured: true, isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    res.json({ success: true, total, outOfStock, featured, byCategory });
  } catch (error) {
    next(error);
  }
};
