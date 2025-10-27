// Toggle collapsible sections
function toggleSection(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Toggle active class
    header.classList.toggle('active');
    content.classList.toggle('active');
    
    // Smooth scroll to section if opening
    if (!isActive) {
        setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Copy manifest URL to clipboard
function copyManifestUrl() {
    const url = 'https://owl20.FriendlyMimic.com/manifest.json';
    const button = event.target.closest('.copy-btn');
    
    navigator.clipboard.writeText(url).then(function() {
        // Update button to show success
        const icon = button.querySelector('.copy-icon');
        icon.textContent = '✅';
        button.title = 'Copied!';
        
        // Reset after 2 seconds
        setTimeout(function() {
            icon.textContent = '📋';
            button.title = 'Copy URL';
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL. Please select and copy manually.');
    });
}

// Add click listeners to all card headers on page load
$(document).ready(function() {
    // Smooth animations on page load
    $('.section-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
});

// Add fade-in animation to cards
$(window).on('load', function() {
    $('.section-card').addClass('fade-in');
});

// Add CSS for fade-in animation dynamically
const style = document.createElement('style');
style.textContent = `
    .section-card {
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
    
    .fade-in {
        opacity: 1;
    }
`;
document.head.appendChild(style);
