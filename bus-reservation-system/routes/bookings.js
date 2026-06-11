const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { mockSchedules } = require('../mock-data');

// Generate Booking ID
function generateBookingId() {
    // Generate a unique ID that is max 20 chars (BUS + 8 chars timestamp + 5 chars random)
    return 'BUS' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Create Booking
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { schedule_id, selected_seats, num_passengers, boarding_point, dropping_point } = req.body;

        if (!schedule_id || !selected_seats || !num_passengers) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // If database not connected, use mock
        if (!global.db) {
            const schedule = mockSchedules.find(s => s.id === parseInt(schedule_id)) || mockSchedules[0];
            const total_fare = (schedule.ticket_price || 800) * num_passengers;
            const booking_id = generateBookingId();
            return res.json({
                success: true,
                message: 'Booking created successfully',
                booking: {
                    id: booking_id,
                    booking_id: booking_id,
                    user_id: req.user.id,
                    schedule_id,
                    selected_seats,
                    num_passengers,
                    total_fare,
                    booking_status: 'Confirmed',
                    departure_date: schedule.departure_date
                }
            });
        }

        const connection = await global.db.getConnection();

        // Get schedule details
        const [schedules] = await connection.query(`
            SELECT bs.*, b.id as bus_id FROM bus_schedule bs
            JOIN buses b ON bs.bus_id = b.id
            WHERE bs.id = ?
        `, [schedule_id]);

        if (schedules.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        const schedule = schedules[0];
        const total_fare = schedule.ticket_price * num_passengers;
        const booking_id = generateBookingId();

        // Create booking
        const [result] = await connection.query(`
            INSERT INTO bookings 
            (booking_id, user_id, bus_id, schedule_id, departure_date, selected_seats, num_passengers, total_fare, boarding_point, dropping_point)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [booking_id, req.user.id, schedule.bus_id, schedule_id, schedule.departure_date, JSON.stringify(selected_seats), num_passengers, total_fare, boarding_point, dropping_point]);

        // Update seats availability
        for (const seat of selected_seats) {
            await connection.query(`
                UPDATE seats SET is_available = FALSE 
                WHERE schedule_id = ? AND seat_number = ?
            `, [schedule_id, seat]);
        }

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId: booking_id,
            totalFare: total_fare
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Booking failed', error: error.message });
    }
});

// Get User Bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [bookings] = await connection.query(`
            SELECT 
                b.*,
                bus.bus_name,
                bus.bus_number,
                r.source,
                r.destination,
                p.payment_status
            FROM bookings b
            JOIN buses bus ON b.bus_id = bus.id
            JOIN routes r ON bus.route_id = r.id
            LEFT JOIN payments p ON b.id = p.booking_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);

        connection.release();

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});

// Get Booking Details
router.get('/:booking_id', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        const [bookings] = await connection.query(`
            SELECT 
                b.*,
                bus.bus_name,
                bus.bus_number,
                bus.bus_type,
                bus.seating_type,
                r.source,
                r.destination,
                bs.departure_time,
                bs.arrival_time,
                p.transaction_id,
                p.payment_status
            FROM bookings b
            JOIN buses bus ON b.bus_id = bus.id
            JOIN routes r ON bus.route_id = r.id
            JOIN bus_schedule bs ON b.schedule_id = bs.id
            LEFT JOIN payments p ON b.id = p.booking_id
            WHERE b.booking_id = ? AND b.user_id = ?
        `, [req.params.booking_id, req.user.id]);

        if (bookings.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        connection.release();

        res.json({ success: true, booking: bookings[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch booking', error: error.message });
    }
});

// Cancel Booking
router.put('/:booking_id/cancel', authMiddleware, async (req, res) => {
    try {
        const connection = await global.db.getConnection();

        // Check if booking exists and belongs to user
        const [bookings] = await connection.query(`
            SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?
        `, [req.params.booking_id, req.user.id]);

        if (bookings.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookings[0];

        // Update booking status
        await connection.query(`
            UPDATE bookings SET booking_status = 'Cancelled' WHERE id = ?
        `, [booking.id]);

        // Release seats
        const selected_seats = JSON.parse(booking.selected_seats);
        for (const seat of selected_seats) {
            await connection.query(`
                UPDATE seats SET is_available = TRUE 
                WHERE schedule_id = ? AND seat_number = ?
            `, [booking.schedule_id, seat]);
        }

        connection.release();

        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cancellation failed', error: error.message });
    }
});

module.exports = router;
