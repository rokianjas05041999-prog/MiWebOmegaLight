// Archive Product Component
// Handles interactive functionality for the product archive page

export class ArchiveProduct {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.filters = {
      search: '',
      categories: [],
      brands: [],
      priceRanges: [],
      availability: []
    };
    this.currentView = 'grid';
    this.currentSort = 'featured';
    this.currentPage = 1;
    this.itemsPerPage = 24;
    this.totalItems = 182;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleViewToggle = this.handleViewToggle.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleMobileFilters = this.handleMobileFilters.bind(this);
  }

  /**
   * Initialize the archive product component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupMobileFilters();
      this.updateResults();
      this.initialized = true;
      
      console.log('✅ ArchiveProduct component initialized');
    } catch (error) {
      console.error('❌ ArchiveProduct initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.archive-product-section'),
      searchInput: document.querySelector('.archive-product-search-input'),
      searchClear: document.querySelector('.archive-product-search-clear'),
      filterToggle: document.querySelector('.archive-product-filter-toggle'),
      filterCount: document.querySelector('.archive-product-filter-count'),
      sidebar: document.querySelector('.archive-product-sidebar'),
      filterCheckboxes: document.querySelectorAll('.archive-product-filter-checkbox'),
      filtersClear: document.querySelector('.archive-product-filters-clear'),
      viewBtns: document.querySelectorAll('.archive-product-view-btn'),
      sortSelect: document.querySelector('.archive-product-sort-select'),
      grid: document.querySelector('.archive-product-grid'),
      resultsCount: document.querySelector('.archive-product-results-count'),
      resultsCurrent: document.querySelector('.archive-product-results-current'),
      resultsTotal: document.querySelector('.archive-product-results-total'),
      activeFilters: document.querySelector('.archive-product-active-filters'),
      activeFiltersList: document.querySelector('.archive-product-active-filters-list'),
      loadMoreBtn: document.querySelector('.archive-product-load-more-btn'),
      mobileOverlay: document.querySelector('.archive-product-mobile-overlay'),
      mobileFiltersClose: document.querySelector('.archive-product-mobile-filters-close'),
      mobileFiltersContent: document.querySelector('.archive-product-mobile-filters-content'),
      mobileFiltersClear: document.querySelector('.archive-product-mobile-filters-clear'),
      mobileFiltersApply: document.querySelector('.archive-product-mobile-filters-apply')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Archive product section not found');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', this.handleSearch);
      this.elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSearch(e);
        }
      });
    }

    if (this.elements.searchClear) {
      this.elements.searchClear.addEventListener('click', this.clearSearch);
    }

    // Filter toggle (mobile)
    if (this.elements.filterToggle) {
      this.elements.filterToggle.addEventListener('click', this.handleFilterToggle);
    }

    // Filter checkboxes
    this.elements.filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.handleFilterChange);
    });

    // Clear all filters
    if (this.elements.filtersClear) {
      this.elements.filtersClear.addEventListener('click', this.clearAllFilters);
    }

    // View toggle buttons
    this.elements.viewBtns.forEach(btn => {
      btn.addEventListener('click', this.handleViewToggle);
    });

    // Sort select
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', this.handleSortChange);
    }

    // Load more button
    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.addEventListener('click', this.handleLoadMore);
    }

    // Mobile filters
    if (this.elements.mobileFiltersClose) {
      this.elements.mobileFiltersClose.addEventListener('click', this.closeMobileFilters);
    }

    if (this.elements.mobileFiltersClear) {
      this.elements.mobileFiltersClear.addEventListener('click', this.clearAllFilters);
    }

    if (this.elements.mobileFiltersApply) {
      this.elements.mobileFiltersApply.addEventListener('click', this.applyMobileFilters);
    }

    // Close mobile overlay on background click
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.mobileOverlay) {
          this.closeMobileFilters();
        }
      });
    }

    // Product quick view buttons
    this.bindProductEvents();
  }

  /**
   * Bind product-related events
   */
  bindProductEvents() {
    const quickViewBtns = document.querySelectorAll('.product-quick-view');
    const productCtas = document.querySelectorAll('.product-cta:not(.product-cta-disabled)');

    quickViewBtns.forEach(btn => {
      btn.addEventListener('click', this.handleQuickView);
    });

    productCtas.forEach(btn => {
      btn.addEventListener('click', this.handleProductClick);
    });
  }

  /**
   * Handle search input
   */
  handleSearch = (e) => {
    const query = e.target.value.trim();
    this.filters.search = query;
    
    // Show/hide clear button
    if (this.elements.searchClear) {
      this.elements.searchClear.style.display = query ? 'flex' : 'none';
    }
    
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  /**
   * Clear search
   */
  clearSearch = () => {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
      this.filters.search = '';
      this.elements.searchClear.style.display = 'none';
      this.applyFilters();
    }
  }

  /**
   * Handle filter toggle (mobile)
   */
  handleFilterToggle = () => {
    if (window.innerWidth <= 768) {
      this.openMobileFilters();
    } else {
      // Toggle sidebar visibility on tablet
      if (this.elements.sidebar) {
        this.elements.sidebar.classList.toggle('archive-product-sidebar-hidden');
      }
    }
  }

  /**
   * Handle filter checkbox changes
   */
  handleFilterChange = (e) => {
    const checkbox = e.target;
    const filterType = this.getFilterType(checkbox);
    const value = checkbox.value;
    
    if (checkbox.checked) {
      if (!this.filters[filterType].includes(value)) {
        this.filters[filterType].push(value);
      }
    } else {
      this.filters[filterType] = this.filters[filterType].filter(item => item !== value);
    }
    
    this.applyFilters();
  }

  /**
   * Get filter type from checkbox
   */
  getFilterType(checkbox) {
    const filterGroup = checkbox.closest('.archive-product-filter-group');
    const title = filterGroup?.querySelector('.archive-product-filter-title')?.textContent.toLowerCase();
    
    if (title?.includes('category')) return 'categories';
    if (title?.includes('brand')) return 'brands';
    if (title?.includes('price')) return 'priceRanges';
    if (title?.includes('availability')) return 'availability';
    
    return 'categories'; // default
  }

  /**
   * Clear all filters
   */
  clearAllFilters = () => {
    // Reset filter state
    this.filters = {
      search: '',
      categories: [],
      brands: [],
      priceRanges: [],
      availability: []
    };
    
    // Clear search input
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
      this.elements.searchClear.style.display = 'none';
    }
    
    // Uncheck all checkboxes
    this.elements.filterCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    this.applyFilters();
  }

  /**
   * Handle view toggle
   */
  handleViewToggle = (e) => {
    const btn = e.currentTarget;
    const view = btn.dataset.view;
    
    if (view === this.currentView) return;
    
    // Update button states
    this.elements.viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update grid view
    this.currentView = view;
    if (this.elements.grid) {
      this.elements.grid.setAttribute('data-view', view);
      this.elements.grid.className = `archive-product-grid archive-product-grid-${view}`;
    }
    
    console.log(`📋 View changed to: ${view}`);
  }

  /**
   * Handle sort change
   */
  handleSortChange = (e) => {
    this.currentSort = e.target.value;
    this.applyFilters();
    console.log(`🔄 Sort changed to: ${this.currentSort}`);
  }

  /**
   * Handle load more button
   */
  handleLoadMore = (e) => {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const originalText = btn.querySelector('span').textContent;
    
    // Show loading state
    btn.querySelector('span').textContent = 'Loading...';
    btn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.currentPage++;
      this.loadMoreProducts();
      
      // Reset button
      btn.querySelector('span').textContent = originalText;
      btn.disabled = false;
      
      // Hide button if no more products
      const currentItems = this.currentPage * this.itemsPerPage;
      if (currentItems >= this.totalItems) {
        btn.style.display = 'none';
      }
    }, 1000);
  }

  /**
   * Setup mobile filters
   */
  setupMobileFilters() {
    if (!this.elements.mobileFiltersContent || !this.elements.sidebar) return;
    
    // Clone sidebar filters to mobile overlay
    const filtersClone = this.elements.sidebar.cloneNode(true);
    filtersClone.classList.remove('archive-product-sidebar');
    filtersClone.classList.add('archive-product-mobile-filters-clone');
    
    this.elements.mobileFiltersContent.appendChild(filtersClone);
    
    // Rebind events for cloned elements
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-product-filter-checkbox');
    mobileCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.handleFilterChange);
    });
  }

  /**
   * Open mobile filters
   */
  openMobileFilters = () => {
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Sync mobile filters with main filters
      this.syncMobileFilters();
    }
  }

  /**
   * Close mobile filters
   */
  closeMobileFilters = () => {
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /**
   * Apply mobile filters
   */
  applyMobileFilters = () => {
    // Sync mobile filter state to main filters
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-product-filter-checkbox');
    
    // Reset filters
    this.filters.categories = [];
    this.filters.brands = [];
    this.filters.priceRanges = [];
    this.filters.availability = [];
    
    // Get checked mobile filters
    mobileCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const filterType = this.getFilterType(checkbox);
        this.filters[filterType].push(checkbox.value);
      }
    });
    
    // Sync main checkboxes
    this.elements.filterCheckboxes.forEach(checkbox => {
      const filterType = this.getFilterType(checkbox);
      checkbox.checked = this.filters[filterType].includes(checkbox.value);
    });
    
    this.applyFilters();
    this.closeMobileFilters();
  }

  /**
   * Sync mobile filters with main filters
   */
  syncMobileFilters() {
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-product-filter-checkbox');
    
    mobileCheckboxes.forEach(checkbox => {
      const filterType = this.getFilterType(checkbox);
      checkbox.checked = this.filters[filterType].includes(checkbox.value);
    });
  }

  /**
   * Apply all filters and update results
   */
  applyFilters() {
    // Update filter count
    const activeFilterCount = this.getActiveFilterCount();
    this.updateFilterCount(activeFilterCount);
    
    // Update active filters display
    this.updateActiveFilters();
    
    // Update results (in a real app, this would make an API call)
    this.updateResults();
    
    console.log('🔍 Filters applied:', this.filters);
  }

  /**
   * Get active filter count
   */
  getActiveFilterCount() {
    let count = 0;
    if (this.filters.search) count++;
    count += this.filters.categories.length;
    count += this.filters.brands.length;
    count += this.filters.priceRanges.length;
    count += this.filters.availability.length;
    return count;
  }

  /**
   * Update filter count display
   */
  updateFilterCount(count) {
    if (this.elements.filterCount) {
      if (count > 0) {
        this.elements.filterCount.textContent = count;
        this.elements.filterCount.style.display = 'inline-flex';
      } else {
        this.elements.filterCount.style.display = 'none';
      }
    }
  }

  /**
   * Update active filters display
   */
  updateActiveFilters() {
    if (!this.elements.activeFilters || !this.elements.activeFiltersList) return;
    
    const activeFilterCount = this.getActiveFilterCount();
    
    if (activeFilterCount > 0) {
      this.elements.activeFilters.style.display = 'flex';
      this.elements.activeFiltersList.innerHTML = '';
      
      // Add search filter
      if (this.filters.search) {
        this.addActiveFilterTag('Search', this.filters.search, 'search');
      }
      
      // Add category filters
      this.filters.categories.forEach(category => {
        this.addActiveFilterTag('Category', category, 'categories');
      });
      
      // Add brand filters
      this.filters.brands.forEach(brand => {
        this.addActiveFilterTag('Brand', brand, 'brands');
      });
      
      // Add price filters
      this.filters.priceRanges.forEach(price => {
        this.addActiveFilterTag('Price', price, 'priceRanges');
      });
      
      // Add availability filters
      this.filters.availability.forEach(availability => {
        this.addActiveFilterTag('Availability', availability, 'availability');
      });
    } else {
      this.elements.activeFilters.style.display = 'none';
    }
  }

  /**
   * Add active filter tag
   */
  addActiveFilterTag(type, value, filterType) {
    const tag = document.createElement('div');
    tag.className = 'archive-product-active-filter-tag';
    tag.innerHTML = `
      <span class="archive-product-active-filter-text">${type}: ${value}</span>
      <button class="archive-product-active-filter-remove" data-filter-type="${filterType}" data-filter-value="${value}">
        <iconify-icon icon="heroicons:x-mark" class="archive-product-active-filter-remove-icon"></iconify-icon>
      </button>
    `;
    
    // Add remove event
    const removeBtn = tag.querySelector('.archive-product-active-filter-remove');
    removeBtn.addEventListener('click', this.removeActiveFilter);
    
    this.elements.activeFiltersList.appendChild(tag);
  }

  /**
   * Remove active filter
   */
  removeActiveFilter = (e) => {
    const btn = e.currentTarget;
    const filterType = btn.dataset.filterType;
    const filterValue = btn.dataset.filterValue;
    
    if (filterType === 'search') {
      this.clearSearch();
    } else {
      this.filters[filterType] = this.filters[filterType].filter(item => item !== filterValue);
      
      // Uncheck corresponding checkbox
      const checkbox = document.querySelector(`input[value="${filterValue}"]`);
      if (checkbox) checkbox.checked = false;
      
      this.applyFilters();
    }
  }

  /**
   * Update results display
   */
  updateResults() {
    // In a real application, this would filter the actual products
    // For now, we'll just update the count display
    
    const filteredCount = this.calculateFilteredCount();
    const startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, filteredCount);
    
    if (this.elements.resultsCurrent) {
      this.elements.resultsCurrent.textContent = `${startItem}-${endItem}`;
    }
    
    if (this.elements.resultsTotal) {
      this.elements.resultsTotal.textContent = filteredCount;
    }
    
    // Show/hide load more button
    if (this.elements.loadMoreBtn) {
      const hasMore = endItem < filteredCount;
      this.elements.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }
  }

  /**
   * Calculate filtered product count (mock implementation)
   */
  calculateFilteredCount() {
    let count = this.totalItems;
    
    // Apply search filter
    if (this.filters.search) {
      count = Math.floor(count * 0.6); // Mock: search reduces results by 40%
    }
    
    // Apply category filters
    if (this.filters.categories.length > 0) {
      count = Math.floor(count * 0.7); // Mock: category filter reduces results
    }
    
    // Apply brand filters
    if (this.filters.brands.length > 0) {
      count = Math.floor(count * 0.8); // Mock: brand filter reduces results
    }
    
    // Apply price filters
    if (this.filters.priceRanges.length > 0) {
      count = Math.floor(count * 0.75); // Mock: price filter reduces results
    }
    
    // Apply availability filters
    if (this.filters.availability.length > 0) {
      count = Math.floor(count * 0.85); // Mock: availability filter reduces results
    }
    
    return Math.max(count, 8); // Minimum 8 results
  }

  /**
   * Load more products (mock implementation)
   */
  loadMoreProducts() {
    // In a real application, this would load more products from the server
    console.log(`📦 Loading more products for page ${this.currentPage}`);
    
    // Mock: Add some product cards
    this.addMockProducts();
  }

  /**
   * Add mock products to grid
   */
  addMockProducts() {
    if (!this.elements.grid) return;
    
    const mockProducts = [
      {
        name: 'LED Strip Light 5M RGB',
        brand: 'Schneider',
        price: 'Rp 125.000',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        badge: 'NEW'
      },
      {
        name: 'Smart Switch WiFi',
        brand: 'TP-Link',
        price: 'Rp 85.000',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        badge: 'HOT'
      }
    ];
    
    mockProducts.forEach(product => {
      const productCard = this.createProductCard(product);
      this.elements.grid.appendChild(productCard);
    });
    
    // Rebind events for new products
    this.bindProductEvents();
  }

  /**
   * Create product card element
   */
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image-wrapper">
        ${product.badge ? `
          <div class="product-badge-wrapper">
            <span class="product-badge product-badge-${product.badge.toLowerCase()}">${product.badge}</span>
          </div>
        ` : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-overlay">
          <button class="product-quick-view">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">High quality electrical product</p>
        <div class="product-price">
          <span class="product-price-current">${product.price}</span>
        </div>
        <button class="product-cta">
          <iconify-icon icon="heroicons:shopping-cart" class="product-cta-icon"></iconify-icon>
          <span>Detail</span>
        </button>
      </div>
    `;
    
    return card;
  }

  /**
   * Handle product quick view
   */
  handleQuickView = (e) => {
    e.preventDefault();
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name')?.textContent;
    
    console.log(`👁️ Quick view for: ${productName}`);
    this.showNotification('Quick view feature coming soon!', 'info');
  }

  /**
   * Handle product click
   */
  handleProductClick = (e) => {
    e.preventDefault();
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name')?.textContent;
    
    console.log(`🔗 Product clicked: ${productName}`);
    // In a real app, this would navigate to the product detail page
    this.showNotification(`Loading ${productName}...`, 'info');
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `archive-product-notification archive-product-notification-${type}`;
    notification.textContent = message;
    
    const colors = {
      success: 'var(--color-accent-600)',
      error: 'var(--color-secondary-600)',
      info: 'var(--color-primary-600)'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  /**
   * Handle window resize
   */
  handleResize = () => {
    // Close mobile filters on desktop
    if (window.innerWidth > 768 && this.elements.mobileOverlay) {
      this.closeMobileFilters();
    }
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    if (this.elements.searchInput) {
      this.elements.searchInput.removeEventListener('input', this.handleSearch);
    }

    this.elements.filterCheckboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', this.handleFilterChange);
    });

    this.elements.viewBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleViewToggle);
    });

    // Clear timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Reset state
    this.filters = {
      search: '',
      categories: [],
      brands: [],
      priceRanges: [],
      availability: []
    };

    this.initialized = false;
    console.log('🗑️ ArchiveProduct component destroyed');
  }
}