// Main App Module
const App = (() => {
    // DOM Elements
    const container = document.querySelector('.container');
    
    // Initialize app
    function init() {
        // Add theme toggle functionality
        addThemeToggle();
        
        // Add responsive menu for mobile
        addResponsiveMenu();
        
        // Add scroll to top button
        addScrollToTopButton();
        
        // Add fade-in animation to elements
        addFadeInAnimation();
    }
    
    // Add theme toggle (light/dark mode)
    function addThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Toggle dark mode';
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        // Apply saved theme or default to light
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Toggle light mode';
        }
        
        // Add click event to toggle theme
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.title = 'Toggle light mode';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.title = 'Toggle dark mode';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Add to header
        const header = document.querySelector('header');
        header.appendChild(themeToggle);
    }
    
    // Add responsive menu for mobile
    function addResponsiveMenu() {
        const header = document.querySelector('header');
        
        // Create menu toggle button (only visible on mobile)
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.title = 'Toggle menu';
        
        // Add click event to toggle menu
        menuToggle.addEventListener('click', () => {
            container.classList.toggle('menu-open');
            
            if (container.classList.contains('menu-open')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Add to header
        header.insertBefore(menuToggle, header.firstChild);
    }
    
    // Add scroll to top button
    function addScrollToTopButton() {
        // Create scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn hidden';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.title = 'Scroll to top';
        
        // Add click event to scroll to top
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.remove('hidden');
            } else {
                scrollTopBtn.classList.add('hidden');
            }
        });
        
        // Add to body
        document.body.appendChild(scrollTopBtn);
    }
    
    // Add fade-in animation to elements
    function addFadeInAnimation() {
        // Add fade-in class to main elements
        const elements = [
            document.querySelector('header'),
            document.getElementById('auth-forms'),
            document.getElementById('notes-section')
        ];
        
        elements.forEach(element => {
            if (element) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Public methods
    return {
        init
    };
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', App.init);
