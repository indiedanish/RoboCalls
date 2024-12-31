const express = require('express');
const orderController = require('../controllers/orderController');
const statsController = require('../controllers/statsController');

const router = express.Router();

// Order routes
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:orderId', orderController.getOrderById);
router.get('/orders/status/:status', orderController.getOrdersByStatus);
router.get('/orders/date/:startDate/:endDate', orderController.getOrdersByDateRange);

// Stats routes
router.get('/stats/daily', statsController.getDailyStats);
router.get('/stats/monthly', statsController.getMonthlyStats);
router.get('/stats/confirmation-rate', statsController.getConfirmationRate);

module.exports = router;