// Detail General Component
// Handles interactive functionality for the general detail page

export class DetailGeneral {
  constructor() {
    this.initialized = false;
    this.elements = {};
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleImageZoom = this.handleImageZoom.bind(this);
    this.handleSocialShare = this.handleSocialShare.bind(this);
    this.handleActionButtons = this.handleActionButtons.bind(this);
    this.handleContactActions = this.handleContactActions.bind(this);
    this.setupBreadcrumb = this.setupBreadcrumb.bind(this);
  }

  /**
   * Initialize the detail general component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupBreadcrumb();
      this.initialized = true;
      
      console.log('✅ DetailGeneral component initialized');
    } catch (error) {
      console.error('❌ DetailGeneral initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.detail-general-section'),
      imageZoomBtn: document.querySelector('.detail-general-image-zoom'),
      featuredImage: document.querySelector('.detail-general-image'),
      socialBtns: document.querySelectorAll('.detail-general-social-btn'),
      actionBtns: document.querySelectorAll('.detail-general-action-btn'),
      ctaBtns: document.querySelectorAll('.detail-general-cta-btn'),
      contactItems: document.querySelectorAll('.detail-general-contact-item'),
      linkItems: document.querySelectorAll('.detail-general-link-item'),
      breadcrumbList: document.querySelector('.detail-general-breadcrumb-list')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Detail general section not found');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Image zoom functionality
    if (this.elements.imageZoomBtn && this.elements.featuredImage) {
      this.elements.imageZoomBtn.addEventListener('click', this.handleImageZoom);
    }

    // Social share buttons
    this.elements.socialBtns.forEach(btn => {
      btn.addEventListener('click', this.handleSocialShare);
    });

    // Action buttons
    this.elements.actionBtns.forEach(btn => {
      btn.addEventListener('click', this.handleActionButtons);
    });

    // CTA buttons
    this.elements.ctaBtns.forEach(btn => {
      btn.addEventListener('click', this.handleActionButtons);
    });

    // Contact items
    this.elements.contactItems.forEach(item => {
      if (item.href && (item.href.startsWith('tel:') || item.href.startsWith('mailto:'))) {
        item.addEventListener('click', this.handleContactActions);
      }
    });

    // Link items analytics
    this.elements.linkItems.forEach(item => {
      item.addEventListener('click', (e) => {
        this.trackLinkClick(e.currentTarget);
      });
    });
  }

  /**
   * Setup dynamic breadcrumb functionality
   */
  setupBreadcrumb() {
    if (!this.elements.breadcrumbList) return;

    // Get page information from URL or meta tags
    const pageInfo = this.getPageInfo();
    
    // Clear existing dynamic breadcrumb items (keep home)
    this.clearDynamicBreadcrumbs();
    
    // Build breadcrumb items
    this.buildBreadcrumb(pageInfo);
    
    console.log('🍞 Breadcrumb setup completed');
  }

