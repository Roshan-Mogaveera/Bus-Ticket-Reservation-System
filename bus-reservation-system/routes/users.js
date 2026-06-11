const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../middleware/auth');

// Update Profile
router.put('/profile/update', authMiddleware, async (req, res) => {
    try {
        const { full_name, phone, address, city, state, pincode } = req.body;

        const connection = await global.db.getConnection();

        await connection.query(`
            UPDATE users 
            SET full_name = ?, phone = ?, address = ?, city = ?, state = ?, pincode = ?
            WHERE id = ?
        `, [full_name, phone, address, city, state, pincode, req.user.id]);

        connection.release();

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
});

// Change Password
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;

        if (!current_password || !new_password || !confirm_password) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const connection = await global.db.getConnection();

        const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [req.user.id]);

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(current_password, users[0].password);

        if (!passwordMatch) {
            connection.release();
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

        connection.release();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Password change failed', error: error.message });
    }
});

// Get Booking Statistics
router.get('/stats/bookings', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [stats] = await connection.query(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN booking_status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN booking_status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
                SUM(total_fare) as total_spent
            FROM bookings WHERE user_id = ?
        `, [req.user.id]);

        connection.release();

        res.json({ success: true, stats: stats[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
    }
});

module.exports = router;
