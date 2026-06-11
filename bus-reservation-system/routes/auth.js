const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth');
const { mockUsers } = require('../mock-data');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, phone, password, confirm_password } = req.body;

        // Validation
        if (!full_name || !email || !phone || !password || !confirm_password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // If database not connected, use mock
        if (!global.db) {
            const token = jwt.sign({ id: Date.now(), email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
            return res.status(201).json({
                success: true,
                message: 'User registered successfully (mock)',
                token,
                user: { id: Date.now(), full_name, email, phone }
            });
        }

        const connection = await global.db.getConnection();

        // Check if email exists
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.query(
            'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
            [full_name, email, phone, hashedPassword]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        // If database not connected, use mock
        if (!global.db) {
            // Mock login - accept any email/password for demo
            if (email === 'rajesh@example.com' && password === 'User@123') {
                const token = jwt.sign({ id: 1, email: 'rajesh@example.com', role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                return res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: { id: 1, full_name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210' }
                });
            } else if (email === 'priya@example.com' && password === 'User@123') {
                const token = jwt.sign({ id: 2, email: 'priya@example.com', role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                return res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: { id: 2, full_name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211' }
                });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid email or password. Use rajesh@example.com / User@123' });
            }
        }

        const connection = await global.db.getConnection();
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// Get Current User
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // If database not connected, use mock
        if (!global.db) {
            if (req.user.id === 1) {
                return res.json({ success: true, user: { id: 1, full_name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', address: '123 Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' } });
            } else if (req.user.id === 2) {
                return res.json({ success: true, user: { id: 2, full_name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', address: '456 Oak Ave', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' } });
            }
            return res.json({ success: true, user: { id: req.user.id, email: req.user.email } });
        }

        const connection = await global.db.getConnection();
        const [users] = await connection.query('SELECT id, full_name, email, phone, profile_picture, address, city, state, pincode FROM users WHERE id = ?', [req.user.id]);
        connection.release();

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
    }
});

module.exports = router;
