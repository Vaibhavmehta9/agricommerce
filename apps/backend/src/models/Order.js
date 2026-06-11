const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: [true, 'Customer name is required'] },
      email: { type: String, required: [true, 'Customer email is required'] },
      phone: { type: String, required: [true, 'Customer phone is required'] },
      address: {
        street: { type: String, required: [true, 'Street address is required'] },
        city: { type: String, required: [true, 'City is required'] },
        state: { type: String, required: [true, 'State is required'] },
        pincode: { type: String, required: [true, 'Pincode is required'] },
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
