// Toggle collapsible sections
function toggleSection(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Get the parent section card to check its ID
    const sectionCard = header.closest('.section-card');
    const sectionId = sectionCard ? sectionCard.id : null;
    
    // Toggle active class
    header.classList.toggle('active');
    content.classList.toggle('active');
    
    // Update URL hash if opening a section
    if (!isActive && sectionId) {
        // Update the URL with the section anchor
        window.history.pushState({}, '', '#' + sectionId);
    } else if (isActive && sectionId) {
        // Remove the hash if closing the section
        window.history.pushState({}, '', window.location.pathname + window.location.search);
    }
    
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

// Copy Owlbear Rodeo URL to clipboard
function copyOwlbearUrl() {
    const url = 'https://www.owlbear.rodeo/*';
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

// Show pending approval modal
function showPendingApprovalModal() {
    const modal = document.getElementById('pendingApprovalModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close pending approval modal
function closePendingApprovalModal(event) {
    // Only close if clicking the overlay or the button specifically
    if (event.target.id === 'pendingApprovalModal' || event.target.classList.contains('modal-close') || event.target.classList.contains('modal-button')) {
        const modal = document.getElementById('pendingApprovalModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Helper function to toggle a section open/closed
function setSectionState(sectionCard, isOpen) {
    const header = sectionCard.querySelector('.card-header');
    const content = sectionCard.querySelector('.card-content');
    
    if (isOpen) {
        header.classList.add('active');
        content.classList.add('active');
    } else {
        header.classList.remove('active');
        content.classList.remove('active');
    }
}

// Add click listeners to all card headers on page load
$(document).ready(function() {
    // Ensure all sections start closed by default
    $('.section-card').each(function() {
        setSectionState(this, false);
    });
    
    // Smooth animations on page load
    $('.section-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
});

// Add fade-in animation to cards and handle anchors
$(window).on('load', function() {
    $('.section-card').addClass('fade-in');
    
    // Handle URL anchor to auto-open sections (after page fully loads)
    const hash = window.location.hash.substring(1); // Remove the # symbol
    
    if (hash === 'player' || hash === 'dm') {
        // Close all sections first
        $('.section-card').each(function() {
            setSectionState(this, false);
        });
        
        // Open the target section
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            setSectionState(targetSection, true);
            
            // Scroll to the section after a short delay
            setTimeout(function() {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
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
