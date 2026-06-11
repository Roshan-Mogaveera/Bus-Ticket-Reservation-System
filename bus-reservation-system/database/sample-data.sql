-- ============================================
-- BusHub - Sample Data for Testing
-- ============================================
-- This file contains sample data for testing
-- Run after schema.sql: mysql -u root -p bus_reservation < sample-data.sql

-- ============================================
-- INSERT ADMIN ACCOUNTS
-- ============================================
INSERT INTO admin (username, email, password, role) VALUES
('admin', 'admin@bushub.com', '$2b$10$..hashhere..', 'super_admin');
-- Note: Hash the password using bcryptjs before inserting
-- Default password is: Admin@123

-- ============================================
-- INSERT ROUTES
-- ============================================
INSERT INTO routes (source, destination, distance, estimated_duration) VALUES
('Delhi', 'Mumbai', 1400, '22'),
('Mumbai', 'Delhi', 1400, '22'),
('Bangalore', 'Chennai', 350, '6'),
('Chennai', 'Bangalore', 350, '6'),
('Hyderabad', 'Pune', 600, '10'),
('Pune', 'Hyderabad', 600, '10'),
('Jaipur', 'Delhi', 240, '4'),
('Delhi', 'Jaipur', 240, '4'),
('Goa', 'Bangalore', 600, '10'),
('Bangalore', 'Goa', 600, '10'),
('Kolkata', 'Delhi', 1500, '24'),
('Delhi', 'Kolkata', 1500, '24'),
('Lucknow', 'Delhi', 400, '7'),
('Delhi', 'Lucknow', 400, '7'),
('Ahmedabad', 'Mumbai', 500, '9'),
('Mumbai', 'Ahmedabad', 500, '9');

-- ============================================
-- INSERT BUSES
-- ============================================
INSERT INTO buses (bus_name, bus_number, bus_type, seating_type, total_seats, route_id, operator_name, rating, amenities) VALUES
-- Delhi to Mumbai Routes
('Maharaja Express', 'MH01ABC', 'AC Volvo', '2x2', 45, 1, 'Maharaja Travels', 4.8, '["WiFi","Charging","Meals"]'),
('Sunrise Deluxe', 'SR02XYZ', 'Non-AC', '3x2', 50, 2, 'Sunrise Tours', 4.5, '["Blanket","Pillow"]'),
('Royal Coach', 'RC03PQR', 'AC Volvo', '2x2', 48, 1, 'Royal Services', 4.7, '["WiFi","Charging","Meals","USB"]'),
('Express Elite', 'EX04MNO', 'Non-AC', '3x2', 54, 2, 'Express India', 4.3, '["Blanket","Pillow","Snacks"]'),

-- Bangalore to Chennai Routes
('Comfort Plus', 'CP05STU', 'AC Volvo', '2x2', 42, 3, 'Comfort Tours', 4.6, '["WiFi","Charging","Meals"]'),
('Swift Travels', 'SW06VWX', 'Non-AC', '3x2', 50, 4, 'Swift Express', 4.4, '["Blanket","Pillow"]'),

-- Hyderabad to Pune Routes
('Star Coach', 'SC07YZA', 'AC Volvo', '2x2', 46, 5, 'Star Travels', 4.9, '["WiFi","Charging","Meals","Entertainment"]'),
('Economy Plus', 'EP08BCD', 'Non-AC', '3x2', 52, 6, 'Economy Tours', 4.2, '["Blanket","Pillow"]'),

-- Jaipur to Delhi Routes
('Pink City Express', 'PC09EFG', 'AC Volvo', '2x2', 40, 7, 'Pink City Tours', 4.7, '["WiFi","Charging"]'),
('Quick Coach', 'QC10HIJ', 'Non-AC', '3x2', 48, 8, 'Quick Transport', 4.1, '["Blanket","Pillow"]'),

-- Additional Routes
('Ocean Wave', 'OW11KLM', 'AC Volvo', '2x2', 44, 9, 'Ocean Tours', 4.6, '["WiFi","Charging","Meals"]'),
('Northern Express', 'NE12NOP', 'Non-AC', '3x2', 56, 10, 'Northern Routes', 4.3, '["Blanket","Pillow"]'),
('Metro Travel', 'MT13QRS', 'AC Volvo', '2x2', 42, 11, 'Metro Services', 4.8, '["WiFi","Charging","Meals","USB"]'),
('Valley Coach', 'VC14TUV', 'Non-AC', '3x2', 50, 12, 'Valley Tours', 4.4, '["Blanket","Pillow"]');

