const express = require('express');
const router  = express.Router();
const {
  getProducts, getProduct, getFeaturedProducts, getCategories,
  createProduct, updateProduct, deleteProduct,
  addReview, getRelatedProducts, getProductStats,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',                    getProducts);
router.get('/featured',            getFeaturedProducts);
router.get('/categories',          getCategories);
router.get('/admin/stats',         protect, adminOnly, getProductStats);
router.get('/:id',                 getProduct);
router.get('/:id/related',         getRelatedProducts);
router.post('/:id/reviews',        protect, addReview);

router.post('/',                   protect, adminOnly, createProduct);
router.put('/:id',                 protect, adminOnly, updateProduct);
router.delete('/:id',              protect, adminOnly, deleteProduct);

module.exports = router;
