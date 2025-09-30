const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tneb_payments';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Models
const paymentSchema = new mongoose.Schema({
  serviceNumber: { type: String, required: true, trim: true },
  consumerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  units: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  transactionId: { 
    type: String, 
    unique: true, 
    default: () => `TNEB${Date.now()}${Math.floor(Math.random() * 1000)}` 
  },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'TNEB Backend Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/payments', async (req, res) => {
  try {
    const { serviceNumber, consumerName, email, phone, units, amount } = req.body;

    if (!serviceNumber || !consumerName || !email || !units) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newPayment = new Payment({
      serviceNumber,
      consumerName,
      email,
      phone: phone || '',
      units: parseInt(units),
      amount
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        transactionId: savedPayment.transactionId,
        amount: savedPayment.amount,
        serviceNumber: savedPayment.serviceNumber,
        consumerName: savedPayment.consumerName,
        units: savedPayment.units,
        createdAt: savedPayment.createdAt
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { id: savedContact._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

app.get('/api/analytics/summary', async (req, res) => {
  try {
    const totalConsumers = await Payment.distinct('serviceNumber').then(r => r.length);
    const totalPayments = await Payment.countDocuments();
    const revenueResult = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const unitsResult = await Payment.aggregate([
      { $group: { _id: null, avgUnits: { $avg: '$units' } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalConsumers,
          totalPayments,
          totalRevenue: revenueResult[0]?.totalRevenue || 0,
          averageUnits: unitsResult[0]?.avgUnits || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`
🚀 TNEB Backend Server Started Successfully!
📍 Server running on: http://localhost:${PORT}
🗄️  Database: MongoDB
📊 API Health: http://localhost:${PORT}/api/health
  `);
});