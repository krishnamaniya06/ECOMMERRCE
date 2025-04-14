const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e-commerce',
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Read and execute wishlist table SQL
  const wishlistSQL = fs.readFileSync('./wishlist_table.sql', 'utf8');
  db.query(wishlistSQL, (err, result) => {
    if (err) {
      console.error('Error creating wishlist table:', err);
    } else {
      console.log('Wishlist table created or already exists');
    }
    
    // Read and execute products table SQL
    const productsSQL = fs.readFileSync('./products_table.sql', 'utf8');
    db.query(productsSQL, (err, result) => {
      if (err) {
        console.error('Error creating products table:', err);
      } else {
        console.log('Products table created or already exists');
      }
      
      // Insert sample product data
      const sampleProductSQL = fs.readFileSync('./sample_product.sql', 'utf8');
      db.query(sampleProductSQL, (err, result) => {
        if (err) {
          console.error('Error inserting sample products:', err);
        } else {
          console.log('Sample products inserted if table was empty');
        }
        db.end();
      });
    });
  });
}); 