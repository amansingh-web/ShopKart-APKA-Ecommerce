const express = require('express');
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus, getDashboardStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/',                         protect, createOrder);
router.get('/my',                        protect, getMyOrders);
router.get('/admin/all',                 protect, adminOnly, getAllOrders);
router.get('/admin/stats',               protect, adminOnly, getDashboardStats);
router.get('/:id',                       protect, getOrderById);
router.put('/:id/cancel',                protect, cancelOrder);
router.put('/admin/:id/status',          protect, adminOnly, updateOrderStatus);

module.exports = router;
