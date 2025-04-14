CREATE TABLE IF NOT EXISTS `products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2),
  `category` VARCHAR(100) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 