const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Order routes working!' });
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerId, items, totalAmount } = req.body;
    
    // Validate request data
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    if (totalAmount === undefined || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }
    
    console.log('Creating order for customer:', customerId);
    console.log('Order items:', items);
    console.log('Total amount:', totalAmount);
    
    // Step 1: Insert the order in the orders table
    const [orderResult] = await db.execute(
      'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
      [customerId, totalAmount, 'pending']
    );
    
    const orderId = orderResult.insertId;
    console.log('Order created with ID:', orderId);
    
    // Step 2: Insert each order item
    for (const item of items) {
      console.log('Adding item to order:', item.id);
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [
          orderId, 
          item.id, 
          item.qty, 
          (item.discount_price || item.price) || 0 // Handle potential undefined values
        ]
      );
    }
    
    console.log('Order completed successfully');
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Check for specific database errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        message: 'Database tables not set up correctly',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false, 
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get orders for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
    }
    
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get details of a specific order including items
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid order ID is required'
      });
    }
    
    // Get order details
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get order items
    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.image, p.price 
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    res.status(200).json({
      success: true,
      order: orders[0],
      items
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

// Add a route to handle order status updates
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status || typeof status !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const [result] = await db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status.toLowerCase(), orderId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or status not updated'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

module.exports = router;


