/**
 * FAQ Section JavaScript
 * Handles expand/collapse functionality
 */

// Initialize FAQ
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
});

function initFAQ() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    // Add click handlers to each FAQ question
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                toggleFAQ(item);
            });
        }
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', handleKeyboard);
    
    // Optional: Open first FAQ by default
    // openFirstFAQ();
    
    // Optional: Add search functionality
    // initFAQSearch();
}

// Toggle FAQ item
function toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    const allItems = document.querySelectorAll('.faq-item');
    
    // Close all other items (accordion behavior)
    allItems.forEach(faq => {
        if (faq !== item && faq.classList.contains('active')) {
            closeFAQ(faq);
        }
    });
    
    // Toggle current item
    if (isActive) {
        closeFAQ(item);
    } else {
        openFAQ(item);
    }
}

// Open FAQ item
function openFAQ(item) {
    item.classList.add('active');
    
    // Announce to screen readers
    const answer = item.querySelector('.faq-answer');
    if (answer) {
        answer.setAttribute('aria-hidden', 'false');
    }
    
    // Smooth scroll into view if needed
    setTimeout(() => {
        const rect = item.getBoundingClientRect();
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;
        
        if (isOutOfView) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 300);
}

// Close FAQ item
function closeFAQ(item) {
    item.classList.remove('active');
    
    // Announce to screen readers
    const answer = item.querySelector('.faq-answer');
    if (answer) {
        answer.setAttribute('aria-hidden', 'true');
    }
}

// Keyboard navigation
function handleKeyboard(e) {
    const focusedElement = document.activeElement;
    const faqQuestion = focusedElement.closest('.faq-question');
    
    if (!faqQuestion) return;
    
    const currentItem = faqQuestion.closest('.faq-item');
    const allItems = Array.from(document.querySelectorAll('.faq-item'));
    const currentIndex = allItems.indexOf(currentItem);
    
    switch(e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault();
            toggleFAQ(currentItem);
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < allItems.length - 1) {
                const nextQuestion = allItems[currentIndex + 1].querySelector('.faq-question');
                nextQuestion?.focus();
            }
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
                const prevQuestion = allItems[currentIndex - 1].querySelector('.faq-question');
                prevQuestion?.focus();
            }
            break;
            
        case 'Home':
            e.preventDefault();
            const firstQuestion = allItems[0].querySelector('.faq-question');
            firstQuestion?.focus();
            break;
            
        case 'End':
            e.preventDefault();
            const lastQuestion = allItems[allItems.length - 1].querySelector('.faq-question');
            lastQuestion?.focus();
            break;
    }
}

// Open first FAQ by default (optional)
function openFirstFAQ() {
    const firstItem = document.querySelector('.faq-item');
    if (firstItem) {
        openFAQ(firstItem);
    }
}

// FAQ Search functionality (optional)
function initFAQSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cari pertanyaan...';
    searchInput.className = 'faq-search w-full px-4 py-2 border border-neutral-300 rounded-lg mb-6';
    
    const faqContainer = document.querySelector('.faq-list');
    if (faqContainer) {
        faqContainer.parentNode.insertBefore(searchInput, faqContainer);
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterFAQs(searchTerm);
        });
    }
}

// Filter FAQs based on search
function filterFAQs(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categories = document.querySelectorAll('.faq-category');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.question-text').textContent.toLowerCase();
        const answer = item.querySelector('.answer-content').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Hide empty categories
    categories.forEach(category => {
        const visibleItems = category.querySelectorAll('.faq-item:not([style*="display: none"])');
        category.style.display = visibleItems.length > 0 ? '' : 'none';
    });
}

// Utility: Get FAQ data (for analytics)
function getFAQData() {
    const faqItems = document.querySelectorAll('.faq-item');
    const data = [];
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.question-text')?.textContent;
        const isActive = item.classList.contains('active');
        
        data.push({
            index,
            question,
            isActive,
            element: item
        });
    });
    
    return data;
}

// Export functions for external use
window.FAQ = {
    toggle: toggleFAQ,
    open: openFAQ,
    close: closeFAQ,
    getData: getFAQData,
    initSearch: initFAQSearch
};
