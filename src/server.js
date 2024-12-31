require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const connectDB = require('./config/database');
const webhookRoutes = require('./routes/webhookRoutes');
const twilioRoutes = require('./routes/twilioRoutes');
const apiRoutes = require('./routes/apiRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookRoutes);
app.use('/twilio', twilioRoutes);
app.use('/api', apiRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});