const Order = require('../models/order');
const logger = require('../logger');
const { getStartOfDay, getStartOfMonth } = require('../utils/dateUtils');

const statsController = {
  async getDailyStats(req, res) {
    try {
      const startOfDay = getStartOfDay();
      const stats = await Order.aggregate([
        {
          $match: {
            'orderDetails.dateCreated': { $gte: startOfDay }
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            confirmedOrders: {
              $sum: { $cond: ['$callStatus.confirmedByCall', 1, 0] }
            },
            totalRevenue: {
              $sum: { $toDouble: '$orderDetails.total' }
            }
          }
        }
      ]);

      res.json(stats[0] || { totalOrders: 0, confirmedOrders: 0, totalRevenue: 0 });
    } catch (error) {
      logger.error('Error fetching daily stats', { error: error.message });
      res.status(500).json({ error: 'Error fetching daily stats' });
    }
  },

  async getMonthlyStats(req, res) {
    try {
      const startOfMonth = getStartOfMonth();
      const stats = await Order.aggregate([
        {
          $match: {
            'orderDetails.dateCreated': { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { 
                format: '%Y-%m-%d', 
                date: '$orderDetails.dateCreated'
              }
            },
            orders: { $sum: 1 },
            confirmed: {
              $sum: { $cond: ['$callStatus.confirmedByCall', 1, 0] }
            },
            revenue: {
              $sum: { $toDouble: '$orderDetails.total' }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json(stats);
    } catch (error) {
      logger.error('Error fetching monthly stats', { error: error.message });
      res.status(500).json({ error: 'Error fetching monthly stats' });
    }
  },

  async getConfirmationRate(req, res) {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            confirmed: {
              $sum: { $cond: ['$callStatus.confirmedByCall', 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            confirmed: 1,
            rate: {
              $multiply: [
                { $divide: ['$confirmed', '$total'] },
                100
              ]
            }
          }
        }
      ]);

      res.json(stats[0] || { total: 0, confirmed: 0, rate: 0 });
    } catch (error) {
      logger.error('Error fetching confirmation rate', { error: error.message });
      res.status(500).json({ error: 'Error fetching confirmation rate' });
    }
  }
};

module.exports = statsController;