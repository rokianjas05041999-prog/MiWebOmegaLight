# MiWeb OmegaLight - Developer Guide

## 🎯 Quick Start Guide

### Memulai dalam 5 Menit

#### 1. Setup Project
```bash
# Clone template
git clone https://github.com/your-org/MiWebOmegaLight.git my-new-project
cd my-new-project

# Install dependencies
npm install

# Start development
npm run dev
```

#### 2. Struktur Dasar Template
```
📂 Template Structure
├── 📄 HTML Pages (index.html, archive-*.html, detail-*.html)
├── 📁 src/components/ (HTML components)
├── 📁 src/scripts/ (JavaScript modules)
├── 📁 src/styles/ (CSS styling)
└── 📁 src/locales/ (Translations)
```

#### 3. Core Concept: Component-Based Architecture

**Template ini menggunakan 3-layer architecture:**

1. **HTML Components** - Static markup
2. **Interactive Components** - JavaScript functionality  
3. **CSS Components** - Styling

**Contoh praktis:**

```html
<!-- 1. HTML Page -->
<div data-section="hero"></div>
```

```html
<!-- 2. HTML Component: src/components/sections/hero.html -->
<section class="hero-section">
  <h1 data-translate="hero.title">Welcome</h1>
</section>
```

```javascript
// 3. Interactive Component: src/scripts/components/Hero.js
export class Hero {
  init() {
    console.log('Hero initialized');
  }
}
```

```css
/* 4. CSS Component: src/styles/components/hero.css */
.hero-section {
  @apply py-16 bg-gradient-to-r from-blue-600 to-purple-600;
}
```

---

## 🧩 Component Development Patterns

### Pattern 1: Static Component (Simple)

**Use case:** Komponen yang hanya menampilkan konten tanpa interaksi

#### Step 1: Buat HTML
```html
<!-- src/components/sections/testimonials.html -->
<section class="testimonials-section">
  <div class="container">
    <h2 data-translate="testimonials.title">What Our Clients Say</h2>
    
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <p data-translate="testimonials.items.0.text">"Excellent service!"</p>
        <cite data-translate="testimonials.items.0.author">John Doe</cite>
      </div>
    </div>
  </div>
</section>
```

#### Step 2: Buat CSS
```css
/* src/styles/components/testimonials.css */
.testimonials-section {
  @apply py-16 bg-gray-50;
}

.testimonials-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.testimonial-card {
  @apply bg-white p-6 rounded-lg shadow-md;
}
```

#### Step 3: Register Component
```javascript
// src/scripts/configs/components.config.js
export const SECTION_COMPONENTS = {
  // ... existing components
  'testimonials': 'testimonials'
};
```

#### Step 4: Import CSS
```css
/* src/styles/main.css */
@import './components/testimonials.css';
```

#### Step 5: Use in Page
```html
<!-- index.html -->
<div data-section="testimonials"></div>
```

### Pattern 2: Interactive Component (Advanced)

**Use case:** Komponen dengan JavaScript functionality

#### Complete Example: Image Gallery

**HTML Component:**
```html
<!-- src/components/sections/gallery.html -->
<section class="gallery-section">
  <div class="container">
    <h2 data-translate="gallery.title">Project Gallery</h2>
    
    <div class="gallery-filters">
      <button class="gallery-filter active" data-filter="all">All</button>
      <button class="gallery-filter" data-filter="residential">Residential</button>
      <button class="gallery-filter" data-filter="commercial">Commercial</button>
    </div>
    
    <div class="gallery-grid">
      <div class="gallery-item" data-category="residential">
        <img src="/images/project-1.jpg" alt="Project 1" loading="lazy">
        <div class="gallery-overlay">
          <button class="gallery-zoom" data-index="0">
            <iconify-icon icon="heroicons:magnifying-glass-plus"></iconify-icon>
          </button>
        </div>
      </div>
      <!-- More gallery items -->
    </div>
    
    <!-- Lightbox Modal -->
    <div class="gallery-lightbox">
      <button class="lightbox-close">
        <iconify-icon icon="heroicons:x-mark"></iconify-icon>
      </button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
      </div>
      <div class="lightbox-nav">
        <button class="lightbox-prev">
          <iconify-icon icon="heroicons:chevron-left"></iconify-icon>
        </button>
        <button class="lightbox-next">
          <iconify-icon icon="heroicons:chevron-right"></iconify-icon>
        </button>
      </div>
    </div>
  </div>
</section>
```

