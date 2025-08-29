// src/js/navbar.js - Responsive Navbar Handler with Module Export

class ResponsiveNavbar {
    constructor() {
        // Get DOM elements
        this.elements = {
            navbar: document.querySelector('.navbar, nav'),
            mobileMenuButton: document.getElementById('mobile-menu-button'),
            mobileMenu: document.getElementById('mobile-menu'),
            closeMenu: document.getElementById('close-menu'),
            menuOverlay: document.getElementById('menu-overlay'),
            menuPanel: document.getElementById('menu-panel'),
            mobileMenuItems: document.querySelectorAll('.mobile-menu-item'),
            navLinks: document.querySelectorAll('.nav-link'),
            searchForm: document.querySelector('.search-form'),
            searchInput: document.querySelector('input[name="q"]')
        };
        
        // State
        this.isMenuOpen = false;
        this.lastScrollTop = 0;
        this.isScrolling = false;
        
        // Initialize
        this.init();
    }
    
    // Initialize all features
    init() {
        // Check if required elements exist
        if (!this.elements.mobileMenuButton || !this.elements.mobileMenu) {
            console.warn('Mobile menu elements not found - some features may not work');
        }
        
        // Initialize features
        this.initMobileMenu();
        this.initScrollBehavior();
        this.initSearchForm();
        this.initActiveLinks();
        this.initKeyboardNavigation();
        
        console.log('✅ Navbar initialized successfully');
    }
    
    // Initialize mobile menu functionality
    initMobileMenu() {
        if (!this.elements.mobileMenuButton || !this.elements.mobileMenu) return;
        
        // Mobile menu toggle
        this.elements.mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Close menu button
        if (this.elements.closeMenu) {
            this.elements.closeMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }
        
        // Close on overlay click
        if (this.elements.menuOverlay) {
            this.elements.menuOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Close menu when clicking menu items (except anchors)
        this.elements.mobileMenuItems.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Don't close if it's an anchor link or has sub-menu
                if (href && !href.startsWith('#') && !link.querySelector('.sub-menu')) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });
        
        // Prevent menu from staying open on back button
        window.addEventListener('popstate', () => {
            if (this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    // Initialize scroll behavior (hide/show navbar)
    initScrollBehavior() {
        if (!this.elements.navbar) return;
        
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }
            
            // Clear and reset timer for scroll end detection
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.elements.navbar.classList.add('scroll-end');
                setTimeout(() => {
                    this.elements.navbar.classList.remove('scroll-end');
                }, 1000);
            }, 150);
        });
    }
    
    // Handle scroll events
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (currentScrollTop > 50) {
            this.elements.navbar.classList.add('scrolled');
        } else {
            this.elements.navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
            // Scrolling down
            this.elements.navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            this.elements.navbar.classList.remove('navbar-hidden');
        }
        
        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }
    
    // Initialize search form
    initSearchForm() {
        if (!this.elements.searchForm) return;
        
        this.elements.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = this.elements.searchInput?.value.trim();
            
            if (query) {
                console.log('Searching for:', query);
                // Implement search functionality
                this.performSearch(query);
            } else {
                // Show validation message
                this.elements.searchInput?.classList.add('error');
                setTimeout(() => {
                    this.elements.searchInput?.classList.remove('error');
                }, 2000);
            }
        });
        
        // Clear error on input
        this.elements.searchInput?.addEventListener('input', () => {
            this.elements.searchInput.classList.remove('error');
        });
    }
    
    // Perform search (implement based on your needs)
    performSearch(query) {
        // Example: redirect to search page
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        
        // Or: show search results in modal
        console.log('Search query:', query);
    }
    
    // Initialize active link highlighting
    initActiveLinks() {
        const currentPath = window.location.pathname;
        
        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if this is the active page
            if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
                link.classList.add('active');
            }
            
            // Smooth scroll for anchor links
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = this.elements.navbar?.offsetHeight || 80;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if (this.isMenuOpen) {
                            this.closeMobileMenu();
                        }
                    }
                });
            }
        });
    }
    
    // Initialize keyboard navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Close menu on Escape
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
                this.elements.mobileMenuButton?.focus();
            }
            
            // Focus search on Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.elements.searchInput?.focus();
            }
        });
    }
    
    // Toggle mobile menu
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    // Open mobile menu
    openMobileMenu() {
        if (!this.elements.mobileMenu) return;
        
        // Show menu container
        this.elements.mobileMenu.style.display = 'block';
        this.elements.mobileMenu.classList.add('active');
        
        // Animate panel
        if (this.elements.menuPanel) {
            // Force reflow for animation
            this.elements.menuPanel.offsetHeight;
            
            this.elements.menuPanel.classList.remove('translate-x-full');
            this.elements.menuPanel.classList.add('translate-x-0');
        }
        
        // Show overlay with fade
        if (this.elements.menuOverlay) {
            this.elements.menuOverlay.classList.add('opacity-100');
            this.elements.menuOverlay.classList.remove('opacity-0');
        }
        
        // Update button state
        this.elements.mobileMenuButton?.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
        
        // Update state
        this.isMenuOpen = true;
        
        // Trap focus in menu
        this.trapFocus();
        
        // Announce to screen readers
        this.announce('Mobile menu opened');
    }
    
    // Close mobile menu
    closeMobileMenu() {
        if (!this.elements.mobileMenu) return;
        
        // Animate panel out
        if (this.elements.menuPanel) {
            this.elements.menuPanel.classList.remove('translate-x-0');
            this.elements.menuPanel.classList.add('translate-x-full');
        }
        
        // Hide overlay with fade
        if (this.elements.menuOverlay) {
            this.elements.menuOverlay.classList.remove('opacity-100');
            this.elements.menuOverlay.classList.add('opacity-0');
        }
        
        // Update button state
        this.elements.mobileMenuButton?.classList.remove('active');
        
        // Wait for animation to complete
        setTimeout(() => {
            if (this.elements.mobileMenu) {
                this.elements.mobileMenu.classList.remove('active');
                this.elements.mobileMenu.style.display = 'none';
            }
        }, 300);
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        
        // Update state
        this.isMenuOpen = false;
        
        // Release focus trap
        this.releaseFocus();
        
        // Announce to screen readers
        this.announce('Mobile menu closed');
    }
    
    // Handle window resize
    handleResize() {
        // Close mobile menu on desktop breakpoint
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    // Trap focus within mobile menu
    trapFocus() {
        const focusableElements = this.elements.mobileMenu?.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Handle tab key
        this.focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        document.addEventListener('keydown', this.focusTrapHandler);
    }
    
    // Release focus trap
    releaseFocus() {
        if (this.focusTrapHandler) {
            document.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }
    
    // Announce to screen readers
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Public method to programmatically close menu
    close() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    // Public method to programmatically open menu
    open() {
        if (!this.isMenuOpen) {
            this.openMobileMenu();
        }
    }
    
    // Destroy method for cleanup
    destroy() {
        // Remove all event listeners
        this.releaseFocus();
        // Add more cleanup if needed
    }
}

// Auto-initialize when imported
const navbar = new ResponsiveNavbar();

// Export both the class and instance
export { ResponsiveNavbar, navbar as default };
