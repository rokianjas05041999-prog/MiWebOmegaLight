/**
 * Navigation Component
 * Handles mobile menu functionality, smooth scrolling, and navigation interactions
 * 
 * Features:
 * - Mobile menu toggle and animations
 * - Off-canvas menu with overlay
 * - Smooth scrolling for anchor links
 * - Focus management and accessibility
 * - Responsive behavior
 */

import { DOMUtils } from '../utils/dom.js';

export class Navigation {
  constructor() {
    this.isMenuOpen = false;
    this.isSearchOpen = false;
    this.lastScrollTop = 0;
    this.isScrolling = false;
    this.focusTrapHandler = null;
    this.isInitialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.openMobileMenu = this.openMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
  }

  async init() {
    if (this.isInitialized) {
      console.log('🧭 Navigation Component already initialized, skipping...');
      return;
    }

    console.log('🧭 Initializing Navigation Component...');
    
    // Wait for DOM elements to be available
    await this.waitForDOMElements();
    
    // Add small delay to ensure header is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize mobile menu functionality
    this.initMobileMenu();
    
    // Initialize search functionality
    this.initSearch();
    
    // Initialize scroll behavior
    this.initScrollBehavior();
    
    // Initialize smooth scrolling
    this.initSmoothScrolling();
    
    // Initialize keyboard navigation
    this.initKeyboardNavigation();
    
    this.isInitialized = true;
    console.log('✅ Navigation Component initialized');
  }

  /**
   * Wait for DOM elements to be available
   */
  async waitForDOMElements() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkElements = () => {
        attempts++;
        const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        
        if (mobileMenuToggle && mobileMenu) {
          console.log(`✅ Navigation elements found after ${attempts} attempts`);
          resolve();
        } else if (attempts >= maxAttempts) {
          console.warn('⚠️ Navigation elements not found after maximum attempts');
          resolve(); // Continue anyway
        } else {
          // Check again in next animation frame
          requestAnimationFrame(checkElements);
        }
      };
      
