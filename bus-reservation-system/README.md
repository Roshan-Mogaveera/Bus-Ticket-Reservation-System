# 🚌 BusHub - Online Bus Reservation System

A complete full-stack web application for online bus ticket booking with a modern, premium UI design inspired by RedBus and AbhiBus.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Admin Login](#admin-login)
- [Default Test Credentials](#default-test-credentials)
- [Features Overview](#features-overview)

## ✨ Features

### User Features
- **User Registration & Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Bus Search & Filtering** - Search by source, destination, date with filters (AC/Non-AC, price range)
- **Interactive Seat Selection** - Visual seat grid with real-time availability
- **Multiple Payment Methods** - UPI, Credit/Debit Card, Net Banking
- **Booking Management** - View, download, and cancel bookings
- **Digital Tickets** - QR code generation for e-tickets
- **User Profile Management** - Update address, change password, view booking statistics
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Admin Features
- **Admin Dashboard** - Real-time statistics, revenue analytics, charts
- **Bus Management** - Add, edit, delete buses
- **User Management** - View users, delete accounts
- **Booking Management** - View all bookings, track status
- **Revenue Analytics** - Monthly revenue trends and insights

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism design with animations
- **Vanilla JavaScript** - No frameworks required
- **Font Awesome Icons** - 6.4.0
- **QRCode.js** - QR code generation
- **Chart.js** - Revenue analytics charts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - 4.18.2 - Web framework
- **MySQL** - Database
- **JWT** - jsonwebtoken 9.0.2 - Authentication
- **bcryptjs** - 2.4.3 - Password hashing
- **CORS** - Cross-origin requests handling

## 📁 Project Structure

```
bus-reservation-system/
├── server.js                    # Express.js server entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Environment configuration
│
├── middleware/
│   └── auth.js                 # JWT authentication & authorization
│
├── routes/
│   ├── auth.js                 # User authentication endpoints
│   ├── buses.js                # Bus search & listing
│   ├── bookings.js             # Booking management
│   ├── payments.js             # Payment processing
│   ├── users.js                # User profile management
│   └── admin.js                # Admin dashboard & management
│
├── database/
│   └── schema.sql              # MySQL database schema
│
├── public/
│   ├── css/
│   │   └── style.css          # Global styling (1200+ lines)
│   └── js/
│       └── main.js            # JavaScript utilities & API helpers
│
└── views/
    ├── index.html             # Home page
    ├── register.html          # User registration
    ├── login.html             # User login
    ├── search.html            # Bus search results
    ├── seats.html             # Seat selection
    ├── payment.html           # Payment processing
    ├── confirmation.html      # Booking confirmation
    ├── bookings.html          # My bookings
    ├── profile.html           # User profile
    ├── about.html             # About & contact
    ├── buses.html             # Browse buses
    ├── admin-login.html       # Admin login
    ├── admin-dashboard.html   # Admin dashboard
    ├── manage-buses.html      # Admin bus management
    ├── manage-users.html      # Admin user management
    └── manage-bookings.html   # Admin booking management
```

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- MySQL 5.7+
- Git

### Step 1: Clone the Repository
```bash
cd bus-reservation-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create or update `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bus_reservation
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 4: Create MySQL Database
Open MySQL and execute:
```sql
CREATE DATABASE IF NOT EXISTS bus_reservation;
USE bus_reservation;
```

## 🗄️ Database Setup

### Step 1: Run Schema
```bash
mysql -u root -p bus_reservation < database/schema.sql
```

### Step 2: Insert Sample Data (Optional)
```sql
-- Admin Credentials
INSERT INTO admin (username, email, password, role) 
VALUES ('admin', 'admin@bushub.com', '$2b$10$YourHashedPassword', 'super_admin');

-- Sample Routes
INSERT INTO routes (source, destination, distance, estimated_duration) VALUES
('Delhi', 'Mumbai', 1400, '22'),
('Bangalore', 'Chennai', 350, '6'),
('Hyderabad', 'Pune', 600, '10'),
('Jaipur', 'Delhi', 240, '4');

-- Sample Buses
INSERT INTO buses (bus_name, bus_number, bus_type, seating_type, total_seats, route_id, operator_name, rating, amenities) VALUES
('Maharaja Express', 'MH01ABC', 'AC Volvo', '2x2', 45, 1, 'Maharaja Travels', 4.8, 'WiFi,Charging,Meals'),
('Sunrise Deluxe', 'SR02XYZ', 'Non-AC', '3x2', 50, 2, 'Sunrise Tours', 4.5, 'Blanket,Pillow');
```

## ▶️ Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Access the Application
- **User Portal**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin-login

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { full_name, email, phone, password }
```

#### User Login
```
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

#### Admin Login
```
POST /api/admin/login
Body: { username, password }
Returns: { token, admin }
```

### Bus Search Endpoints

#### Search Buses
```
GET /api/buses/search?source=Delhi&destination=Mumbai&date=2024-01-15&sortBy=price&filterBy=ac
```

#### Get Bus Details
```
GET /api/buses/:id
```

#### Get Available Seats
```
GET /api/buses/schedule/:schedule_id/seats
```

#### Popular Routes
```
GET /api/buses/routes/popular
```

### Booking Endpoints

#### Create Booking
```
POST /api/bookings/create
Body: { schedule_id, selected_seats, num_passengers, boarding_point, dropping_point }
```

#### Get My Bookings
```
GET /api/bookings/my-bookings
Auth: Required
```

#### Cancel Booking
```
PUT /api/bookings/:booking_id/cancel
Auth: Required
```

### Payment Endpoints

#### Process Payment
```
POST /api/payments/process
Body: { booking_id, amount, payment_method }
```

#### Check Payment Status
```
GET /api/payments/status/:transaction_id
```

### Admin Endpoints

#### Dashboard Stats
```
GET /api/admin/dashboard/stats
Auth: Admin Required
```

#### Get All Users
```
GET /api/admin/users
Auth: Admin Required
```

#### Delete User
```
DELETE /api/admin/users/:user_id
Auth: Admin Required
```

#### Get All Buses
```
GET /api/admin/buses
Auth: Admin Required
```

#### Get Revenue Analytics
```
GET /api/admin/analytics/revenue
Auth: Admin Required
```

## 🔐 Admin Login

### First-Time Admin Setup
1. Access MySQL console
2. Create admin user:
```sql
INSERT INTO admin (username, email, password, role) 
VALUES ('admin', 'admin@bushub.com', 'Admin@123', 'super_admin');
```
Note: In production, hash passwords with bcryptjs

3. Access Admin Panel: http://localhost:5000/admin-login

## 👤 Default Test Credentials

### Admin Account
- **Username**: admin
- **Password**: Admin@123
- **Access**: http://localhost:5000/admin-login

### Demo User Account
- **Email**: user@example.com
- **Password**: User@123

(Create test users through registration page for testing)

## 🎨 Design Highlights

### Glassmorphism Design
- Frosted glass effect (backdrop-filter: blur)
- Semi-transparent backgrounds with rgba colors
- Smooth gradient overlays

### Color Scheme
- Primary Dark: #1e3a8a (Dark Blue)
- Secondary: #4f46e5 (Indigo)
- Accent: #a855f7 (Purple)
- Neon Cyan: #06b6d4
- Neon Purple: #a855f7
- Success Green: #10b981
- Danger Red: #ef4444
- Warning Yellow: #f59e0b

### Typography
- Font Family: Segoe UI, Tahoma, sans-serif
- Primary Font Size: 16px
- Responsive scaling on smaller devices

### Animations
- `float` - Floating animation for hero elements
- `fadeInUp` - Fade in upward for page load
- `spin` - Rotation for loaders
- `pulse` - Pulsing effect for interactive elements

## 🎯 Features Implementation

### Search & Filter System
- Real-time filtering by AC/Non-AC type
- Price range slider
- Sort by: Price, Departure Time, Rating
- Save search parameters in sessionStorage

### Seat Selection
- Color-coded seats (Green: Available, Red: Booked, Blue: Selected)
- Real-time fare calculation
- Seat selection validation
- Multiple seats selection support

### Payment Integration
- 3 Payment Methods: UPI, Card, Net Banking
- Transaction ID generation
- 90% success rate simulation for testing
- Transaction history tracking

### Booking Management
- Real-time booking status
- Download & print tickets
- QR code generation for digital verification
- Cancellation with refund tracking

## 📱 Responsive Design

- **Desktop**: Full layout optimization
- **Tablet**: 768px breakpoint
- **Mobile**: 480px breakpoint
- Flexbox & CSS Grid for layout
- Touch-friendly buttons and forms

## 🔒 Security Features

- **JWT Authentication** - Token-based authentication
- **Bcrypt Password Hashing** - Secure password storage
- **Role-based Access Control** - Admin/User separation
- **Input Validation** - Email, phone, password validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Cross-origin request handling

## 🚀 Performance Optimization

- Lazy loading for images
- CSS minification ready
- JavaScript bundling ready
- Database query optimization with indices
- Connection pooling with mysql2

## 📖 Usage Examples

### Search for Buses
1. Go to home page
2. Enter Source, Destination, Date
3. Click "Search Buses"
4. Apply filters and sorting
5. Select a bus and click "Book Now"

### Complete a Booking
1. Search buses
2. Select preferred bus
3. Choose seats
4. Review fare
5. Select payment method
6. Confirm payment
7. Download ticket

### Manage Admin Dashboard
1. Login with admin credentials
2. View real-time statistics
3. Manage buses, users, bookings
4. View revenue analytics
5. Monitor system performance

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running
```bash
# On Windows
net start MySQL80

# On Mac/Linux
mysql.server start
```

### JWT Token Invalid
- Clear browser localStorage
- Login again to get new token
- Check JWT_SECRET in .env matches

### Port Already in Use
Change PORT in .env file:
```env
PORT=3000
```

### CORS Error
Ensure frontend URL matches CORS origin in server.js

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💼 Author

Created for Mini Project Demonstration and Viva Presentation

## 📞 Support

For issues or questions:
1. Check the API documentation above
2. Verify database setup
3. Review browser console for errors
4. Check server logs for backend errors

---

**Happy Bus Booking! 🚌✨**

Built with ❤️ using HTML5, CSS3, Vanilla JavaScript, Node.js, Express, and MySQL
