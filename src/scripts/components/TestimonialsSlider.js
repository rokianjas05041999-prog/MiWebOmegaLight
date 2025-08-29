/**
 * Testimonials Slider Component
 * Handles navigation and auto-scrolling for testimonials
 */

export class TestimonialsSlider {
  constructor() {
    this.slider = null;
    this.track = null;
    this.slides = [];
    this.currentSlide = 0;
    this.isInitialized = false;
    this.autoScrollInterval = null;
    this.autoScrollDelay = 5000; // 5 seconds

    // Bind methods
    this.init = this.init.bind(this);
    this.goToSlide = this.goToSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.startAutoScroll = this.startAutoScroll.bind(this);
    this.stopAutoScroll = this.stopAutoScroll.bind(this);
    this.handleDotClick = this.handleDotClick.bind(this);
  }

  /**
   * Initialize the testimonials slider
   */
  init() {
    if (this.isInitialized) return;

    console.log('🎠 Initializing TestimonialsSlider...');

    try {
      // Find slider elements
      this.slider = document.querySelector('.testimonials-slider');
      this.track = document.querySelector('#testimonials-track');
      this.slides = Array.from(this.track.querySelectorAll('.testimonial-card'));

      if (!this.slider || !this.track || this.slides.length === 0) {
        console.warn('⚠️ TestimonialsSlider: Required elements not found');
        return;
      }

      // Setup slider
      this.setupSlider();
      this.setupEventListeners();
      this.startAutoScroll();

      this.isInitialized = true;
      console.log('✅ TestimonialsSlider initialized successfully');

      // Dispatch event
      window.dispatchEvent(new CustomEvent('testimonialsSliderInitialized', {
        detail: { instance: this }
      }));

    } catch (error) {
      console.error('❌ TestimonialsSlider initialization failed:', error);
    }
  }

  /**
   * Setup slider properties
   */
  setupSlider() {
    // Ensure track has proper styling
    this.track.style.display = 'flex';
    this.track.style.transition = 'transform 0.5s ease-in-out';
    this.track.style.width = `${this.slides.length * 100}%`;
    
    // Set width for each slide
    this.slides.forEach(slide => {
      slide.style.width = `${100 / this.slides.length}%`;
      slide.style.flexShrink = '0';
    });

    // Set initial slide
    this.goToSlide(0);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation buttons
    const prevButton = document.querySelector('#testimonials-prev');
    const nextButton = document.querySelector('#testimonials-next');

    if (prevButton) prevButton.addEventListener('click', this.prevSlide);
    if (nextButton) nextButton.addEventListener('click', this.nextSlide);

    // Dots navigation
    const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.handleDotClick(index));
    });

    // Pause auto-scroll on hover
    this.slider.addEventListener('mouseenter', this.stopAutoScroll);
    this.slider.addEventListener('mouseleave', this.startAutoScroll);
  }

  /**
   * Go to specific slide
   * @param {number} index - Slide index
   */
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentSlide = index;
    const offset = -(index * (100 / this.slides.length));
    this.track.style.transform = `translateX(${offset}%)`;

    // Update dots
    const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonial-dot-active', i === index);
    });

    console.log(`🔄 TestimonialsSlider: Moved to slide ${index}`);
  }

  /**
   * Go to next slide
   */
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  /**
   * Go to previous slide
   */
  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  /**
   * Start auto-scroll
   */
  startAutoScroll() {
    this.stopAutoScroll();
    this.autoScrollInterval = setInterval(this.nextSlide, this.autoScrollDelay);
    console.log('▶️ TestimonialsSlider: Auto-scroll started');
  }

  /**
   * Stop auto-scroll
   */
  stopAutoScroll() {
    clearInterval(this.autoScrollInterval);
    this.autoScrollInterval = null;
    console.log('⏸️ TestimonialsSlider: Auto-scroll stopped');
  }

  /**
   * Handle dot click
   * @param {number} index - Dot index
   */
  handleDotClick(index) {
    this.goToSlide(index);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stopAutoScroll();

    const prevButton = document.querySelector('#testimonials-prev');
    const nextButton = document.querySelector('#testimonials-next');

    if (prevButton) prevButton.removeEventListener('click', this.prevSlide);
    if (nextButton) nextButton.removeEventListener('click', this.nextSlide);

    const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
    dots.forEach((dot) => {
      dot.removeEventListener('click', this.handleDotClick);
    });

    this.slider.removeEventListener('mouseenter', this.stopAutoScroll);
    this.slider.removeEventListener('mouseleave', this.startAutoScroll);

    this.slider = null;
    this.track = null;
    this.slides = [];
    this.currentSlide = 0;
    this.isInitialized = false;

    console.log('🧹 TestimonialsSlider: Cleanup completed');
  }
}

// Export singleton instance
export default new TestimonialsSlider();
