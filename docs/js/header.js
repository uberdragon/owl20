// Header Navigation Enhancement
// Sets the active state on the nav button matching the current page.
// The header HTML is baked into each page (locally via scripts/inject-header.js,
// in production via the deploy workflow).

function enhanceHeaderNav() {
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');

    const pageName = currentPath.split('/').pop().replace('.html', '');
    const activeButton = (isIndexPage || pageName === 'index' || pageName === '') ? 'home' : pageName;

    document.querySelectorAll('.header-nav .nav-button').forEach(function(button) {
        if (button.getAttribute('data-nav') === activeButton) {
            button.classList.add('active');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceHeaderNav);
} else {
    enhanceHeaderNav();
}