-- ============================================
-- INSERT BUS SCHEDULES
-- ============================================
INSERT INTO bus_schedule (bus_id, departure_date, departure_time, arrival_time, ticket_price, available_seats, status) VALUES
-- Delhi to Mumbai (1)
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00', '16:00', 800, 30, 'active'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00', '16:00', 800, 45, 'active'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00', '17:00', 600, 35, 'active'),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00', '18:00', 850, 40, 'active'),
(3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:00', '18:00', 850, 48, 'active'),

-- Bangalore to Chennai (3)
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00', '14:00', 450, 25, 'active'),
(5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00', '14:00', 450, 42, 'active'),
(6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00', '15:00', 350, 38, 'active'),

-- Hyderabad to Pune (5)
(7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '22:00', '08:00', 550, 32, 'active'),
(8, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '23:00', '09:00', 400, 45, 'active'),

-- Jaipur to Delhi (7)
(9, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00', '10:00', 300, 28, 'active'),
(10, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00', '11:00', 250, 40, 'active');

-- ============================================
-- INSERT DEMO USERS
-- ============================================
INSERT INTO users (full_name, email, phone, password, address, city, state, pincode) VALUES
('Rajesh Kumar', 'rajesh@example.com', '9876543210', '$2b$10$..hashhere..', '123 Main St', 'Delhi', 'Delhi', '110001'),
('Priya Singh', 'priya@example.com', '9876543211', '$2b$10$..hashhere..', '456 Oak Ave', 'Mumbai', 'Maharashtra', '400001'),
('Amit Patel', 'amit@example.com', '9876543212', '$2b$10$..hashhere..', '789 Pine Road', 'Bangalore', 'Karnataka', '560001');
-- Note: Hash passwords before inserting. Demo password: User@123

-- ============================================
-- INSERT SAMPLE BOOKINGS
-- ============================================
INSERT INTO bookings (booking_id, user_id, bus_id, schedule_id, departure_date, selected_seats, num_passengers, total_fare, booking_status, boarding_point, dropping_point) VALUES
('BH001', 1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '["1A","1B"]', 2, 1600, 'Confirmed', 'Delhi Central', 'Mumbai Station'),
('BH002', 2, 5, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '["5A"]', 1, 450, 'Confirmed', 'Bangalore Central', 'Chennai Airport'),
('BH003', 3, 7, 9, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '["12A","12B","12C"]', 3, 1650, 'Pending', 'Hyderabad Station', 'Pune Station');

-- ============================================
-- INSERT SAMPLE PAYMENTS
-- ============================================
INSERT INTO payments (booking_id, transaction_id, payment_method, amount, payment_status, payment_date) VALUES
(1, 'TXN001', 'UPI', 1600, 'Success', NOW()),
(2, 'TXN002', 'Card', 450, 'Success', NOW()),
(3, 'TXN003', 'Net Banking', 1650, 'Success', NOW());

-- ============================================
-- INSERT SAMPLE REVIEWS
-- ============================================
INSERT INTO reviews (user_id, bus_id, rating, review_text) VALUES
(1, 1, 5, 'Excellent bus service! Very comfortable and clean. Highly recommended!'),
(2, 5, 4, 'Good experience. On-time arrival and courteous staff.'),
(3, 7, 5, 'Premium service with great amenities. Will book again!'),
(1, 2, 3, 'Average experience. Could improve on cleanliness.');

-- ============================================
-- INSERT SEATS FOR SCHEDULES
-- ============================================
-- Schedule 1 - 45 seats
INSERT INTO seats (bus_id, schedule_id, seat_number, is_available) 
SELECT 1, 1, CONCAT(CEILING(ROW_NUMBER() OVER ()/2), CHAR(64 + MOD(ROW_NUMBER() OVER (), 2) + 1)), TRUE
FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) AS a
CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) AS b LIMIT 45;

-- ============================================
-- NOTES
-- ============================================
-- 1. Update password hashes with actual bcrypt hashes:
--    Use: bcryptjs.hash('password', 10)
--    
-- 2. Sample login credentials:
--    Email: rajesh@example.com
--    Password: User@123
--    
--    Email: priya@example.com
--    Password: User@123
--    
-- 3. Admin login:
--    Username: admin
--    Password: Admin@123
--
-- 4. Run this file AFTER schema.sql:
--    mysql -u root -p bus_reservation < database/schema.sql
--    mysql -u root -p bus_reservation < database/sample-data.sql
