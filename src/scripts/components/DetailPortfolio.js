// Detail Portfolio Component
// Handles interactive functionality for the portfolio detail page

export class DetailPortfolio {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.currentImageIndex = 0;
    this.images = [];
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleGalleryNavigation = this.handleGalleryNavigation.bind(this);
    this.handleSocialShare = this.handleSocialShare.bind(this);
    this.handleActionButtons = this.handleActionButtons.bind(this);
    this.handleContactActions = this.handleContactActions.bind(this);
    this.setupBreadcrumb = this.setupBreadcrumb.bind(this);
    this.setupGallery = this.setupGallery.bind(this);
  }

  /**
   * Initialize the detail portfolio component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupBreadcrumb();
      this.setupGallery();
      this.setupAnimations();
      this.initialized = true;
      
      console.log('✅ DetailPortfolio component initialized');
    } catch (error) {
      console.error('❌ DetailPortfolio initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.detail-portfolio-section'),
      galleryFeatured: document.querySelector('.detail-portfolio-gallery-featured'),
      galleryThumbs: document.querySelectorAll('.detail-portfolio-gallery-thumb'),
      socialBtns: document.querySelectorAll('.detail-portfolio-social-btn'),
      actionBtns: document.querySelectorAll('.detail-portfolio-action-btn'),
      ctaBtns: document.querySelectorAll('.detail-portfolio-cta-btn'),
      contactBtns: document.querySelectorAll('.detail-portfolio-contact-btn'),
      relatedItems: document.querySelectorAll('.detail-portfolio-related-item'),
      breadcrumbList: document.querySelector('.detail-portfolio-breadcrumb-list'),
      timelineItems: document.querySelectorAll('.detail-portfolio-timeline-item'),
      statItems: document.querySelectorAll('.detail-portfolio-stat-item'),
      specCards: document.querySelectorAll('.detail-portfolio-spec-card')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Detail portfolio section not found');
    }

    // Cache gallery images data
    this.images = Array.from(this.elements.galleryThumbs).map((thumb, index) => {
      const img = thumb.querySelector('.detail-portfolio-thumb-image');
      return {
        thumb: img.src,
        full: img.src.replace('w=300&h=200', 'w=1200&h=800'),
        alt: img.alt,
        index: index
      };
    });
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Gallery navigation
    this.elements.galleryThumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.handleGalleryNavigation(index));
    });

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

    // Contact buttons
    this.elements.contactBtns.forEach(btn => {
      btn.addEventListener('click', this.handleContactActions);
    });

    // Related project items
    this.elements.relatedItems.forEach(item => {
      item.addEventListener('click', (e) => {
        this.trackRelatedProjectClick(e.currentTarget);
      });
    });

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigateGallery('prev');
      } else if (e.key === 'ArrowRight') {
        this.navigateGallery('next');
      }
    });
  }

  /**
   * Setup dynamic breadcrumb functionality
   */
  setupBreadcrumb() {
    if (!this.elements.breadcrumbList) return;

    // Get project information from page content or URL
    const projectInfo = this.getProjectInfo();
    
    // Update breadcrumb if needed
    this.updateBreadcrumb(projectInfo);
    
    console.log('🍞 Portfolio breadcrumb setup completed');
  }

  /**
   * Get project information for breadcrumb
   */
  getProjectInfo() {
    const title = document.querySelector('.detail-portfolio-title')?.textContent || 'Portfolio Project';
    const category = document.querySelector('.detail-portfolio-category')?.textContent || 'Project';
    
    return {
      category: 'Portfolio',
      categoryUrl: '#gallery',
      currentPage: title,
      currentUrl: window.location.pathname
    };
  }

  /**
   * Update breadcrumb dynamically
   */
  updateBreadcrumb(projectInfo) {
    // This can be enhanced to dynamically update breadcrumb based on project data
    console.log('📍 Breadcrumb updated for:', projectInfo.currentPage);
  }

  /**
   * Setup gallery functionality
   */
  setupGallery() {
    if (this.images.length === 0) return;

    // Set initial active thumbnail
    this.setActiveThumb(0);
    
    // Setup swipe gestures for mobile
    this.setupSwipeGestures();
    
    console.log('🖼️ Gallery setup completed with', this.images.length, 'images');
  }

  /**
   * Setup swipe gestures for mobile gallery navigation
   */
  setupSwipeGestures() {
    if (!this.elements.galleryFeatured) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    this.elements.galleryFeatured.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.elements.galleryFeatured.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.navigateGallery('prev');
        } else {
          this.navigateGallery('next');
        }
      }
    });
  }

  /**
   * Setup scroll animations
   */
  setupAnimations() {
    // Animate timeline items on scroll
    this.setupScrollAnimations();
    
    // Animate stats counter
    this.setupStatsAnimation();
    
    console.log('✨ Animations setup completed');
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe timeline items
    this.elements.timelineItems.forEach(item => {
      observer.observe(item);
    });

    // Observe spec cards
    this.elements.specCards.forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * Setup stats counter animation
   */
  setupStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStatValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.elements.statItems.forEach(item => {
      observer.observe(item);
    });
  }

  /**
   * Animate stat value counter
   */
  animateStatValue(statItem) {
    const valueElement = statItem.querySelector('.detail-portfolio-stat-value');
    if (!valueElement) return;

    const finalValue = valueElement.textContent;
    const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericValue)) return;

    let currentValue = 0;
    const increment = numericValue / 30; // 30 frames for smooth animation
    const suffix = finalValue.replace(/[\d.]/g, '');

    const animate = () => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        valueElement.textContent = finalValue;
        return;
      }
      
      const displayValue = Math.floor(currentValue);
      valueElement.textContent = displayValue + suffix;
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Handle gallery navigation
   */
  handleGalleryNavigation(index) {
    if (index < 0 || index >= this.images.length) return;

    this.currentImageIndex = index;
    const image = this.images[index];

    // Update featured image
    if (this.elements.galleryFeatured) {
      this.elements.galleryFeatured.src = image.full;
      this.elements.galleryFeatured.alt = image.alt;
    }

    // Update active thumbnail
    this.setActiveThumb(index);

    // Track gallery navigation
    this.trackGalleryNavigation(index);

    console.log(`🖼️ Gallery navigated to image ${index + 1}`);
  }

  /**
   * Navigate gallery with direction
   */
  navigateGallery(direction) {
    let newIndex = this.currentImageIndex;
    
    if (direction === 'next') {
      newIndex = (this.currentImageIndex + 1) % this.images.length;
    } else if (direction === 'prev') {
      newIndex = this.currentImageIndex === 0 ? this.images.length - 1 : this.currentImageIndex - 1;
    }

    this.handleGalleryNavigation(newIndex);
  }

  /**
   * Set active thumbnail
   */
  setActiveThumb(index) {
    this.elements.galleryThumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
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
    const text = encodeURIComponent('Check out this amazing electrical project by OmegaLight');
    
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
    
    console.log(`📤 Portfolio shared on ${platform}`);
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
    } else if (text.includes('Download')) {
      this.handleDownloadPDF();
    } else if (text.includes('View More')) {
      this.scrollToGallery();
    }
    
    console.log(`🔘 Portfolio action button clicked: ${text}`);
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
   * Scroll to gallery section
   */
  scrollToGallery() {
    const gallerySection = document.querySelector('#gallery, .gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Show share options
   */
  showShareOptions() {
    const shareSection = document.querySelector('.detail-portfolio-social-share');
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
   * Handle PDF download
   */
  handleDownloadPDF() {
    // This would typically generate or download a project PDF
    this.showNotification('PDF download feature coming soon!');
    console.log('📄 PDF download requested');
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
        content_type: 'portfolio_project',
        content_id: window.location.pathname
      });
    }
  }

  /**
   * Track gallery navigation
   */
  trackGalleryNavigation(index) {
    console.log(`📊 Gallery navigation tracked: image ${index + 1}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'gallery_navigation', {
        event_category: 'portfolio',
        event_label: `image_${index + 1}`
      });
    }
  }

  /**
   * Track related project clicks
   */
  trackRelatedProjectClick(item) {
    const projectTitle = item.querySelector('.detail-portfolio-related-title')?.textContent || 'Unknown Project';
    console.log(`🔗 Related project clicked: ${projectTitle}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'related_project',
        event_label: projectTitle
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
   * Update project data dynamically (public method)
   */
  updateProject(projectData) {
    // Update title
    const titleElement = document.querySelector('.detail-portfolio-title');
    if (titleElement && projectData.title) {
      titleElement.textContent = projectData.title;
    }

    // Update images
    if (projectData.images && projectData.images.length > 0) {
      this.images = projectData.images;
      this.setupGallery();
    }

    // Update stats
    if (projectData.stats) {
      Object.keys(projectData.stats).forEach(key => {
        const statElement = document.querySelector(`[data-stat="${key}"]`);
        if (statElement) {
          statElement.textContent = projectData.stats[key];
        }
      });
    }

    console.log('🔄 Portfolio project data updated');
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.elements.galleryThumbs.forEach((thumb, index) => {
      thumb.removeEventListener('click', () => this.handleGalleryNavigation(index));
    });

    this.elements.socialBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleSocialShare);
    });

    this.elements.actionBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleActionButtons);
    });

    this.elements.ctaBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleActionButtons);
    });

    this.elements.contactBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleContactActions);
    });

    this.initialized = false;
    console.log('🗑️ DetailPortfolio component destroyed');
  }
}