**CSS Component:**
```css
/* src/styles/components/gallery.css */
.gallery-section {
  @apply py-16;
}

.gallery-filters {
  @apply flex flex-wrap gap-4 justify-center mb-8;
}

.gallery-filter {
  @apply px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50;
  @apply transition-colors duration-200;
}

.gallery-filter.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.gallery-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.gallery-item {
  @apply relative overflow-hidden rounded-lg cursor-pointer;
  @apply transition-transform duration-300 hover:scale-105;
}

.gallery-item img {
  @apply w-full h-64 object-cover;
}

.gallery-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 opacity-0;
  @apply flex items-center justify-center transition-opacity duration-300;
  @apply hover:opacity-100;
}

.gallery-zoom {
  @apply text-white text-2xl p-2 rounded-full bg-white bg-opacity-20;
  @apply hover:bg-opacity-30 transition-all duration-200;
}

/* Lightbox Styles */
.gallery-lightbox {
  @apply fixed inset-0 bg-black bg-opacity-90 z-50 opacity-0 invisible;
  @apply flex items-center justify-center transition-all duration-300;
}

.gallery-lightbox.active {
  @apply opacity-100 visible;
}

.lightbox-content {
  @apply max-w-4xl max-h-full p-4;
}

.lightbox-image {
  @apply max-w-full max-h-full object-contain;
}

.lightbox-close {
  @apply absolute top-4 right-4 text-white text-3xl;
  @apply hover:text-gray-300 transition-colors duration-200;
}

.lightbox-nav {
  @apply absolute inset-y-0 flex items-center justify-between w-full px-4;
}

.lightbox-prev,
.lightbox-next {
  @apply text-white text-3xl p-2 rounded-full bg-white bg-opacity-20;
  @apply hover:bg-opacity-30 transition-all duration-200;
}
```

**Interactive Component:**
```javascript
// src/scripts/components/Gallery.js
export class Gallery {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.currentIndex = 0;
    this.images = [];
    this.currentFilter = 'all';
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleLightboxNav = this.handleLightboxNav.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * Initialize gallery component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupImages();
      this.initialized = true;
      
      console.log('✅ Gallery component initialized');
    } catch (error) {
      console.error('❌ Gallery initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.gallery-section'),
      filters: document.querySelectorAll('.gallery-filter'),
      grid: document.querySelector('.gallery-grid'),
      items: document.querySelectorAll('.gallery-item'),
      zoomButtons: document.querySelectorAll('.gallery-zoom'),
      lightbox: document.querySelector('.gallery-lightbox'),
      lightboxImage: document.querySelector('.lightbox-image'),
      lightboxClose: document.querySelector('.lightbox-close'),
      lightboxPrev: document.querySelector('.lightbox-prev'),
      lightboxNext: document.querySelector('.lightbox-next')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Gallery section not found');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter buttons
    this.elements.filters.forEach(filter => {
      filter.addEventListener('click', this.handleFilterClick);
    });

    // Zoom buttons
    this.elements.zoomButtons.forEach(button => {
      button.addEventListener('click', this.handleImageClick);
    });

    // Lightbox controls
    if (this.elements.lightboxClose) {
      this.elements.lightboxClose.addEventListener('click', this.closeLightbox.bind(this));
    }

    if (this.elements.lightboxPrev) {
      this.elements.lightboxPrev.addEventListener('click', () => this.handleLightboxNav('prev'));
    }

    if (this.elements.lightboxNext) {
      this.elements.lightboxNext.addEventListener('click', () => this.handleLightboxNav('next'));
    }

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyPress);

    // Click outside to close lightbox
    this.elements.lightbox.addEventListener('click', (e) => {
      if (e.target === this.elements.lightbox) {
        this.closeLightbox();
      }
    });
  }

  /**
   * Setup images array
   */
  setupImages() {
    this.images = Array.from(this.elements.items).map(item => {
      const img = item.querySelector('img');
      return {
        src: img.src,
        alt: img.alt,
        category: item.dataset.category || 'all'
      };
    });
  }

  /**
   * Handle filter button click
   */
  handleFilterClick(e) {
    const filter = e.target;
    const filterValue = filter.dataset.filter;
    
    // Update active filter
    this.elements.filters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    
    this.currentFilter = filterValue;
    this.filterImages();
    
    // Track event
    this.trackFilter(filterValue);
  }

  /**
   * Filter gallery images
   */
  filterImages() {
    this.elements.items.forEach(item => {
      const category = item.dataset.category || 'all';
      const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
      
      if (shouldShow) {
        item.style.display = 'block';
        item.classList.add('fade-in');
      } else {
        item.style.display = 'none';
        item.classList.remove('fade-in');
      }
    });
  }

  /**
   * Handle image click to open lightbox
   */
  handleImageClick(e) {
    e.preventDefault();
    const index = parseInt(e.target.closest('.gallery-zoom').dataset.index);
    this.openLightbox(index);
  }

  /**
   * Open lightbox with specific image
   */
  openLightbox(index) {
    this.currentIndex = index;
    const image = this.images[index];
    
    if (!image) return;
    
    this.elements.lightboxImage.src = image.src;
    this.elements.lightboxImage.alt = image.alt;
    this.elements.lightbox.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Track event
    this.trackLightboxOpen(index);
  }

  /**
   * Close lightbox
   */
  closeLightbox() {
    this.elements.lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Track event
    this.trackLightboxClose();
  }

  /**
   * Handle lightbox navigation
   */
  handleLightboxNav(direction) {
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
    
    this.openLightbox(this.currentIndex);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyPress(e) {
    if (!this.elements.lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.handleLightboxNav('next');
        break;
      case 'ArrowLeft':
        this.handleLightboxNav('prev');
        break;
    }
  }

  /**
   * Track filter usage
   */
  trackFilter(filter) {
    console.log(`Gallery filtered by: ${filter}`);
    // Add analytics tracking here
  }

  /**
   * Track lightbox open
   */
  trackLightboxOpen(index) {
    console.log(`Lightbox opened for image: ${index}`);
    // Add analytics tracking here
  }

  /**
   * Track lightbox close
   */
  trackLightboxClose() {
    console.log('Lightbox closed');
    // Add analytics tracking here
  }

  /**
   * Destroy component and cleanup
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyPress);
    
    this.elements.filters.forEach(filter => {
      filter.removeEventListener('click', this.handleFilterClick);
    });
    
    this.initialized = false;
    console.log('Gallery component destroyed');
  }
}
```

