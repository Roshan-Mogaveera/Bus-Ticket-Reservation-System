-- Create Database
CREATE DATABASE IF NOT EXISTS bus_reservation;
USE bus_reservation;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance INT,
    estimated_duration TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buses Table
CREATE TABLE IF NOT EXISTS buses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_name VARCHAR(100) NOT NULL,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    bus_type ENUM('AC', 'Non-AC') DEFAULT 'AC',
    seating_type ENUM('Seater', 'Sleeper', 'Semi-Sleeper') DEFAULT 'Seater',
    total_seats INT NOT NULL,
    route_id INT NOT NULL,
    operator_name VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 4.5,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- Bus Schedule Table
CREATE TABLE IF NOT EXISTS bus_schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('Active', 'Cancelled', 'Completed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_schedule (bus_id, departure_date)
);

-- Seats Table
CREATE TABLE IF NOT EXISTS seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT NOT NULL,
    schedule_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES bus_schedule(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (schedule_id, seat_number)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    schedule_id INT NOT NULL,
    departure_date DATE NOT NULL,
    selected_seats JSON NOT NULL,
    num_passengers INT NOT NULL,
    total_fare DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('Confirmed', 'Pending', 'Cancelled') DEFAULT 'Pending',
    boarding_point VARCHAR(100),
    dropping_point VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES bus_schedule(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    payment_method ENUM('UPI', 'Card', 'NetBanking') DEFAULT 'UPI',
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Success', 'Failed', 'Pending') DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- Indices for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_bus_route ON buses(route_id);
CREATE INDEX idx_schedule_date ON bus_schedule(departure_date);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_payment_status ON payments(payment_status);
