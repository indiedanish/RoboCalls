const express = require('express');
const orderService = require('../services/orderService');
const twilioService = require('../services/twilioService');
const logger = require('../logger');

const router = express.Router();

// Route to handle new orders
router.post('/order', async (req, res) => {
  try {
    const order = req.body;
    const phoneNumber = order?.billing?.phone;

    if (!phoneNumber) {
      throw new Error('Phone number missing from order');
    }

    // Create the order and initiate the call
    const newOrder = await orderService.createOrder(order);
    const call = await twilioService.makeOrderConfirmationCall(phoneNumber, newOrder._id);
    await orderService.updateCallStatus(newOrder.id, call.sid);

    res.status(200).json({
      success: true,
      message: 'Order processed and call initiated successfully',
    });
  } catch (error) {
    logger.error('Error processing order', {
      error: error.message,
      orderId: req.body?.id,
    });

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