**Register Component:**
```javascript
// src/scripts/configs/components.config.js
export const SECTION_COMPONENTS = {
  // ... existing components
  'gallery': 'gallery'
};

// src/scripts/core/App.js - Add to interactive components
import { Gallery } from '../components/Gallery.js';

const componentInitializers = [
  // ... other components
  { name: 'gallery', class: Gallery, critical: false }
];
```

---

## 🎨 Styling Patterns

### Pattern 1: Component-Scoped Styles

```css
/* src/styles/components/pricing.css */

/* Main component container */
.pricing-section {
  @apply py-16 bg-gray-50;
}

/* Section header */
.pricing-header {
  @apply text-center mb-12;
}

.pricing-title {
  @apply text-3xl font-bold text-gray-900 mb-4;
}

.pricing-description {
  @apply text-lg text-gray-600 max-w-2xl mx-auto;
}

/* Pricing grid */
.pricing-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

/* Pricing card */
.pricing-card {
  @apply bg-white rounded-lg shadow-lg overflow-hidden;
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.pricing-card.featured {
  @apply ring-2 ring-blue-500 relative;
}

.pricing-card-badge {
  @apply absolute -top-3 left-1/2 transform -translate-x-1/2;
  @apply bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium;
}

.pricing-card-header {
  @apply p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50;
}

.pricing-card-name {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.pricing-card-price {
  @apply text-3xl font-bold text-blue-600;
}

.pricing-card-period {
  @apply text-gray-600 text-sm;
}

.pricing-card-body {
  @apply p-6;
}

.pricing-features {
  @apply space-y-3 mb-6;
}

.pricing-feature {
  @apply flex items-start;
}

.pricing-feature-icon {
  @apply text-green-500 mr-3 mt-0.5 flex-shrink-0;
}

.pricing-feature-text {
  @apply text-gray-600;
}

.pricing-card-footer {
  @apply p-6 pt-0;
}

.pricing-cta {
  @apply w-full bg-blue-600 text-white py-3 rounded-lg font-medium;
  @apply hover:bg-blue-700 transition-colors duration-200;
}

.pricing-card.featured .pricing-cta {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600;
  @apply hover:from-blue-700 hover:to-indigo-700;
}
```

