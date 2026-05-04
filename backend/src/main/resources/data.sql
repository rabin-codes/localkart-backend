-- ============================================
-- LocalKart Complete Seed Data
-- ============================================

-- ----------------------
-- CLEANUP (Protect Foreign Key Integrity)
-- ----------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE chat_messages;
TRUNCATE TABLE combo_items;
TRUNCATE TABLE combo_orders;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE user_behaviors;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE delivery_partners;
TRUNCATE TABLE vendors;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------
-- CATEGORIES (8 total)
-- ----------------------
INSERT IGNORE INTO categories (id, name, description, image, icon) VALUES
('grocery',     'Grocery',     'Daily essentials, fruits, and vegetables', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', 'Apple'),
('electronics', 'Electronics', 'Gadgets, appliances, and tech accessories',  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', 'Smartphone'),
('pharmacy',    'Pharmacy',    'Medicines, health supplements, and care',  'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500', 'Activity'),
('fashion',     'Fashion',     'Clothing, footwear, and accessories',     'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', 'Shirt'),
('food',        'Food & Drink','Restaurant meals and packaged snacks',    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500', 'Coffee'),
('home',        'Home Decor',  'Kitchenware, decor, and home essentials',  'https://images.unsplash.com/photo-1583847268964-b28dc2f51ec9?w=500', 'Home'),
('sports',      'Sports',      'Fitness gear and sports equipment',        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 'Dumbbell'),
('personal-care','Personal Care','Skincare, haircare, and grooming',        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', 'User');

-- ----------------------
-- USERS
-- ----------------------
INSERT INTO users (id, name, email, password, role, shop_name, vehicle_type, license_number, phone, city, created_at, updated_at) VALUES
(1, 'Fresh Valley Store',   'vendor@localkart.com',    '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'Fresh Valley',     NULL, NULL,      '9876543210', 'Bhubaneswar', NOW(), NOW()),
(2, 'TechZone Hub',         'techzone@localkart.com',  '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'TechZone Hub',     NULL, NULL,      '9876500001', 'Bhubaneswar', NOW(), NOW()),
(3, 'MediCare Pharmacy',    'pharmacy@localkart.com',  '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'MediCare Pharmacy', NULL, NULL,      '9876500002', 'Bhubaneswar', NOW(), NOW()),
(4, 'Style Street',         'fashion@localkart.com',   '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'VENDOR',   'Style Street',     NULL, NULL,      '9876500003', 'Bhubaneswar', NOW(), NOW()),
(5, 'Raj Kumar',            'delivery@localkart.com',  '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'DELIVERY', NULL,               'Bike', 'OR-01-2024-001', '9876511111', 'Bhubaneswar', NOW(), NOW()),
(6, 'Arjun Singh',          'delivery2@localkart.com', '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'DELIVERY', NULL,               'Electric', 'OR-01-2024-002', '9876511112', 'Bhubaneswar', NOW(), NOW()),
(7, 'Priya Sharma',         'user@localkart.com',      '$2a$10$ajFLly6Mdnzvus3F4s.FSOlteTH6EMTQXq4iJFEan1WmFAglP6F/.', 'USER',     NULL,               NULL, NULL,      '9876522222', 'Bhubaneswar', NOW(), NOW())
ON DUPLICATE KEY UPDATE
password = VALUES(password),
name = VALUES(name),
updated_at = NOW();

-- ----------------------
-- VENDORS
-- ----------------------
INSERT IGNORE INTO vendors (user_id, shop_name, shop_description, is_approved, created_at) VALUES
(1, 'Fresh Valley', 'Fresh fruits and vegetables directly from farms.', true, NOW()),
(2, 'TechZone Hub', 'Latest gadgets and electronics at best prices.', true, NOW()),
(3, 'MediCare Pharmacy', 'Your one-stop shop for all medical needs.', true, NOW()),
(4, 'Style Street Fashion', 'Trendy apparel and accessories.', true, NOW());

-- ----------------------
-- DELIVERY PARTNERS
-- ----------------------
INSERT IGNORE INTO delivery_partners (user_id, vehicle_type, license_number, is_available, is_approved, created_at) VALUES
(5, 'Bike', 'OR-01-2024-001', true, true, NOW()),
(6, 'Electric Scooter', 'OR-01-2024-002', true, true, NOW());



-- ----------------------
-- PRODUCTS - GROCERY (Vendor 1: Fresh Valley)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Farm Fresh Tomatoes',     'Sun-ripened juicy tomatoes, 1 kg pack. Rich in lycopene.',               40.0,  55.0,  'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&h=500&fit=crop', 'grocery', 1, 150, 4.5, 280, true, 520, NOW(), NOW()),
('Organic Basmati Rice 5kg','Extra long grain premium basmati, aged for 2 years. Perfect biryani.',  450.0, 520.0, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', 'grocery', 1, 80,  4.7, 340, true, 210, NOW(), NOW()),
('Fresh Alphonso Mangoes',  '12-piece Alphonso mango box. The king of mangoes, naturally sweet.',      320.0, 380.0, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=500&fit=crop', 'grocery', 1, 60,  4.9, 520, true, 380, NOW(), NOW()),
('Full Cream Milk 1L',      'Pasteurized full cream milk from grass-fed cows. 3.5% fat content.',      65.0,  75.0,  'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=500&fit=crop', 'grocery', 1, 200, 4.6, 410, true, 890, NOW(), NOW()),
('Amul Butter 500g',        'Rich, creamy table butter. Made from fresh cream. Perfect spread.',       280.0, 310.0, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop', 'grocery', 1, 100, 4.8, 260, true, 430, NOW(), NOW()),
('Fresh Spinach Bunch',     'Tender baby spinach leaves. Pesticide-free farm fresh. 250g bundle.',     30.0,  40.0,  'https://images.unsplash.com/photo-1566842600175-97dca7c5a999?w=500&h=500&fit=crop', 'grocery', 1, 90,  4.3, 180, true, 340, NOW(), NOW()),
('Organic Bananas 6pcs',    'Farm-grown Cavendish bananas. Energy-packed, naturally sweet.',           45.0,  55.0,  'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&h=500&fit=crop', 'grocery', 1, 120, 4.4, 230, true, 560, NOW(), NOW()),
('Red Onions 1kg',          'Strong fragrant red onions. Essential kitchen staple. Farm direct.',       35.0,  45.0,  'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=500&h=500&fit=crop', 'grocery', 1, 200, 4.2, 190, true, 720, NOW(), NOW()),
('Fresh Green Chilies 200g','Crispy hot green chilies. Perfect for curries and chutneys.',             20.0,  30.0,  'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&h=500&fit=crop', 'grocery', 1, 180, 4.1, 150, true, 450, NOW(), NOW()),
('Greek Yogurt 400g',       'Thick creamy Greek-style yogurt. High protein, low fat. Probiotic rich.', 90.0, 110.0, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop', 'grocery', 1, 70,  4.6, 200, true, 310, NOW(), NOW());

-- ----------------------
-- PRODUCTS - ELECTRONICS (Vendor 2: TechZone Hub)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Wireless Noise-Cancel Earbuds', 'Active noise cancellation, 32hr battery, IPX5 waterproof. Premium bass.',  2499.0, 3999.0, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 'electronics', 2, 45, 4.7, 820, true, 340, NOW(), NOW()),
('Smart LED Bulb 9W',             'Wi-Fi enabled RGB bulb. 16M colors, works with Alexa & Google Home.',       449.0,  699.0,  'https://images.unsplash.com/photo-1550985543-f47f58316113?w=500&h=500&fit=crop', 'electronics', 2, 120, 4.4, 430, true, 280, NOW(), NOW()),
('USB-C Fast Charger 65W',        'GaN technology 65W charger. Charges laptop + phone simultaneously.',        1299.0, 1899.0, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=500&fit=crop', 'electronics', 2, 80,  4.5, 560, true, 210, NOW(), NOW()),
('Mechanical Keyboard RGB',       'Blue switches, full 104-key layout, per-key RGB, USB braided cable.',       3499.0, 4999.0, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop', 'electronics', 2, 30,  4.8, 290, true, 95,  NOW(), NOW()),
('Portable Power Bank 20000mAh',  'Dual fast-charge ports, LED display, lightweight 345g body.',              1699.0, 2499.0, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop', 'electronics', 2, 60,  4.6, 680, true, 420, NOW(), NOW());

-- ----------------------
-- PRODUCTS - PHARMACY (Vendor 3: MediCare)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Vitamin C 1000mg (60 tabs)',  'Immune-boosting Vitamin C with zinc. Time-release formula.',       299.0, 399.0, 'https://images.unsplash.com/photo-1550572017-ea08e4a4c5d7?w=500&h=500&fit=crop', 'pharmacy', 3, 200, 4.8, 920, true, 680, NOW(), NOW()),
('Digital Thermometer',         'Fast 10-sec reading. Fever alert beep. Memory function. CE certified.', 249.0, 349.0, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', 'pharmacy', 3, 80,  4.6, 450, true, 320, NOW(), NOW()),
('Hand Sanitizer 500ml',        '70% alcohol formula. Kills 99.9% germs. Moisturizing aloe vera.',    120.0, 160.0, 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&h=500&fit=crop', 'pharmacy', 3, 300, 4.3, 380, true, 890, NOW(), NOW()),
('Fish Oil Omega-3 (90 caps)',  'High-potency EPA+DHA. Heart & brain support. Odourless softgels.',  499.0, 699.0, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&h=500&fit=crop', 'pharmacy', 3, 150, 4.7, 560, true, 410, NOW(), NOW()),
('N95 Face Masks 10pc',         'NIOSH-certified N95 respirators. Multi-layer filtration. Adjustable.',199.0, 299.0, 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&h=500&fit=crop', 'pharmacy', 3, 400, 4.5, 820, true, 1200, NOW(), NOW());

-- ----------------------
-- PRODUCTS - FASHION (Vendor 4: Style Street)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Men Cotton Kurta - Navy',     'Premium handloom cotton kurta. Breathable fabric. Sizes S to XXL.',    899.0,  1299.0, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop', 'fashion', 4, 80,  4.6, 340, true, 210, NOW(), NOW()),
('Women Floral Kurti',          'Rayon digital print kurti. Comfortable fit. Sizes XS to 3XL.',         749.0,  1099.0, 'https://images.unsplash.com/photo-1610030469668-935142b96fe4?w=500&h=500&fit=crop', 'fashion', 4, 100, 4.5, 280, true, 320, NOW(), NOW()),
('Running Sneakers - White',    'Lightweight mesh upper, cushioned sole. Unisex design. Sizes 6-11.',   1499.0, 2299.0, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', 'fashion', 4, 60,  4.7, 520, true, 180, NOW(), NOW()),
('Aviator Sunglasses',          'UV400 polarized lenses. Metal frame. Classic pilot style.',             599.0,  999.0,  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', 'fashion', 4, 90,  4.4, 190, true, 260, NOW(), NOW()),
('Canvas Backpack 30L',         'Water-resistant canvas. Laptop compartment 15.6. USB charging port.',  1299.0, 1899.0, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', 'fashion', 4, 45,  4.5, 310, true, 140, NOW(), NOW());

-- ----------------------
-- PRODUCTS - FOOD (Vendor 1)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Masala Chai Latte Mix',       'Authentic Indian spiced tea blend. 200g, makes 40 cups.',             180.0, 250.0, 'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=500&h=500&fit=crop', 'food', 1, 150, 4.8, 620, true, 480, NOW(), NOW()),
('Dark Chocolate 70% 100g',     'Single origin Ecuador cacao. Rich bitter notes. Vegan certified.',    220.0, 299.0, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=500&fit=crop', 'food', 1, 200, 4.7, 380, true, 290, NOW(), NOW()),
('Mixed Dry Fruits 250g',       'Premium cashew, almond, walnut, pistachio mix. Zero added sugar.',   450.0, 599.0, 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=500&fit=crop', 'food', 1, 80,  4.9, 580, true, 360, NOW(), NOW()),
('Cold Pressed Orange Juice 1L','100% natural, no preservatives, no added sugar. Freshly pressed.',    149.0, 199.0, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=500&fit=crop', 'food', 1, 60,  4.5, 240, true, 420, NOW(), NOW());

-- ----------------------
-- PRODUCTS - HOME (Vendor 2)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Bamboo Chopping Board',       'Eco-friendly extra-large bamboo board. Anti-bacterial, easy clean.', 599.0,  899.0,  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', 'home', 2, 70,  4.6, 280, true, 190, NOW(), NOW()),
('Aromatherapy Diffuser',       'Ultrasonic mist diffuser. 7-color LED. 400ml tank, 8hr runtime.',   1299.0, 1799.0, 'https://images.unsplash.com/photo-1608181831688-5e5b0a2b9cf8?w=500&h=500&fit=crop', 'home', 2, 40,  4.7, 350, true, 130, NOW(), NOW());

-- ----------------------
-- PRODUCTS - SPORTS (Vendor 2)
-- ----------------------
INSERT IGNORE INTO products (name, description, price, original_price, image, category_id, vendor_id, stock, rating, reviews, is_active, sold_count, created_at, updated_at) VALUES
('Resistance Bands Set (5pcs)', 'Latex resistance bands 10-50 lbs. Full body workout anywhere.',      499.0,  799.0,  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop', 'sports', 2, 120, 4.5, 420, true, 280, NOW(), NOW()),
('Yoga Mat Premium 6mm',        'Non-slip TPE foam mat. 183x61cm. Includes carrying strap.',          899.0,  1299.0, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop', 'sports', 2, 85,  4.6, 380, true, 220, NOW(), NOW()),
('Protein Shaker Bottle 700ml', 'BPA-free tritan. Integrated mixing ball. Leak-proof lid. 700ml.',   349.0,  499.0,  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop', 'sports', 2, 150, 4.3, 290, true, 410, NOW(), NOW());

-- ----------------------
-- INITIAL BEHAVIORS (for AI Prediction demo)
-- ----------------------
INSERT INTO user_behaviors (user_id, product_id, order_count, last_ordered_at, next_predicted_order, category_name, prediction_reason) VALUES
((SELECT id FROM users WHERE email='user@localkart.com'), (SELECT id FROM products WHERE name='Farm Fresh Tomatoes' LIMIT 1), 12, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 'Grocery', 'You order Tomatoes every week'),
((SELECT id FROM users WHERE email='user@localkart.com'), (SELECT id FROM products WHERE name='Full Cream Milk 1L' LIMIT 1), 8,  DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'Grocery', 'You usually refill Milk by now');

-- ----------------------
-- SAMPLE CHATS (for demo)
-- ----------------------
INSERT INTO chat_messages (sender_id, recipient_id, message, is_read, sent_at, room_id) VALUES
((SELECT id FROM users WHERE email='vendor@localkart.com'), (SELECT id FROM users WHERE email='user@localkart.com'), 'Welcome to Fresh Valley! Let us know if you need anything specific.', true, DATE_SUB(NOW(), INTERVAL 1 DAY), 'user_7_vendor_1'),
((SELECT id FROM users WHERE email='user@localkart.com'), (SELECT id FROM users WHERE email='vendor@localkart.com'), 'Do you have fresh alphonso mangoes today?', true, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'user_7_vendor_1');
