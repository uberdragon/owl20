// Header and Navigation Component
// This function generates the header and navigation for all pages
function loadHeader() {
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
    
    // Header HTML
    const headerHTML = `
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <a href="/" style="text-decoration: none; color: inherit;">
                    <img src="owl20-128.png" alt="Owl20 Logo" class="logo-img">
                </a>
                <a href="/" style="text-decoration: none; color: inherit;">
                    <div style="font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;">Owl20</div>
                </a>
                <p class="tagline">Bridge Between Beyond20 & Owlbear Rodeo</p>
            </div>
            <div class="badges">
                <a href="https://chromewebstore.google.com/detail/owl20-beyond20-to-owlbear/lpogdhcmmpkmafhdlbonpfjfmgcilhjp" class="badge chrome" title="Chrome Web Store" target="_blank">
                    Chrome
                </a>
                <a href="https://microsoftedge.microsoft.com/addons/detail/owl20-beyond20-to-owlbe/bofhilfebkhnchmngeaplaeodjobgdcf" class="badge edge" title="Microsoft Edge Add-ons" target="_blank">
                    Edge
                </a>
                <a href="https://addons.mozilla.org/en-US/firefox/addon/owl20-beyond20-owlbear-bridge/" class="badge firefox" title="Firefox Add-ons" target="_blank">
                    Firefox
                </a>
            </div>
        </header>

        <!-- Header Navigation -->
        <nav class="header-nav">
            <a href="/" class="nav-button ${activeButton === 'home' ? 'active' : ''}">Home</a>
            <a href="about.html" class="nav-button ${activeButton === 'about' ? 'active' : ''}">About</a>
            <a href="${isIndexPage ? '#' : '/#'}player" class="nav-button ${activeButton === 'player' ? 'active' : ''}">Player Setup</a>
            <a href="${isIndexPage ? '#' : '/#'}dm" class="nav-button ${activeButton === 'dm' ? 'active' : ''}">DM Setup</a>
            <a href="faq.html" class="nav-button ${activeButton === 'faq' ? 'active' : ''}">FAQ</a>
            <a href="${isIndexPage ? '#' : '/#'}troubleshooting" class="nav-button ${activeButton === 'troubleshooting' ? 'active' : ''}">Troubleshooting</a>
            <a href="privacy.html" class="nav-button ${activeButton === 'privacy' ? 'active' : ''}">Privacy</a>
            <a href="sitemap.html" class="nav-button ${activeButton === 'sitemap' ? 'active' : ''}">Sitemap</a>
        </nav>
    `;
    
    // Find or create header container
    let headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'header-container';
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(headerContainer, container.firstChild);
        } else {
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
    }
    
    headerContainer.innerHTML = headerHTML;
    
    // Initialize navigation click handlers after header is loaded
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

// Load header when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadHeader();
        // Update active state after a short delay to handle hash navigation
        setTimeout(function() {
            const hash = window.location.hash.substring(1);
            if (hash === 'player' || hash === 'dm' || hash === 'troubleshooting') {
                $('.header-nav .nav-button').removeClass('active');
                $('.header-nav .nav-button[href="#' + hash + '"]').addClass('active');
            }
        }, 100);
    });
} else {
    loadHeader();
    // Update active state after a short delay to handle hash navigation
    setTimeout(function() {
        const hash = window.location.hash.substring(1);
        if (hash === 'player' || hash === 'dm' || hash === 'troubleshooting') {
            $('.header-nav .nav-button').removeClass('active');
            $('.header-nav .nav-button[href="#' + hash + '"]').addClass('active');
        }
    }, 100);
}

