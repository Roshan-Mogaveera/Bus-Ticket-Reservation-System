// Mock Data for Development/Testing without Database

const mockUsers = {
    'rajesh@example.com': {
        id: 1,
        full_name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        password: '$2b$10$YourHashedPassword', // User@123
        address: '123 Main St',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
    },
    'priya@example.com': {
        id: 2,
        full_name: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543211',
        password: '$2b$10$YourHashedPassword', // User@123
        address: '456 Oak Ave',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
    }
};

const mockRoutes = [
    { id: 1, source: 'Delhi', destination: 'Mumbai', distance: 1400, estimated_duration: '22' },
    { id: 2, source: 'Bangalore', destination: 'Chennai', distance: 350, estimated_duration: '6' },
    { id: 3, source: 'Hyderabad', destination: 'Pune', distance: 600, estimated_duration: '10' },
    { id: 4, source: 'Jaipur', destination: 'Delhi', distance: 240, estimated_duration: '4' }
];

const mockBuses = [
    { id: 1, bus_name: 'Maharaja Express', bus_number: 'MH01ABC', bus_type: 'AC Volvo', seating_type: '2x2', total_seats: 45, operator_name: 'Maharaja Travels', rating: 4.8, amenities: 'WiFi,Charging,Meals' },
    { id: 2, bus_name: 'Sunrise Deluxe', bus_number: 'SR02XYZ', bus_type: 'Non-AC', seating_type: '3x2', total_seats: 50, operator_name: 'Sunrise Tours', rating: 4.5, amenities: 'Blanket,Pillow' },
    { id: 3, bus_name: 'Royal Coach', bus_number: 'RC03PQR', bus_type: 'AC Volvo', seating_type: '2x2', total_seats: 48, operator_name: 'Royal Services', rating: 4.7, amenities: 'WiFi,Charging,Meals,USB' }
];

const mockSchedules = [
    { id: 1, bus_id: 1, departure_date: new Date().toISOString().split('T')[0], departure_time: '18:00', arrival_time: '16:00', ticket_price: 800, available_seats: 30, status: 'active' },
    { id: 2, bus_id: 2, departure_date: new Date().toISOString().split('T')[0], departure_time: '19:00', arrival_time: '17:00', ticket_price: 600, available_seats: 35, status: 'active' },
    { id: 3, bus_id: 3, departure_date: new Date().toISOString().split('T')[0], departure_time: '20:00', arrival_time: '18:00', ticket_price: 850, available_seats: 40, status: 'active' }
];

const mockBookings = [
    { booking_id: 'BH001', user_id: 1, bus_id: 1, schedule_id: 1, departure_date: new Date().toISOString().split('T')[0], selected_seats: ['1A', '1B'], num_passengers: 2, total_fare: 1600, booking_status: 'Confirmed' }
];

module.exports = {
    mockUsers,
    mockRoutes,
    mockBuses,
    mockSchedules,
    mockBookings
};
