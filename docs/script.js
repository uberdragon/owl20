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
