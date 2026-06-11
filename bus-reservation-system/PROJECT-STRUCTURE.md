# BusHub - Project Structure & File Overview

## 📦 Complete Project Contents

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, scripts |
| `.env` | Environment configuration (DB, JWT, PORT) |
| `server.js` | Express.js server entry point, route mounting |

### Backend - Route Files (`/routes`)
| File | Endpoints | Purpose |
|------|-----------|---------|
| `auth.js` | /register, /login, /me | User authentication & token generation |
| `buses.js` | /search, /:id, /schedule/:id/seats, /routes/popular | Bus browsing & seat availability |
| `bookings.js` | /create, /my-bookings, /:id, /:id/cancel | Booking management & cancellation |
| `payments.js` | /process, /status/:id, /history | Payment processing & tracking |
| `users.js` | /profile/update, /change-password, /stats/bookings | User profile & statistics |
| `admin.js` | /login, /dashboard/stats, /users, /buses, /bookings, /analytics/revenue | Admin dashboard functionality |

### Backend - Middleware (`/middleware`)
| File | Purpose |
|------|---------|
| `auth.js` | JWT verification, role-based access control |

### Database (`/database`)
| File | Purpose |
|------|---------|
| `schema.sql` | 8 tables with relationships, indices, constraints |
| `sample-data.sql` | Demo data for testing |

### Frontend - Styling (`/public/css`)
| File | Lines | Purpose |
|------|-------|---------|
| `style.css` | 1200+ | Global CSS, glassmorphism, animations, responsive |

### Frontend - JavaScript (`/public/js`)
| File | Functions | Purpose |
|------|-----------|---------|
| `main.js` | 25+ | API utilities, validation, notifications |

### Frontend - Pages (`/views`)
| Page | Purpose |
|------|---------|
| `index.html` | Home page with hero, stats, features |
| `register.html` | User registration form |
| `login.html` | User login with remember-me |
| `search.html` | Bus search & filtering |
| `buses.html` | Browse all available buses |
| `seats.html` | Interactive seat selection |
| `payment.html` | Payment method selection |
| `confirmation.html` | Booking confirmation & ticket |
| `bookings.html` | User booking history |
| `profile.html` | User profile management |
| `about.html` | About page with company info |
| `admin-login.html` | Admin authentication |
| `admin-dashboard.html` | Admin dashboard with analytics |
| `manage-buses.html` | Admin bus management |
| `manage-users.html` | Admin user management |
| `manage-bookings.html` | Admin booking management |

### Documentation (`/`)
| File | Purpose |
|------|---------|
| `README.md` | Complete documentation & API reference |
| `SETUP.md` | Quick start guide for setup |
| `PROJECT-STRUCTURE.md` | This file - project overview |

## 🎯 Technology Stack Summary

### Frontend (16 HTML Pages)
- **HTML5** - Semantic structure
- **CSS3** - Glassmorphism, animations, responsive
- **Vanilla JavaScript** - No frameworks
- **Libraries**: Font Awesome, QRCode.js, Chart.js

### Backend (6 API Route Files)
- **Node.js** - Runtime
- **Express.js 4.18.2** - Web framework
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Database
- **MySQL** - 8 tables, normalized schema
- **mysql2 3.6.0** - Node.js driver
- **Indices** - Optimized queries

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Total Files | 30+ |
| HTML Pages | 16 |
| API Routes | 6 |
| Database Tables | 8 |
| CSS Lines | 1200+ |
| JavaScript Functions | 25+ |
| API Endpoints | 25+ |
| NPM Dependencies | 10 |

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│          FRONTEND TIER                      │
│  (HTML, CSS, Vanilla JavaScript)            │
│  - 16 User & Admin Pages                    │
│  - Responsive Design                        │
│  - 25+ Utility Functions                    │
└────────────────┬────────────────────────────┘
                 │ AJAX/Fetch
┌────────────────┴────────────────────────────┐
│          API TIER                           │
│  (Express.js REST APIs)                     │
│  - Authentication Routes                    │
│  - Business Logic                           │
│  - JWT Middleware                           │
│  - Error Handling                           │
└────────────────┬────────────────────────────┘
                 │ MySQL Queries
┌────────────────┴────────────────────────────┐
│          DATABASE TIER                      │
│  (MySQL)                                    │
│  - 8 Normalized Tables                      │
│  - Relationships & Constraints              │
│  - Optimized Indices                        │
└─────────────────────────────────────────────┘
```

## 🔄 User Flow

```
1. Homepage (index.html)
    ↓
2. Register/Login (register.html / login.html)
    ↓
3. Search Buses (search.html)
    ↓
4. Select Bus & Seats (seats.html)
    ↓
5. Make Payment (payment.html)
    ↓
6. Confirmation (confirmation.html)
    ↓
7. My Bookings (bookings.html)
    ↓
8. Profile Management (profile.html)
```

## 🔄 Admin Flow

```
1. Admin Login (admin-login.html)
    ↓
2. Dashboard (admin-dashboard.html)
    ↓
3. Manage Resources:
    - Buses (manage-buses.html)
    - Users (manage-users.html)
    - Bookings (manage-bookings.html)
