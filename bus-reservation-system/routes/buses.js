const express = require('express');
const router = express.Router();
const { mockBuses, mockSchedules } = require('../mock-data');

// Search Buses
router.post('/search', async (req, res) => {
    try {
        const { source, destination, departure_date, sort_by = 'price', filter_type } = req.body;

        if (!source || !destination || !departure_date) {
            return res.status(400).json({ success: false, message: 'Source, destination, and date required' });
        }

        // If database not connected, use mock
        if (!global.db) {
            let results = mockBuses.map((bus, idx) => ({
                id: bus.id,
                bus_name: bus.bus_name,
                bus_number: bus.bus_number,
                bus_type: bus.bus_type,
                seating_type: bus.seating_type,
                total_seats: bus.total_seats,
                rating: bus.rating,
                source: source,
                destination: destination,
                departure_time: mockSchedules[idx]?.departure_time || '18:00',
                arrival_time: mockSchedules[idx]?.arrival_time || '16:00',
                ticket_price: mockSchedules[idx]?.ticket_price || 800,
                available_seats: mockSchedules[idx]?.available_seats || 30,
                schedule_id: mockSchedules[idx]?.id || (idx + 1),
                departure_date: departure_date
            }));

            // Apply filters
            if (filter_type === 'AC') {
                results = results.filter(r => r.bus_type === 'AC');
            } else if (filter_type === 'Non-AC') {
                results = results.filter(r => r.bus_type === 'Non-AC');
            }

            // Apply sorting
            if (sort_by === 'price') {
                results.sort((a, b) => a.ticket_price - b.ticket_price);
            } else if (sort_by === 'time') {
                results.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
            } else if (sort_by === 'rating') {
                results.sort((a, b) => b.rating - a.rating);
            }

            return res.json({ success: true, buses: results });
        }

        const connection = await global.db.getConnection();

        // Build query
        let query = `
            SELECT 
                b.id,
                b.bus_name,
                b.bus_number,
                b.bus_type,
                b.seating_type,
                b.total_seats,
                b.rating,
                r.source,
                r.destination,
                bs.departure_time,
                bs.arrival_time,
                bs.ticket_price,
                bs.available_seats,
                bs.id as schedule_id,
                bs.departure_date
            FROM buses b
            JOIN routes r ON b.route_id = r.id
            JOIN bus_schedule bs ON b.id = bs.bus_id
            WHERE LOWER(r.source) = LOWER(?) AND LOWER(r.destination) = LOWER(?) AND bs.departure_date = ?
        `;

        let params = [source, destination, departure_date];

        // Apply filters
        if (filter_type) {
            if (filter_type === 'AC') {
                query += ` AND b.bus_type = 'AC'`;
            } else if (filter_type === 'Non-AC') {
                query += ` AND b.bus_type = 'Non-AC'`;
            }
        }

        // Apply sorting
        switch(sort_by) {
            case 'price_asc':
                query += ` ORDER BY bs.ticket_price ASC`;
                break;
            case 'price_desc':
                query += ` ORDER BY bs.ticket_price DESC`;
                break;
            case 'departure':
                query += ` ORDER BY bs.departure_time ASC`;
                break;
            case 'rating':
                query += ` ORDER BY b.rating DESC`;
                break;
            default:
                query += ` ORDER BY bs.ticket_price ASC`;
        }

        const [buses] = await connection.query(query, params);
        connection.release();

        res.json({ success: true, buses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
});

// Get Bus Details
router.get('/:id', async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        
        const [buses] = await connection.query(`
            SELECT 
                b.*,
                r.source,
                r.destination,
                r.distance,
                r.estimated_duration
            FROM buses b
            JOIN routes r ON b.route_id = r.id
            WHERE b.id = ?
        `, [req.params.id]);

        if (buses.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }

        const [schedules] = await connection.query(`
            SELECT * FROM bus_schedule WHERE bus_id = ? AND departure_date >= CURDATE()
            ORDER BY departure_date
        `, [req.params.id]);

        connection.release();

        res.json({ 
            success: true, 
            bus: buses[0],
            schedules 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bus', error: error.message });
    }
});

// Get Available Seats
router.get('/schedule/:schedule_id/seats', async (req, res) => {
    try {
        const connection = await global.db.getConnection();
        
        const [seats] = await connection.query(`
            SELECT seat_number, is_available FROM seats 
            WHERE schedule_id = ? 
            ORDER BY seat_number
        `, [req.params.schedule_id]);

        connection.release();

        res.json({ success: true, seats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch seats', error: error.message });
    }
});

// Get Popular Routes
router.get('/routes/popular', async (req, res) => {
    try {
        // If database not connected, use mock
        if (!global.db) {
            const routes = [
                { id: 1, source: 'Delhi', destination: 'Mumbai', bus_count: 3, avg_rating: 4.67 },
                { id: 2, source: 'Bangalore', destination: 'Chennai', bus_count: 2, avg_rating: 4.55 },
                { id: 3, source: 'Hyderabad', destination: 'Pune', bus_count: 2, avg_rating: 4.55 },
                { id: 4, source: 'Jaipur', destination: 'Delhi', bus_count: 2, avg_rating: 4.4 }
            ];
            return res.json({ success: true, routes });
        }

        const connection = await global.db.getConnection();
        
        const [routes] = await connection.query(`
            SELECT 
                r.id,
                r.source,
                r.destination,
                COUNT(b.id) as bus_count,
                AVG(b.rating) as avg_rating
            FROM routes r
            JOIN buses b ON r.id = b.route_id
            GROUP BY r.id
            ORDER BY bus_count DESC
            LIMIT 10
        `);

        connection.release();

        res.json({ success: true, routes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch routes', error: error.message });
    }
});

// Get All Routes
router.get('/routes/all', async (req, res) => {
    try {
        if (!global.db) {
            const routes = [
                { id: 1, source: 'Delhi', destination: 'Mumbai' },
                { id: 2, source: 'Bangalore', destination: 'Chennai' },
                { id: 3, source: 'Hyderabad', destination: 'Pune' },
                { id: 4, source: 'Jaipur', destination: 'Delhi' }
            ];
            return res.json({ success: true, routes });
        }

        const connection = await global.db.getConnection();
        const [routes] = await connection.query('SELECT id, source, destination FROM routes ORDER BY source ASC');
        connection.release();

        res.json({ success: true, routes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch routes', error: error.message });
    }
});

module.exports = router;
