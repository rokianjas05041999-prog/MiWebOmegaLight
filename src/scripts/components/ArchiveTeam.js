// ArchiveTeam Component
// Handles team archive page functionality including filtering, sorting, and search
// Team cards are now rendered directly in HTML, this component only handles interactions

import { DOMUtils } from '../utils/dom.js';

export class ArchiveTeam {
  constructor() {
    this.container = null;
    this.searchInput = null;
    this.sortSelect = null;
    this.filterCheckboxes = [];
    this.teamGrid = null;
    this.teamCards = [];
    this.resultsInfo = null;
    this.activeFilters = null;
    
    // Language manager
    this.languageManager = null;
    
    this.init();
  }

  async init() {
    try {
      // Get language manager
      this.languageManager = window.app?.getManager('languageManager');
      
      // Find container
      this.container = document.querySelector('.archive-team-section');
      if (!this.container) return;

      // Initialize elements
      this.initializeElements();
      
      // Get existing team cards from HTML
      this.teamCards = Array.from(this.teamGrid.querySelectorAll('.team-card'));
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initial update
      this.updateResultsInfo();
      
      console.log('✅ ArchiveTeam initialized successfully');
    } catch (error) {
      console.error('❌ ArchiveTeam initialization failed:', error);
    }
  }

  initializeElements() {
    // Search elements
    this.searchInput = this.container.querySelector('.archive-team-search-input');
    this.searchClear = this.container.querySelector('.archive-team-search-clear');
    
    // Sort elements
    this.sortSelect = this.container.querySelector('.archive-team-sort-select');
    
    // Filter elements
    this.filterCheckboxes = Array.from(this.container.querySelectorAll('.archive-team-filter-checkbox'));
    this.filtersClear = this.container.querySelector('.archive-team-filters-clear');
    
    // Grid
    this.teamGrid = this.container.querySelector('.archive-team-grid');
    
    // Results info
    this.resultsInfo = this.container.querySelector('.archive-team-results-count');
    this.activeFilters = this.container.querySelector('.archive-team-active-filters');
  }

  setupEventListeners() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    if (this.searchClear) {
      this.searchClear.addEventListener('click', () => {
        this.searchInput.value = '';
        this.handleSearch('');
      });
    }

    // Sort functionality
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.handleSort(e.target.value);
      });
    }

    // Filter functionality
    this.filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.handleFilter();
      });
    });

    if (this.filtersClear) {
      this.filtersClear.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }

    // Language change listener
    window.addEventListener('languageChanged', () => {
      // Re-get team cards after language change to ensure proper filtering
      this.teamCards = Array.from(this.teamGrid.querySelectorAll('.team-card'));
      this.updateResultsInfo();
    });
  }

  translate(key) {
    return this.languageManager?.translate(key) || key;
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
      this.searchClear.style.display = 'none';
      this.showAllCards();
    } else {
      this.searchClear.style.display = 'block';
      this.filterCardsBySearch(searchTerm);
    }

    this.updateResultsInfo();
  }

  filterCardsBySearch(searchTerm) {
    this.teamCards.forEach(card => {
      const name = card.querySelector('.team-member-name')?.textContent?.toLowerCase() || '';
      const position = card.querySelector('.team-member-position')?.textContent?.toLowerCase() || '';
      const description = card.querySelector('.team-member-description')?.textContent?.toLowerCase() || '';
      
      const matches = name.includes(searchTerm) || 
                     position.includes(searchTerm) || 
                     description.includes(searchTerm);
      
      card.style.display = matches ? 'block' : 'none';
    });
  }

  handleSort(sortBy) {
    const sortedCards = [...this.teamCards];
    
    switch (sortBy) {
      case 'name-asc':
        sortedCards.sort((a, b) => {
          const nameA = a.querySelector('.team-member-name')?.textContent || '';
          const nameB = b.querySelector('.team-member-name')?.textContent || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name-desc':
        sortedCards.sort((a, b) => {
          const nameA = a.querySelector('.team-member-name')?.textContent || '';
          const nameB = b.querySelector('.team-member-name')?.textContent || '';
          return nameB.localeCompare(nameA);
        });
        break;
      case 'experience':
        sortedCards.sort((a, b) => {
          const expA = a.querySelector('.team-member-experience')?.textContent || '';
          const expB = b.querySelector('.team-member-experience')?.textContent || '';
          // Extract numbers from experience text for comparison
          const numA = parseInt(expA.match(/\d+/)?.[0] || '0');
          const numB = parseInt(expB.match(/\d+/)?.[0] || '0');
          return numB - numA; // Descending order (most experience first)
        });
        break;
      case 'department':
        sortedCards.sort((a, b) => {
          const posA = a.querySelector('.team-member-position')?.textContent || '';
          const posB = b.querySelector('.team-member-position')?.textContent || '';
          return posA.localeCompare(posB);
        });
        break;
    }

    // Re-append cards in sorted order
    sortedCards.forEach(card => {
      this.teamGrid.appendChild(card);
    });
  }

  handleFilter() {
    // For now, just show all cards since we don't have detailed filter data in HTML
    // This can be enhanced later if needed
    this.showAllCards();
    this.updateActiveFilters();
  }

  showAllCards() {
    this.teamCards.forEach(card => {
      card.style.display = 'block';
    });
  }

  clearAllFilters() {
    this.filterCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    if (this.searchClear) {
      this.searchClear.style.display = 'none';
    }
    
    this.showAllCards();
    this.updateResultsInfo();
    this.updateActiveFilters();
  }

  updateActiveFilters() {
    const activeFiltersList = this.activeFilters?.querySelector('.archive-team-active-filters-list');
    if (!activeFiltersList) return;

    const activeFilters = this.filterCheckboxes.filter(cb => cb.checked);
    
    if (activeFilters.length === 0) {
      this.activeFilters.style.display = 'none';
      return;
    }

    this.activeFilters.style.display = 'block';
    activeFiltersList.innerHTML = '';

    activeFilters.forEach(checkbox => {
      const filterTag = document.createElement('span');
      filterTag.className = 'archive-team-active-filter-tag';
      filterTag.innerHTML = `
        ${checkbox.nextElementSibling.textContent}
        <button class="archive-team-active-filter-remove">
          <iconify-icon icon="heroicons:x-mark"></iconify-icon>
        </button>
      `;

      filterTag.querySelector('.archive-team-active-filter-remove').addEventListener('click', () => {
        checkbox.checked = false;
        this.handleFilter();
      });

      activeFiltersList.appendChild(filterTag);
    });
  }

  updateResultsInfo() {
    if (!this.resultsInfo) return;

    const currentElement = this.resultsInfo.querySelector('.archive-team-results-current');
    const totalElement = this.resultsInfo.querySelector('.archive-team-results-total');

    if (currentElement && totalElement) {
      const visibleCards = this.teamCards.filter(card => 
        card.style.display !== 'none'
      ).length;
      
      currentElement.textContent = `1-${visibleCards}`;
      totalElement.textContent = visibleCards;
    }
  }
}

export default ArchiveTeam;