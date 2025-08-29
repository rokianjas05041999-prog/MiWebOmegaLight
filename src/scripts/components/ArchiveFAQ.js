// Archive FAQ Component
// Handles interactive functionality for the FAQ archive page

export class ArchiveFAQ {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.filters = {
      search: '',
      category: 'all'
    };
    this.currentSort = 'relevance';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.totalItems = 48;
    this.bookmarkedFAQs = new Set();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.filterFAQs = this.filterFAQs.bind(this);
  }

  /**
   * Initialize the archive FAQ component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.loadBookmarks();
      this.setupInitialState();
      this.updateResults();
      this.initialized = true;
      
      console.log('✅ ArchiveFAQ component initialized');
    } catch (error) {
      console.error('❌ ArchiveFAQ initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    const section = document.querySelector('.archive-faqs-section');
    if (!section) {
      throw new Error('Archive FAQ section not found');
    }

    this.elements = {
      section,
      searchInput: section.querySelector('[data-faq-search]'),
      searchClear: section.querySelector('[data-faq-search-clear]'),
      filterButtons: section.querySelectorAll('[data-faq-filter]'),
      sortSelect: section.querySelector('[data-faq-sort]'),
      faqGrid: section.querySelector('[data-faq-grid]'),
      faqItems: section.querySelectorAll('.archive-faqs-item'),
      bookmarkButtons: section.querySelectorAll('[data-faq-bookmark]'),
      loadMoreBtn: section.querySelector('[data-faq-load-more]'),
      resultsText: section.querySelector('[data-faq-results-text]'),
      showingCount: section.querySelector('[data-faq-showing]'),
      totalCount: section.querySelector('[data-faq-total]'),
    };
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
          this.handleSearch(e);
        }
      });
    }

    if (this.elements.searchClear) {
      this.elements.searchClear.addEventListener('click', this.handleSearchClear);
    }

    // Filter buttons
    this.elements.filterButtons.forEach(button => {
      button.addEventListener('click', this.handleFilterChange);
    });

    // Sort select
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', this.handleSortChange);
    }

    // Bookmark buttons
    this.elements.bookmarkButtons.forEach(button => {
      button.addEventListener('click', this.handleBookmark);
    });

    // Load more button
    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.addEventListener('click', this.handleLoadMore);
    }
  }

  /**
   * Setup initial component state
   */
  setupInitialState() {
    // Set first filter as active
    if (this.elements.filterButtons.length > 0) {
      this.elements.filterButtons[0].classList.add('active');
    }

    // Update bookmark states
    this.updateBookmarkStates();

    // Check URL parameters
    this.checkURLParameters();
  }

  /**
   * Check URL parameters for initial filters
   */
  checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam) {
      this.setFilter(filterParam);
    }
  }

  /**
   * Handle search input
   * @param {Event} e - Input event
   */
  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    this.filters.search = searchTerm;

    // Show/hide clear button
    if (searchTerm.length > 0) {
      this.elements.searchClear?.classList.remove('hidden');
    } else {
      this.elements.searchClear?.classList.add('hidden');
    }

    // Debounced search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filterFAQs();
    }, 300);
  }

  /**
   * Handle search clear
   */
  handleSearchClear() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
      this.filters.search = '';
      this.elements.searchClear.classList.add('hidden');
      this.filterFAQs();
    }
  }

  /**
   * Handle filter button clicks
   * @param {Event} e - Click event
   */
  handleFilterChange(e) {
    const button = e.currentTarget;
    const filter = button.getAttribute('data-faq-filter');

    // Update active filter button
    this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Update filter and apply filtering
    this.filters.category = filter;
    this.filterFAQs();
  }

  /**
   * Handle sort change
   * @param {Event} e - Change event
   */
  handleSortChange(e) {
    this.currentSort = e.target.value;
    this.filterFAQs();
  }

  /**
   * Handle bookmark toggle
   * @param {Event} e - Click event
   */
  handleBookmark(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const faqId = button.getAttribute('data-faq-bookmark');
    
    if (this.bookmarkedFAQs.has(faqId)) {
      this.bookmarkedFAQs.delete(faqId);
      button.classList.remove('bookmarked');
    } else {
      this.bookmarkedFAQs.add(faqId);
      button.classList.add('bookmarked');
    }

    this.saveBookmarks();
  }

  /**
   * Handle load more button
   */
  handleLoadMore() {
    this.currentPage++;
    this.loadMoreItems();
  }

  /**
   * Filter FAQ items based on search and category
   */
  filterFAQs() {
    let visibleItems = 0;
    
    this.elements.faqItems.forEach((item, index) => {
      const category = item.getAttribute('data-faq-category');
      const question = item.querySelector('.archive-faqs-item-question a')?.textContent.toLowerCase() || '';
      const preview = item.querySelector('.archive-faqs-item-preview')?.textContent.toLowerCase() || '';
      
      // Check category filter
      const categoryMatch = this.filters.category === 'all' || category === this.filters.category;
      
      // Check search filter
      const searchMatch = this.filters.search === '' || 
                         question.includes(this.filters.search) || 
                         preview.includes(this.filters.search);

      const shouldShow = categoryMatch && searchMatch;

      if (shouldShow) {
        item.classList.remove('hidden');
        visibleItems++;
        // Add staggered animation
        setTimeout(() => {
          item.style.animation = `fadeInUp 0.6s ease-out forwards`;
        }, (visibleItems % 12) * 100);
      } else {
        item.classList.add('hidden');
        item.style.animation = 'none';
      }
    });

    this.updateResults(visibleItems);
  }

  /**
   * Load more items (simulate pagination)
   */
  loadMoreItems() {
    // In a real application, this would fetch more data from an API
    const hiddenItems = Array.from(this.elements.faqItems)
      .filter(item => item.classList.contains('hidden'))
      .slice(0, this.itemsPerPage);

    hiddenItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.remove('hidden');
        item.style.animation = `fadeInUp 0.6s ease-out forwards`;
      }, index * 100);
    });

    // Hide load more button if no more items
    if (hiddenItems.length < this.itemsPerPage) {
      this.elements.loadMoreBtn?.classList.add('hidden');
    }
  }

  /**
   * Update results counter
   * @param {number} visibleCount - Number of visible items
   */
  updateResults(visibleCount = null) {
    if (visibleCount === null) {
      visibleCount = Array.from(this.elements.faqItems)
        .filter(item => !item.classList.contains('hidden')).length;
    }

    if (this.elements.showingCount) {
      this.elements.showingCount.textContent = visibleCount;
    }
    if (this.elements.totalCount) {
      this.elements.totalCount.textContent = this.totalItems;
    }
  }

  /**
   * Set filter programmatically
   * @param {string} filter - Filter category
   */
  setFilter(filter) {
    const filterButton = Array.from(this.elements.filterButtons)
      .find(btn => btn.getAttribute('data-faq-filter') === filter);
    
    if (filterButton) {
      filterButton.click();
    }
  }

  /**
   * Load bookmarks from localStorage
   */
  loadBookmarks() {
    try {
      const saved = localStorage.getItem('omegalight_faq_bookmarks');
      if (saved) {
        this.bookmarkedFAQs = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }

  /**
   * Save bookmarks to localStorage
   */
  saveBookmarks() {
    try {
      localStorage.setItem('omegalight_faq_bookmarks', 
        JSON.stringify(Array.from(this.bookmarkedFAQs)));
    } catch (error) {
      console.warn('Failed to save bookmarks:', error);
    }
  }

  /**
   * Update bookmark button states
   */
  updateBookmarkStates() {
    this.elements.bookmarkButtons.forEach(button => {
      const faqId = button.getAttribute('data-faq-bookmark');
      if (this.bookmarkedFAQs.has(faqId)) {
        button.classList.add('bookmarked');
      }
    });
  }

  /**
   * Public method to get search statistics
   * @returns {Object} Search statistics
   */
  getStatistics() {
    const visible = Array.from(this.elements.faqItems)
      .filter(item => !item.classList.contains('hidden')).length;

    return {
      total: this.totalItems,
      visible,
      bookmarked: this.bookmarkedFAQs.size,
      currentFilter: this.filters.category,
      currentSearch: this.filters.search,
      currentSort: this.currentSort
    };
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (!this.initialized) return;

    // Clear timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Remove event listeners
    if (this.elements.searchInput) {
      this.elements.searchInput.removeEventListener('input', this.handleSearch);
    }
    
    this.elements.filterButtons.forEach(button => {
      button.removeEventListener('click', this.handleFilterChange);
    });

    this.elements.bookmarkButtons.forEach(button => {
      button.removeEventListener('click', this.handleBookmark);
    });

    // Reset state
    this.elements = {};
    this.initialized = false;
    
    console.log('✅ ArchiveFAQ component destroyed');
  }
}
