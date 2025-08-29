/**
 * Detail Article Component
 * Handles article detail page functionality including sharing, navigation, and interactions
 * 
 * Features:
 * - Article sharing functionality
 * - Copy link to clipboard
 * - Smooth scrolling navigation
 * - Reading progress indicator
 * - Social media integration
 */

import { DOMUtils } from '../utils/dom.js';

export class DetailArticle {
  constructor() {
    this.isInitialized = false;
    this.readingProgress = 0;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleCopyLink = this.handleCopyLink.bind(this);
    this.updateReadingProgress = this.updateReadingProgress.bind(this);
  }

  async init() {
    if (this.isInitialized) {
      console.log('📄 DetailArticle Component already initialized, skipping...');
      return;
    }

    console.log('📄 Initializing DetailArticle Component...');
    
    try {
      // Wait for DOM elements to be available
      await this.waitForDOMElements();
      
      // Initialize share functionality
      this.initShareButtons();
      
      // Initialize reading progress
      this.initReadingProgress();
      
      // Initialize smooth scrolling for internal links
      this.initSmoothScrolling();
      
      // Initialize back button functionality
      this.initBackButton();
      
      this.isInitialized = true;
      console.log('✅ DetailArticle Component initialized');
      
    } catch (error) {
      console.error('❌ DetailArticle initialization failed:', error);
    }
  }

  /**
   * Wait for DOM elements to be available
   */
  async waitForDOMElements() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkElements = () => {
        attempts++;
        const articleSection = document.querySelector('.detail-article-section');
        
        if (articleSection) {
          console.log(`✅ DetailArticle elements found after ${attempts} attempts`);
          resolve();
        } else if (attempts >= maxAttempts) {
          console.warn('⚠️ DetailArticle elements not found after maximum attempts');
          resolve(); // Continue anyway
        } else {
          // Check again in next animation frame
          requestAnimationFrame(checkElements);
        }
      };
      
      checkElements();
    });
  }

  /**
   * Initialize share buttons functionality
   */
  initShareButtons() {
    const shareButtons = document.querySelectorAll('.detail-article-share-button');
    
    shareButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const shareType = button.getAttribute('data-share');
        
        if (shareType === 'twitter' || button.textContent.includes('Copy')) {
          this.handleCopyLink();
        } else {
          this.handleShare(shareType);
        }
      });
    });

    console.log('🔗 Share buttons initialized');
  }

  /**
   * Handle article sharing
   */
  async handleShare(platform) {
    const title = document.querySelector('.detail-article-title')?.textContent || 'Article';
    const url = window.location.href;
    
    try {
      if (navigator.share && platform === 'native') {
        await navigator.share({
          title: title,
          url: url
        });
        console.log('📤 Article shared successfully');
      } else {
        // Fallback to copy link
        this.handleCopyLink();
      }
    } catch (error) {
      console.log('📤 Share cancelled or failed, copying link instead');
      this.handleCopyLink();
    }
  }

  /**
   * Handle copy link to clipboard
   */
  async handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showNotification('Link copied to clipboard!', 'success');
      console.log('📋 Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
      this.showNotification('Failed to copy link', 'error');
    }
  }

  /**
   * Initialize reading progress indicator
   */
  initReadingProgress() {
    const articleContent = document.querySelector('.detail-article-content');
    if (!articleContent) return;

    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.detail-article-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'detail-article-progress';
      progressBar.innerHTML = '<div class="detail-article-progress-bar"></div>';
      document.body.appendChild(progressBar);
    }

    const progressBarFill = progressBar.querySelector('.detail-article-progress-bar');

    // Update progress on scroll
    const updateProgress = () => {
      const articleRect = articleContent.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const articleHeight = articleContent.offsetHeight;
      
      // Calculate reading progress
      const scrolled = Math.max(0, -articleRect.top);
      const maxScroll = articleHeight - windowHeight;
      const progress = Math.min(100, Math.max(0, (scrolled / maxScroll) * 100));
      
      this.readingProgress = progress;
      progressBarFill.style.width = `${progress}%`;
    };

    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        updateProgress();
        scrollTimeout = null;
      }, 16); // ~60fps
    });

    console.log('📊 Reading progress initialized');
  }

  /**
   * Initialize smooth scrolling for internal links
   */
  initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement && targetId !== '#') {
          e.preventDefault();
          
          const navbar = document.querySelector('.header-navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 80;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    console.log('🔗 Smooth scrolling initialized');
  }

  /**
   * Initialize back button functionality
   */
  initBackButton() {
    const backButton = document.querySelector('.detail-article-back-button');
    
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        // Check if there's a referrer from the same domain
        if (document.referrer && document.referrer.includes(window.location.hostname)) {
          e.preventDefault();
          window.history.back();
        }
        // Otherwise, let the default link behavior work
      });
    }

    console.log('⬅️ Back button initialized');
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.detail-article-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `detail-article-notification detail-article-notification-${type}`;
    notification.innerHTML = `
      <div class="detail-article-notification-content">
        <iconify-icon icon="heroicons:check-circle" class="detail-article-notification-icon"></iconify-icon>
        <span class="detail-article-notification-text">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('detail-article-notification-show');
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('detail-article-notification-show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  /**
   * Get reading progress
   */
  getReadingProgress() {
    return this.readingProgress;
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Remove progress bar
    const progressBar = document.querySelector('.detail-article-progress');
    if (progressBar) {
      progressBar.remove();
    }

    // Remove notifications
    const notifications = document.querySelectorAll('.detail-article-notification');
    notifications.forEach(notification => notification.remove());

    this.isInitialized = false;
    console.log('📄 DetailArticle Component destroyed');
  }
}

export default DetailArticle;