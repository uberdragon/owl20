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

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<span class="toast-icon">✓</span><span class="toast-message">' + message + '</span>';
    
    // Add to body
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(function() {
        toast.classList.add('show');
    }, 10);
    
    // Remove after animation
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 2000);
}

// Copy manifest URL to clipboard
function copyManifestUrl() {
    const url = 'https://owl20.FriendlyMimic.com/manifest.json';
    const button = event.target.closest('.copy-btn');
    
    // Push dataLayer event for GTM tracking
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'copy_manifest_url',
            'url_copied': url,
            'copy_location': 'dm_setup_section'
        });
    }
    
    navigator.clipboard.writeText(url).then(function() {
        showToast('Added to Clipboard');
        
        // Update button to show success if it exists
        if (button) {
            const icon = button.querySelector('.copy-icon');
            if (icon) {
                icon.textContent = '✅';
                button.title = 'Copied!';
                
                // Reset after 2 seconds
                setTimeout(function() {
                    icon.textContent = '📋';
                    button.title = 'Copy URL';
                }, 2000);
            }
        }
    }).catch(function(err) {
        console.error('Failed to copy URL:', err);
        showToast('Failed to copy');
    });
}

// Copy Owlbear Rodeo URL to clipboard
function copyOwlbearUrl() {
    const url = 'https://www.owlbear.rodeo/*';
    const button = event.target.closest('.copy-btn');
    
    // Push dataLayer event for GTM tracking
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'copy_owlbear_url',
            'url_copied': url,
            'copy_location': 'player_setup_section'
        });
    }
    
    navigator.clipboard.writeText(url).then(function() {
        showToast('Added to Clipboard');
        
        // Update button to show success if it exists
        if (button) {
            const icon = button.querySelector('.copy-icon');
            if (icon) {
                icon.textContent = '✅';
                button.title = 'Copied!';
                
                // Reset after 2 seconds
                setTimeout(function() {
                    icon.textContent = '📋';
                    button.title = 'Copy URL';
                }, 2000);
            }
        }
    }).catch(function(err) {
        console.error('Failed to copy URL:', err);
        showToast('Failed to copy');
    });
}

// Play video when play button is clicked
function playVideo() {
    const video = document.getElementById('demoVideo');
    const overlay = document.getElementById('playOverlay');
    
    if (video && overlay) {
        video.play();
        overlay.classList.add('hidden');
    }
}

// Hide play overlay when video is playing
function initVideoPlayer() {
    const video = document.getElementById('demoVideo');
    const overlay = document.getElementById('playOverlay');
    
    if (video && overlay) {
        // Hide overlay when video starts playing
        video.addEventListener('play', function() {
            overlay.classList.add('hidden');
        });
        
        // Show overlay when video ends or is paused
        video.addEventListener('pause', function() {
            if (video.ended) {
                overlay.classList.remove('hidden');
            }
        });
        
        video.addEventListener('ended', function() {
            overlay.classList.remove('hidden');
        });
    }
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

// Open accordion section by ID
function openSectionById(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const header = section.querySelector('.card-header');
        const content = section.querySelector('.card-content');
        
        // Close all other sections
        $('.section-card').each(function() {
            if (this.id !== sectionId) {
                setSectionState(this, false);
            }
        });
        
        // Open the target section
        header.classList.add('active');
        content.classList.add('active');
        
        // Update URL hash
        window.history.pushState({}, '', '#' + sectionId);
        
        // Scroll to the section
        setTimeout(function() {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
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

// Toggle FAQ accordion
function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = questionElement.classList.contains('active');
    
    // Toggle active class
    questionElement.classList.toggle('active');
    answer.classList.toggle('active');
    
    // Optional: Close other FAQ items (accordion behavior)
    // Uncomment the following lines if you want only one FAQ open at a time
    /*
    if (!isActive) {
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                const otherQuestion = item.querySelector('.faq-question');
                const otherAnswer = item.querySelector('.faq-answer');
                otherQuestion.classList.remove('active');
                otherAnswer.classList.remove('active');
            }
        });
    }
    */
}

// Add click listeners to all card headers on page load
$(document).ready(function() {
    // Initialize video player
    initVideoPlayer();
    
    // Ensure all sections start closed by default
    $('.section-card').each(function() {
        setSectionState(this, false);
    });
    
    // Ensure all FAQ items start closed by default
    $('.faq-item').each(function() {
        const question = this.querySelector('.faq-question');
        const answer = this.querySelector('.faq-answer');
        question.classList.remove('active');
        answer.classList.remove('active');
    });
    
    // Smooth animations on page load
    $('.section-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
    
    // Smooth animations for FAQ items
    $('.faq-item').each(function(index) {
        $(this).css('animation-delay', (index * 0.05) + 's');
    });
});

// Add fade-in animation to cards and handle anchors
$(window).on('load', function() {
    $('.section-card, .faq-item').addClass('fade-in');
    
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
    .section-card, .faq-item {
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
