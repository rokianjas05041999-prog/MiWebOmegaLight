// Archive Portfolio Component
// Handles interactive functionality for the portfolio archive page

export class ArchivePortfolio {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.filters = {
      search: '',
      projectTypes: [],
      serviceCategories: [],
      projectScales: [],
      completionYears: []
    };
    this.currentView = 'grid';
    this.currentSort = 'newest';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.totalItems = 85;
    
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
   * Initialize the archive portfolio component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupMobileFilters();
      this.updateResults();
      this.initialized = true;
      
      console.log('✅ ArchivePortfolio component initialized');
    } catch (error) {
      console.error('❌ ArchivePortfolio initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.archive-portfolio-section'),
      searchInput: document.querySelector('.archive-portfolio-search-input'),
      searchClear: document.querySelector('.archive-portfolio-search-clear'),
      filterToggle: document.querySelector('.archive-portfolio-filter-toggle'),
      filterCount: document.querySelector('.archive-portfolio-filter-count'),
      sidebar: document.querySelector('.archive-portfolio-sidebar'),
      filterCheckboxes: document.querySelectorAll('.archive-portfolio-filter-checkbox'),
      filtersClear: document.querySelector('.archive-portfolio-filters-clear'),
      viewBtns: document.querySelectorAll('.archive-portfolio-view-btn'),
      sortSelect: document.querySelector('.archive-portfolio-sort-select'),
      grid: document.querySelector('.archive-portfolio-grid'),
      resultsCount: document.querySelector('.archive-portfolio-results-count'),
      resultsCurrent: document.querySelector('.archive-portfolio-results-current'),
      resultsTotal: document.querySelector('.archive-portfolio-results-total'),
      activeFilters: document.querySelector('.archive-portfolio-active-filters'),
      activeFiltersList: document.querySelector('.archive-portfolio-active-filters-list'),
      loadMoreBtn: document.querySelector('.archive-portfolio-load-more-btn'),
      mobileOverlay: document.querySelector('.archive-portfolio-mobile-overlay'),
      mobileFiltersClose: document.querySelector('.archive-portfolio-mobile-filters-close'),
      mobileFiltersContent: document.querySelector('.archive-portfolio-mobile-filters-content'),
      mobileFiltersClear: document.querySelector('.archive-portfolio-mobile-filters-clear'),
      mobileFiltersApply: document.querySelector('.archive-portfolio-mobile-filters-apply')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Archive portfolio section not found');
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

    // Portfolio quick view buttons
    this.bindPortfolioEvents();
  }

  /**
   * Bind portfolio-related events
   */
  bindPortfolioEvents() {
    const quickViewBtns = document.querySelectorAll('.portfolio-quick-view');
    const portfolioCtas = document.querySelectorAll('.portfolio-cta');

    quickViewBtns.forEach(btn => {
      btn.addEventListener('click', this.handleQuickView);
    });

    portfolioCtas.forEach(btn => {
      btn.addEventListener('click', this.handlePortfolioClick);
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
        this.elements.sidebar.classList.toggle('archive-portfolio-sidebar-hidden');
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
    const filterGroup = checkbox.closest('.archive-portfolio-filter-group');
    const title = filterGroup?.querySelector('.archive-portfolio-filter-title')?.textContent.toLowerCase();
    
    if (title?.includes('project type')) return 'projectTypes';
    if (title?.includes('service category')) return 'serviceCategories';
    if (title?.includes('project scale')) return 'projectScales';
    if (title?.includes('completion year')) return 'completionYears';
    
    return 'projectTypes'; // default
  }

  /**
   * Clear all filters
   */
  clearAllFilters = () => {
    // Reset filter state
    this.filters = {
      search: '',
      projectTypes: [],
      serviceCategories: [],
      projectScales: [],
      completionYears: []
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
      this.elements.grid.className = `archive-portfolio-grid archive-portfolio-grid-${view}`;
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
      this.loadMoreProjects();
      
      // Reset button
      btn.querySelector('span').textContent = originalText;
      btn.disabled = false;
      
      // Hide button if no more projects
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
    filtersClone.classList.remove('archive-portfolio-sidebar');
    filtersClone.classList.add('archive-portfolio-mobile-filters-clone');
    
    this.elements.mobileFiltersContent.appendChild(filtersClone);
    
    // Rebind events for cloned elements
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-portfolio-filter-checkbox');
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-portfolio-filter-checkbox');
    
    // Reset filters
    this.filters.projectTypes = [];
    this.filters.serviceCategories = [];
    this.filters.projectScales = [];
    this.filters.completionYears = [];
    
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-portfolio-filter-checkbox');
    
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
    count += this.filters.projectTypes.length;
    count += this.filters.serviceCategories.length;
    count += this.filters.projectScales.length;
    count += this.filters.completionYears.length;
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
      
      // Add project type filters
      this.filters.projectTypes.forEach(type => {
        this.addActiveFilterTag('Project Type', type, 'projectTypes');
      });
      
      // Add service category filters
      this.filters.serviceCategories.forEach(category => {
        this.addActiveFilterTag('Service Category', category, 'serviceCategories');
      });
      
      // Add project scale filters
      this.filters.projectScales.forEach(scale => {
        this.addActiveFilterTag('Project Scale', scale, 'projectScales');
      });
      
      // Add completion year filters
      this.filters.completionYears.forEach(year => {
        this.addActiveFilterTag('Completion Year', year, 'completionYears');
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
    tag.className = 'archive-portfolio-active-filter-tag';
    tag.innerHTML = `
      <span class="archive-portfolio-active-filter-text">${type}: ${value}</span>
      <button class="archive-portfolio-active-filter-remove" data-filter-type="${filterType}" data-filter-value="${value}">
        <iconify-icon icon="heroicons:x-mark" class="archive-portfolio-active-filter-remove-icon"></iconify-icon>
      </button>
    `;
    
    // Add remove event
    const removeBtn = tag.querySelector('.archive-portfolio-active-filter-remove');
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
    // In a real application, this would filter the actual projects
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
   * Calculate filtered project count (mock implementation)
   */
  calculateFilteredCount() {
    let count = this.totalItems;
    
    // Apply search filter
    if (this.filters.search) {
      count = Math.floor(count * 0.6); // Mock: search reduces results by 40%
    }
    
    // Apply project type filters
    if (this.filters.projectTypes.length > 0) {
      count = Math.floor(count * 0.7); // Mock: project type filter reduces results
    }
    
    // Apply service category filters
    if (this.filters.serviceCategories.length > 0) {
      count = Math.floor(count * 0.8); // Mock: service category filter reduces results
    }
    
    // Apply project scale filters
    if (this.filters.projectScales.length > 0) {
      count = Math.floor(count * 0.75); // Mock: project scale filter reduces results
    }
    
    // Apply completion year filters
    if (this.filters.completionYears.length > 0) {
      count = Math.floor(count * 0.85); // Mock: completion year filter reduces results
    }
    
    return Math.max(count, 6); // Minimum 6 results
  }

  /**
   * Load more projects (mock implementation)
   */
  loadMoreProjects() {
    // In a real application, this would load more projects from the server
    console.log(`📦 Loading more projects for page ${this.currentPage}`);
    
    // Mock: Add some project cards
    this.addMockProjects();
  }

  /**
   * Add mock projects to grid
   */
  addMockProjects() {
    if (!this.elements.grid) return;
    
    const mockProjects = [
      {
        title: 'Hotel Electrical Renovation',
        type: 'Hospitality',
        category: 'Electrical Installation',
        date: 'June 2024',
        duration: '3 months',
        excerpt: 'Complete electrical system renovation for luxury hotel including guest rooms and common areas.',
        tags: ['Hotel', 'Renovation', 'Luxury'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'
      },
      {
        title: 'Data Center Power Infrastructure',
        type: 'Commercial',
        category: 'Emergency Systems',
        date: 'May 2024',
        duration: '7 months',
        excerpt: 'Critical power infrastructure for new data center with redundant systems and backup power.',
        tags: ['Data Center', 'Critical Power', 'Redundancy'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop'
      }
    ];
    
    mockProjects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      this.elements.grid.appendChild(projectCard);
    });
    
    // Rebind events for new projects
    this.bindPortfolioEvents();
  }

  /**
   * Create project card element
   */
  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'portfolio-card';
    card.innerHTML = `
      <div class="portfolio-image-wrapper">
        <div class="portfolio-type-badge">
          <span>${project.type}</span>
        </div>
        <img src="${project.image}" alt="${project.title}" class="portfolio-image" loading="lazy">
        <div class="portfolio-overlay">
          <button class="portfolio-quick-view">Quick View</button>
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-meta">
          <span class="portfolio-category">${project.category}</span>
          <span class="portfolio-date">${project.date}</span>
          <span class="portfolio-duration">${project.duration}</span>
        </div>
        <h3 class="portfolio-title">${project.title}</h3>
        <p class="portfolio-excerpt">${project.excerpt}</p>
        <div class="portfolio-tags">
          ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
        </div>
        <a href="detail-portfolio.html" class="portfolio-cta">
          <span>View Project</span>
          <iconify-icon icon="heroicons:arrow-right" class="portfolio-cta-icon"></iconify-icon>
        </a>
      </div>
    `;
    
    return card;
  }

  /**
   * Handle portfolio quick view
   */
  handleQuickView = (e) => {
    e.preventDefault();
    const portfolioCard = e.target.closest('.portfolio-card');
    const portfolioTitle = portfolioCard.querySelector('.portfolio-title')?.textContent;
    
    console.log(`👁️ Quick view for: ${portfolioTitle}`);
    this.showNotification('Quick view feature coming soon!', 'info');
  }

  /**
   * Handle portfolio click
   */
  handlePortfolioClick = (e) => {
    const portfolioCard = e.target.closest('.portfolio-card');
    const portfolioTitle = portfolioCard.querySelector('.portfolio-title')?.textContent;
    
    console.log(`🔗 Portfolio clicked: ${portfolioTitle}`);
    // In a real app, this would navigate to the portfolio detail page
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `archive-portfolio-notification archive-portfolio-notification-${type}`;
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
      projectTypes: [],
      serviceCategories: [],
      projectScales: [],
      completionYears: []
    };

    this.initialized = false;
    console.log('🗑️ ArchivePortfolio component destroyed');
  }
}