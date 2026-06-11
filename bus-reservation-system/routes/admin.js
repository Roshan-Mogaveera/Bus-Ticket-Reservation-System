const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const connection = await global.db.getConnection();
        const [admins] = await connection.query('SELECT * FROM admin WHERE username = ?', [username]);
        connection.release();

        if (admins.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const admin = admins[0];
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: { id: admin.id, username: admin.username, role: admin.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// Dashboard Statistics
router.get('/dashboard/stats', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [totalUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
        const [totalBuses] = await connection.query('SELECT COUNT(*) as count FROM buses');
        const [totalBookings] = await connection.query('SELECT COUNT(*) as count FROM bookings');
        const [totalRevenue] = await connection.query('SELECT SUM(amount) as total FROM payments WHERE payment_status = "Success"');
        const [confirmedBookings] = await connection.query('SELECT COUNT(*) as count FROM bookings WHERE booking_status = "Confirmed"');

        connection.release();

        res.json({
            success: true,
            stats: {
                total_users: totalUsers[0].count,
                total_buses: totalBuses[0].count,
                total_bookings: totalBookings[0].count,
                total_revenue: totalRevenue[0].total || 0,
                confirmed_bookings: confirmedBookings[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
    }
});

// Get All Users
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        const [users] = await connection.query(`
            SELECT id, full_name, email, phone, created_at FROM users ORDER BY created_at DESC
        `);
        connection.release();

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
});

// Delete User
router.delete('/users/:id', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        await connection.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        connection.release();

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
});

// Get All Buses
router.get('/buses', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        const [buses] = await connection.query(`
            SELECT b.*, r.source, r.destination FROM buses b
            JOIN routes r ON b.route_id = r.id
            ORDER BY b.created_at DESC
        `);
        connection.release();

        res.json({ success: true, buses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch buses', error: error.message });
    }
});

// Add Bus
router.post('/buses/add', adminMiddleware, async (req, res) => {
    try {
        const { bus_name, bus_number, bus_type, seating_type, total_seats, route_id, operator_name } = req.body;

        const connection = await global.db.getConnection();
        
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(`
                INSERT INTO buses (bus_name, bus_number, bus_type, seating_type, total_seats, route_id, operator_name)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [bus_name, bus_number, bus_type, seating_type, total_seats, route_id, operator_name]);

            const newBusId = result.insertId;

            // Auto-generate schedule for the next 30 days
            const scheduleQueries = [];
            const scheduleParams = [];
            
            // Default pricing logic based on bus type
            const basePrice = bus_type === 'AC' ? 1200.00 : 800.00;
            const extraPrice = seating_type === 'Sleeper' ? 400.00 : (seating_type === 'Semi-Sleeper' ? 200.00 : 0);
            const ticketPrice = basePrice + extraPrice;

            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                
                // Add a default schedule (8 PM departure, 6 AM arrival)
                scheduleQueries.push(`(?, ?, '20:00:00', '06:00:00', ?, ?, 'Active')`);
                scheduleParams.push(newBusId, dateStr, ticketPrice, total_seats);
            }

            if (scheduleQueries.length > 0) {
                await connection.query(`
                    INSERT INTO bus_schedule (bus_id, departure_date, departure_time, arrival_time, ticket_price, available_seats, status)
                    VALUES ${scheduleQueries.join(', ')}
                `, scheduleParams);
            }

            await connection.commit();
            connection.release();

            res.status(201).json({
                success: true,
                message: 'Bus added and scheduled for next 30 days successfully',
                busId: newBusId
            });
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add bus', error: error.message });
    }
});

// Update Bus
router.put('/buses/:id', adminMiddleware, async (req, res) => {
    try {
        const { bus_name, bus_number, bus_type, seating_type, total_seats, operator_name, route_id } = req.body;

        const connection = await global.db.getConnection();
        await connection.query(`
            UPDATE buses SET bus_name = ?, bus_number = ?, bus_type = ?, seating_type = ?, total_seats = ?, operator_name = ?, route_id = ?
            WHERE id = ?
        `, [bus_name, bus_number, bus_type, seating_type, total_seats, operator_name, route_id, req.params.id]);

        connection.release();

        res.json({ success: true, message: 'Bus updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
});

// Delete Bus
router.delete('/buses/:id', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        await connection.query('DELETE FROM buses WHERE id = ?', [req.params.id]);
        connection.release();

        res.json({ success: true, message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
});

// Get All Bookings
router.get('/bookings', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        const [bookings] = await connection.query(`
            SELECT b.*, u.full_name, bus.bus_name, r.source, r.destination
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN buses bus ON b.bus_id = bus.id
            JOIN routes r ON bus.route_id = r.id
            ORDER BY b.created_at DESC
        `);
        connection.release();

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});

// Get Revenue Analytics
router.get('/analytics/revenue', adminMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [monthlyRevenue] = await connection.query(`
            SELECT 
                DATE_FORMAT(payment_date, '%Y-%m') as month,
                SUM(amount) as total
            FROM payments
            WHERE payment_status = 'Success'
            GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
            ORDER BY month DESC
            LIMIT 12
        `);

        connection.release();

        res.json({ success: true, monthlyRevenue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
    }
});

module.exports = router;
