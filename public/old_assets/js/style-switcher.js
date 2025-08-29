// style-switcher.js
document.addEventListener('DOMContentLoaded', function() {
    // Style configuration
    const styleConfig = {
        primary: {
            name: 'Primary Orange',
            icon: 'heroicons:sun',
            iconColor: 'text-orange-600',
            floatingBtnBg: '#ea580c',
            badgeColors: {
                sale: 'bg-orange-600',
                hot: 'bg-orange-600',
                best: 'bg-orange-600'
            }
        },
        secondary: {
            name: 'Secondary Green',
            icon: 'heroicons:sparkles',
            iconColor: 'text-emerald-600',
            floatingBtnBg: '#059669',
            badgeColors: {
                sale: 'bg-emerald-600',
                hot: 'bg-emerald-600',
                best: 'bg-emerald-600'
            }
        },
        tertiary: {
            name: 'Tertiary Pearl',
            icon: 'heroicons:moon',
            iconColor: 'text-neutral-600',
            floatingBtnBg: '#525252',
            badgeColors: {
                sale: 'bg-neutral-600',
                hot: 'bg-neutral-600',
                best: 'bg-neutral-600'
            }
        }
    };
    
    // Toggle functionality for floating selector
    const toggleBtn = document.getElementById('styleToggleBtn');
    const selectorPanel = document.getElementById('styleSelectorPanel');
    
    // Toggle panel visibility
    if (toggleBtn && selectorPanel) {
        toggleBtn.addEventListener('click', function() {
            const isOpen = selectorPanel.classList.contains('show');
            
            if (isOpen) {
                selectorPanel.classList.remove('show');
                toggleBtn.classList.remove('active');
            } else {
                selectorPanel.classList.add('show');
                toggleBtn.classList.add('active');
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.floating-container')) {
                selectorPanel.classList.remove('show');
                toggleBtn.classList.remove('active');
            }
        });
    }
    
    // Existing style switching functionality
    const radioButtons = document.querySelectorAll('input[name="style"]');
    const styleLink = document.getElementById('style-link');
    
    // Check localStorage for saved style
    const savedStyle = localStorage.getItem('selectedStyle') || 'primary';
    const savedRadio = document.querySelector(`input[value="${savedStyle}"]`);
    if (savedRadio) {
        savedRadio.checked = true;
    }
    
    // Apply initial style
    applyStyle(savedStyle);
    
    // Event listener for style changes
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                applyStyle(this.value);
                
                // Optional: Close panel after selection
                setTimeout(() => {
                    if (selectorPanel) {
                        selectorPanel.classList.remove('show');
                        toggleBtn.classList.remove('active');
                    }
                }, 300);
                
                // Optional: Show notification
                showStyleChangeNotification(this.value);
            }
        });
    });
    
    // Main function to apply style
    function applyStyle(styleName) {
        // Update CSS file
        styleLink.href = `/src/${styleName}.css`;
        
        // Save to localStorage
        localStorage.setItem('selectedStyle', styleName);
        
        // Update floating button color
        updateFloatingButton(styleName);
        
        // Update dynamic elements
        updateDynamicElements(styleName);
        
        // Update body data attribute for CSS hooks
        document.body.setAttribute('data-theme', styleName);
    }
    
    // Update floating button appearance
    function updateFloatingButton(styleName) {
        const config = styleConfig[styleName];
        if (toggleBtn && config) {
            toggleBtn.style.backgroundColor = config.floatingBtnBg;
            
            // Update icon
            const iconElement = toggleBtn.querySelector('iconify-icon');
            if (iconElement) {
                iconElement.setAttribute('icon', config.icon);
            }
        }
    }
    
    // Update dynamic elements based on theme
    function updateDynamicElements(styleName) {
        const config = styleConfig[styleName];
        if (!config) return;
        
        // Update badge colors
        updateBadgeColors(config.badgeColors);
        
        // Update icon colors in style selector
        updateStyleSelectorIcons(styleName);
        
        // Update other dynamic elements
        updateSectionBackgrounds(styleName);
        updateButtonStyles(styleName);
    }
    
    // Update badge colors
    function updateBadgeColors(badgeColors) {
        // Sale badges
        document.querySelectorAll('.badge-sale').forEach(badge => {
            badge.className = `badge-sale ${badgeColors.sale} text-white text-xs font-bold px-3 py-1 rounded-full`;
        });
        
        // Hot badges
        document.querySelectorAll('[class*="bg-red-600"]').forEach(badge => {
            if (badge.textContent.trim() === 'HOT') {
                badge.className = `${badgeColors.hot} text-white text-xs font-bold px-3 py-1 rounded-full`;
            }
        });
        
        // Best seller badges
        document.querySelectorAll('[class*="bg-orange-600"]').forEach(badge => {
            if (badge.textContent.trim() === 'BEST SELLER') {
                badge.className = `${badgeColors.best} text-white text-xs font-bold px-3 py-1 rounded-full`;
            }
        });
    }
    
    // Update style selector icons
    function updateStyleSelectorIcons(currentStyle) {
        Object.keys(styleConfig).forEach(style => {
            const option = document.querySelector(`input[value="${style}"]`);
            if (option) {
                const iconElement = option.parentElement.querySelector('iconify-icon');
                if (iconElement) {
                    iconElement.className = styleConfig[style].iconColor;
                }
            }
        });
    }
    
    // Update section backgrounds
    function updateSectionBackgrounds(styleName) {
        // Update sections with theme-specific classes
        document.querySelectorAll('[class*="bg-orange-"], [class*="bg-emerald-"], [class*="bg-neutral-"]').forEach(element => {
            // Skip elements that shouldn't change
            if (element.closest('.style-selector-panel') || 
                element.closest('.footer-section') ||
                element.tagName === 'SPAN' && element.closest('.badge')) {
                return;
            }
            
            // Update based on theme
            const classList = element.className;
            if (styleName === 'primary' && classList.includes('bg-emerald-')) {
                element.className = classList.replace(/bg-emerald-(\d+)/g, 'bg-orange-$1');
            } else if (styleName === 'secondary' && classList.includes('bg-orange-')) {
                element.className = classList.replace(/bg-orange-(\d+)/g, 'bg-emerald-$1');
            } else if (styleName === 'tertiary') {
                element.className = classList.replace(/bg-(orange|emerald)-(\d+)/g, 'bg-neutral-$2');
            }
        });
    }
    
    // Update button styles
    function updateButtonStyles(styleName) {
        // Update primary buttons
        document.querySelectorAll('.bg-primary-600').forEach(btn => {
            if (!btn.closest('.style-selector-panel')) {
                btn.classList.add('transition-colors');
            }
        });
        
        // Update hover states via CSS variables (handled by CSS files)
    }
});