### Pattern 2: Responsive Design

```css
/* Mobile first approach */
.hero-section {
  /* Mobile styles (default) */
  @apply py-12 px-4;
}

.hero-content {
  @apply text-center;
}

.hero-title {
  @apply text-2xl font-bold mb-4;
}

.hero-description {
  @apply text-base mb-6;
}

.hero-actions {
  @apply flex flex-col gap-4;
}

/* Tablet styles */
@media (min-width: 768px) {
  .hero-section {
    @apply py-16 px-6;
  }
  
  .hero-title {
    @apply text-3xl mb-6;
  }
  
  .hero-description {
    @apply text-lg mb-8;
  }
  
  .hero-actions {
    @apply flex-row justify-center;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .hero-section {
    @apply py-20 px-8;
  }
  
  .hero-content {
    @apply max-w-4xl mx-auto;
  }
  
  .hero-title {
    @apply text-4xl lg:text-5xl mb-8;
  }
  
  .hero-description {
    @apply text-xl mb-10 max-w-3xl mx-auto;
  }
}
```

### Pattern 3: Theme Support

```css
/* Use CSS custom properties for theme-aware colors */
.card {
  background: rgb(var(--color-background));
  color: rgb(var(--color-text));
  border: 1px solid rgb(var(--color-border));
}

.card-header {
  background: rgb(var(--color-background-secondary));
  border-bottom: 1px solid rgb(var(--color-border));
}

.button-primary {
  background: rgb(var(--color-primary));
  color: rgb(var(--color-primary-text));
}

.button-primary:hover {
  background: rgb(var(--color-primary-dark));
}

/* Theme-specific overrides when needed */
[data-theme="dark"] .card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

[data-theme="light"] .card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## 🌍 Internationalization (i18n)

### Translation File Structure

```json
// src/locales/en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": {
      "title": "Services",
      "installation": "Installation",
      "maintenance": "Maintenance",
      "repair": "Repair"
    }
  },
  "hero": {
    "badge": "Trusted Since 1995",
    "title": "Professional Electrical Solutions",
    "description": "Complete electrical services for residential and commercial needs",
    "cta": {
      "primary": "Get Started",
      "secondary": "Learn More"
    }
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try Again",
    "close": "Close",
    "next": "Next",
    "previous": "Previous"
  }
}
```

### Dynamic Translation Usage

```javascript
// src/scripts/components/ContactForm.js
export class ContactForm {
  constructor() {
    this.languageManager = null;
  }

  async init() {
    // Get language manager
    this.languageManager = window.TechCorpApp.getManager('languageManager');
    
    this.cacheElements();
    this.bindEvents();
    this.updateMessages();
  }

  updateMessages() {
    // Update validation messages
    this.validationMessages = {
      required: this.translate('validation.required', 'This field is required'),
      email: this.translate('validation.email', 'Please enter a valid email'),
      phone: this.translate('validation.phone', 'Please enter a valid phone number')
    };
    
    // Update success/error messages
    this.statusMessages = {
      sending: this.translate('contact.sending', 'Sending message...'),
      success: this.translate('contact.success', 'Message sent successfully!'),
      error: this.translate('contact.error', 'Failed to send message. Please try again.')
    };
  }

  translate(key, fallback = '') {
    return this.languageManager ? this.languageManager.translate(key) : fallback;
  }

  showMessage(type, messageKey) {
    const message = this.statusMessages[messageKey] || messageKey;
    // Show message to user
    this.displayNotification(message, type);
  }

  // Listen for language changes
  setupLanguageListener() {
    window.addEventListener('languageChanged', () => {
      this.updateMessages();
      this.updateUIText();
    });
  }
}
```

### Pluralization Support

```json
// Advanced translation with pluralization
{
  "products": {
    "count": {
      "zero": "No products found",
      "one": "1 product found", 
      "other": "{{count}} products found"
    },
    "cart": {
      "items": {
        "zero": "Your cart is empty",
        "one": "1 item in cart",
        "other": "{{count}} items in cart"
      }
    }
  }
}
```

```javascript
// Usage with pluralization
function updateProductCount(count) {
  const key = count === 0 ? 'zero' : (count === 1 ? 'one' : 'other');
  const message = this.translate(`products.count.${key}`, '{{count}} products')
    .replace('{{count}}', count);
  
  document.querySelector('.product-count').textContent = message;
}
```

---

## 📱 Mobile-First Development

### Responsive Breakpoints

```css
/* Template breakpoints */
/* xs: 0px - 639px (mobile) */
/* sm: 640px - 767px (large mobile) */
/* md: 768px - 1023px (tablet) */
/* lg: 1024px - 1279px (desktop) */
/* xl: 1280px+ (large desktop) */

