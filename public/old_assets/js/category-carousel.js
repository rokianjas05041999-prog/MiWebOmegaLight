// Category Carousel Handler
class CategoryCarousel {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            sliderId: 'category-slider',
            autoPlay: false,
            autoPlaySpeed: 5000,
            slidesToShow: 4,
            slidesToScroll: 1,
            gap: 24, // Gap between slides in pixels
            breakpoints: {
                1024: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                },
                768: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                },
                640: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            ...options
        };
        
        // Initialize properties
        this.currentIndex = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.slider = null;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;
        this.autoPlayInterval = null;
        
        // Initialize carousel
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.slider = document.getElementById(this.config.sliderId);
        if (!this.slider) return;
        
        this.sliderWrapper = this.slider.closest('.overflow-hidden');
        this.container = this.slider.closest('.relative');
        this.prevButton = this.container.querySelector('button:first-of-type');
        this.nextButton = this.container.querySelector('button:last-of-type');
        
        // Setup carousel structure
        this.setupCarousel();
        
        // Add event listeners
        this.addEventListeners();
        
        // Handle responsive
        this.handleResponsive();
        
        // Start autoplay if enabled
        if (this.config.autoPlay) {
            this.startAutoPlay();
        }
        
        // Initialize position
        this.updateSliderPosition();
    }
    
    setupCarousel() {
        // Get all category cards
        const gridContainer = this.slider.querySelector('.grid');
        const cards = Array.from(gridContainer.children);
        
        // Store original cards
        this.slides = cards;
        this.totalSlides = cards.length;
        
        // Remove grid classes and convert to flex
        gridContainer.className = 'flex';
        
        // Wrap each card in a slide container
        cards.forEach((card, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'carousel-slide flex-shrink-0';
            slideWrapper.style.width = `calc((100% - ${this.config.gap * (this.getCurrentSlidesToShow() - 1)}px) / ${this.getCurrentSlidesToShow()})`;
            slideWrapper.style.marginRight = index < cards.length - 1 ? `${this.config.gap}px` : '0';
            
            // Clone the card and append to wrapper
            const cardClone = card.cloneNode(true);
            slideWrapper.appendChild(cardClone);
            
            // Replace original card with wrapper
            card.parentNode.replaceChild(slideWrapper, card);
        });
        
        // Update slider styles
        this.slider.style.cursor = 'grab';
        
        // Calculate max index
        this.calculateMaxIndex();
    }
    
    getCurrentSlidesToShow() {
        const width = window.innerWidth;
        const breakpoints = Object.keys(this.config.breakpoints)
            .map(Number)
            .sort((a, b) => b - a);
        
        for (const breakpoint of breakpoints) {
            if (width <= breakpoint) {
                return this.config.breakpoints[breakpoint].slidesToShow;
            }
        }
        
        return this.config.slidesToShow;
    }
    
    calculateMaxIndex() {
        const slidesToShow = this.getCurrentSlidesToShow();
        this.maxIndex = Math.max(0, this.totalSlides - slidesToShow);
    }
    
    addEventListeners() {
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prev());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        
        // Touch events
        this.slider.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
        this.slider.addEventListener('touchmove', this.touchMove.bind(this), { passive: true });
        this.slider.addEventListener('touchend', this.touchEnd.bind(this));
        
        // Mouse events
        this.slider.addEventListener('mousedown', this.dragStart.bind(this));
        this.slider.addEventListener('mousemove', this.dragMove.bind(this));
        this.slider.addEventListener('mouseup', this.dragEnd.bind(this));
        this.slider.addEventListener('mouseleave', this.dragEnd.bind(this));
        
        // Prevent click on drag
        this.slider.addEventListener('click', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
        
        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsive();
        }, 300));
        
        // Pause autoplay on hover
        if (this.config.autoPlay) {
            this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    handleResponsive() {
        // Recalculate slides to show
        const slidesToShow = this.getCurrentSlidesToShow();
        
        // Update slide widths
        const slides = this.slider.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.style.width = `calc((100% - ${this.config.gap * (slidesToShow - 1)}px) / ${slidesToShow})`;
            slide.style.marginRight = index < slides.length - 1 ? `${this.config.gap}px` : '0';
        });
        
        // Recalculate max index
        this.calculateMaxIndex();
        
        // Adjust current index if needed
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
        
        // Update position
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const slidesToShow = this.getCurrentSlidesToShow();
        const slideWidth = (100 + this.config.gap * slidesToShow / slidesToShow) / slidesToShow;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.slider.style.transition = 'transform 0.5s ease-in-out';
        this.slider.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        this.updateButtonStates();
        
        // Update dots if exists
        this.updateDots();
    }
    
    updateButtonStates() {
        // Previous button
        if (this.prevButton) {
            if (this.currentIndex === 0) {
                this.prevButton.classList.add('opacity-50', 'cursor-not-allowed');
                this.prevButton.disabled = true;
            } else {
                this.prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
                this.prevButton.disabled = false;
            }
        }
        
        // Next button
        if (this.nextButton) {
            if (this.currentIndex >= this.maxIndex) {
                this.nextButton.classList.add('opacity-50', 'cursor-not-allowed');
                this.nextButton.disabled = true;
            } else {
                this.nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
                this.nextButton.disabled = false;
            }
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSliderPosition();
        } else if (this.config.autoPlay) {
            // Loop to start
            this.currentIndex = 0;
            this.updateSliderPosition();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSliderPosition();
        }
    }
    
    // Touch and drag handlers
    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    touchStart(event) {
        this.dragStart(event);
    }
    
    touchMove(event) {
        this.dragMove(event);
    }
    
    touchEnd() {
        this.dragEnd();
    }
    
    dragStart(event) {
        this.isDragging = true;
        this.startPos = this.getPositionX(event);
        this.slider.style.cursor = 'grabbing';
        this.slider.style.transition = 'none';
        
        // Store current transform
        const transform = window.getComputedStyle(this.slider).transform;
        if (transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            this.prevTranslate = parseFloat(matrix[4]);
        }
    }
    
    dragMove(event) {
        if (!this.isDragging) return;
        
        event.preventDefault();
        const currentPosition = this.getPositionX(event);
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;
        
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    dragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.slider.style.cursor = 'grab';
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        const threshold = 100;
        
        if (movedBy < -threshold && this.currentIndex < this.maxIndex) {
            this.next();
        } else if (movedBy > threshold && this.currentIndex > 0) {
            this.prev();
        } else {
            this.updateSliderPosition();
        }
    }
    
    // Autoplay methods
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.config.autoPlaySpeed);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Dots navigation (optional)
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'flex justify-center mt-6 space-x-2';
        
        const numDots = this.maxIndex + 1;
        
        for (let i = 0; i <= numDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'w-2 h-2 rounded-full bg-gray-300 hover:bg-neutral-500 transition-colors duration-300';
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.updateSliderPosition();
            });
            dotsContainer.appendChild(dot);
        }
        
        this.container.parentElement.appendChild(dotsContainer);
        this.dotsContainer = dotsContainer;
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-orange-600');
            } else {
                dot.classList.remove('bg-orange-600');
                dot.classList.add('bg-gray-300');
            }
        });
    }
    
    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public methods
    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateSliderPosition();
        }
    }
    
    destroy() {
        // Remove event listeners and cleanup
        this.stopAutoPlay();
        // Reset styles
        this.slider.style = '';
        // Remove dots if created
        if (this.dotsContainer) {
            this.dotsContainer.remove();
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with custom options
    const carousel = new CategoryCarousel({
        autoPlay: true,
        autoPlaySpeed: 4000,
        slidesToShow: 4,
        slidesToScroll: 1
    });
    
    // Optional: Add dots navigation
    carousel.createDots();
});
