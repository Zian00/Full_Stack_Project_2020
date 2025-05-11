const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://festival-performance-backend.onrender.com' // Your Render URL
};

// Make config available globally
window.CONFIG = CONFIG;

// Export the config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 