  /**
   * Get page information for breadcrumb
   */
  getPageInfo() {
    const url = window.location.pathname;
    const title = document.title;
    const metaCategory = document.querySelector('meta[name="category"]');
    const metaType = document.querySelector('meta[name="page-type"]');
    
    // Default page info
    let pageInfo = {
      category: 'Services',
      categoryUrl: '/services',
      subcategory: null,
      subcategoryUrl: null,
      currentPage: title.split(' - ')[0] || 'Detail Page',
      currentUrl: url
    };

    // Try to extract from URL structure
    const pathParts = url.split('/').filter(part => part);
    
    if (pathParts.length >= 1) {
      // If we have path parts, use them
      if (pathParts[0] !== 'detail-general.html') {
        pageInfo.category = this.formatBreadcrumbText(pathParts[0]);
        pageInfo.categoryUrl = `/${pathParts[0]}`;
        
        if (pathParts.length >= 2) {
          pageInfo.subcategory = this.formatBreadcrumbText(pathParts[1]);
          pageInfo.subcategoryUrl = `/${pathParts[0]}/${pathParts[1]}`;
        }
      }
    }

    // Override with meta tags if available
    if (metaCategory) {
      pageInfo.category = metaCategory.content;
    }
    
    if (metaType) {
      pageInfo.type = metaType.content;
    }

    return pageInfo;
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
   * Clear dynamic breadcrumb items (keep home)
   */
  clearDynamicBreadcrumbs() {
    const items = this.elements.breadcrumbList.querySelectorAll('.detail-general-breadcrumb-item');
    const separators = this.elements.breadcrumbList.querySelectorAll('.detail-general-breadcrumb-separator');
    
    // Remove all items except the first one (home)
    for (let i = 1; i < items.length; i++) {
      items[i].remove();
    }
    
    // Remove all separators except those needed
    separators.forEach(separator => {
      separator.remove();
    });
  }

  /**
   * Build breadcrumb items
   */
  buildBreadcrumb(pageInfo) {
    const items = [];

    // Add category if available and different from default
    if (pageInfo.category && pageInfo.category !== 'Detail Page') {
      items.push({
        text: pageInfo.category,
        url: pageInfo.categoryUrl,
        isLink: true
      });
    }

    // Add subcategory if available
    if (pageInfo.subcategory) {
      items.push({
        text: pageInfo.subcategory,
        url: pageInfo.subcategoryUrl,
        isLink: true
      });
    }

    // Add current page
    items.push({
      text: pageInfo.currentPage,
      url: pageInfo.currentUrl,
      isLink: false,
      isCurrent: true
    });

    // Create and append breadcrumb items
    items.forEach((item) => {
      // Add separator before each item
      const separator = this.createBreadcrumbSeparator();
      this.elements.breadcrumbList.appendChild(separator);

      // Create breadcrumb item
      const breadcrumbItem = this.createBreadcrumbItem(item);
      this.elements.breadcrumbList.appendChild(breadcrumbItem);
    });
  }

  /**
   * Create breadcrumb separator
   */
  createBreadcrumbSeparator() {
    const separator = document.createElement('li');
    separator.className = 'detail-general-breadcrumb-separator';
    separator.innerHTML = `
      <iconify-icon icon="heroicons:chevron-right" class="detail-general-breadcrumb-separator-icon"></iconify-icon>
    `;
    return separator;
  }

  /**
   * Create breadcrumb item
   */
  createBreadcrumbItem(item) {
    const li = document.createElement('li');
    li.className = `detail-general-breadcrumb-item${item.isCurrent ? ' detail-general-breadcrumb-current' : ''}`;

    if (item.isLink && !item.isCurrent) {
      li.innerHTML = `
        <a href="${item.url}" class="detail-general-breadcrumb-link">
          ${item.text}
        </a>
      `;
    } else {
      li.innerHTML = `<span>${item.text}</span>`;
    }

    return li;
  }

  /**
   * Update breadcrumb dynamically (public method)
   */
  updateBreadcrumb(category, subcategory, currentPage) {
    const pageInfo = {
      category: category,
      categoryUrl: `/${category.toLowerCase().replace(/\s+/g, '-')}`,
      subcategory: subcategory,
      subcategoryUrl: subcategory ? `/${category.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}` : null,
      currentPage: currentPage,
      currentUrl: window.location.pathname
    };

    if (this.elements.breadcrumbList) {
      this.clearDynamicBreadcrumbs();
      this.buildBreadcrumb(pageInfo);
    }
  }

  /**
   * Handle image zoom functionality
   */
  handleImageZoom(e) {
    e.preventDefault();
    
    try {
      const imageUrl = this.elements.featuredImage.src;
      const imageAlt = this.elements.featuredImage.alt;
      
      // Create lightbox overlay
      const lightbox = this.createLightbox(imageUrl, imageAlt);
      document.body.appendChild(lightbox);
      
      // Show lightbox with animation
      requestAnimationFrame(() => {
        lightbox.classList.add('active');
      });
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      console.log('🔍 Image zoom opened');
    } catch (error) {
      console.error('❌ Image zoom failed:', error);
    }
  }

  /**
   * Create lightbox for image zoom
   */
  createLightbox(imageUrl, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'detail-general-lightbox';
    lightbox.innerHTML = `
      <div class="detail-general-lightbox-overlay">
        <div class="detail-general-lightbox-container">
          <button class="detail-general-lightbox-close">
            <iconify-icon icon="heroicons:x-mark" class="detail-general-lightbox-close-icon"></iconify-icon>
          </button>
          <img src="${imageUrl}" alt="${imageAlt}" class="detail-general-lightbox-image">
        </div>
      </div>
    `;

    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .detail-general-lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      .detail-general-lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      .detail-general-lightbox-container {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      .detail-general-lightbox-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      }
      .detail-general-lightbox-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .detail-general-lightbox-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .detail-general-lightbox-close-icon {
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(style);

    // Close lightbox functionality
    const closeBtn = lightbox.querySelector('.detail-general-lightbox-close');
    const overlay = lightbox.querySelector('.detail-general-lightbox-overlay');
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (lightbox.parentNode) {
          lightbox.parentNode.removeChild(lightbox);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeLightbox();
      }
    });

    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return lightbox;
  }

