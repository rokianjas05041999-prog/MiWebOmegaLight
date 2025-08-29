/**
 * Brands Carousel Component
 * Handles auto-scrolling brand logos carousel with pause on hover
 */

export class BrandsCarousel {
  constructor() {
    this.carousel = null;
    this.track = null;
    this.isInitialized = false;
    this.animationDuration = 30000; // 30 seconds
    this.isPlaying = true;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  /**
   * Initialize the brands carousel
   */
  init() {
    if (this.isInitialized) return;

    console.log('🎠 Initializing BrandsCarousel...');

    try {
      // Find carousel elements
      this.carousel = document.querySelector('.brands-carousel');
      this.track = document.querySelector('#brands-track');

      if (!this.carousel || !this.track) {
        console.warn('⚠️ BrandsCarousel: Required elements not found');
        return;
      }

      // Setup carousel
      this.setupCarousel();
      this.setupEventListeners();
      this.startAnimation();

      this.isInitialized = true;
      console.log('✅ BrandsCarousel initialized successfully');

      // Dispatch event
      window.dispatchEvent(new CustomEvent('brandsCarouselInitialized', {
        detail: { instance: this }
      }));

    } catch (error) {
      console.error('❌ BrandsCarousel initialization failed:', error);
    }
  }

  /**
   * Setup carousel properties
   */
  setupCarousel() {
    // Ensure track has proper styling
    this.track.style.display = 'flex';
    this.track.style.animationName = 'scroll-infinite';
    this.track.style.animationDuration = `${this.animationDuration}ms`;
    this.track.style.animationTimingFunction = 'linear';
    this.track.style.animationIterationCount = 'infinite';
    this.track.style.animationPlayState = 'running';
    
    // Calculate track width based on items
    this.calculateTrackWidth();
  }

  /**
   * Calculate and set track width for seamless loop
   */
  calculateTrackWidth() {
    const items = this.track.querySelectorAll('.brands-item');
    const itemCount = items.length;
    
    if (itemCount === 0) return;

    // Get item width including margins
    const firstItem = items[0];
    const itemStyle = window.getComputedStyle(firstItem);
    const itemWidth = firstItem.offsetWidth + 
                     parseInt(itemStyle.marginLeft) + 
                     parseInt(itemStyle.marginRight);

    // Set track width to accommodate all items plus duplicates
    const totalWidth = itemWidth * itemCount;
    this.track.style.width = `${totalWidth * 2}px`;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Pause on hover
    this.carousel.addEventListener('mouseenter', this.handleMouseEnter);
    this.carousel.addEventListener('mouseleave', this.handleMouseLeave);

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Recalculate on resize
    window.addEventListener('resize', this.handleResize);

    // Handle animation end (restart seamlessly)
    this.track.addEventListener('animationiteration', () => {
      console.log('🔄 BrandsCarousel: Animation loop completed');
    });
  }

  /**
   * Handle mouse enter (pause animation)
   */
  handleMouseEnter() {
    this.pauseAnimation();
  }

  /**
   * Handle mouse leave (resume animation)
   */
  handleMouseLeave() {
    this.resumeAnimation();
  }

  /**
   * Handle visibility change (pause when tab hidden)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAnimation();
    } else {
      this.resumeAnimation();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Debounce resize calculations
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.calculateTrackWidth();
    }, 250);
  }

  /**
   * Start animation
   */
  startAnimation() {
    if (!this.track) return;
    
    this.track.style.animationPlayState = 'running';
    this.isPlaying = true;
    console.log('▶️ BrandsCarousel: Animation started');
  }

  /**
   * Pause animation
   */
  pauseAnimation() {
    if (!this.track) return;
    
    this.track.style.animationPlayState = 'paused';
    this.isPlaying = false;
    console.log('⏸️ BrandsCarousel: Animation paused');
  }

  /**
   * Resume animation
   */
  resumeAnimation() {
    if (!this.track) return;
    
    this.track.style.animationPlayState = 'running';
    this.isPlaying = true;
    console.log('▶️ BrandsCarousel: Animation resumed');
  }

  /**
   * Stop animation
   */
  stopAnimation() {
    if (!this.track) return;
    
    this.track.style.animationPlayState = 'paused';
    this.isPlaying = false;
    console.log('⏹️ BrandsCarousel: Animation stopped');
  }

  /**
   * Set animation speed
   * @param {number} duration - Animation duration in milliseconds
   */
  setAnimationSpeed(duration) {
    this.animationDuration = duration;
    if (this.track) {
      this.track.style.animationDuration = `${duration}ms`;
    }
    console.log(`🏃 BrandsCarousel: Animation speed set to ${duration}ms`);
  }

  /**
   * Add new brand item
   * @param {Object} brandData - Brand data (src, alt, name)
   */
  addBrandItem(brandData) {
    if (!this.track || !brandData) return;

    const item = document.createElement('div');
    item.className = 'brands-item';
    
    const img = document.createElement('img');
    img.src = brandData.src || `https://placehold.co/180x80/E5E5E5/666666?text=${encodeURIComponent(brandData.name || 'Brand')}`;
    img.alt = brandData.alt || brandData.name || 'Brand Logo';
    img.className = 'brands-logo';
    
    item.appendChild(img);
    this.track.appendChild(item);
    
    // Recalculate track width
    this.calculateTrackWidth();
    
    console.log('➕ BrandsCarousel: Brand item added', brandData);
  }

  /**
   * Get current animation state
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      animationDuration: this.animationDuration,
      itemCount: this.track ? this.track.querySelectorAll('.brands-item').length : 0
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.carousel) {
      this.carousel.removeEventListener('mouseenter', this.handleMouseEnter);
      this.carousel.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.handleResize);

    clearTimeout(this.resizeTimeout);

    this.carousel = null;
    this.track = null;
    this.isInitialized = false;

    console.log('🧹 BrandsCarousel: Cleanup completed');
  }
}

// Export singleton instance
export default new BrandsCarousel();
