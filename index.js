const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/user');
const alertRoutes = require('./routes/alerts');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
require('./config/db')();

// Routes
app.get('/', (req, res) => {
  res.send('API running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


//  Routes
app.use('/auth', authRoutes);
app.use('/alerts', alertRoutes);
