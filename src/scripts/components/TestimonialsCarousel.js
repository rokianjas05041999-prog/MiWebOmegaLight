// TestimonialsCarousel Component
// Handles testimonials section carousel functionality

import { DOMUtils } from '../utils/dom.js';

export class TestimonialsCarousel {
  constructor() {
    this.currentIndex = 0;
    this.testimonials = [];
    this.isPlaying = true;
    this.interval = null;
    this.autoSlideDelay = 6000; // 6 seconds
    
    this.init();
  }

  init() {
    this.setupTestimonialsData();
    this.enhanceTestimonialsSection();
    this.setupEventListeners();
    this.startAutoSlide();
  }

  setupTestimonialsData() {
    // Testimonials data - matches testimonials section
    this.testimonials = [
      {
        text: 'testimonials.items.client1.text',
        name: 'testimonials.items.client1.name',
        position: 'testimonials.items.client1.position',
        location: 'testimonials.items.client1.location',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 5
      },
      {
        text: 'testimonials.items.client2.text',
        name: 'testimonials.items.client2.name',
        position: 'testimonials.items.client2.position',
        location: 'testimonials.items.client2.location',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        rating: 5
      },
      {
        text: 'testimonials.items.client3.text',
        name: 'testimonials.items.client3.name',
        position: 'testimonials.items.client3.position',
        location: 'testimonials.items.client3.location',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 5
      },
      // Additional testimonials
      {
        text: 'Outstanding service and product quality. The installation team was professional and completed the work on time. Highly recommended for electrical needs.',
        name: 'Maria Santos',
        position: 'Restaurant Owner',
        location: 'South Jakarta',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        rating: 5
      },
      {
        text: 'Great experience with OmegaLight. Competitive prices, genuine products, and excellent customer service. Will definitely return for future purchases.',
        name: 'Robert Chen',
        position: 'Contractor',
        location: 'Bogor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        rating: 4
      }
    ];
  }

  enhanceTestimonialsSection() {
    const testimonialsSection = DOMUtils.select('#testimonials, .testimonials-section');
    if (!testimonialsSection) return;

    // Check if carousel already exists
    if (testimonialsSection.querySelector('.testimonials-carousel')) return;

    const testimonialsGrid = testimonialsSection.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;

    // Create carousel structure
    const carouselHTML = `
      <div class="testimonials-carousel">
        <div class="testimonials-track">
          ${this.testimonials.map((testimonial, index) => `
            <div class="testimonial-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <div class="testimonial-rating">
                    ${Array.from({length: 5}, (_, i) => `
                      <iconify-icon icon="heroicons:star${i < testimonial.rating ? '' : '-outline'}" 
                                    class="star ${i < testimonial.rating ? 'filled' : ''}"></iconify-icon>
                    `).join('')}
                  </div>
                  <blockquote class="testimonial-text" data-translate="${testimonial.text}">
                    ${testimonial.text.includes('.') ? '' : testimonial.text}
                  </blockquote>
                  <div class="testimonial-author">
                    <div class="author-avatar">
                      <img src="${testimonial.avatar}" alt="${testimonial.name}" class="avatar-image" />
                    </div>
                    <div class="author-info">
                      <h4 class="author-name" data-translate="${testimonial.name}">
                        ${testimonial.name.includes('.') ? '' : testimonial.name}
                      </h4>
                      <p class="author-position" data-translate="${testimonial.position}">
                        ${testimonial.position.includes('.') ? '' : testimonial.position}
                      </p>
                      <p class="author-location" data-translate="${testimonial.location}">
                        ${testimonial.location.includes('.') ? '' : testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Carousel Controls -->
        <div class="testimonials-controls">
          <button class="testimonial-nav testimonial-prev" data-testimonial-prev>
            <iconify-icon icon="heroicons:chevron-left"></iconify-icon>
          </button>
          <button class="testimonial-nav testimonial-next" data-testimonial-next>
            <iconify-icon icon="heroicons:chevron-right"></iconify-icon>
          </button>
        </div>
        
        <!-- Carousel Indicators -->
        <div class="testimonials-indicators">
          ${this.testimonials.map((_, index) => `
            <button class="testimonial-indicator ${index === 0 ? 'active' : ''}" 
                    data-testimonial-to="${index}"></button>
          `).join('')}
        </div>
        
        <!-- Progress Bar -->
        <div class="testimonials-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    `;

    // Replace grid with carousel
    testimonialsGrid.outerHTML = carouselHTML;
  }

  setupEventListeners() {
    const prevBtn = DOMUtils.select('[data-testimonial-prev]');
    const nextBtn = DOMUtils.select('[data-testimonial-next]');
    const indicators = DOMUtils.selectAll('[data-testimonial-to]');
    const carousel = DOMUtils.select('.testimonials-carousel');

    // Navigation buttons
    if (prevBtn) {
      DOMUtils.addEventListener(prevBtn, 'click', () => this.previousTestimonial());
    }
    
    if (nextBtn) {
      DOMUtils.addEventListener(nextBtn, 'click', () => this.nextTestimonial());
    }

    // Indicators
    indicators.forEach(indicator => {
      DOMUtils.addEventListener(indicator, 'click', () => {
        const slideIndex = parseInt(indicator.dataset.testimonialTo);
        this.goToTestimonial(slideIndex);
      });
    });

    // Pause on hover
    if (carousel) {
      DOMUtils.addEventListener(carousel, 'mouseenter', () => this.pauseAutoSlide());
      DOMUtils.addEventListener(carousel, 'mouseleave', () => this.resumeAutoSlide());
    }

    // Touch/Swipe support
    this.setupTouchSupport();
  }

  setupTouchSupport() {
    const track = DOMUtils.select('.testimonials-track');
    if (!track) return;

    let startX = 0;
    let isDragging = false;

    DOMUtils.addEventListener(track, 'touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.pauseAutoSlide();
    });

    DOMUtils.addEventListener(track, 'touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    DOMUtils.addEventListener(track, 'touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const deltaX = startX - endX;
      
      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
        if (deltaX > 0) {
          this.nextTestimonial();
        } else {
          this.previousTestimonial();
        }
      }
      
      isDragging = false;
      this.resumeAutoSlide();
    });
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateCarousel();
  }

  previousTestimonial() {
    this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
    this.updateCarousel();
  }

  goToTestimonial(index) {
    if (index >= 0 && index < this.testimonials.length) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    const slides = DOMUtils.selectAll('.testimonial-slide');
    const indicators = DOMUtils.selectAll('.testimonial-indicator');
    const progressBar = DOMUtils.select('.progress-bar');

    // Update slides
    slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update progress bar
    if (progressBar) {
      const progress = ((this.currentIndex + 1) / this.testimonials.length) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Update translations if available
    if (window.App && window.App.languageManager) {
      window.App.languageManager.updateTranslations();
    }
  }

  startAutoSlide() {
    if (this.testimonials.length <= 1) return;
    
    this.interval = setInterval(() => {
      if (this.isPlaying) {
        this.nextTestimonial();
      }
    }, this.autoSlideDelay);
  }

  stopAutoSlide() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  pauseAutoSlide() {
    this.isPlaying = false;
  }

  resumeAutoSlide() {
    this.isPlaying = true;
  }

  destroy() {
    this.stopAutoSlide();
  }
}

export default TestimonialsCarousel;
