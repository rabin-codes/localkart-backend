-- Seed data for LocalKart

-- Categories
INSERT IGNORE INTO categories (id, name, description, image) VALUES 
('grocery', 'Grocery', 'Fresh vegetables, fruits, and daily essentials', '/images/categories/grocery.jpg'),
('electronics', 'Electronics', 'Mobiles, laptops, and home appliances', '/images/categories/electronics.jpg'),
('fashion', 'Fashion', 'Clothing, footwear, and accessories', '/images/categories/fashion.jpg'),
('pharmacy', 'Pharmacy', 'Medicines and healthcare products', '/images/categories/pharmacy.jpg');

-- Initial Admin/Vendor (Password is 'Swain@123' encoded)
INSERT IGNORE INTO users (id, name, email, password, role, shop_name, created_at, updated_at) VALUES 
(1, 'Admin Vendor', 'vendor@localkart.com', '$2a$10$8.UnVuG9HHgffUDAlk8qnOnvX9tP5S.BkjJjN6C5/O5a1R/9tZ.V.', 'VENDOR', 'LocalKart Central Store', NOW(), NOW());

-- Initial Products
INSERT IGNORE INTO products (name, description, price, image, category_id, vendor_id, stock, is_active, created_at) VALUES 
('Fresh Organic Tomatoes', '1kg farm fresh red tomatoes', 40.0, '/images/products/tomato.jpg', 'grocery', 1, 100, true, NOW()),
('Basmati Rice 5kg', 'Premium long grain basmati rice', 450.0, '/images/products/rice.jpg', 'grocery', 1, 50, true, NOW()),
('Wireless Earbuds', 'Noise cancelling high bass earbuds', 1200.0, '/images/products/earbuds.jpg', 'electronics', 1, 20, true, NOW());
