// Auth Module
const Auth = (() => {
    // API URL
    const API_URL = 'http://localhost:5000/api';
    
    // DOM Elements
    const authSection = document.getElementById('auth-section');
    const authForms = document.getElementById('auth-forms');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const notesSection = document.getElementById('notes-section');
    
    // Event Listeners
    function initEventListeners() {
        // Show register form
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            
            // Focus on first input
            setTimeout(() => document.getElementById('register-name').focus(), 100);
        });
        
        // Show login form
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            
            // Focus on first input
            setTimeout(() => document.getElementById('login-email').focus(), 100);
        });
        
        // Login form submission
        document.getElementById('login').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state on button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            try {
                await login(email, password);
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Register form submission
        document.getElementById('register').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            
            // Basic validation
            if (!name || !email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading state on button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            
            try {
                await register(name, email, password);
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Check if user is logged in
    function checkAuth() {
        const token = localStorage.getItem('token');
        
        if (token) {
            // User is logged in
            authForms.classList.add('hidden');
            notesSection.classList.remove('hidden');
            updateAuthButtons(true);
            return true;
        } else {
            // User is not logged in
            notesSection.classList.add('hidden');
            authForms.classList.remove('hidden');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            updateAuthButtons(false);
            return false;
        }
    }
    
    // Update auth buttons based on login status
    function updateAuthButtons(isLoggedIn) {
        authSection.innerHTML = '';
        
        if (isLoggedIn) {
            const userName = localStorage.getItem('userName');
            const userInfo = document.createElement('span');
            userInfo.textContent = `Welcome, ${userName}`;
            userInfo.className = 'user-info';
            
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            logoutBtn.className = 'btn';
            logoutBtn.addEventListener('click', logout);
            
            authSection.appendChild(userInfo);
            authSection.appendChild(logoutBtn);
        } else {
            const loginBtn = document.createElement('button');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.className = 'btn';
            loginBtn.addEventListener('click', () => {
                authForms.classList.remove('hidden');
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                
                // Focus on first input
                setTimeout(() => document.getElementById('login-email').focus(), 100);
            });
            
            authSection.appendChild(loginBtn);
        }
    }
    
    // Login user
    async function login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Save token and user info to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userName', data.user.name);
            
            showAlert('Login successful', 'success');
            checkAuth();
            
            // Load notes after successful login
            if (typeof Notes !== 'undefined') {
                Notes.loadNotes();
            }
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    // Register user
    async function register(name, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            // Save token and user info to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userName', data.user.name);
            
            showAlert('Registration successful', 'success');
            checkAuth();
            
            // Load notes after successful registration
            if (typeof Notes !== 'undefined') {
                Notes.loadNotes();
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    // Logout user
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        showAlert('Logged out successfully', 'success');
        checkAuth();
    }
    
    // Show alert message
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        alertContainer.appendChild(alertDiv);
        
        // Remove alert after animation completes (4 seconds)
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }
    
    // Initialize auth module
    function init() {
        initEventListeners();
        checkAuth();
    }
    
    // Public methods
    return {
        init,
        checkAuth,
        getToken: () => localStorage.getItem('token'),
        getUserId: () => localStorage.getItem('userId'),
        showAlert
    };
})();

// Initialize auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', Auth.init);
