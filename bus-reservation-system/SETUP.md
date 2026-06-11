# 🚀 Quick Start Guide - BusHub Setup Instructions

## ⚡ 5-Minute Quick Setup

Follow these steps to get BusHub running on your machine for demonstration and viva presentation.

### Step 1: Prerequisites Installation (if not already installed)
```bash
# Download and install from:
# Node.js: https://nodejs.org/ (v14 or higher)
# MySQL: https://dev.mysql.com/downloads/mysql/

# Verify installations:
node --version
npm --version
mysql --version
```

### Step 2: Navigate to Project Directory
```bash
cd bus-reservation-system
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Set Up Database

**Option A: Automatic Setup (Recommended)**

1. Open MySQL Command Line:
```bash
mysql -u root -p
```

2. Enter your MySQL password (if you set one during installation, otherwise press Enter)

3. Execute these commands:
```sql
CREATE DATABASE IF NOT EXISTS bus_reservation;
USE bus_reservation;
SOURCE database/schema.sql;
SOURCE database/sample-data.sql;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Create new connection to localhost
3. File → Open SQL Script → Select `database/schema.sql`
4. Execute script
5. Repeat for `database/sample-data.sql`

### Step 5: Configure Environment Variables

Edit `.env` file in the project root:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bus_reservation
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important Notes:**
- If MySQL password is set, replace empty string with your password
- Change JWT_SECRET to a random string for security

### Step 6: Start the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Step 7: Access the Application

Open your browser and navigate to:

- **User Portal**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin-login

## 🧪 Test the Application

### Test User Credentials
```
Email: rajesh@example.com
Password: User@123
```

OR

```
Email: priya@example.com
Password: User@123
```

### Admin Credentials
```
Username: admin
Password: Admin@123
```

### Demo Flow for Presentation

1. **Home Page** → Browse featured buses and operators
2. **Register/Login** → Create account or login with demo credentials
3. **Search Buses** → Enter Delhi, Mumbai with tomorrow's date
4. **Select & Seat Selection** → Pick a bus and select seats
5. **Payment** → Choose payment method and pay
6. **Confirmation** → View digital ticket with QR code
7. **Admin Dashboard** → Login as admin, view statistics and analytics
8. **Manage Bookings** → View and manage all bookings

## 📋 Project File Structure
```
bus-reservation-system/
├── server.js                    ← Express.js main server
├── package.json                 ← Project dependencies
├── .env                         ← Configuration file
├── README.md                    ← Full documentation
├── SETUP.md                     ← This file
├── database/
│   ├── schema.sql              ← Database schema
│   └── sample-data.sql         ← Sample test data
├── routes/                      ← API endpoints
├── middleware/                  ← Authentication
├── public/
│   ├── css/style.css           ← Styling
│   └── js/main.js              ← JavaScript utilities
└── views/                       ← HTML pages
```

## ✨ Key Features to Demo

### User Features
- ✅ User Registration & Login
- ✅ Bus Search with Filters
- ✅ Interactive Seat Selection
- ✅ Payment Processing
- ✅ Digital Tickets with QR Code
- ✅ Booking Management
- ✅ Profile Management

### Admin Features
- ✅ Dashboard with Statistics
- ✅ Revenue Analytics Charts
- ✅ Bus Management
- ✅ User Management
- ✅ Booking Management

### Technical Highlights
- ✅ Glassmorphism Design
- ✅ Responsive UI
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Secure Password Hashing
- ✅ MySQL Database
- ✅ Modern CSS & JavaScript

## 🔍 Troubleshooting

### Error: "Cannot connect to database"
```
Solution: 
1. Check MySQL is running: mysql -u root -p
2. Verify DB credentials in .env
3. Check database exists: SHOW DATABASES;
```

### Error: "Port 5000 already in use"
```
Solution:
1. Change PORT in .env to 3000 or another number
2. OR kill process on port 5000
```

### Error: "Module not found"
```
Solution:
npm install
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv body-parser
```

### Seeds/Bookings not showing
```
Solution:
1. Verify sample-data.sql was executed
2. Check database has data: SELECT * FROM bookings;
3. Re-run sample-data.sql if needed
```

## 📱 Responsive Design Testing

**Desktop:** Full layout - Open at 1200px or wider  
**Tablet:** Medium layout - Open at 768px-1200px  
**Mobile:** Mobile layout - Open at 360px-768px

Use browser DevTools (F12) → Toggle device toolbar to test responsive design

## 🔐 Security Notes

For production deployment:
1. Change JWT_SECRET to a strong random string
2. Use environment-specific configuration
3. Enable HTTPS
4. Implement rate limiting
5. Add input validation on server-side
6. Use encrypted database connections
7. Implement proper error handling
8. Add logging and monitoring

## 📊 Database Schema Overview

**8 Tables:**
- `users` - User accounts
- `admin` - Admin accounts
- `routes` - Bus routes
- `buses` - Bus information
- `bus_schedule` - Schedules & prices
- `seats` - Seat availability
- `bookings` - Passenger bookings
- `payments` - Payment transactions
- `reviews` - User reviews

## 🎓 Viva Presentation Tips

1. **Start with homepage** - Show modern design
2. **Perform a complete booking** - Register → Search → Book
3. **Show admin features** - Login as admin, show dashboard
4. **Explain architecture** - Show MVC pattern, API routes
5. **Discuss database** - Explain schema relationships
6. **Highlight features** - Security, validation, responsive design
7. **Answer questions** - Be ready to explain code decisions

## 📞 Quick Support

If stuck during setup:
1. Check database is created: `SHOW DATABASES;`
2. Verify dependencies: `npm list`
3. Check server logs in terminal
4. Clear browser cache: Ctrl+Shift+Delete
5. Restart MySQL and Node.js server

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MySQL running and accessible
- [ ] Database created with schema
- [ ] Sample data inserted
- [ ] .env file configured
- [ ] npm install completed
- [ ] npm run dev executing without errors
- [ ] Can access http://localhost:5000
- [ ] Can login with demo credentials
- [ ] Admin panel accessible at /admin-login

## 🎉 Ready to Demo!

Once all steps are complete, your BusHub application is ready for:
- ✅ Mini project demonstration
- ✅ Viva presentation
- ✅ Code review
- ✅ Feature showcase

---

**Happy Demoing! 🚌✨**

For detailed documentation, see README.md  
For API details, see API Documentation in README.md
