const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Generate Transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Process Payment
router.post('/process', authMiddleware, async (req, res) => {
    try {
        const { booking_id, payment_method, amount } = req.body;

        if (!booking_id || !payment_method || !amount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // If database not connected, use mock
        if (!global.db) {
            const transaction_id = generateTransactionId();
            const payment_status = 'Success'; // Always succeed in mock mode for demo
            return res.json({
                success: true,
                message: 'Payment processed successfully',
                transaction: {
                    transaction_id,
                    booking_id,
                    payment_method,
                    amount,
                    payment_status,
                    payment_date: new Date().toISOString()
                }
            });
        }

        const connection = await global.db.getConnection();

        // Check if booking exists
        const [bookings] = await connection.query(`
            SELECT id FROM bookings WHERE booking_id = ? AND user_id = ?
        `, [booking_id, req.user.id]);

        if (bookings.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookings[0];
        const transaction_id = generateTransactionId();

        // Simulate payment processing - in reality, integrate with payment gateway
        const payment_status = 'Success'; // Always succeed for demo purposes

        // Create payment record
        await connection.query(`
            INSERT INTO payments (booking_id, transaction_id, payment_method, amount, payment_status)
            VALUES (?, ?, ?, ?, ?)
        `, [booking.id, transaction_id, payment_method, amount, payment_status]);

        // Update booking status if payment successful
        if (payment_status === 'Success') {
            await connection.query(`
                UPDATE bookings SET booking_status = 'Confirmed' WHERE id = ?
            `, [booking.id]);
        }

        connection.release();

        res.json({
            success: payment_status === 'Success',
            message: payment_status === 'Success' ? 'Payment successful' : 'Payment failed',
            transaction_id,
            payment_status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
    }
});

// Get Payment Status
router.get('/status/:transaction_id', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [payments] = await connection.query(`
            SELECT p.*, b.user_id FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            WHERE p.transaction_id = ? AND b.user_id = ?
        `, [req.params.transaction_id, req.user.id]);

        if (payments.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        connection.release();

        res.json({ success: true, payment: payments[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payment status', error: error.message });
    }
});

// Get Payment History
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [payments] = await connection.query(`
            SELECT p.* FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            WHERE b.user_id = ?
            ORDER BY p.payment_date DESC
        `, [req.user.id]);

        connection.release();

        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payment history', error: error.message });
    }
});

module.exports = router;
