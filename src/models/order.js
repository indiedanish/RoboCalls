const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postcode: String,
      country: String
    }
  },
  orderDetails: {
    status: String,
    total: String,
    currency: String,
    paymentMethod: String,
    dateCreated: Date,
    items: [{
      name: String,
      quantity: Number,
      price: Number,
      total: String
    }]
  },
  callStatus: {
    initiated: Boolean,
    twilioCallSid: String,
    callTimestamp: Date,
    confirmedByCall: Boolean,
    confirmationTimestamp: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);