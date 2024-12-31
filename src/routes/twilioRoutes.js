const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const orderService = require('../services/orderService');
const logger = require('../logger');

const router = express.Router();

// Route to generate TwiML for order confirmation
router.get('/twiml/order-confirmation', (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const orderId = req.query.orderId;

    if (!orderId) {
      throw new Error('Order ID is missing');
    }

    // twiml.say({ voice: 'alice' }, 'Thank you for your order. Please press 1 to confirm your order, or any other key to cancel.');
    twiml.play(`${process.env.BASE_URL}/public/greeting.mp3`);
    twiml.gather({
      numDigits: 1,
      action: `/twilio/handle-confirmation?orderId=${orderId}`,
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    logger.error('Error generating TwiML', { error: error.message });
    res.status(500).send('Error generating voice response');
  }
});

// Route to handle confirmation response
router.post('/handle-confirmation', async (req, res) => {
  const twiml = new VoiceResponse();
  const orderId = req.query.orderId;
  const digit = req.body.Digits;

  try {
    if (!orderId) {
      throw new Error('Order ID is missing');
    }

    const confirmed = digit === '1';
    await orderService.updateOrderConfirmation(orderId, confirmed);

    if (confirmed) {
      twiml.say({ voice: 'alice' }, 'Thank you for confirming your order. We will process it right away.');
    } else {
      twiml.say({ voice: 'alice' }, 'Your order has been cancelled. Please contact our support if this was a mistake.');
    }
  } catch (error) {
    logger.error('Error handling confirmation', { orderId, error: error.message });
    twiml.say({ voice: 'alice' }, 'We encountered an error processing your response. Please contact our support.');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
