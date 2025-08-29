// Detail Category Component
// Handles interactive functionality for the category detail page

export class DetailCategory {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.currentPage = 1;
    this.totalPages = 8;
    this.filters = {
      priceRange: 'all',
      brand: 'all',
      wattage: 'all',
      sortBy: 'featured'
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleProductActions = this.handleProductActions.bind(this);
    this.setupBreadcrumb = this.setupBreadcrumb.bind(this);
  }

  /**
   * Initialize the detail category component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupBreadcrumb();
      this.initialized = true;
      
      console.log('✅ DetailCategory component initialized');
    } catch (error) {
      console.error('❌ DetailCategory initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.detail-category-section'),
      breadcrumbList: document.querySelector('.detail-category-breadcrumb-list'),
      filterSelects: document.querySelectorAll('.detail-category-filter-select'),
      sortSelect: document.querySelector('.detail-category-sort-select'),
      actionBtns: document.querySelectorAll('.detail-category-action-btn'),
      productCards: document.querySelectorAll('.product-card'),
      quickViewBtns: document.querySelectorAll('.product-quick-view'),
      addToCartBtns: document.querySelectorAll('.product-cta'),
      paginationBtns: document.querySelectorAll('.detail-category-pagination-btn'),
      paginationNumbers: document.querySelectorAll('.detail-category-pagination-number'),
      resultsInfo: document.querySelector('.detail-category-results-info')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Detail category section not found');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter change handlers
    this.elements.filterSelects.forEach(select => {
      select.addEventListener('change', this.handleFilterChange);
    });

    // Sort change handler
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', this.handleSortChange);
    }

    // Action button handlers
    this.elements.actionBtns.forEach(btn => {
      btn.addEventListener('click', this.handleProductActions);
    });

    // Add to cart handlers (Quick view is handled by ProductQuickView component globally)
    this.elements.addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAddToCart(e));
    });

    // Pagination handlers
    this.elements.paginationBtns.forEach(btn => {
      btn.addEventListener('click', this.handlePagination);
    });

    this.elements.paginationNumbers.forEach(btn => {
      btn.addEventListener('click', this.handlePagination);
    });

    // Product card hover effects
    this.elements.productCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => this.handleCardHover(e, true));
      card.addEventListener('mouseleave', (e) => this.handleCardHover(e, false));
    });
  }

  /**
   * Setup dynamic breadcrumb functionality
   */
  setupBreadcrumb() {
    if (!this.elements.breadcrumbList) return;

    // Get category information from URL or meta tags
    const categoryInfo = this.getCategoryInfo();
    
    // Update breadcrumb with category information
    this.updateBreadcrumb(categoryInfo);
    
    console.log('🍞 Category breadcrumb setup completed');
  }

  /**
   * Get category information for breadcrumb
   */
  getCategoryInfo() {
    const url = window.location.pathname;
    const title = document.title;
    const metaCategory = document.querySelector('meta[name="category"]');
    
    // Default category info
    let categoryInfo = {
      name: 'LED Lights',
      url: url,
      parent: 'Categories',
      parentUrl: '/categories'
    };

    // Try to extract from URL structure
    const pathParts = url.split('/').filter(part => part);
    
    if (pathParts.length >= 2) {
      categoryInfo.parent = this.formatBreadcrumbText(pathParts[0]);
      categoryInfo.parentUrl = `/${pathParts[0]}`;
      categoryInfo.name = this.formatBreadcrumbText(pathParts[1]);
    }

    // Override with meta tags if available
    if (metaCategory) {
      categoryInfo.name = metaCategory.content;
    }

    return categoryInfo;
  }

