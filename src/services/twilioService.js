const twilio = require('twilio');
const logger = require('../logger');

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async makeOrderConfirmationCall(phoneNumber, orderId) {
    try {
      const call = await this.client.calls.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${process.env.BASE_URL}/twilio/twiml/order-confirmation?orderId=${orderId}`,
        method: 'GET'
      });

      logger.info('Twilio call initiated', { orderId, callSid: call.sid });
      return call;
    } catch (error) {
      logger.error('Twilio call failed', { orderId, error: error.message });
      throw error;
    }
  }
}

module.exports = new TwilioService();