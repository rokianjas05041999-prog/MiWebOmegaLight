// FAQ Component
// Handles interactive functionality for the FAQ section with accordion and filtering

export class FAQ {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.currentFilter = 'all';
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleAccordionToggle = this.handleAccordionToggle.bind(this);
    this.filterFAQs = this.filterFAQs.bind(this);
    this.openAccordion = this.openAccordion.bind(this);
    this.closeAccordion = this.closeAccordion.bind(this);
  }

  /**
   * Initialize the FAQ component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupInitialState();
      this.initialized = true;
      
      console.log('✅ FAQ component initialized');
    } catch (error) {
      console.error('❌ FAQ initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    const section = document.querySelector('.faqs-section');
    if (!section) {
      throw new Error('FAQ section not found');
    }

    this.elements = {
      section,
      filterButtons: section.querySelectorAll('[data-faq-filter]'),
      faqItems: section.querySelectorAll('.faqs-item'),
      accordionToggles: section.querySelectorAll('[data-faq-toggle]'),
    };
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter buttons
    this.elements.filterButtons.forEach(button => {
      button.addEventListener('click', this.handleFilterClick);
    });

    // Use simple direct event listeners for better reliability
    this.elements.accordionToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleAccordionClick(toggle);
      });
    });

    // Keyboard navigation
    this.elements.accordionToggles.forEach(toggle => {
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          this.handleAccordionClick(toggle);
        }
      });
    });
  }

  /**
   * Setup initial component state
   */
  setupInitialState() {
    // Set first filter as active
    if (this.elements.filterButtons.length > 0) {
      this.elements.filterButtons[0].classList.add('active');
    }

    // Close all accordions initially and set ARIA attributes
    this.elements.faqItems.forEach(item => {
      item.classList.remove('active');
      
      const toggle = item.querySelector('[data-faq-toggle]');
      const answer = item.querySelector('.faqs-answer');
      
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      
      if (answer) {
        answer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * Handle filter button clicks
   * @param {Event} e - Click event
   */
  handleFilterClick(e) {
    const button = e.currentTarget;
    const filter = button.getAttribute('data-faq-filter');

    // Update active filter button
    this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Update current filter and apply filtering
    this.currentFilter = filter;
    this.filterFAQs(filter);
  }

  /**
   * Handle accordion click - simplified approach
   * @param {HTMLElement} toggle - The clicked toggle button
   */
  handleAccordionClick(toggle) {
    const faqItem = toggle.closest('.faqs-item');
    if (!faqItem) return;

    const isCurrentlyActive = faqItem.classList.contains('active');
    const questionText = toggle.querySelector('span')?.textContent?.substring(0, 50) + '...';
    
    console.log('FAQ Clicked:', {
      questionText,
      isCurrentlyActive,
      element: faqItem
    });

    // Close ALL accordions first
    this.elements.faqItems.forEach(item => {
      item.classList.remove('active');
      const itemToggle = item.querySelector('[data-faq-toggle]');
      const itemAnswer = item.querySelector('.faqs-answer');
      
      if (itemToggle) itemToggle.setAttribute('aria-expanded', 'false');
      if (itemAnswer) itemAnswer.setAttribute('aria-hidden', 'true');
    });

    // If the clicked item wasn't active, open it
    if (!isCurrentlyActive) {
      faqItem.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      
      const answer = faqItem.querySelector('.faqs-answer');
      if (answer) answer.setAttribute('aria-hidden', 'false');
      
      console.log('Opened FAQ:', questionText);
    } else {
      console.log('Closed FAQ:', questionText);
    }
  }

  /**
   * Handle accordion toggle - keeping for backward compatibility
   * @param {Event} e - Click event  
   */
  handleAccordionToggle(e) {
    const toggle = e.target.closest('[data-faq-toggle]');
    if (toggle) {
      this.handleAccordionClick(toggle);
    }
  }

  /**
   * Filter FAQ items based on category
   * @param {string} filter - Filter category
   */
  filterFAQs(filter) {
    this.elements.faqItems.forEach((item, index) => {
      const category = item.getAttribute('data-faq-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        item.classList.remove('hidden');
        // Add staggered animation
        setTimeout(() => {
          item.style.animation = `fadeInUp 0.6s ease-out forwards`;
        }, index * 100);
      } else {
        item.classList.add('hidden');
        item.style.animation = 'none';
      }
    });
  }

  /**
   * Open accordion item
   * @param {HTMLElement} faqItem - FAQ item element
   */
  openAccordion(faqItem) {
    if (!faqItem) return;
    
    const questionText = faqItem.querySelector('[data-faq-toggle] span')?.textContent?.substring(0, 50) + '...';
    console.log('Opening FAQ:', questionText);
    
    faqItem.classList.add('active');
    
    // Set ARIA attributes for accessibility
    const toggle = faqItem.querySelector('[data-faq-toggle]');
    const answer = faqItem.querySelector('.faqs-answer');
    
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
    
    if (answer) {
      answer.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Close accordion item
   * @param {HTMLElement} faqItem - FAQ item element
   */
  closeAccordion(faqItem) {
    if (!faqItem) return;
    
    const questionText = faqItem.querySelector('[data-faq-toggle] span')?.textContent?.substring(0, 50) + '...';
    console.log('Closing FAQ:', questionText);
    
    faqItem.classList.remove('active');
    
    // Set ARIA attributes for accessibility
    const toggle = faqItem.querySelector('[data-faq-toggle]');
    const answer = faqItem.querySelector('.faqs-answer');
    
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    
    if (answer) {
      answer.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Public method to open specific FAQ by index
   * @param {number} index - FAQ index to open
   */
  openFAQByIndex(index) {
    const faqItem = this.elements.faqItems[index];
    if (faqItem && !faqItem.classList.contains('hidden')) {
      this.openAccordion(faqItem);
    }
  }

  /**
   * Public method to filter FAQs programmatically
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
   * Public method to get FAQ statistics
   * @returns {Object} FAQ statistics
   */
  getStatistics() {
    const total = this.elements.faqItems.length;
    const visible = Array.from(this.elements.faqItems)
      .filter(item => !item.classList.contains('hidden')).length;
    const open = Array.from(this.elements.faqItems)
      .filter(item => item.classList.contains('active')).length;

    return {
      total,
      visible,
      open,
      currentFilter: this.currentFilter
    };
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (!this.initialized) return;

    // Remove event listeners
    this.elements.filterButtons.forEach(button => {
      button.removeEventListener('click', this.handleFilterClick);
    });

    this.elements.accordionToggles.forEach(toggle => {
      toggle.removeEventListener('click', this.handleAccordionToggle);
    });

    // Reset state
    this.elements = {};
    this.initialized = false;
    
    console.log('✅ FAQ component destroyed');
  }
}
