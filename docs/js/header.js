// Header Navigation Enhancement
// This script adds interactive features to the static header navigation
function enhanceHeaderNav() {
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');

    // Determine which nav button should be active based on current page
    const pageName = currentPath.split('/').pop().replace('.html', '');
    const activeButton = (isIndexPage || pageName === 'index' || pageName === '') ? 'home' : pageName;

    // Set active state on the appropriate button
    const navButtons = document.querySelectorAll('.header-nav .nav-button');
    navButtons.forEach(button => {
        const navType = button.getAttribute('data-nav');
        if (navType === activeButton) {
            button.classList.add('active');
        }
    });

    // Initialize navigation click handlers
    if (typeof $ !== 'undefined') {
        initializeHeaderNav();
    } else {
        // Wait for jQuery to load
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof $ !== 'undefined') {
                initializeHeaderNav();
            }
        });
    }
}

// Initialize header navigation click handlers
function initializeHeaderNav() {
    // Add active state to clicked nav buttons
    $('.header-nav .nav-button').on('click', function() {
        $('.header-nav .nav-button').removeClass('active');
        $(this).addClass('active');
    });
}

// Enhance header navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceHeaderNav);
} else {
    enhanceHeaderNav();
}

// Legacy fallback for backward compatibility
function loadHeader() {
    console.warn('loadHeader() is deprecated. Header is now rendered server-side.');
    enhanceHeaderNav();
}