  /**
   * Format text for breadcrumb display
   */
  formatBreadcrumbText(text) {
    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Update breadcrumb with category information
   */
  updateBreadcrumb(categoryInfo) {
    const currentCategoryElement = this.elements.breadcrumbList.querySelector('.detail-category-breadcrumb-current span');
    if (currentCategoryElement) {
      currentCategoryElement.textContent = categoryInfo.name;
    }
  }

  /**
   * Handle filter changes
   */
  handleFilterChange(e) {
    const select = e.target;
    const filterType = this.getFilterType(select);
    const value = select.value;
    
    // Update filter state
    this.filters[filterType] = value;
    
    // Apply filters
    this.applyFilters();
    
    // Add visual feedback
    this.addSelectFeedback(select);
    
    console.log(`🔍 Filter changed: ${filterType} = ${value}`);
  }

  /**
   * Handle sort changes
   */
  handleSortChange(e) {
    const select = e.target;
    const value = select.value;
    
    // Update sort state
    this.filters.sortBy = value;
    
    // Apply sorting
    this.applySorting();
    
    // Add visual feedback
    this.addSelectFeedback(select);
    
    console.log(`📊 Sort changed: ${value}`);
  }

  /**
   * Get filter type from select element
   */
  getFilterType(select) {
    const classList = select.className;
    if (classList.includes('price')) return 'priceRange';
    if (classList.includes('brand')) return 'brand';
    if (classList.includes('wattage')) return 'wattage';
    return 'unknown';
  }

  /**
   * Apply filters to product grid
   */
  applyFilters() {
    // In a real implementation, this would filter products
    // For now, we'll just update the results count
    this.updateResultsCount();
    
    // Show loading state briefly
    this.showLoadingState();
    
    setTimeout(() => {
      this.hideLoadingState();
      this.showNotification('Filters applied successfully');
    }, 500);
  }

  /**
   * Apply sorting to product grid
   */
  applySorting() {
    // In a real implementation, this would sort products
    // For now, we'll just show feedback
    this.showLoadingState();
    
    setTimeout(() => {
      this.hideLoadingState();
      this.showNotification('Products sorted successfully');
    }, 300);
  }

  /**
   * Handle pagination
   */
  handlePagination(e) {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const action = this.getPaginationAction(btn);
    
    let newPage = this.currentPage;
    
    switch (action) {
      case 'prev':
        newPage = Math.max(1, this.currentPage - 1);
        break;
      case 'next':
        newPage = Math.min(this.totalPages, this.currentPage + 1);
        break;
      case 'number':
        newPage = parseInt(btn.textContent);
        break;
    }
    
    if (newPage !== this.currentPage) {
      this.goToPage(newPage);
    }
  }

  /**
   * Get pagination action from button
   */
  getPaginationAction(btn) {
    if (btn.classList.contains('detail-category-pagination-prev')) return 'prev';
    if (btn.classList.contains('detail-category-pagination-next')) return 'next';
    if (btn.classList.contains('detail-category-pagination-number')) return 'number';
    return 'unknown';
  }

  /**
   * Go to specific page
   */
  goToPage(page) {
    this.currentPage = page;
    
    // Update pagination UI
    this.updatePaginationUI();
    
    // Show loading state
    this.showLoadingState();
    
    // Scroll to top of products
    this.scrollToProducts();
    
    // Simulate loading
    setTimeout(() => {
      this.hideLoadingState();
      this.showNotification(`Page ${page} loaded`);
    }, 500);
    
    console.log(`📄 Navigated to page ${page}`);
  }

  /**
   * Update pagination UI
   */
  updatePaginationUI() {
    // Update active page number
    this.elements.paginationNumbers.forEach(btn => {
      const pageNum = parseInt(btn.textContent);
      if (pageNum === this.currentPage) {
        btn.classList.add('detail-category-pagination-active');
      } else {
        btn.classList.remove('detail-category-pagination-active');
      }
    });

    // Update prev/next button states
    const prevBtn = document.querySelector('.detail-category-pagination-prev');
    const nextBtn = document.querySelector('.detail-category-pagination-next');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === this.totalPages;
    }
  }

  /**
   * Handle product actions (filter, sort, view)
   */
  handleProductActions(e) {
    const btn = e.currentTarget;
    const text = btn.textContent.trim();
    
    // Add visual feedback
    this.addButtonFeedback(btn);
    
    // Handle specific actions
    if (text.includes('Filter')) {
      this.toggleFilterPanel();
    } else if (text.includes('Sort')) {
      this.toggleSortPanel();
    } else if (text.includes('View')) {
      this.toggleViewMode();
    }
    
    console.log(`🔘 Action button clicked: ${text}`);
  }

