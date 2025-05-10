const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://festival-performance-backend.onrender.com' // Replace with your actual Render URL when you have it
};

// Make config available globally
window.CONFIG = CONFIG;

// Export the config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 