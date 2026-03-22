// Header and Navigation Component
// This function generates the header and navigation for all pages
function loadHeader() {
    const currentPath = window.location.pathname;

    // Determine which nav button should be active
    const pageName = currentPath.split('/').pop().replace('.html', '');
    let activeButton = (pageName === 'index' || pageName === '') ? 'home' : pageName;

    // Header HTML
    const headerHTML = `
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <a href="index.html" style="text-decoration: none; color: inherit;">
                    <img src="owl20-128.png" alt="Owl20 Logo" class="logo-img">
                </a>
                <a href="index.html" style="text-decoration: none; color: inherit;">
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
            <a href="index.html" class="nav-button ${activeButton === 'home' ? 'active' : ''}" data-nav="home">Home</a>
            <a href="about.html" class="nav-button ${activeButton === 'about' ? 'active' : ''}" data-nav="about">About</a>
            <a href="player-setup.html" class="nav-button ${activeButton === 'player-setup' ? 'active' : ''}" data-nav="player-setup">Player Setup</a>
            <a href="dm-setup.html" class="nav-button ${activeButton === 'dm-setup' ? 'active' : ''}" data-nav="dm-setup">DM Setup</a>
            <a href="faq.html" class="nav-button ${activeButton === 'faq' ? 'active' : ''}" data-nav="faq">FAQ</a>
            <a href="troubleshooting.html" class="nav-button ${activeButton === 'troubleshooting' ? 'active' : ''}" data-nav="troubleshooting">Troubleshooting</a>
            <a href="how-it-works.html" class="nav-button ${activeButton === 'how-it-works' ? 'active' : ''}" data-nav="how-it-works">How It Works</a>
            <a href="privacy.html" class="nav-button ${activeButton === 'privacy' ? 'active' : ''}" data-nav="privacy">Privacy</a>
            <a href="sitemap.html" class="nav-button ${activeButton === 'sitemap' ? 'active' : ''}" data-nav="sitemap">Sitemap</a>
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
}

// Load header when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadHeader();
    });
} else {
    loadHeader();
}
