const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require("axios");
const jwt = require('jsonwebtoken'); // Make sure this is installed
const cookieParser = require('cookie-parser'); // Add this package with npm install cookie-parser
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Updated CORS config to allow credentials
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie parser middleware

const db = require('./models/db');

// JWT secret key - move to .env file in production
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const [checkResult] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      console.log(`User not found: ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    console.log(`User found, comparing passwords...`);
    
    // Store the hashed password from the database for comparison
    const hashedPassword = user.password;
    
    try {
      // Compare password with proper error handling
      const isMatch = await bcrypt.compare(password, hashedPassword);
      console.log(`Password match result: ${isMatch}`);
      
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token with user info
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
  
      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      });
  
      // Return token and user data in response for client-side storage
      res.json({ 
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      
      // If there's an issue with bcrypt comparison, we can implement a fallback
      // This is not recommended for production but can help diagnose the issue
      if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_BYPASS === 'true') {
        // Generate emergency token
        const token = jwt.sign(
          { 
            userId: user.id, 
            email: user.email, 
            role: user.role 
          }, 
          JWT_SECRET, 
          { expiresIn: '1h' }
        );
        
        return res.json({
          message: 'Emergency login successful (bypass mode)',
          token: token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        });
      } else {
        return res.status(500).json({ message: 'Authentication error' });
      }
    }
  } catch (err) {
    console.error('Database or server error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Add logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Add user info to request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Example protected route
app.get('/api/user-profile', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Protected data retrieved successfully',
    user: req.user
  });
});

// Get user orders endpoint
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Query to get orders for the logged-in user
    const [orders] = await db.execute(
      "SELECT *, created_at as order_date FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
      [userEmail]
    );
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get detailed order history with items
app.get('/api/order-history', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log(`Fetching order history for user: ${userEmail}`);
    
    // First get all orders for this user
    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
      [userEmail]
    );
    
    console.log(`Found ${orders.length} orders for user ${userEmail}`);
    
    if (!orders || orders.length === 0) {
      return res.json([]); // Return empty array if no orders
    }
    
    try {
      // For each order, get the order items with product details
      const orderHistory = await Promise.all(orders.map(async (order) => {
        try {
          console.log(`Processing order ID: ${order.id}`);
          
          // Check if order has valid ID
          if (!order.id) {
            console.error(`Order missing ID: ${JSON.stringify(order)}`);
            return { ...order, items: [] };
          }
          
          // Get items for this order with product information
          const [items] = await db.execute(
            `SELECT oi.*, p.name, p.image, p.price, p.discount_price 
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
          );
          
          console.log(`Found ${items.length} items for order ID: ${order.id}`);
          
          return {
            ...order,
            items: items || [],
            // Map created_at to order_date for frontend compatibility
            order_date: order.created_at
          };
        } catch (itemError) {
          console.error(`Error fetching items for order ${order.id}:`, itemError);
          // Return the order with empty items rather than failing completely
          return { 
            ...order, 
            items: [],
            // Map created_at to order_date for frontend compatibility
            order_date: order.created_at
          };
        }
      }));
      
      res.json(orderHistory);
    } catch (mapError) {
      console.error('Error processing orders:', mapError);
      // Return just the basic orders without items if the mapping fails
      res.json(orders.map(order => ({ 
        ...order, 
        items: [],
        // Map created_at to order_date for frontend compatibility
        order_date: order.created_at
      })));
    }
  } catch (error) {
    console.error('Error fetching detailed order history:', error);
    res.status(500).json({ 
      message: 'Server error fetching detailed order history',
      error: error.message 
    });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome!',
    text: 'Thank you for subscribing!',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send email.', error });
  }
});

// DEBUG ONLY - Add a debug endpoint to check users (remove in production)
app.get('/api/debug/users', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' });
  }
  
  try {
    const [users] = await db.execute('SELECT id, email, role, SUBSTRING(password, 1, 10) as password_preview FROM users');
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an order with items
app.post('/api/order', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { 
      order_items, 
      total_amount, 
      status = 'pending'  // Default status if not provided
    } = req.body;
    
    const userEmail = req.user.email;
    console.log(`Creating order for user: ${userEmail}`);
    console.log('Order details:', { total_amount, status, items_count: order_items?.length || 0 });
    
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Start transaction
    await connection.beginTransaction();
    
    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_id, total_amount, status, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [userEmail, total_amount, status]
    );
    
    if (!orderResult.insertId) {
      throw new Error('Failed to create order');
    }
    
    const orderId = orderResult.insertId;
    console.log(`Created order with ID: ${orderId}`);
    
    // Create order items
    for (const item of order_items) {
      const { product_id, quantity, price } = item;
      
      console.log(`Adding item to order: product_id=${product_id}, quantity=${quantity}, price=${price}`);
      
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, product_id, quantity, price]
      );
    }
    
    // Commit transaction
    await connection.commit();
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      order_id: orderId 
    });
    
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error creating order',
      error: error.message 
    });
  } finally {
    connection.release();
  }
});

app.use("/api/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});