// Category Static Section Handler
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize static category interactions
    initializeStaticCategories();
    
    // Initialize filter functionality (if needed)
    initializeCategoryFilter();
});

// Initialize Static Categories
function initializeStaticCategories() {
    const categoryCards = document.querySelectorAll('.group, [class*="hover:shadow"]');
    
    categoryCards.forEach(card => {
        // Track hover time
        let hoverTimer;
        
        card.addEventListener('mouseenter', function() {
            hoverTimer = setTimeout(() => {
                // Show quick preview after 1 second hover
                showQuickPreview(this);
            }, 1000);
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimer);
            hideQuickPreview();
        });
        
        // Click handler with ripple effect
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            
            // Navigate to category
            const categoryTitle = this.querySelector('h3').textContent;
            handleCategoryClick(categoryTitle);
        });
    });
}

// Create ripple effect on click
function createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show quick preview tooltip
function showQuickPreview(element) {
    const preview = document.createElement('div');
    preview.className = 'category-preview';
    preview.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-4 absolute z-50 w-64">
            <p class="text-sm font-semibold mb-2">Quick Info</p>
            <p class="text-xs text-gray-600">Click untuk melihat semua produk dalam kategori ini</p>
        </div>
    `;
    
    document.body.appendChild(preview);
    
    // Position the preview
    const rect = element.getBoundingClientRect();
    preview.style.position = 'absolute';
    preview.style.top = (rect.top - 80) + 'px';
    preview.style.left = rect.left + 'px';
}

// Hide quick preview
function hideQuickPreview() {
    const preview = document.querySelector('.category-preview');
    if (preview) {
        preview.remove();
    }
}

// Handle category click
function handleCategoryClick(categoryName) {
    // Add your navigation logic here
    console.log('Navigating to category:', categoryName);
    
    // Example: Show loading state
    showLoadingState();
    
    // Simulate navigation delay
    setTimeout(() => {
        hideLoadingState();
        // window.location.href = `/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
    }, 500);
}

// Category filter initialization
function initializeCategoryFilter() {
    // If you have filter buttons, initialize them here
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCategories(filter);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Filter categories
function filterCategories(filter) {
    const cards = document.querySelectorAll('.group, [class*="col-span"]');
    
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Loading state handlers
function showLoadingState() {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.id = 'category-loader';
    loader.innerHTML = `
        <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span>Loading...</span>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoadingState() {
    const loader = document.getElementById('category-loader');
    if (loader) {
        loader.remove();
    }
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