```

## 🗄️ Database Schema

### Users Table
- ID, Name, Email, Phone, Password, Address, City, State, Pincode, Timestamps

### Admin Table
- ID, Username, Email, Password, Role (admin/super_admin)

### Routes Table
- ID, Source, Destination, Distance, Estimated Duration

### Buses Table
- ID, Name, Number, Type (AC/Non-AC), Seating (2x2/3x2), Total Seats, Operator, Rating, Amenities, FK Route

### Bus Schedule Table
- ID, Bus ID, Departure Date/Time, Arrival Time, Ticket Price, Available Seats, Status

### Seats Table
- ID, Bus ID, Schedule ID, Seat Number, Is Available

### Bookings Table
- ID, Booking ID, User ID, Bus ID, Schedule ID, Selected Seats (JSON), Passengers, Fare, Status, Boarding, Dropping

### Payments Table
- ID, Booking ID, Transaction ID, Payment Method, Amount, Status, Date

## 🎨 Design System

### Color Palette
- Primary: #1e3a8a (Dark Blue)
- Secondary: #4f46e5 (Indigo)
- Accent: #a855f7 (Purple)
- Neon Cyan: #06b6d4
- Neon Purple: #a855f7
- Success: #10b981
- Danger: #ef4444
- Warning: #f59e0b

### Components
- Glassmorphism Cards (backdrop-filter blur)
- Gradient Buttons
- Interactive Forms
- Data Tables
- Modal Dialogs
- Status Badges
- Toast Notifications

### Animations
- Float, FadeInUp, Spin, Pulse
- Hover Effects
- Smooth Transitions
- Page Load Animations

## 🔐 Security Features

✅ JWT Token Authentication  
✅ Bcrypt Password Hashing  
✅ Role-based Access Control  
✅ Input Validation  
✅ SQL Injection Prevention  
✅ CORS Protection  
✅ Secure Password Storage  
✅ Session Management  

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1200px
- Mobile: 320px - 768px

## 🚀 Performance Optimizations

✅ Connection Pooling (MySQL)  
✅ Indexed Database Queries  
✅ Lazy Loading Images  
✅ CSS Bundling Ready  
✅ Minification Ready  
✅ Efficient JavaScript  
✅ Optimized Animations  

## 📝 API Endpoint Summary

### Authentication (4 endpoints)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Buses (4 endpoints)
- GET /api/buses/search
- GET /api/buses/:id
- GET /api/buses/schedule/:id/seats
- GET /api/buses/routes/popular

### Bookings (4 endpoints)
- POST /api/bookings/create
- GET /api/bookings/my-bookings
- GET /api/bookings/:id
- PUT /api/bookings/:id/cancel

### Payments (3 endpoints)
- POST /api/payments/process
- GET /api/payments/status/:id
- GET /api/payments/history

### Users (3 endpoints)
- PUT /api/users/profile/update
- POST /api/users/change-password
- GET /api/users/stats/bookings

### Admin (8+ endpoints)
- POST /api/admin/login
- GET /api/admin/dashboard/stats
- GET /api/admin/users
- DELETE /api/admin/users/:id
- GET /api/admin/buses
- GET /api/admin/bookings
- GET /api/admin/analytics/revenue

## 🎓 Learning Outcomes

This project demonstrates:

### Frontend Concepts
- Responsive Web Design
- Modern CSS (Glassmorphism)
- Vanilla JavaScript (ES6+)
- DOM Manipulation
- API Integration
- Form Validation
- Local Storage
- Session Management

### Backend Concepts
- Express.js Framework
- RESTful API Design
- Middleware Architecture
- Authentication/Authorization
- Error Handling
- Request Validation

### Database Concepts
- Relational Database Design
- SQL Queries
- Foreign Keys & Relationships
- Indexing & Optimization
- Data Normalization

### Security Concepts
- JWT Tokens
- Password Hashing (Bcrypt)
- Input Validation
- CORS Protection
- Role-based Access Control

## 📚 Documentation Files

| Document | Contents |
|----------|----------|
| README.md | Complete guide, features, setup, APIs |
| SETUP.md | Quick start for 5-minute setup |
| PROJECT-STRUCTURE.md | This file |

## ✅ Quality Checklist

- ✅ 16 functional HTML pages
- ✅ 25+ JavaScript utility functions
- ✅ 20+ RESTful API endpoints
- ✅ 8 normalized database tables
- ✅ 1200+ lines of CSS
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern glassmorphism UI
- ✅ JWT authentication
- ✅ Secure password hashing
- ✅ Admin dashboard
- ✅ Complete documentation
- ✅ Ready for presentation & viva

## 🎯 Mini Project Readiness

✅ **Code Quality**: Well-organized, commented, professional  
✅ **Documentation**: Comprehensive README & SETUP guides  
✅ **Features**: Complete feature set with premium design  
✅ **Architecture**: Proper MVC pattern with scalability  
✅ **Security**: Authentication, hashing, validation  
✅ **Database**: Normalized schema with relationships  
✅ **UI/UX**: Modern, professional, responsive design  
✅ **Testing**: Sample data included for quick testing  
✅ **Performance**: Optimized queries, connection pooling  
✅ **Deployment Ready**: Environment configuration, error handling  

---

## 🚀 Next Steps for Viva

1. **Understand the Architecture** - Review MVC pattern
2. **Walk Through Code** - Know main files & functions
3. **Test All Features** - Register → Book → Pay
4. **Review Database** - Understand schema design
5. **Explain Design Decisions** - Be ready to justify choices
6. **Practice Presentation** - Demo for 10-15 minutes
7. **Prepare Q&A** - Anticipate technical questions

---

**Project Status: ✅ COMPLETE & READY FOR DEMONSTRATION**

Created for Mini Project Exhibition and Viva Voce Presentation  
Technology: HTML5, CSS3, Vanilla JavaScript, Node.js, Express, MySQL  
Total Development: Complete Full-Stack Application