/* Mobile-first approach */
.navigation {
  /* Mobile styles (default) */
  @apply fixed inset-x-0 top-0 bg-white shadow-lg z-50;
  @apply transform -translate-y-full transition-transform duration-300;
}

.navigation.open {
  @apply translate-y-0;
}

.navigation-menu {
  @apply flex flex-col p-4 space-y-4;
}

.navigation-item {
  @apply block py-2 px-4 hover:bg-gray-100 rounded;
}

/* Tablet and up */
@media (min-width: 768px) {
  .navigation {
    @apply static transform-none shadow-none;
    @apply bg-transparent;
  }
  
  .navigation-menu {
    @apply flex-row space-y-0 space-x-6 p-0;
  }
  
  .navigation-item {
    @apply py-1 px-2 hover:bg-transparent hover:text-blue-600;
  }
}
```

### Touch-Friendly Interactions

```javascript
// src/scripts/components/TouchGallery.js
export class TouchGallery {
  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    // Touch start
    this.elements.gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    // Touch move
    this.elements.gallery.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;

      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;

      const deltaX = startX - currentX;
      const deltaY = startY - currentY;

      // Horizontal swipe detection
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 50) { // Minimum swipe distance
          if (deltaX > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
          
          // Reset
          startX = 0;
          startY = 0;
        }
      }
    }, { passive: true });

    // Touch end
    this.elements.gallery.addEventListener('touchend', () => {
      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  // Ensure touch targets are at least 44px x 44px
  setupTouchTargets() {
    const buttons = this.elements.gallery.querySelectorAll('button');
    buttons.forEach(button => {
      if (button.offsetWidth < 44 || button.offsetHeight < 44) {
        button.style.minWidth = '44px';
        button.style.minHeight = '44px';
      }
    });
  }
}
```

---

## 🔧 Advanced Patterns

### State Management Pattern

```javascript
// src/scripts/utils/StateManager.js
export class StateManager {
  constructor() {
    this.state = {};
    this.subscribers = {};
  }

  /**
   * Set state value and notify subscribers
   */
  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    if (this.subscribers[key]) {
      this.subscribers[key].forEach(callback => {
        callback(value, oldValue);
      });
    }
  }

  /**
   * Get state value
   */
  getState(key) {
    return this.state[key];
  }

  /**
   * Subscribe to state changes
   */
  subscribe(key, callback) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    this.subscribers[key].push(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers[key] = this.subscribers[key].filter(cb => cb !== callback);
    };
  }
}

// Usage in components
export class ProductFilter {
  constructor() {
    this.stateManager = new StateManager();
    this.setupState();
  }

  setupState() {
    // Initialize state
    this.stateManager.setState('filters', {
      category: 'all',
      priceRange: [0, 1000],
      inStock: true
    });

    // Subscribe to filter changes
    this.stateManager.subscribe('filters', (newFilters) => {
      this.applyFilters(newFilters);
    });
  }

