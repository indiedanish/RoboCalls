const Order = require('../models/order');
const logger = require('../logger');
const { formatDateRange } = require('../utils/dateUtils');

const orderController = {
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(req.query.limit) || 100);
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching orders', { error: error.message });
      res.status(500).json({ error: 'Error fetching orders' });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findOne({ orderId: req.params.orderId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      logger.error('Error fetching order', { 
        orderId: req.params.orderId, 
        error: error.message 
      });
      res.status(500).json({ error: 'Error fetching order' });
    }
  },

  async getOrdersByStatus(req, res) {
    try {
      const orders = await Order.find({
        'callStatus.confirmedByCall': req.params.status === 'confirmed'
      }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching orders by status', { error: error.message });
      res.status(500).json({ error: 'Error fetching orders by status' });
    }
  },

  async getOrdersByDateRange(req, res) {
    try {
      const { startDate, endDate } = formatDateRange(
        req.params.startDate,
        req.params.endDate
      );

      const orders = await Order.find({
        'orderDetails.dateCreated': {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      logger.error('Error fetching orders by date range', { error: error.message });
      res.status(500).json({ error: 'Error fetching orders by date range' });
    }
  }
};

module.exports = orderController;