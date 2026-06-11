/* ========================================
   MAIN JAVASCRIPT FILE
   Handles common functionality for all pages
   ======================================== */

const API_BASE_URL = 'http://localhost:5000/api';

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Set auth token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Store user data
function setUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Get user data
function getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(time) {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ========================================
// API FUNCTIONS
// ========================================

// API request helper
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok && response.status === 401) {
            logout();
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error' };
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.getElementById('notification-container') || createNotificationContainer();
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown reverse 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 3000;
        max-width: 400px;
        width: 90%;
    `;
    document.body.appendChild(container);
    return container;
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Update navbar based on login status
    updateNavbar();
    setupBackButton();
});

function setupBackButton() {
    const noBackPages = ['/', '/login', '/register', '/admin-login', '/admin-dashboard', '/index.html'];
    if (!noBackPages.includes(window.location.pathname)) {
        const container = document.querySelector('.container') || document.querySelector('.hero-content');
        if (container) {
            const backBtn = document.createElement('button');
            backBtn.className = 'btn btn-outline btn-sm';
            backBtn.style.marginBottom = '1.5rem';
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Go Back';
            backBtn.onclick = (e) => {
                e.preventDefault();
                window.history.back();
            };
            container.insertBefore(backBtn, container.firstChild);
        }
    }
}

function updateNavbar() {
    const navbarButtons = document.querySelector('.navbar-buttons');
    if (!navbarButtons) return;

    if (isLoggedIn()) {
        const user = getUserData();
        navbarButtons.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span style="color: white; font-weight: 500;">Hi, ${user?.full_name || 'User'}</span>
                <a href="/profile" class="btn btn-primary btn-sm">Profile</a>
                <button onclick="logout()" class="btn btn-secondary btn-sm">Logout</button>
            </div>
        `;
    } else {
        navbarButtons.innerHTML = `
            <a href="/login" class="btn btn-outline">Login</a>
            <a href="/register" class="btn btn-primary">Register</a>
        `;
    }
}

// ========================================
// FORM VALIDATION
// ========================================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// LOADING SPINNER
// ========================================

function showLoader(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.id = 'loader-overlay';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loader.innerHTML = `
        <div style="text-align: center; color: white;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.remove();
    }
}

// ========================================
// GENERATE QR CODE
// ========================================

async function generateQRCode(text) {
    const canvas = await QRCode.toCanvas(text);
    return canvas.toDataURL();
}

// ========================================
// DOWNLOAD PDF/TICKET
// ========================================

function downloadTicket(ticketHTML, fileName = 'ticket.html') {
    const element = document.createElement('div');
    element.innerHTML = ticketHTML;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
}

// ========================================
// ANIMATE ON SCROLL
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card, .bus-card, section').forEach(el => {
        observer.observe(el);
    });
});

// ========================================
// COUNTER ANIMATION
// ========================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// SESSION STORAGE FOR BOOKING
// ========================================

function setSeatSelection(seats) {
    sessionStorage.setItem('selectedSeats', JSON.stringify(seats));
}

function getSeatSelection() {
    const seats = sessionStorage.getItem('selectedSeats');
    return seats ? JSON.parse(seats) : [];
}

function setBookingData(data) {
    sessionStorage.setItem('bookingData', JSON.stringify(data));
}

function getBookingData() {
    const data = sessionStorage.getItem('bookingData');
    return data ? JSON.parse(data) : null;
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

window.showNotification = showNotification;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.apiRequest = apiRequest;
