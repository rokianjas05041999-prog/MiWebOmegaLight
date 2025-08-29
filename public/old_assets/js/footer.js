/**
 * Footer JavaScript
 * Handles footer functionality
 */

// Initialize footer
document.addEventListener('DOMContentLoaded', function() {
    initFooter();
});

function initFooter() {
    // Update current year
    updateYear();
    
    // Initialize newsletter form
    initNewsletter();
    
    // Smooth scroll for footer links
    initSmoothScroll();
    
    // Track social media clicks
    trackSocialClicks();
}

// Update copyright year
function updateYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Newsletter subscription
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            showNewsletterMessage('Email tidak valid', 'error');
            return;
        }
        
        // Show loading state
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Loading...';
        btn.disabled = true;
        
        try {
            // Simulate API call
            await subscribeToNewsletter(email);
            
            // Success
            showNewsletterMessage('Terima kasih! Anda berhasil berlangganan newsletter.', 'success');
            emailInput.value = '';
            
        } catch (error) {
            // Error
            showNewsletterMessage('Terjadi kesalahan. Silakan coba lagi.', 'error');
        } finally {
            // Reset button
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mock newsletter subscription
async function subscribeToNewsletter(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success/failure
    if (Math.random() > 0.1) {
        // Store email (in real app, send to backend)
        console.log('Newsletter subscription:', email);
        return { success: true };
    } else {
        throw new Error('Subscription failed');
    }
}

// Show newsletter message
function showNewsletterMessage(message, type) {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    // Remove existing message
    const existingMsg = form.parentElement.querySelector('.newsletter-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Add classes to form
    form.classList.remove('success', 'error');
    form.classList.add(type);
    
    // Create message element
    const msgDiv = document.createElement('div');
    msgDiv.className = `newsletter-message ${type}`;
    msgDiv.textContent = message;
    
    // Insert after form
    form.parentElement.appendChild(msgDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        msgDiv.remove();
        form.classList.remove('success', 'error');
    }, 5000);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Track social media clicks
function trackSocialClicks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.getAttribute('aria-label');
            
            // Track click (Google Analytics, etc.)
            console.log('Social click:', platform);
            
            // Optional: Open in new window
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

// Utility: Get footer height
function getFooterHeight() {
    const footer = document.querySelector('.footer-section');
    return footer ? footer.offsetHeight : 0;
}

// Export functions
window.Footer = {
    getHeight: getFooterHeight,
    subscribeNewsletter: subscribeToNewsletter
};
