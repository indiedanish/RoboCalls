const Order = require('../models/order');
const logger = require('../logger');

class OrderService {
  async createOrder(orderData) {
    const newOrder = new Order({
      orderId: orderData.id.toString(),
      customerDetails: {
        firstName: orderData.billing.first_name,
        lastName: orderData.billing.last_name,
        email: orderData.billing.email,
        phone: orderData.billing.phone,
        address: {
          line1: orderData.billing.address_1,
          line2: orderData.billing.address_2,
          city: orderData.billing.city,
          state: orderData.billing.state,
          postcode: orderData.billing.postcode,
          country: orderData.billing.country
        }
      },
      orderDetails: {
        status: orderData.status,
        total: orderData.total,
        currency: orderData.currency,
        paymentMethod: orderData.payment_method,
        dateCreated: orderData.date_created,
        items: orderData.line_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }))
      },
      callStatus: {
        initiated: false,
        confirmedByCall: false
      }
    });

    await newOrder.save();
    logger.info('Order saved to database', { orderId: orderData.id });
    return newOrder;
  }

  async updateCallStatus(orderId, callSid) {
    await Order.findOneAndUpdate(
      { orderId: orderId.toString() },
      {
        'callStatus.initiated': true,
        'callStatus.twilioCallSid': callSid,
        'callStatus.callTimestamp': new Date()
      }
    );
  }

  async updateOrderConfirmation(orderId, confirmed) {
    await Order.findOneAndUpdate(
      { _id: orderId.toString() },
      {
        'callStatus.confirmedByCall': confirmed,
        'callStatus.confirmationTimestamp': new Date()
      }
    );
    logger.info('Order confirmation updated', { orderId, confirmed });
  }
}

module.exports = new OrderService();