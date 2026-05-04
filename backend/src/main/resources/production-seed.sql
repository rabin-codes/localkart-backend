-- ============================================
-- LocalKart Enhanced Production Seed Data
-- ============================================

USE localkart_db;

-- 1. CLEANUP (Protect Foreign Key Integrity)
-- ----------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE chat_messages;
TRUNCATE TABLE user_behaviors;
TRUNCATE TABLE combo_items;
TRUNCATE TABLE combo_orders;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, name, email, password, role, shop_name, phone, city, created_at, updated_at) VALUES 
(1, 'Fresh Valley Admin', 'vendor@localkart.com',   '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'Fresh Valley Store',    '9876543210', 'Bhubaneswar', NOW(), NOW()),
(2, 'Tech Hub Manager',  'techzone@localkart.com', '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'TechZone Hub',          '9876500001', 'Bhubaneswar', NOW(), NOW()),
(3, 'Priya Sharma',      'user@localkart.com',     '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'USER',     NULL,                    '9876522222', 'Bhubaneswar', NOW(), NOW()),
(4, 'Raj Kumar',         'delivery@localkart.com', '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'DELIVERY', NULL,                    '9876511111', 'Bhubaneswar', NOW(), NOW());

-- 2. Categories
-- ----------------------
DELETE FROM categories;
INSERT INTO categories (id, name, description, image, icon) VALUES 
('grocery',     'Grocery',         'Fresh vegetables, fruits & daily essentials', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', '🛒'),
('electronics', 'Electronics',     'Gagdets, mobiles & accessories',              'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800', '📱'),
('pharmacy',    'Pharmacy',        'Medicines & healthcare products',             'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800', '💊'),
('food',        'Food & Beverages','Delicious local meals & snacks',              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', '🍔');

-- 3. Products
-- ----------------------
DELETE FROM products;
INSERT INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES 
('Organic Milk 1L',   'Farm fresh organic full cream milk',                65.0,  75.0,  'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500', 'grocery',     1, 100, 4.8, 240, true, 850, NOW(), NOW()),
('Fresh Tomatoes 1kg','Sun-ripened local heritage tomatoes',               40.0,  55.0,  'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500', 'grocery',     1, 150, 4.5, 310, true, 1200, NOW(), NOW()),
('Wireless Buds',    'Premium noise canceling wireless earbuds',           2499.0, 3999.0, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'electronics', 2, 45,  4.7, 560, true, 340, NOW(), NOW()),
('Fast Charger 65W',  'High speed Gan technology laptop & phone charger', 1299.0, 1899.0, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', 'electronics', 2, 80,  4.5, 420, true, 210, NOW(), NOW());

-- 4. Initial Behaviors (for AI Prediction demo)
-- ----------------------
DELETE FROM user_behaviors;
INSERT INTO user_behaviors (user_id, product_id, order_count, last_ordered_at, next_predicted_order, category_name, prediction_reason) VALUES
(3, 1, 12, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 'Grocery', 'You order Organic Milk every week'),
(3, 2, 8,  DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'Grocery', 'You usually refill Tomatoes by now');

-- 5. Chats (for demo)
-- ----------------------
DELETE FROM chat_messages;
INSERT INTO chat_messages (sender_id, receiver_id, message, is_read, created_at) VALUES
(1, 3, 'Welcome to Fresh Valley! Let us know if you need anything specific.', true, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 1, 'Do you have fresh alphonso mangoes today?', true, DATE_SUB(NOW(), INTERVAL 2 HOUR));
