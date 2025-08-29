// Archive Category Component
// Handles interactive functionality for the category archive page

export class ArchiveCategory {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.filters = {
      search: '',
      productCount: [],
      brands: [],
      types: []
    };
    this.currentView = 'grid';
    this.currentSort = 'featured';
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.totalItems = 8;
    
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
   * Initialize the archive category component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupMobileFilters();
      this.updateResults();
      this.initialized = true;
      
      console.log('✅ ArchiveCategory component initialized');
    } catch (error) {
      console.error('❌ ArchiveCategory initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.archive-category-section'),
      searchInput: document.querySelector('.archive-category-search-input'),
      searchClear: document.querySelector('.archive-category-search-clear'),
      filterToggle: document.querySelector('.archive-category-filter-toggle'),
      filterCount: document.querySelector('.archive-category-filter-count'),
      sidebar: document.querySelector('.archive-category-sidebar'),
      filterCheckboxes: document.querySelectorAll('.archive-category-filter-checkbox'),
      filtersClear: document.querySelector('.archive-category-filters-clear'),
      viewBtns: document.querySelectorAll('.archive-category-view-btn'),
      sortSelect: document.querySelector('.archive-category-sort-select'),
      grid: document.querySelector('.archive-category-grid'),
      resultsCount: document.querySelector('.archive-category-results-count'),
      resultsCurrent: document.querySelector('.archive-category-results-current'),
      resultsTotal: document.querySelector('.archive-category-results-total'),
      activeFilters: document.querySelector('.archive-category-active-filters'),
      activeFiltersList: document.querySelector('.archive-category-active-filters-list'),
      loadMoreBtn: document.querySelector('.archive-category-load-more-btn'),
      mobileOverlay: document.querySelector('.archive-category-mobile-overlay'),
      mobileFiltersClose: document.querySelector('.archive-category-mobile-filters-close'),
      mobileFiltersContent: document.querySelector('.archive-category-mobile-filters-content'),
      mobileFiltersClear: document.querySelector('.archive-category-mobile-filters-clear'),
      mobileFiltersApply: document.querySelector('.archive-category-mobile-filters-apply')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Archive category section not found');
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

    // Category card events
    this.bindCategoryEvents();
  }

  /**
   * Bind category-related events
   */
  bindCategoryEvents() {
    const categoryCtas = document.querySelectorAll('.category-cta');

    categoryCtas.forEach(btn => {
      btn.addEventListener('click', this.handleCategoryClick);
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
        this.elements.sidebar.classList.toggle('archive-category-sidebar-hidden');
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
    const filterGroup = checkbox.closest('.archive-category-filter-group');
    const title = filterGroup?.querySelector('.archive-category-filter-title')?.textContent.toLowerCase();
    
    if (title?.includes('product count')) return 'productCount';
    if (title?.includes('brand')) return 'brands';
    if (title?.includes('type')) return 'types';
    
    return 'productCount'; // default
  }

  /**
   * Clear all filters
   */
  clearAllFilters = () => {
    // Reset filter state
    this.filters = {
      search: '',
      productCount: [],
      brands: [],
      types: []
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
      this.elements.grid.className = `archive-category-grid archive-category-grid-${view}`;
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
      this.loadMoreCategories();
      
      // Reset button
      btn.querySelector('span').textContent = originalText;
      btn.disabled = false;
      
      // Hide button if no more categories
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
    filtersClone.classList.remove('archive-category-sidebar');
    filtersClone.classList.add('archive-category-mobile-filters-clone');
    
    this.elements.mobileFiltersContent.appendChild(filtersClone);
    
    // Rebind events for cloned elements
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-category-filter-checkbox');
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-category-filter-checkbox');
    
    // Reset filters
    this.filters.productCount = [];
    this.filters.brands = [];
    this.filters.types = [];
    
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-category-filter-checkbox');
    
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
    count += this.filters.productCount.length;
    count += this.filters.brands.length;
    count += this.filters.types.length;
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
      
      // Add product count filters
      this.filters.productCount.forEach(count => {
        this.addActiveFilterTag('Product Count', count, 'productCount');
      });
      
      // Add brand filters
      this.filters.brands.forEach(brand => {
        this.addActiveFilterTag('Brand', brand, 'brands');
      });
      
      // Add type filters
      this.filters.types.forEach(type => {
        this.addActiveFilterTag('Type', type, 'types');
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
    tag.className = 'archive-category-active-filter-tag';
    tag.innerHTML = `
      <span class="archive-category-active-filter-text">${type}: ${value}</span>
      <button class="archive-category-active-filter-remove" data-filter-type="${filterType}" data-filter-value="${value}">
        <iconify-icon icon="heroicons:x-mark" class="archive-category-active-filter-remove-icon"></iconify-icon>
      </button>
    `;
    
    // Add remove event
    const removeBtn = tag.querySelector('.archive-category-active-filter-remove');
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
    // In a real application, this would filter the actual categories
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
   * Calculate filtered category count (mock implementation)
   */
  calculateFilteredCount() {
    let count = this.totalItems;
    
    // Apply search filter
    if (this.filters.search) {
      count = Math.floor(count * 0.6); // Mock: search reduces results by 40%
    }
    
    // Apply product count filters
    if (this.filters.productCount.length > 0) {
      count = Math.floor(count * 0.7); // Mock: product count filter reduces results
    }
    
    // Apply brand filters
    if (this.filters.brands.length > 0) {
      count = Math.floor(count * 0.8); // Mock: brand filter reduces results
    }
    
    // Apply type filters
    if (this.filters.types.length > 0) {
      count = Math.floor(count * 0.75); // Mock: type filter reduces results
    }
    
    return Math.max(count, 4); // Minimum 4 results
  }

  /**
   * Load more categories (mock implementation)
   */
  loadMoreCategories() {
    // In a real application, this would load more categories from the server
    console.log(`📦 Loading more categories for page ${this.currentPage}`);
    
    // Mock: Add some category cards
    this.addMockCategories();
  }

  /**
   * Add mock categories to grid
   */
  addMockCategories() {
    if (!this.elements.grid) return;
    
    const mockCategories = [
      {
        title: 'Smart Switches',
        type: 'Wiring & Cables',
        description: 'WiFi enabled switches with app control',
        productCount: 15,
        brandCount: 4,
        features: ['WiFi', 'App Control', 'Voice Control'],
        badge: 'SMART',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
      },
      {
        title: 'Solar Panels',
        type: 'Energy Solutions',
        description: 'High efficiency solar panels for renewable energy',
        productCount: 12,
        brandCount: 3,
        features: ['High Efficiency', 'Durable', 'Eco Friendly'],
        badge: 'ECO',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
      }
    ];
    
    mockCategories.forEach(category => {
      const categoryCard = this.createCategoryCard(category);
      this.elements.grid.appendChild(categoryCard);
    });
    
    // Rebind events for new categories
    this.bindCategoryEvents();
  }

  /**
   * Create category card element
   */
  createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-image-wrapper">
        ${category.badge ? `
          <div class="category-badge-wrapper">
            <span class="category-badge category-badge-${category.badge.toLowerCase()}">${category.badge}</span>
          </div>
        ` : ''}
        <img src="${category.image}" alt="${category.title} Category" class="category-image" loading="lazy">
        <div class="category-overlay">
          <div class="category-stats">
            <span class="category-product-count">${category.productCount} Products</span>
            <span class="category-brand-count">${category.brandCount} Brands</span>
          </div>
        </div>
      </div>
      <div class="category-content">
        <div class="category-header">
          <h3 class="category-title">${category.title}</h3>
          <div class="category-meta">
            <span class="category-type">${category.type}</span>
          </div>
        </div>
        <p class="category-description">${category.description}</p>
        <div class="category-features">
          ${category.features.map(feature => `<span class="category-feature">${feature}</span>`).join('')}
        </div>
        <a href="detail-category.html" class="category-cta">
          <span>View Category</span>
          <iconify-icon icon="heroicons:arrow-right" class="category-cta-icon"></iconify-icon>
        </a>
      </div>
    `;
    
    return card;
  }

  /**
   * Handle category click
   */
  handleCategoryClick = (e) => {
    const categoryCard = e.target.closest('.category-card');
    const categoryTitle = categoryCard.querySelector('.category-title')?.textContent;
    
    console.log(`🔗 Category clicked: ${categoryTitle}`);
    // In a real app, this would navigate to the category detail page
    this.showNotification(`Loading ${categoryTitle} category...`, 'info');
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `archive-category-notification archive-category-notification-${type}`;
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
      productCount: [],
      brands: [],
      types: []
    };

    this.initialized = false;
    console.log('🗑️ ArchiveCategory component destroyed');
  }
}