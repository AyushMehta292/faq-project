const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const faqRoutes = require('./routes/faq');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const FAQ = require('./models/faq');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.use('/api', faqRoutes);

// Setup AdminJS for a user-friendly admin interface
AdminJS.registerAdapter(AdminJSMongoose);
const adminJs = new AdminJS({
  resources: [{ resource: FAQ, options: {} }],
  rootPath: '/admin',
});
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('FAQ API is running.');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});