// Archive Article Component
// Handles interactive functionality for the article archive page

export class ArchiveArticle {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.filters = {
      search: '',
      categories: [],
      authors: [],
      readingTime: [],
      date: []
    };
    this.currentView = 'grid';
    this.currentSort = 'newest';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.totalItems = 147;
    
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
   * Initialize the archive article component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupMobileFilters();
      this.updateResults();
      this.initialized = true;
      
      console.log('✅ ArchiveArticle component initialized');
    } catch (error) {
      console.error('❌ ArchiveArticle initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.archive-article-section'),
      searchInput: document.querySelector('.archive-article-search-input'),
      searchClear: document.querySelector('.archive-article-search-clear'),
      filterToggle: document.querySelector('.archive-article-filter-toggle'),
      filterCount: document.querySelector('.archive-article-filter-count'),
      sidebar: document.querySelector('.archive-article-sidebar'),
      filterCheckboxes: document.querySelectorAll('.archive-article-filter-checkbox'),
      filtersClear: document.querySelector('.archive-article-filters-clear'),
      viewBtns: document.querySelectorAll('.archive-article-view-btn'),
      sortSelect: document.querySelector('.archive-article-sort-select'),
      grid: document.querySelector('.archive-article-grid'),
      resultsCount: document.querySelector('.archive-article-results-count'),
      resultsCurrent: document.querySelector('.archive-article-results-current'),
      resultsTotal: document.querySelector('.archive-article-results-total'),
      activeFilters: document.querySelector('.archive-article-active-filters'),
      activeFiltersList: document.querySelector('.archive-article-active-filters-list'),
      loadMoreBtn: document.querySelector('.archive-article-load-more-btn'),
      mobileOverlay: document.querySelector('.archive-article-mobile-overlay'),
      mobileFiltersClose: document.querySelector('.archive-article-mobile-filters-close'),
      mobileFiltersContent: document.querySelector('.archive-article-mobile-filters-content'),
      mobileFiltersClear: document.querySelector('.archive-article-mobile-filters-clear'),
      mobileFiltersApply: document.querySelector('.archive-article-mobile-filters-apply')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Archive article section not found');
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

    // Article quick view buttons
    this.bindArticleEvents();
  }

  /**
   * Bind article-related events
   */
  bindArticleEvents() {
    const quickViewBtns = document.querySelectorAll('.article-quick-view');
    const articleCtas = document.querySelectorAll('.article-cta');

    quickViewBtns.forEach(btn => {
      btn.addEventListener('click', this.handleQuickView);
    });

    articleCtas.forEach(btn => {
      btn.addEventListener('click', this.handleArticleClick);
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
        this.elements.sidebar.classList.toggle('archive-article-sidebar-hidden');
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
    const filterGroup = checkbox.closest('.archive-article-filter-group');
    const title = filterGroup?.querySelector('.archive-article-filter-title')?.textContent.toLowerCase();
    
    if (title?.includes('category')) return 'categories';
    if (title?.includes('author')) return 'authors';
    if (title?.includes('reading') || title?.includes('time')) return 'readingTime';
    if (title?.includes('date') || title?.includes('publication')) return 'date';
    
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
      authors: [],
      readingTime: [],
      date: []
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
      this.elements.grid.className = `archive-article-grid archive-article-grid-${view}`;
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
      this.loadMoreArticles();
      
      // Reset button
      btn.querySelector('span').textContent = originalText;
      btn.disabled = false;
      
      // Hide button if no more articles
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
    filtersClone.classList.remove('archive-article-sidebar');
    filtersClone.classList.add('archive-article-mobile-filters-clone');
    
    this.elements.mobileFiltersContent.appendChild(filtersClone);
    
    // Rebind events for cloned elements
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-article-filter-checkbox');
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-article-filter-checkbox');
    
    // Reset filters
    this.filters.categories = [];
    this.filters.authors = [];
    this.filters.readingTime = [];
    this.filters.date = [];
    
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
    const mobileCheckboxes = this.elements.mobileFiltersContent.querySelectorAll('.archive-article-filter-checkbox');
    
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
    count += this.filters.authors.length;
    count += this.filters.readingTime.length;
    count += this.filters.date.length;
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
      
      // Add author filters
      this.filters.authors.forEach(author => {
        this.addActiveFilterTag('Author', author, 'authors');
      });
      
      // Add reading time filters
      this.filters.readingTime.forEach(time => {
        this.addActiveFilterTag('Reading Time', time, 'readingTime');
      });
      
      // Add date filters
      this.filters.date.forEach(date => {
        this.addActiveFilterTag('Date', date, 'date');
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
    tag.className = 'archive-article-active-filter-tag';
    tag.innerHTML = `
      <span class="archive-article-active-filter-text">${type}: ${value}</span>
      <button class="archive-article-active-filter-remove" data-filter-type="${filterType}" data-filter-value="${value}">
        <iconify-icon icon="heroicons:x-mark" class="archive-article-active-filter-remove-icon"></iconify-icon>
      </button>
    `;
    
    // Add remove event
    const removeBtn = tag.querySelector('.archive-article-active-filter-remove');
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
    // In a real application, this would filter the actual articles
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
   * Calculate filtered article count (mock implementation)
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
    
    // Apply author filters
    if (this.filters.authors.length > 0) {
      count = Math.floor(count * 0.8); // Mock: author filter reduces results
    }
    
    // Apply reading time filters
    if (this.filters.readingTime.length > 0) {
      count = Math.floor(count * 0.75); // Mock: reading time filter reduces results
    }
    
    // Apply date filters
    if (this.filters.date.length > 0) {
      count = Math.floor(count * 0.85); // Mock: date filter reduces results
    }
    
    return Math.max(count, 6); // Minimum 6 results
  }

  /**
   * Load more articles (mock implementation)
   */
  loadMoreArticles() {
    // In a real application, this would load more articles from the server
    console.log(`📦 Loading more articles for page ${this.currentPage}`);
    
    // Mock: Add some article cards
    this.addMockArticles();
  }

  /**
   * Add mock articles to grid
   */
  addMockArticles() {
    if (!this.elements.grid) return;
    
    const mockArticles = [
      {
        title: 'Energy Efficient Lighting Solutions',
        author: 'OmegaLight Team',
        date: 'December 28, 2023',
        readingTime: '4 min read',
        excerpt: 'Discover the latest energy-efficient lighting technologies and how they can reduce your electricity costs.',
        category: 'Energy Saving',
        tags: ['LED', 'Energy', 'Savings'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
      },
      {
        title: 'Electrical Code Updates 2024',
        author: 'Ahmad Electrical Expert',
        date: 'December 25, 2023',
        readingTime: '6 min read',
        excerpt: 'Stay compliant with the latest electrical code changes and safety requirements for 2024.',
        category: 'Safety',
        tags: ['Code', 'Safety', 'Compliance'],
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=250&fit=crop'
      }
    ];
    
    mockArticles.forEach(article => {
      const articleCard = this.createArticleCard(article);
      this.elements.grid.appendChild(articleCard);
    });
    
    // Rebind events for new articles
    this.bindArticleEvents();
  }

  /**
   * Create article card element
   */
  createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-image-wrapper">
        <div class="article-category-badge">
          <span>${article.category}</span>
        </div>
        <img src="${article.image}" alt="${article.title}" class="article-image" loading="lazy">
        <div class="article-overlay">
          <button class="article-quick-view">Quick View</button>
        </div>
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-author">${article.author}</span>
          <span class="article-date">${article.date}</span>
          <span class="article-reading-time">${article.readingTime}</span>
        </div>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-excerpt">${article.excerpt}</p>
        <div class="article-tags">
          ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
        </div>
        <a href="detail-article.html" class="article-cta">
          <span>Read More</span>
          <iconify-icon icon="heroicons:arrow-right" class="article-cta-icon"></iconify-icon>
        </a>
      </div>
    `;
    
    return card;
  }

  /**
   * Handle article quick view
   */
  handleQuickView = (e) => {
    e.preventDefault();
    const articleCard = e.target.closest('.article-card');
    const articleTitle = articleCard.querySelector('.article-title')?.textContent;
    
    console.log(`👁️ Quick view for: ${articleTitle}`);
    this.showNotification('Quick view feature coming soon!', 'info');
  }

  /**
   * Handle article click
   */
  handleArticleClick = (e) => {
    const articleCard = e.target.closest('.article-card');
    const articleTitle = articleCard.querySelector('.article-title')?.textContent;
    
    console.log(`🔗 Article clicked: ${articleTitle}`);
    // In a real app, this would navigate to the article detail page
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `archive-article-notification archive-article-notification-${type}`;
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
      authors: [],
      readingTime: [],
      date: []
    };

    this.initialized = false;
    console.log('🗑️ ArchiveArticle component destroyed');
  }
}