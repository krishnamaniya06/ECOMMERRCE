-- Insert sample products only if the table is empty
INSERT INTO products (name, image, description, price, discount_price, category, type, date)
SELECT 'Gold Necklace', 'http://localhost:5000/uploads/necklace1.jpg', 'Beautiful gold necklace with intricate design', 499.99, 449.99, 'necklaces', 'necklaces', CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO products (name, image, description, price, discount_price, category, type, date)
SELECT 'Silver Earrings', 'http://localhost:5000/uploads/earrings1.jpg', 'Elegant silver earrings for any occasion', 99.99, 89.99, 'earrings', 'earrings', CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO products (name, image, description, price, discount_price, category, type, date)
SELECT 'Diamond Ring', 'http://localhost:5000/uploads/ring1.jpg', 'Stunning diamond ring with platinum band', 999.99, 899.99, 'rings', 'rings', CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1); 