const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Root endpoint
app.get('/', (req, res) => {
  res.send('FAQ API is running.');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});