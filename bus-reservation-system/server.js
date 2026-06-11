const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', (filepath, options, callback) => {
    const fs = require('fs');
    fs.readFile(filepath, (err, content) => {
        if (err) return callback(err);
        return callback(null, content.toString());
    });
});

// Database Connection
const mysql = require('mysql2/promise');
let db = null;
let dbConnected = false;

const initializeDatabase = async () => {
    try {
        db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        // Test connection
        const connection = await db.getConnection();
        connection.release();
        dbConnected = true;
        global.db = db;
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.warn('⚠️  Database connection warning:', err.message);
        dbConnected = false;
        // Create mock db to allow server to run for UI testing
        db = null;
        global.db = null;
    }
};

// Make db globally accessible initially (will be updated)
global.db = db;
global.initializeDatabase = initializeDatabase;

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'search.html'));
});

app.get('/buses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'buses.html'));
});

app.get('/seats', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'seats.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'confirmation.html'));
});

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bookings.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

app.get('/manage-buses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'manage-buses.html'));
});

app.get('/manage-users', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'manage-users.html'));
});

app.get('/manage-bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'manage-bookings.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
(async () => {
    try {
        await initializeDatabase();
    } catch (err) {
        console.warn('⚠️  Could not initialize database:', err.message);
    }
    
    app.listen(PORT, () => {
        console.log(`🚌 Bus Reservation System running on port ${PORT}`);
        console.log(`✅ Server is live at http://localhost:${PORT}`);
        if (dbConnected) {
            console.log(`✅ Database connected`);
        } else {
            console.log(`⚠️  Database not connected - API features will be limited`);
            console.log(`   Set up MySQL and run database/schema.sql for full features`);
        }
    });
})();

module.exports = app;
