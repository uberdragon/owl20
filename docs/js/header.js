// Header Navigation Enhancement
// This script adds interactive features to the static header navigation
function enhanceHeaderNav() {
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');

    // Determine which nav button should be active
    let activeButton = '';
    if (isIndexPage) {
        const hash = window.location.hash.substring(1);
        if (hash === 'player' || hash === 'dm' || hash === 'troubleshooting') {
            activeButton = hash;
        } else {
            activeButton = 'home';
        }
    } else {
        // Extract page name from path
        const pageName = currentPath.split('/').pop().replace('.html', '');
        if (pageName === 'index' || pageName === '') {
            activeButton = 'home';
        } else {
            activeButton = pageName;
        }
    }

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
    // Add click handlers to header navigation links for collapsible sections
    $('.header-nav .nav-button[href="#player"], .header-nav .nav-button[href="#dm"], .header-nav .nav-button[href="#troubleshooting"]').on('click', function(event) {
        event.preventDefault();
        // Remove active from all buttons
        $('.header-nav .nav-button').removeClass('active');
        // Add active to clicked button
        $(this).addClass('active');
        const sectionId = this.getAttribute('href').substring(1);
        if (typeof openSectionById !== 'undefined') {
            openSectionById(sectionId);
        }
    });
    
    // Handle header nav links with /#section format
    $('.header-nav .nav-button[href^="/#"], .header-nav .nav-button[href^="index.html#"]').on('click', function(event) {
        // Only prevent default if we're already on index.html
        const currentPath = window.location.pathname;
        if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
            event.preventDefault();
            // Remove active from all buttons
            $('.header-nav .nav-button').removeClass('active');
            // Add active to clicked button
            $(this).addClass('active');
            const href = this.getAttribute('href');
            const sectionId = href.split('#')[1];
            if (sectionId === 'player' || sectionId === 'dm' || sectionId === 'troubleshooting') {
                if (typeof openSectionById !== 'undefined') {
                    openSectionById(sectionId);
                }
            } else {
                window.location.hash = sectionId;
            }
        }
    });
    
    // Add active state to clicked nav buttons (for page navigation)
    $('.header-nav .nav-button').on('click', function() {
        // Only set active for non-anchor links or when navigating away
        const href = $(this).attr('href');
        if (!href.includes('#') || ((href.startsWith('/#') || href.startsWith('index.html#')) && !(window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')))) {
            $('.header-nav .nav-button').removeClass('active');
            $(this).addClass('active');
        }
    });
}

// Enhance header navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        enhanceHeaderNav();
        // Update active state after a short delay to handle hash navigation
        setTimeout(function() {
            const hash = window.location.hash.substring(1);
            if (hash === 'player' || hash === 'dm' || hash === 'troubleshooting') {
                $('.header-nav .nav-button').removeClass('active');
                $('.header-nav .nav-button[data-nav="' + hash + '"]').addClass('active');
            }
        }, 100);
    });
} else {
    enhanceHeaderNav();
    // Update active state after a short delay to handle hash navigation
    setTimeout(function() {
        const hash = window.location.hash.substring(1);
        if (hash === 'player' || hash === 'dm' || hash === 'troubleshooting') {
            $('.header-nav .nav-button').removeClass('active');
            $('.header-nav .nav-button[data-nav="' + hash + '"]').addClass('active');
        }
    }, 100);
}

// Legacy fallback for backward compatibility
function loadHeader() {
    console.warn('loadHeader() is deprecated. Header is now rendered server-side.');
    enhanceHeaderNav();
}

