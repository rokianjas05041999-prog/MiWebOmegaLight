// Detail FAQ Component
// Handles interactive functionality for the FAQ detail page

export class DetailFAQ {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.faqId = null;
    this.bookmarkedFAQs = new Set();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
    this.handleFeedbackCancel = this.handleFeedbackCancel.bind(this);
  }

  /**
   * Initialize the detail FAQ component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.loadBookmarks();
      this.setupInitialState();
      this.getFAQIdFromURL();
      this.loadFAQContent();
      this.initialized = true;
      
      console.log('✅ DetailFAQ component initialized');
    } catch (error) {
      console.error('❌ DetailFAQ initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    const section = document.querySelector('.detail-faq-section');
    if (!section) {
      throw new Error('Detail FAQ section not found');
    }

    this.elements = {
      section,
      bookmarkBtn: section.querySelector('.detail-faq-bookmark'),
      shareBtn: section.querySelector('.detail-faq-share'),
      ratingButtons: section.querySelectorAll('[data-faq-rating]'),
      feedbackForm: section.querySelector('[data-feedback-form]'),
      feedbackTextarea: section.querySelector('.detail-faq-feedback-textarea'),
      feedbackSubmit: section.querySelector('.detail-faq-feedback-submit'),
      feedbackCancel: section.querySelector('.detail-faq-feedback-cancel'),
      contactButtons: section.querySelectorAll('.detail-faq-contact-btn'),
      relatedLinks: section.querySelectorAll('.detail-faq-related-item'),
      categoryLinks: section.querySelectorAll('.detail-faq-category-item'),
    };
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Bookmark functionality
    if (this.elements.bookmarkBtn) {
      this.elements.bookmarkBtn.addEventListener('click', this.handleBookmark);
    }

    // Share functionality
    if (this.elements.shareBtn) {
      this.elements.shareBtn.addEventListener('click', this.handleShare);
    }

    // Rating buttons
    this.elements.ratingButtons.forEach(button => {
      button.addEventListener('click', this.handleRating);
    });

    // Feedback form
    if (this.elements.feedbackSubmit) {
      this.elements.feedbackSubmit.addEventListener('click', this.handleFeedbackSubmit);
    }

    if (this.elements.feedbackCancel) {
      this.elements.feedbackCancel.addEventListener('click', this.handleFeedbackCancel);
    }

    // Contact buttons analytics
    this.elements.contactButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const type = e.currentTarget.classList.contains('whatsapp') ? 'whatsapp' :
                    e.currentTarget.classList.contains('phone') ? 'phone' : 'email';
        this.trackContactClick(type);
      });
    });

    // Related links analytics
    this.elements.relatedLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = e.currentTarget.getAttribute('href');
        this.trackRelatedClick(href);
      });
    });
  }

  /**
   * Setup initial component state
   */
  setupInitialState() {
    // Update bookmark state
    this.updateBookmarkState();
    
    // Hide feedback form initially
    if (this.elements.feedbackForm) {
      this.elements.feedbackForm.classList.add('hidden');
    }
  }

  /**
   * Get FAQ ID from URL parameters
   */
  getFAQIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    this.faqId = urlParams.get('id') || '1';
  }

  /**
   * Load FAQ content based on ID
   */
  loadFAQContent() {
    // In a real application, this would fetch content from an API
    // For now, we'll use the static content already in the HTML
    
    // Update view count (simulate)
    this.incrementViewCount();
    
    // Track page view
    this.trackPageView();
  }

  /**
   * Handle bookmark toggle
   * @param {Event} e - Click event
   */
  handleBookmark(e) {
    e.preventDefault();
    
    if (this.bookmarkedFAQs.has(this.faqId)) {
      this.bookmarkedFAQs.delete(this.faqId);
      this.elements.bookmarkBtn.classList.remove('bookmarked');
      this.showMessage('FAQ dihapus dari bookmark', 'info');
    } else {
      this.bookmarkedFAQs.add(this.faqId);
      this.elements.bookmarkBtn.classList.add('bookmarked');
      this.showMessage('FAQ ditambahkan ke bookmark', 'success');
    }

    this.saveBookmarks();
  }

  /**
   * Handle share functionality
   * @param {Event} e - Click event
   */
  async handleShare(e) {
    e.preventDefault();
    
    const shareData = {
      title: document.querySelector('.detail-faq-title')?.textContent || 'FAQ - OmegaLight',
      text: 'Lihat jawaban untuk pertanyaan ini di OmegaLight',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.trackShareClick('native');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        this.showMessage('Link telah disalin ke clipboard', 'success');
        this.trackShareClick('clipboard');
      }
    } catch (error) {
      console.warn('Share failed:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        this.showMessage('Link telah disalin ke clipboard', 'success');
      } catch (clipboardError) {
        this.showMessage('Gagal membagikan link', 'error');
      }
    }
  }

  /**
   * Handle rating button clicks
   * @param {Event} e - Click event
   */
  handleRating(e) {
    const button = e.currentTarget;
    const rating = button.getAttribute('data-faq-rating');
    
    // Update button states
    this.elements.ratingButtons.forEach(btn => {
      btn.classList.remove('selected');
    });
    button.classList.add('selected');

    // Show feedback form for negative rating
    if (rating === 'not-helpful' && this.elements.feedbackForm) {
      this.elements.feedbackForm.classList.remove('hidden');
      this.elements.feedbackTextarea?.focus();
    } else {
      this.elements.feedbackForm?.classList.add('hidden');
      this.showMessage('Terima kasih atas feedback Anda!', 'success');
    }

    // Track rating
    this.trackRating(rating);
  }

  /**
   * Handle feedback form submission
   */
  handleFeedbackSubmit() {
    const feedback = this.elements.feedbackTextarea?.value.trim();
    
    if (!feedback) {
      this.showMessage('Mohon isi feedback Anda', 'warning');
      return;
    }

    // Submit feedback (simulate API call)
    this.submitFeedback(feedback)
      .then(() => {
        this.showMessage('Feedback berhasil dikirim. Terima kasih!', 'success');
        this.elements.feedbackForm?.classList.add('hidden');
        this.elements.feedbackTextarea.value = '';
      })
      .catch(() => {
        this.showMessage('Gagal mengirim feedback. Silakan coba lagi.', 'error');
      });
  }

  /**
   * Handle feedback form cancel
   */
  handleFeedbackCancel() {
    this.elements.feedbackForm?.classList.add('hidden');
    this.elements.feedbackTextarea.value = '';
    
    // Reset rating buttons
    this.elements.ratingButtons.forEach(btn => {
      btn.classList.remove('selected');
    });
  }

  /**
   * Submit feedback to server
   * @param {string} feedback - Feedback text
   * @returns {Promise}
   */
  async submitFeedback(feedback) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% success rate for simulation
        if (Math.random() > 0.1) {
          console.log('Feedback submitted:', {
            faqId: this.faqId,
            feedback,
            timestamp: new Date().toISOString()
          });
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 1000);
    });
  }

  /**
   * Increment view count (simulate)
   */
  incrementViewCount() {
    const viewElement = document.querySelector('.detail-faq-views span');
    if (viewElement) {
      const currentViews = parseInt(viewElement.textContent.replace(/\D/g, '')) || 0;
      viewElement.textContent = `${currentViews + 1} kali dilihat`;
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
   * Update bookmark button state
   */
  updateBookmarkState() {
    if (this.elements.bookmarkBtn && this.bookmarkedFAQs.has(this.faqId)) {
      this.elements.bookmarkBtn.classList.add('bookmarked');
    }
  }

  /**
   * Show message to user
   * @param {string} message - Message text
   * @param {string} type - Message type (success, error, warning, info)
   */
  showMessage(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Analytics tracking methods
   */
  trackPageView() {
    console.log('FAQ page view:', {
      faqId: this.faqId,
      timestamp: new Date().toISOString()
    });
  }

  trackContactClick(type) {
    console.log('Contact clicked:', {
      type,
      faqId: this.faqId,
      timestamp: new Date().toISOString()
    });
  }

  trackRelatedClick(href) {
    console.log('Related FAQ clicked:', {
      href,
      faqId: this.faqId,
      timestamp: new Date().toISOString()
    });
  }

  trackShareClick(method) {
    console.log('FAQ shared:', {
      method,
      faqId: this.faqId,
      timestamp: new Date().toISOString()
    });
  }

  trackRating(rating) {
    console.log('FAQ rated:', {
      rating,
      faqId: this.faqId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Public method to get FAQ data
   * @returns {Object} FAQ data
   */
  getFAQData() {
    return {
      id: this.faqId,
      isBookmarked: this.bookmarkedFAQs.has(this.faqId),
      title: document.querySelector('.detail-faq-title')?.textContent || '',
      category: document.querySelector('.detail-faq-category-badge')?.textContent || ''
    };
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (!this.initialized) return;

    // Remove event listeners
    if (this.elements.bookmarkBtn) {
      this.elements.bookmarkBtn.removeEventListener('click', this.handleBookmark);
    }

    if (this.elements.shareBtn) {
      this.elements.shareBtn.removeEventListener('click', this.handleShare);
    }

    this.elements.ratingButtons.forEach(button => {
      button.removeEventListener('click', this.handleRating);
    });

    // Reset state
    this.elements = {};
    this.initialized = false;
    
    console.log('✅ DetailFAQ component destroyed');
  }
}