  /**
   * Handle social share functionality
   */
  handleSocialShare(e) {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const platform = this.getSocialPlatform(btn);
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Check out this page from OmegaLight');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      default:
        console.warn('Unknown social platform:', platform);
        return;
    }
    
    // Open share window
    const shareWindow = window.open(
      shareUrl,
      'share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
    
    if (shareWindow) {
      shareWindow.focus();
    }
    
    // Track share event
    this.trackSocialShare(platform);
    
    console.log(`📤 Shared on ${platform}`);
  }

  /**
   * Get social platform from button class
   */
  getSocialPlatform(btn) {
    const classes = btn.className;
    if (classes.includes('facebook')) return 'facebook';
    if (classes.includes('twitter')) return 'twitter';
    if (classes.includes('linkedin')) return 'linkedin';
    if (classes.includes('whatsapp')) return 'whatsapp';
    return 'unknown';
  }

  /**
   * Handle action button clicks
   */
  handleActionButtons(e) {
    const btn = e.currentTarget;
    const text = btn.textContent.trim();
    
    // Add visual feedback
    this.addButtonFeedback(btn);
    
    // Handle specific actions
    if (text.includes('Contact') || text.includes('Quote')) {
      this.scrollToContact();
    } else if (text.includes('Share')) {
      this.showShareOptions();
    } else if (text.includes('Bookmark')) {
      this.handleBookmark();
    }
    
    console.log(`🔘 Action button clicked: ${text}`);
  }

  /**
   * Handle contact action clicks
   */
  handleContactActions(e) {
    const link = e.currentTarget;
    const href = link.href;
    
    if (href.startsWith('tel:')) {
      this.trackPhoneCall(href);
    } else if (href.startsWith('mailto:')) {
      this.trackEmailClick(href);
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
   * Scroll to contact section
   */
  scrollToContact() {
    const contactSection = document.querySelector('#contact, .contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Show share options
   */
  showShareOptions() {
    const shareSection = document.querySelector('.detail-general-social-share');
    if (shareSection) {
      shareSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Highlight share buttons
      shareSection.style.animation = 'pulse 1s ease-in-out';
      setTimeout(() => {
        shareSection.style.animation = '';
      }, 1000);
    }
  }

  /**
   * Handle bookmark functionality
   */
  handleBookmark() {
    try {
      // Try to use browser bookmark API if available
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        });
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          this.showNotification('URL copied to clipboard!');
        });
      }
    } catch (error) {
      console.error('Bookmark failed:', error);
      this.showNotification('Bookmark feature not available');
    }
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
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Track social share events
   */
  trackSocialShare(platform) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: platform,
        content_type: 'detail_page',
        content_id: window.location.pathname
      });
    }
  }

  /**
   * Track link clicks
   */
  trackLinkClick(link) {
    const linkText = link.textContent.trim();
    console.log(`🔗 Link clicked: ${linkText}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'detail_page_link',
        event_label: linkText
      });
    }
  }

  /**
   * Track phone calls
   */
  trackPhoneCall(href) {
    const phoneNumber = href.replace('tel:', '');
    console.log(`📞 Phone call initiated: ${phoneNumber}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'phone_call', {
        event_category: 'contact',
        event_label: phoneNumber
      });
    }
  }

  /**
   * Track email clicks
   */
  trackEmailClick(href) {
    const email = href.replace('mailto:', '');
    console.log(`📧 Email clicked: ${email}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'email_click', {
        event_category: 'contact',
        event_label: email
      });
    }
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    if (this.elements.imageZoomBtn) {
      this.elements.imageZoomBtn.removeEventListener('click', this.handleImageZoom);
    }

    this.elements.socialBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleSocialShare);
    });

    this.elements.actionBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleActionButtons);
    });

    this.elements.ctaBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleActionButtons);
    });

    this.initialized = false;
    console.log('🗑️ DetailGeneral component destroyed');
  }
}