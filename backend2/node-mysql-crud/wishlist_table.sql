CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 