  updateFilter(key, value) {
    const currentFilters = this.stateManager.getState('filters');
    this.stateManager.setState('filters', {
      ...currentFilters,
      [key]: value
    });
  }
}
```

### Event Bus Pattern

```javascript
// src/scripts/utils/EventBus.js
export class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to event
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit event
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  /**
   * Subscribe once
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
  }
}

// Create global event bus
export const eventBus = new EventBus();

// Usage in components
import { eventBus } from '../utils/EventBus.js';

export class Cart {
  addItem(item) {
    // Add item to cart
    this.items.push(item);
    
    // Emit event
    eventBus.emit('cart:itemAdded', { item, total: this.items.length });
  }
}

export class CartCounter {
  init() {
    // Listen for cart changes
    eventBus.on('cart:itemAdded', (data) => {
      this.updateCounter(data.total);
    });
  }
}
```

### Async Data Loading Pattern

```javascript
// src/scripts/services/DataService.js
export class DataService {
  constructor() {
    this.cache = new Map();
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  /**
   * Generic GET request with caching
   */
  async get(endpoint, options = {}) {
    const { cache = true, transform } = options;
    const cacheKey = `GET:${endpoint}`;

    // Return cached data if available
    if (cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();
      
      // Apply data transformation if provided
      if (transform && typeof transform === 'function') {
        data = transform(data);
      }

      // Cache successful responses
      if (cache) {
        this.cache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error(`DataService GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Get products with caching and transformation
   */
  async getProducts(category = null) {
    const endpoint = category ? `/products?category=${category}` : '/products';
    
    return this.get(endpoint, {
      cache: true,
      transform: (data) => {
        // Transform API response to match frontend needs
        return data.products?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          inStock: product.stock > 0,
          category: product.category_name
        })) || [];
      }
    });
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Clear specific cache entries
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage in components
export class ProductListing {
  constructor() {
    this.dataService = new DataService();
    this.products = [];
    this.loading = false;
  }

  async loadProducts(category = null) {
    this.setLoading(true);
    
    try {
      this.products = await this.dataService.getProducts(category);
      this.renderProducts();
    } catch (error) {
      this.showError('Failed to load products. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.loading = loading;
    this.updateLoadingState();
  }

  showError(message) {
    // Show error notification
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
  }
}
```

---

## 🎯 Performance Optimization

### Lazy Loading Implementation

```javascript
// src/scripts/utils/LazyLoader.js
export class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.01,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }

  /**
   * Handle intersection observer callback
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Load lazy element
   */
  async loadElement(element) {
    const type = element.dataset.lazyType;
    
    switch (type) {
      case 'image':
        this.loadImage(element);
        break;
      case 'component':
        await this.loadComponent(element);
        break;
      case 'iframe':
        this.loadIframe(element);
        break;
    }
  }

  /**
   * Load lazy image
   */
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Create new image to preload
    const imageLoader = new Image();
    imageLoader.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    imageLoader.src = src;
  }

  /**
   * Load lazy component
   */
  async loadComponent(element) {
    const componentName = element.dataset.component;
    if (!componentName) return;

    try {
      // Show loading placeholder
      element.innerHTML = '<div class="loading-spinner">Loading...</div>';
      
      // Dynamically import component
      const module = await import(`../components/${componentName}.js`);
      const ComponentClass = module[componentName] || module.default;
      
      if (ComponentClass) {
        const component = new ComponentClass();
        await component.init(element);
        
        element.classList.add('loaded');
      }
    } catch (error) {
      console.error(`Failed to load lazy component ${componentName}:`, error);
      element.innerHTML = '<div class="error-message">Failed to load component</div>';
    }
  }

  /**
   * Load lazy iframe
   */
  loadIframe(iframe) {
    const src = iframe.dataset.src;
    if (!src) return;

    iframe.src = src;
    iframe.classList.add('loaded');
    iframe.removeAttribute('data-src');
  }

  /**
   * Observe elements for lazy loading
   */
  observe(elements) {
    if (NodeList.prototype.isPrototypeOf(elements)) {
      elements.forEach(el => this.observer.observe(el));
    } else if (Array.isArray(elements)) {
      elements.forEach(el => this.observer.observe(el));
    } else {
      this.observer.observe(elements);
    }
  }

  /**
   * Disconnect observer
   */
  disconnect() {
    this.observer.disconnect();
  }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', () => {
  const lazyLoader = new LazyLoader();
  
  // Lazy load images
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => img.dataset.lazyType = 'image');
  lazyLoader.observe(lazyImages);
  
  // Lazy load components
  const lazyComponents = document.querySelectorAll('[data-lazy-component]');
  lazyComponents.forEach(el => {
    el.dataset.lazyType = 'component';
    el.dataset.component = el.dataset.lazyComponent;
  });
  lazyLoader.observe(lazyComponents);
});
```

### Bundle Splitting

```javascript
// src/scripts/utils/DynamicImports.js
export class DynamicImports {
  constructor() {
    this.loadedModules = new Set();
  }

  /**
   * Load module only when needed
   */
  async loadModule(moduleName, condition = () => true) {
    if (this.loadedModules.has(moduleName) || !condition()) {
      return null;
    }

    try {
      let module;
      
      switch (moduleName) {
        case 'charts':
          module = await import('../components/Charts.js');
          break;
        case 'datePicker':
          module = await import('../components/DatePicker.js');
          break;
        case 'richEditor':
          module = await import('../components/RichEditor.js');
          break;
        case 'videoPlayer':
          module = await import('../components/VideoPlayer.js');
          break;
        default:
          throw new Error(`Unknown module: ${moduleName}`);
      }

      this.loadedModules.add(moduleName);
      return module;
    } catch (error) {
      console.error(`Failed to load module ${moduleName}:`, error);
      return null;
    }
  }

  /**
   * Load component on user interaction
   */
  async loadOnInteraction(trigger, moduleName) {
    const element = typeof trigger === 'string' 
      ? document.querySelector(trigger)
      : trigger;

    if (!element) return;

    const loadModule = async () => {
      const module = await this.loadModule(moduleName);
      if (module) {
        const Component = module.default || module[moduleName];
        const instance = new Component();
        await instance.init(element);
        
        // Remove event listeners after loading
        element.removeEventListener('click', loadModule);
        element.removeEventListener('focus', loadModule);
        element.removeEventListener('mouseenter', loadModule);
      }
    };

    // Load on multiple interactions
    element.addEventListener('click', loadModule, { once: true });
    element.addEventListener('focus', loadModule, { once: true });
    element.addEventListener('mouseenter', loadModule, { once: true });
  }
}

// Usage examples
const dynamicImports = new DynamicImports();

// Load charts only on dashboard page
if (document.querySelector('.dashboard')) {
  dynamicImports.loadModule('charts');
}

// Load rich editor only when form is interacted with
dynamicImports.loadOnInteraction('.rich-editor-trigger', 'richEditor');

// Load video player only when play button is clicked
dynamicImports.loadOnInteraction('.video-play-btn', 'videoPlayer');
```

---

## 📚 Component Reference

### Built-in Components

#### Navigation Component
- **File**: `src/scripts/components/Navigation.js`
- **Purpose**: Mobile-responsive navigation menu
- **Features**: Toggle menu, active states, accessibility

#### ContactForm Component
- **File**: `src/scripts/components/ContactForm.js`
- **Purpose**: Contact form with validation
- **Features**: Form validation, AJAX submission, internationalization

#### Gallery Component
- **File**: `src/scripts/components/Gallery.js`
- **Purpose**: Image gallery with lightbox
- **Features**: Filtering, lightbox modal, keyboard navigation

#### ProductQuickView Component
- **File**: `src/scripts/components/ProductQuickView.js`
- **Purpose**: Product preview modal
- **Features**: Modal display, image carousel, responsive

#### TestimonialsCarousel Component
- **File**: `src/scripts/components/TestimonialsCarousel.js`
- **Purpose**: Rotating testimonials display
- **Features**: Auto-rotation, navigation controls, touch support

### Archive Components

#### ArchiveProduct Component
- **File**: `src/scripts/components/ArchiveProduct.js`
- **Purpose**: Product listing with filters
- **Features**: Search, filtering, pagination, sorting

#### ArchiveArticle Component
- **File**: `src/scripts/components/ArchiveArticle.js`
- **Purpose**: Blog/article listing
- **Features**: Category filtering, search, pagination

#### ArchivePortfolio Component
- **File**: `src/scripts/components/ArchivePortfolio.js`
- **Purpose**: Portfolio project listing
- **Features**: Multi-level filtering, grid/list view, load more

### Detail Components

#### DetailProduct Component
- **File**: `src/scripts/components/DetailProduct.js`
- **Purpose**: Product detail page
- **Features**: Image gallery, specifications, related products

#### DetailArticle Component
- **File**: `src/scripts/components/DetailArticle.js`
- **Purpose**: Article/blog post detail
- **Features**: Reading time, social sharing, related articles

#### DetailPortfolio Component
- **File**: `src/scripts/components/DetailPortfolio.js`
- **Purpose**: Portfolio project detail
- **Features**: Project timeline, specifications, gallery

---

**Dokumentasi Developer Guide ini memberikan panduan praktis dan lengkap untuk pengembangan menggunakan template MiWeb OmegaLight. Ikuti pola-pola yang telah ditetapkan untuk memastikan konsistensi dan maintainability kode.**