      checkElements();
    });
  }

  /**
   * Initialize mobile menu functionality
   */
  initMobileMenu() {
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenuClose = document.querySelector('[data-mobile-menu-close]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuOverlay = document.querySelector('.header-mobile-overlay');
    const mobileMenuItems = document.querySelectorAll('.header-mobile-item, .header-mobile-cta');

    if (!mobileMenuToggle || !mobileMenu) {
      console.warn('Mobile menu elements not found');
      return;
    }

    console.log('🔧 Setting up mobile menu event listeners...');

    // Mobile menu toggle button
    mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('📱 Mobile menu toggle clicked');
      this.toggleMobileMenu();
    });

    // Close button
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('❌ Mobile menu close clicked');
        this.closeMobileMenu();
      });
    }

    // Overlay click to close
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', () => {
        console.log('🔄 Overlay clicked - closing menu');
        this.closeMobileMenu();
      });
    }

    // Close menu when clicking menu items (except anchors that stay on page)
    mobileMenuItems.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        console.log('🔗 Menu item clicked:', href);
        // Close menu for anchor links or external links
        if (href && (href.startsWith('#') || !href.startsWith('/'))) {
          // Small delay for anchor links to allow smooth scroll
          setTimeout(() => {
            this.closeMobileMenu();
          }, href.startsWith('#') ? 100 : 0);
        }
      });
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Close mobile menu on desktop breakpoint
        if (window.innerWidth >= 768 && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      }, 250);
    });

    // Prevent menu from staying open on back button
    window.addEventListener('popstate', () => {
      if (this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    console.log('✅ Mobile menu event listeners setup complete');
  }

  /**
   * Initialize search functionality
   */
  initSearch() {
    const searchToggle = document.querySelector('[data-search-toggle]');
    const searchForm = document.querySelector('[data-search-form]');
    const searchClose = document.querySelector('[data-search-close]');
    const searchInput = document.querySelector('[data-search-input]');

    if (!searchToggle || !searchForm) {
      console.warn('Search elements not found');
      return;
    }

    console.log('🔧 Setting up search event listeners...');

    // Search toggle button
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔍 Search toggle clicked');
      this.toggleSearch();
    });

    // Close button
    if (searchClose) {
      searchClose.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('❌ Search close clicked');
        this.closeSearch();
      });
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isSearchOpen && !searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
        console.log('🔄 Clicked outside search - closing');
        this.closeSearch();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isSearchOpen) {
        this.closeSearch();
        searchToggle.focus();
      }
    });

    console.log('✅ Search event listeners setup complete');
  }

  /**
   * Toggle search form
   */
  toggleSearch() {
    console.log('🔄 Toggling search, current state:', this.isSearchOpen);
    if (this.isSearchOpen) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }

  /**
   * Open search form
   */
  openSearch() {
    const searchForm = document.querySelector('[data-search-form]');
    const searchInput = document.querySelector('[data-search-input]');

    if (!searchForm) {
      console.error('Search form element not found');
      return;
    }

    console.log('🔍 Opening search form...');

    // Show search form
    searchForm.classList.add('active');

    // Focus on input
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 200); // Wait for animation
    }

    // Update state
    this.isSearchOpen = true;

    console.log('✅ Search form opened successfully');
  }

  /**
   * Close search form
   */
  closeSearch() {
    const searchForm = document.querySelector('[data-search-form]');
    const searchInput = document.querySelector('[data-search-input]');

    if (!searchForm) {
      console.error('Search form element not found');
      return;
    }

    console.log('🔍 Closing search form...');

    // Hide search form
    searchForm.classList.remove('active');

    // Clear input
    if (searchInput) {
      searchInput.value = '';
    }

    // Update state
    this.isSearchOpen = false;

    console.log('✅ Search form closed successfully');
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    console.log('🔄 Toggling mobile menu, current state:', this.isMenuOpen);
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');

    if (!mobileMenu) {
      console.error('Mobile menu element not found');
      return;
    }

    console.log('📱 Opening mobile menu...');

    // Show menu container
    mobileMenu.classList.remove('hidden');
    
    // Force reflow for animation
    mobileMenu.offsetHeight;
    
    // Add active class for CSS transitions
    mobileMenu.classList.add('active');

    // Update button state
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.add('active');
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');

    // Update state
    this.isMenuOpen = true;

    // Setup focus trap
    this.trapFocus();

    // Announce to screen readers
    this.announce('Mobile menu opened');

    console.log('✅ Mobile menu opened successfully');
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');

    if (!mobileMenu) {
      console.error('Mobile menu element not found');
      return;
    }

    console.log('📱 Closing mobile menu...');

    // Remove active class for CSS transitions
    mobileMenu.classList.remove('active');

    // Update button state
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove('active');
    }

    // Wait for animation to complete before hiding
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
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

    console.log('✅ Mobile menu closed successfully');
  }

  /**
   * Initialize scroll behavior for navbar
   */
  initScrollBehavior() {
    const navbar = document.querySelector('.header-navbar');
    if (!navbar) return;

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
        navbar.classList.add('scroll-end');
        setTimeout(() => {
          navbar.classList.remove('scroll-end');
        }, 1000);
      }, 150);
    });
  }

  /**
   * Handle scroll events for navbar visibility
   */
  handleScroll() {
    const navbar = document.querySelector('.header-navbar');
    if (!navbar) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class
    if (currentScrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar based on scroll direction (optional behavior)
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
      // Scrolling down - could hide navbar
      navbar.classList.add('navbar-hidden');
    } else {
      // Scrolling up - show navbar
      navbar.classList.remove('navbar-hidden');
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const navbar = document.querySelector('.header-navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection && targetId !== '#') {
          e.preventDefault();

          // Calculate scroll position with navbar offset
          const targetPosition = targetSection.offsetTop - navbarHeight - 20;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }

          // Update active state
          this.updateActiveLink(link);
        }
      });
    });
  }

  /**
   * Update active link state
   */
  updateActiveLink(clickedLink) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-item');

    // Remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to clicked link
    clickedLink.classList.add('active');
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Close menu on Escape
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
        const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
        if (mobileMenuToggle) {
          mobileMenuToggle.focus();
        }
      }
    });
  }

  /**
   * Trap focus within mobile menu for accessibility
   */
  trapFocus() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
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

  /**
   * Release focus trap
   */
  releaseFocus() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  /**
   * Announce to screen readers
   */
  announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  /**
   * Public method to programmatically close menu
   */
  close() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Public method to programmatically open menu
   */
  open() {
    if (!this.isMenuOpen) {
      this.openMobileMenu();
    }
  }

  /**
   * Check if mobile menu is open
   */
  isOpen() {
    return this.isMenuOpen;
  }

  /**
   * Cleanup method
   */
  destroy() {
    this.releaseFocus();
    this.isMenuOpen = false;
    
    // Remove body classes
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    
    console.log('🧭 Navigation Component destroyed');
  }
}

export default Navigation;