const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  street:  { type: String, required: true },
  city:    { type: String, required: true },
  state:   { type: String, required: true },
  pincode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems:      [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod:   { type: String, required: true, enum: ['COD', 'Card', 'UPI', 'NetBanking'] },
    paymentStatus:   { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    paymentId:       { type: String, default: '' },
    itemsPrice:      { type: Number, required: true },
    shippingPrice:   { type: Number, required: true, default: 0 },
    taxPrice:        { type: Number, required: true, default: 0 },
    totalPrice:      { type: Number, required: true },
    orderStatus:     {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Processing',
    },
    statusHistory:   [
      {
        status:    String,
        timestamp: { type: Date, default: Date.now },
        note:      String,
      },
    ],
    deliveredAt:     Date,
    cancelledAt:     Date,
    cancelReason:    String,
    orderNumber:     { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SK' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