  /**
   * Handle add to cart
   */
  handleAddToCart(e) {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const productCard = btn.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price-current').textContent;
    
    // Add visual feedback
    this.addButtonFeedback(btn);
    
    // Temporarily change button text
    const originalText = btn.innerHTML;
    btn.innerHTML = '<iconify-icon icon="heroicons:check" class="product-cta-icon"></iconify-icon><span>Added!</span>';
    btn.style.backgroundColor = 'var(--color-accent-600)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = '';
    }, 2000);
    
    // Show success notification
    this.showNotification(`${productName} added to cart (${productPrice})`);
    
    console.log(`🛒 Added to cart: ${productName} - ${productPrice}`);
  }

  /**
   * Handle card hover effects
   */
  handleCardHover(e, isHovering) {
    const card = e.currentTarget;
    
    if (isHovering) {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    } else {
      card.style.transform = '';
    }
  }

  /**
   * Toggle filter panel
   */
  toggleFilterPanel() {
    const filterBar = document.querySelector('.detail-category-filter-bar');
    if (filterBar) {
      filterBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight filter bar
      filterBar.style.animation = 'pulse 1s ease-in-out';
      setTimeout(() => {
        filterBar.style.animation = '';
      }, 1000);
    }
  }

  /**
   * Toggle sort panel
   */
  toggleSortPanel() {
    const sortSelect = this.elements.sortSelect;
    if (sortSelect) {
      sortSelect.focus();
      sortSelect.click();
    }
  }

  /**
   * Toggle view mode
   */
  toggleViewMode() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      // Toggle between grid layouts
      if (productsGrid.classList.contains('xl:grid-cols-4')) {
        productsGrid.classList.remove('xl:grid-cols-4');
        productsGrid.classList.add('xl:grid-cols-3');
        this.showNotification('Switched to large grid view');
      } else {
        productsGrid.classList.remove('xl:grid-cols-3');
        productsGrid.classList.add('xl:grid-cols-4');
        this.showNotification('Switched to compact grid view');
      }
    }
  }

  /**
   * Update results count
   */
  updateResultsCount() {
    // Simulate filtering results
    const count = Math.floor(Math.random() * 20) + 10;
    
    if (this.elements.resultsInfo) {
      const countElement = this.elements.resultsInfo.querySelector('strong');
      if (countElement) {
        countElement.textContent = count;
      }
    }
  }

  /**
   * Scroll to products section
   */
  scrollToProducts() {
    const productsSection = document.querySelector('.detail-category-products');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.style.opacity = '0.6';
      productsGrid.style.pointerEvents = 'none';
    }
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.style.opacity = '';
      productsGrid.style.pointerEvents = '';
    }
  }

  /**
   * Add visual feedback to button clicks
   */
  addButtonFeedback(btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  /**
   * Add visual feedback to select changes
   */
  addSelectFeedback(select) {
    select.style.borderColor = 'var(--color-primary-400)';
    select.style.boxShadow = '0 0 0 2px var(--color-primary-100)';
    
    setTimeout(() => {
      select.style.borderColor = '';
      select.style.boxShadow = '';
    }, 1000);
  }

  /**
   * Show notification message
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--color-primary-600);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.elements.filterSelects.forEach(select => {
      select.removeEventListener('change', this.handleFilterChange);
    });

    if (this.elements.sortSelect) {
      this.elements.sortSelect.removeEventListener('change', this.handleSortChange);
    }

    this.elements.actionBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleProductActions);
    });

    this.elements.paginationBtns.forEach(btn => {
      btn.removeEventListener('click', this.handlePagination);
    });

    this.elements.paginationNumbers.forEach(btn => {
      btn.removeEventListener('click', this.handlePagination);
    });

    this.initialized = false;
    console.log('🗑️ DetailCategory component destroyed');
  }
}