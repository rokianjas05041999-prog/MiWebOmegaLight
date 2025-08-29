/**
 * Testimonial Section JavaScript
 * Handles testimonial carousel functionality
 */

// Configuration
const testimonialConfig = {
    autoPlay: true,
    autoPlayInterval: 5000,
    pauseOnHover: true
};

// State
let currentTestimonial = 0;
let totalTestimonials = 0;
let autoPlayTimer = null;
let isTransitioning = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTestimonials();
});

function initTestimonials() {
    // Get elements
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    totalTestimonials = cards.length;
    
    if (totalTestimonials === 0) return;
    
    // Setup event listeners
    setupHoverPause();
    
    // Start autoplay
    if (testimonialConfig.autoPlay) {
        startAutoPlay();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Touch support
    setupTouchSupport();
    
    // Animate stats on scroll
    setupStatsAnimation();
}

// Show specific testimonial
function showTestimonial(index) {
    if (isTransitioning || index === currentTestimonial) return;
    
    isTransitioning = true;
    
    // Get elements
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Hide current
    if (cards[currentTestimonial]) {
        cards[currentTestimonial].classList.remove('active');
        cards[currentTestimonial].classList.add('slide-out');
    }
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Show new
    setTimeout(() => {
        if (cards[currentTestimonial]) {
            cards[currentTestimonial].classList.remove('slide-out');
        }
        
        currentTestimonial = index;
        
        if (cards[currentTestimonial]) {
            cards[currentTestimonial].classList.add('active', 'slide-in');
        }
        
        setTimeout(() => {
            if (cards[currentTestimonial]) {
                cards[currentTestimonial].classList.remove('slide-in');
            }
            isTransitioning = false;
        }, 500);
    }, 300);
}

// Navigation functions - EXPOSED TO GLOBAL
function nextTestimonial() {
    const next = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(next);
    resetAutoPlay();
}

function prevTestimonial() {
    const prev = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(prev);
    resetAutoPlay();
}

function goToTestimonial(index) {
    showTestimonial(index);
    resetAutoPlay();
}

// Auto play
function startAutoPlay() {
    if (!testimonialConfig.autoPlay) return;
    
    autoPlayTimer = setInterval(() => {
        nextTestimonial();
    }, testimonialConfig.autoPlayInterval);
}

function stopAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

function resetAutoPlay() {
    if (testimonialConfig.autoPlay) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// Pause on hover
function setupHoverPause() {
    if (!testimonialConfig.pauseOnHover) return;
    
    const container = document.querySelector('.testimonial-content');
    
    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', () => {
            if (testimonialConfig.autoPlay) {
                startAutoPlay();
            }
        });
    }
}

// Keyboard navigation
function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        prevTestimonial();
    } else if (e.key === 'ArrowRight') {
        nextTestimonial();
    }
}

// Touch support
function setupTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const testimonialWrapper = document.querySelector('.testimonial-wrapper');
    
    if (testimonialWrapper) {
        testimonialWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
}

function handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextTestimonial();
        } else {
            prevTestimonial();
        }
    }
}

// Stats animation
function setupStatsAnimation() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsContainer = document.querySelector('.testimonial-stats');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
}

// Animate statistics numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const target = parseInt(text.replace(/\D/g, ''));
        const suffix = text.includes('%') ? '%' : '+';
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

// EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR HTML onclick
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.goToTestimonial = goToTestimonial;
