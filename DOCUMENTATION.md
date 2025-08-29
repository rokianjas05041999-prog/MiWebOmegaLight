# MiWeb OmegaLight - Dokumentasi Template Standar

## 📋 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Arsitektur Aplikasi](#arsitektur-aplikasi)
3. [Struktur Proyek](#struktur-proyek)
4. [Sistem Komponen](#sistem-komponen)
5. [Sistem Tema & Bahasa](#sistem-tema--bahasa)
6. [Panduan Pengembangan](#panduan-pengembangan)
7. [Standar Koding](#standar-koding)
8. [Deployment & Build](#deployment--build)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## 🎯 Pendahuluan

MiWeb OmegaLight adalah template standar untuk pengembangan website company profile yang menggunakan arsitektur modular dan sistem komponen yang scalable. Template ini dibangun dengan teknologi modern dan mengikuti best practices untuk maintainability dan performance.

### Fitur Utama

- ✅ **Arsitektur Modular** - Komponen terpisah dan reusable
- ✅ **Multi-bahasa** - Support bahasa Indonesia, English, dan Melayu
- ✅ **Multi-tema** - Dark/Light mode dengan custom themes
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **SEO Optimized** - Meta tags dan structured data
- ✅ **Performance Optimized** - Lazy loading dan code splitting
- ✅ **Accessibility** - WCAG 2.1 compliant
- ✅ **Modern Tech Stack** - Vite, TailwindCSS 4.1, ES6+ modules

### Target Penggunaan

Template ini cocok untuk:
- Company Profile / Corporate Website
- Business Portfolio
- Service-based businesses
- Electrical/Technical companies
- Multi-language websites

---

## 🏗️ Arsitektur Aplikasi

### Pola Arsitektur

Template menggunakan **Component-Based Architecture** dengan pola **MVC (Model-View-Controller)** yang dimodifikasi:

```
┌─────────────────────────────────────┐
│            Main Application         │
├─────────────────────────────────────┤
│  📦 Core Layer                      │
│  ├── App.js (Main Controller)       │
│  ├── Bootstrap.js (Initializer)     │
│  └── Dependencies.js (Utils)        │
├─────────────────────────────────────┤
│  🎛️ Managers Layer                  │
│  ├── ThemeManager                   │
│  ├── LanguageManager                │
│  └── ComponentLoader                │
├─────────────────────────────────────┤
│  🧩 Components Layer                │
│  ├── Layout Components              │
│  ├── Section Components             │
│  └── Interactive Components         │
├─────────────────────────────────────┤
│  🎨 Styles Layer                    │
│  ├── Base Styles                    │
│  ├── Component Styles               │
│  └── Utility Styles                 │
└─────────────────────────────────────┘
```

### Lifecycle Aplikasi

```javascript
1. Bootstrap → 2. Core Managers → 3. Load HTML → 4. Init Components → 5. Event Binding
```

#### 1. Bootstrap Phase
- Inisialisasi aplikasi utama
- Setup error handling global
- Persiapan environment

#### 2. Core Managers Phase
- **ThemeManager**: Mengelola tema dan dark/light mode
- **LanguageManager**: Mengelola multi-bahasa dan translations
- **ComponentLoader**: Mengelola loading komponen HTML

#### 3. Load HTML Phase
- Auto-detection komponen dari DOM
- Loading komponen berdasarkan `data-layout` dan `data-section`
- Injection HTML ke target elements

#### 4. Init Components Phase
- Inisialisasi komponen interaktif
- Binding event handlers
- Setup animations

#### 5. Event Binding Phase
- Global event listeners
- Performance monitoring
- Ready state notification

---

## 📂 Struktur Proyek

### Overview Struktur

```
MiWebOmegaLight/
├── 📄 index.html                    # Homepage
├── 📄 archive-*.html               # Archive pages
├── 📄 detail-*.html                # Detail pages
├── 📦 package.json                 # Dependencies & scripts
├── ⚙️ vite.config.js               # Build configuration
├── 📁 public/                      # Static assets
│   ├── css/                       # Legacy CSS (optional)
│   ├── js/                        # Third-party scripts
│   ├── images/                    # Images & icons
│   └── fonts/                     # Custom fonts
└── 📁 src/                        # Source code
    ├── 📁 components/             # HTML components
    ├── 📁 scripts/                # JavaScript modules
    ├── 📁 styles/                 # CSS & styling
    └── 📁 locales/                # Translation files
```

### Detail Struktur Source

```
src/
├── 📁 components/
│   ├── 📁 layouts/                # Layout components
│   │   ├── header.html
│   │   └── footer.html
│   └── 📁 sections/               # Section components
│       ├── hero.html
│       ├── about.html
│       ├── products.html
│       ├── archive-*.html
│       └── detail-*.html
├── 📁 scripts/
│   ├── 📁 core/                   # Core application files
│   │   ├── App.js                 # Main application class
│   │   ├── bootstrap.js           # Application initializer
│   │   └── dependencies.js        # Shared utilities
│   ├── 📁 managers/               # System managers
│   │   ├── ThemeManager.js
│   │   ├── LanguageManager.js
│   │   └── ComponentLoader.js
│   ├── 📁 components/             # Interactive components
│   │   ├── Navigation.js
│   │   ├── ContactForm.js
│   │   ├── Gallery.js
│   │   ├── Archive*.js
│   │   └── Detail*.js
│   ├── 📁 configs/                # Configuration files
│   │   └── components.config.js
│   └── 📁 utils/                  # Utility functions
│       ├── dom.js
│       ├── http.js
│       └── storage.js
├── 📁 styles/
│   ├── main.css                   # Main CSS entry point
│   ├── 📁 base/                   # Base styles
│   │   ├── variables.css
│   │   ├── typography.css
│   │   ├── fonts.css
│   │   └── animations.css
│   ├── 📁 components/             # Component-specific styles
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── archive-*.css
│   │   └── detail-*.css
│   └── 📁 utilities/              # Utility classes
│       ├── layout.css
│       ├── buttons.css
│       └── colors.css
└── 📁 locales/                    # Translation files
    ├── en.json                    # English translations
    ├── id.json                    # Indonesian translations
    └── ms.json                    # Malay translations
```

---

## 🧩 Sistem Komponen

Template menggunakan sistem komponen yang terdiri dari 3 layer:

### 1. HTML Components (View Layer)

File HTML yang berisi markup untuk setiap komponen.

**Lokasi**: `src/components/`

#### Layout Components
```html
<!-- src/components/layouts/header.html -->
<header class="header">
  <nav class="header-nav">
    <!-- Navigation content -->
  </nav>
</header>
```

#### Section Components
```html
<!-- src/components/sections/hero.html -->
<section class="hero-section">
  <div class="hero-content">
    <!-- Hero content -->
  </div>
</section>
```

### 2. Interactive Components (Controller Layer)

File JavaScript yang mengelola interaksi dan logika komponen.

**Lokasi**: `src/scripts/components/`

#### Component Structure
```javascript
// src/scripts/components/Gallery.js
export class Gallery {
  constructor() {
    this.initialized = false;
    this.elements = {};
    
    // Bind methods
    this.init = this.init.bind(this);
  }

  /**
   * Initialize component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupInitialState();
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
      gallery: document.querySelector('.gallery'),
      items: document.querySelectorAll('.gallery-item'),
      // ... other elements
    };
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.elements.items.forEach((item, index) => {
      item.addEventListener('click', () => this.openItem(index));
    });
  }

  /**
   * Open gallery item
   */
  openItem(index) {
    // Implementation
  }
}
```

### 3. Component Styles (Style Layer)

File CSS yang berisi styling untuk setiap komponen.

**Lokasi**: `src/styles/components/`

```css
/* src/styles/components/gallery.css */
.gallery {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.gallery-item {
  @apply relative overflow-hidden rounded-lg cursor-pointer;
  @apply transition-transform duration-300 hover:scale-105;
}

.gallery-item-image {
  @apply w-full h-64 object-cover;
}
```

### Component Loading System

Sistem loading komponen otomatis berdasarkan attribute DOM:

```html
<!-- HTML Page -->
<!DOCTYPE html>
<html>
<body>
  <!-- Layout components -->
  <div data-layout="header"></div>
  
  <!-- Section components -->
  <div data-section="hero"></div>
  <div data-section="about"></div>
  <div data-section="products"></div>
  
  <div data-layout="footer"></div>
</body>
</html>
```

**ComponentLoader** akan otomatis:
1. Mendeteksi semua `data-layout` dan `data-section`
2. Load file HTML yang sesuai dari `src/components/`
3. Inject HTML ke target element
4. Initialize interactive component jika ada

### Component Configuration

Mapping komponen dikonfigurasi di `src/scripts/configs/components.config.js`:

```javascript
export const LAYOUT_COMPONENTS = {
  'header': 'header',
  'footer': 'footer'
};

export const SECTION_COMPONENTS = {
  'hero': 'hero',
  'about': 'about',
  'products': 'products',
  'archive-product': 'archive-product',
  'detail-product': 'detail-product',
  // ... more components
};
```

---

## 🎨 Sistem Tema & Bahasa

### Theme System

**ThemeManager** mengelola tema aplikasi dengan fitur:
- Light/Dark mode toggle
- Custom color schemes
- Persistent theme selection
- CSS custom properties

#### Theme Structure
```css
/* src/styles/base/variables.css */
:root {
  /* Light theme colors */
  --color-primary: 59 130 246;
  --color-secondary: 99 102 241;
  --color-background: 255 255 255;
  --color-text: 17 24 39;
}

[data-theme="dark"] {
  /* Dark theme colors */
  --color-primary: 96 165 250;
  --color-secondary: 129 140 248;
  --color-background: 17 24 39;
  --color-text: 243 244 246;
}
```

#### Theme Usage
```javascript
// Get theme manager
const themeManager = window.TechCorpApp.getManager('themeManager');

// Switch theme
themeManager.setTheme('dark');

// Listen for theme changes
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

### Language System

**LanguageManager** mengelola multi-bahasa dengan fitur:
- Dynamic language switching
- Nested translation keys
- Fallback language support
- Automatic DOM translation

#### Translation Structure
```json
{
  "nav": {
    "home": "Home",
    "about": "About Us",
    "products": "Products",
    "contact": "Contact Us"
  },
  "hero": {
    "title": "Trusted Electrical Solutions",
    "subtitle": "Complete Electrical Store for Your Needs",
    "cta": {
      "primary": "Get Started",
      "secondary": "Learn More"
    }
  }
}
```

#### Language Usage
```html
<!-- HTML with translation attributes -->
<h1 data-translate="hero.title">Trusted Electrical Solutions</h1>
<button data-translate="hero.cta.primary">Get Started</button>
```

```javascript
// Get language manager
const langManager = window.TechCorpApp.getManager('languageManager');

// Change language
langManager.setLanguage('id');

// Get translation programmatically
const title = langManager.translate('hero.title');
```

---

## 🛠️ Panduan Pengembangan

### Setup Development Environment

#### 1. Prerequisites
- Node.js 18+
- NPM atau Yarn
- Modern browser untuk testing

#### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-repo/MiWebOmegaLight.git
cd MiWebOmegaLight

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 3. Development Scripts
```json
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "npm run copy-assets && vite build",  // Production build
    "preview": "vite preview",         // Preview build
    "copy-assets": "npm run copy-iconify"  // Copy third-party assets
  }
}
```

### Membuat Komponen Baru

#### 1. Buat HTML Component

```html
<!-- src/components/sections/services.html -->
<section class="services-section">
  <div class="container">
    <div class="services-header">
      <h2 class="services-title" data-translate="services.title">Our Services</h2>
      <p class="services-description" data-translate="services.description">
        Professional electrical services for all your needs
      </p>
    </div>
    
    <div class="services-grid">
      <!-- Service items -->
      <div class="service-card">
        <div class="service-icon">
          <iconify-icon icon="heroicons:wrench-screwdriver"></iconify-icon>
        </div>
        <h3 class="service-title" data-translate="services.items.installation.title">Installation</h3>
        <p class="service-description" data-translate="services.items.installation.description">
          Professional electrical installation services
        </p>
      </div>
      <!-- More service items -->
    </div>
  </div>
</section>
```

#### 2. Buat CSS Component

```css
/* src/styles/components/services.css */
.services-section {
  @apply py-16 bg-gray-50;
}

.services-header {
  @apply text-center mb-12;
}

.services-title {
  @apply text-3xl font-bold text-gray-900 mb-4;
}

.services-description {
  @apply text-lg text-gray-600 max-w-2xl mx-auto;
}

.services-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.service-card {
  @apply bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow;
}

.service-icon {
  @apply text-4xl text-blue-600 mb-4;
}

.service-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.service-description {
  @apply text-gray-600;
}
```

#### 3. Buat Interactive Component (Optional)

```javascript
// src/scripts/components/Services.js
export class Services {
  constructor() {
    this.initialized = false;
    this.elements = {};
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize services component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupAnimations();
      this.initialized = true;
      
      console.log('✅ Services component initialized');
    } catch (error) {
      console.error('❌ Services initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.services-section'),
      cards: document.querySelectorAll('.service-card')
    };
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.elements.cards.forEach((card, index) => {
      card.addEventListener('click', () => this.handleCardClick(index));
    });
  }

  /**
   * Handle service card click
   */
  handleCardClick(index) {
    console.log(`Service card ${index} clicked`);
    // Add interaction logic here
  }

  /**
   * Setup scroll animations
   */
  setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    });

    this.elements.cards.forEach(card => {
      observer.observe(card);
    });
  }
}
```

#### 4. Register Component

```javascript
// src/scripts/configs/components.config.js
export const SECTION_COMPONENTS = {
  'hero': 'hero',
  'about': 'about',
  'services': 'services',  // ← Add new component
  'products': 'products',
  // ... other components
};
```

```javascript
// src/scripts/core/App.js - Add to interactive components
import { Services } from '../components/Services.js';

// In initializeInteractiveComponents method
const componentInitializers = [
  // ... other components
  { name: 'services', class: Services, critical: false },
];
```

#### 5. Import CSS

```css
/* src/styles/main.css */
@import './components/header.css';
@import './components/hero.css';
@import './components/services.css';  /* ← Add new CSS */
@import './components/about.css';
/* ... other imports */
```

#### 6. Add Translations

```json
// src/locales/en.json
{
  "services": {
    "title": "Our Services",
    "description": "Professional electrical services for all your needs",
    "items": {
      "installation": {
        "title": "Installation",
        "description": "Professional electrical installation services"
      },
      "maintenance": {
        "title": "Maintenance",
        "description": "Regular maintenance and inspection services"
      },
      "repair": {
        "title": "Repair",
        "description": "Quick and reliable electrical repair services"
      }
    }
  }
}
```

#### 7. Use Component in HTML

```html
<!-- Any HTML page -->
<body>
  <div data-layout="header"></div>
  
  <div data-section="hero"></div>
  <div data-section="services"></div>  <!-- ← Add new component -->
  <div data-section="about"></div>
  
  <div data-layout="footer"></div>
</body>
```

### Membuat Halaman Baru

#### 1. Buat File HTML Halaman

```html
<!-- services.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services - OmegaLight</title>
    <meta name="description" content="Professional electrical services - Installation, maintenance, and repair services by experienced technicians.">
    <meta name="keywords" content="electrical services, installation, maintenance, repair, OmegaLight">
    <meta name="category" content="Services">
    <meta name="page-type" content="services">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <!-- Tailwind CSS -->
    <link rel="stylesheet" href="./src/styles/main.css">
    
    <!-- Main Application Script -->
    <script type="module" src="./src/scripts/main.js"></script>
</head>
<body class="font-sans antialiased">
    
    <!-- Theme & Language Switchers -->
    <div class="floating-switchers">
        <!-- Language Switcher -->
        <div class="floating-switchers-group">
            <button data-language-toggle class="switcher-toggle">
                <iconify-icon icon="heroicons:language" class="switcher-toggle-icon"></iconify-icon>
            </button>
            
            <div data-language-switcher class="switcher-panel">
                <h3 class="switcher-panel-title" data-translate="common.chooseLanguage">Choose Language</h3>
                <div data-language-options class="switcher-panel-options"></div>
            </div>
        </div>
        
        <!-- Theme Switcher -->
        <div class="floating-switchers-group">
            <button data-theme-toggle class="switcher-toggle">
                <iconify-icon icon="heroicons:paint-brush" class="switcher-toggle-icon"></iconify-icon>
            </button>
            
            <div data-theme-switcher class="switcher-panel"></div>
        </div>
    </div>
    
    <!-- Header -->
    <div data-layout="header"></div>

    <!-- Page Content -->
    <div data-section="services"></div>
    <div data-section="contact"></div>

    <!-- Footer -->
    <div data-layout="footer"></div>

</body>
</html>
```

#### 2. Update Navigation

Tambahkan link navigasi di `src/components/layouts/header.html`:

```html
<nav class="header-nav">
  <ul class="header-nav-list">
    <li><a href="index.html" data-translate="nav.home">Home</a></li>
    <li><a href="services.html" data-translate="nav.services">Services</a></li>
    <li><a href="products.html" data-translate="nav.products">Products</a></li>
    <!-- ... other links -->
  </ul>
</nav>
```

#### 3. Update Translations

```json
// src/locales/en.json
{
  "nav": {
    "home": "Home",
    "services": "Services",  // ← Add new nav item
    "products": "Products",
    // ... other nav items
  }
}
```

### Archive & Detail Pages Pattern

Template menyediakan pola untuk halaman archive dan detail:

#### Archive Pages
- Menampilkan daftar/grid items
- Filter dan pencarian
- Pagination
- Sorting options

Contoh: `archive-product.html`, `archive-article.html`

#### Detail Pages
- Menampilkan detail item individual
- Gallery/carousel
- Related content
- Social sharing

Contoh: `detail-product.html`, `detail-article.html`

---

## 📋 Standar Koding

### JavaScript Standards

#### 1. ES6+ Modules
```javascript
// ✅ Good
import { ComponentLoader } from '../managers/ComponentLoader.js';
export class MyComponent { }

// ❌ Avoid
const ComponentLoader = require('../managers/ComponentLoader.js');
module.exports = MyComponent;
```

#### 2. Class-based Components
```javascript
// ✅ Good
export class Gallery {
  constructor() {
    this.initialized = false;
    this.elements = {};
    
    // Bind methods to maintain context
    this.init = this.init.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  init() {
    if (this.initialized) return;
    
    try {
      this.cacheElements();
      this.bindEvents();
      this.initialized = true;
      
      console.log('✅ Gallery initialized');
    } catch (error) {
      console.error('❌ Gallery failed:', error);
    }
  }
}
```

#### 3. Error Handling
```javascript
// ✅ Good - Always use try-catch
try {
  await componentLoader.loadComponent('hero', '#hero-section');
  console.log('✅ Component loaded');
} catch (error) {
  console.error('❌ Component load failed:', error);
}

// ✅ Good - Graceful degradation
const element = document.querySelector('.optional-feature');
if (element) {
  // Setup optional feature
}
```

#### 4. Event Handling
```javascript
// ✅ Good - Use arrow functions for event handlers
bindEvents() {
  this.elements.button.addEventListener('click', this.handleClick);
  
  // For inline handlers, use arrow functions
  this.elements.items.forEach((item, index) => {
    item.addEventListener('click', () => this.openItem(index));
  });
}

// ✅ Good - Cleanup event listeners
destroy() {
  this.elements.button.removeEventListener('click', this.handleClick);
}
```

#### 5. Documentation
```javascript
/**
 * Gallery component for image display and interaction
 * 
 * Features:
 * - Lightbox modal display
 * - Keyboard navigation
 * - Touch/swipe support
 * - Lazy loading
 */
export class Gallery {
  /**
   * Initialize gallery component
   * @param {Object} options - Configuration options
   * @param {boolean} options.autoplay - Enable autoplay
   * @param {number} options.interval - Autoplay interval
   */
  init(options = {}) {
    // Implementation
  }

  /**
   * Open gallery item at specific index
   * @param {number} index - Item index to open
   * @returns {boolean} Success status
   */
  openItem(index) {
    // Implementation
  }
}
```

### CSS Standards

#### 1. Tailwind Classes
```css
/* ✅ Good - Use Tailwind utilities first */
.card {
  @apply bg-white rounded-lg shadow-md p-6;
  @apply hover:shadow-lg transition-shadow duration-200;
}

/* ✅ Good - Custom properties for theme support */
.card {
  background: rgb(var(--color-background));
  color: rgb(var(--color-text));
}

/* ❌ Avoid - Direct CSS properties when Tailwind equivalent exists */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### 2. BEM-like Naming
```css
/* ✅ Good - Component-based naming */
.gallery { }
.gallery-item { }
.gallery-item-image { }
.gallery-item-overlay { }

.hero-section { }
.hero-content { }
.hero-title { }
.hero-description { }
```

#### 3. Mobile-first Responsive
```css
/* ✅ Good - Mobile first */
.gallery {
  @apply grid grid-cols-1 gap-4;
}

@media (min-width: 768px) {
  .gallery {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .gallery {
    @apply grid-cols-3;
  }
}
```

### HTML Standards

#### 1. Semantic HTML
```html
<!-- ✅ Good -->
<article class="product-card">
  <header class="product-header">
    <h3 class="product-title">Product Name</h3>
  </header>
  <div class="product-content">
    <p class="product-description">Description...</p>
  </div>
  <footer class="product-actions">
    <button class="product-cta">Learn More</button>
  </footer>
</article>

<!-- ❌ Avoid -->
<div class="product-card">
  <div class="product-header">
    <div class="product-title">Product Name</div>
  </div>
</div>
```

#### 2. Accessibility
```html
<!-- ✅ Good -->
<button aria-label="Close modal" class="modal-close">
  <iconify-icon icon="heroicons:x-mark" aria-hidden="true"></iconify-icon>
</button>

<img src="product.jpg" alt="LED Strip Light 5 meter warm white" loading="lazy">

<form>
  <label for="email">Email Address</label>
  <input type="email" id="email" required aria-describedby="email-help">
  <div id="email-help">We'll never share your email</div>
</form>
```

#### 3. Translation Attributes
```html
<!-- ✅ Good -->
<h1 data-translate="hero.title">Default Title</h1>
<p data-translate="hero.description">Default description</p>
<button data-translate="hero.cta.primary">Get Started</button>
```

---

## 🚀 Deployment & Build

### Build Process

#### 1. Build Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'  // Add more entries for multi-page
      }
    },
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public'
})
```

#### 2. Build Commands
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

#### 3. Build Output
```
dist/
├── index.html
├── archive-*.html
├── detail-*.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [asset-files]
└── images/
    └── [optimized-images]
```

### Environment Configuration

#### 1. Environment Variables
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=development

# .env.production
VITE_API_BASE_URL=https://api.omegalight.com
VITE_APP_ENV=production
```

#### 2. Usage in Code
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const isProduction = import.meta.env.VITE_APP_ENV === 'production';
```

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)
```bash
# Build for static hosting
npm run build

# Deploy dist/ folder
```

#### 2. Traditional Web Server
```bash
# Build
npm run build

# Upload dist/ contents to web server
# Configure web server for SPA routing (optional)
```

#### 3. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎯 Best Practices

### Performance Optimization

#### 1. Lazy Loading
```html
<!-- Images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Components -->
<div data-section="gallery" data-lazy="true"></div>
```

```javascript
// Intersection Observer for lazy components
const lazyComponents = document.querySelectorAll('[data-lazy="true"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadComponent(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

lazyComponents.forEach(el => observer.observe(el));
```

#### 2. Code Splitting
```javascript
// Dynamic imports for large components
const loadGallery = async () => {
  const { Gallery } = await import('./components/Gallery.js');
  return new Gallery();
};
```

#### 3. Asset Optimization
- Use WebP images with fallback
- Minify CSS/JS in production
- Use CDN for static assets
- Enable gzip compression

### SEO Optimization

#### 1. Meta Tags
```html
<head>
  <title>Page Title - OmegaLight</title>
  <meta name="description" content="Page description for SEO">
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  <meta name="category" content="Product Category">
  <meta name="page-type" content="product-listing">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="/images/og-image.jpg">
  <meta property="og:type" content="website">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Page description">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://omegalight.com/page-url">
</head>
```

#### 2. Structured Data
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OmegaLight",
  "url": "https://omegalight.com",
  "logo": "https://omegalight.com/logo.png"
}
</script>
```

#### 3. URL Structure
- Use descriptive URLs: `/products/led-strip-lights`
- Implement breadcrumbs
- Add proper heading hierarchy (H1, H2, H3)

### Security Best Practices

#### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' https:;">
```

#### 2. Input Sanitization
```javascript
// Sanitize user input
function sanitizeInput(input) {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### 3. HTTPS Enforcement
```javascript
// Redirect to HTTPS in production
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}
```

### Accessibility Best Practices

#### 1. Keyboard Navigation
```javascript
// Trap focus in modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}
```

#### 2. Screen Reader Support
```html
<!-- Live regions for dynamic content -->
<div aria-live="polite" id="status-message"></div>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ARIA labels and descriptions -->
<button aria-label="Close modal" aria-describedby="close-help">×</button>
<div id="close-help" class="sr-only">Closes the modal dialog</div>
```

#### 3. Color and Contrast
```css
/* Ensure sufficient contrast ratios */
.text-primary {
  color: #1f2937; /* Dark gray with good contrast */
}

.bg-primary {
  background-color: #2563eb; /* Blue with sufficient contrast */
}

/* Focus indicators */
button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

---

## ❓ FAQ

### Q: Bagaimana cara menambahkan tema custom?

**A:** Buat file CSS baru dengan custom properties:

```css
/* src/styles/themes/custom-theme.css */
[data-theme="custom"] {
  --color-primary: 255 107 0;    /* Orange */
  --color-secondary: 34 197 94;  /* Green */
  --color-background: 248 250 252;
  --color-text: 15 23 42;
}
```

Import di `main.css` dan daftarkan di `ThemeManager.js`.

### Q: Bagaimana cara menambahkan bahasa baru?

**A:** 
1. Buat file translation: `src/locales/fr.json`
2. Salin struktur dari `en.json` dan terjemahkan
3. Daftarkan di `LanguageManager.js`:

```javascript
this.supportedLanguages = ['en', 'id', 'ms', 'fr'];
this.languageNames = {
  'en': 'English',
  'id': 'Indonesia', 
  'ms': 'Melayu',
  'fr': 'Français'
};
```

### Q: Bagaimana cara mengoptimalkan performance?

**A:**
1. Gunakan lazy loading untuk images: `loading="lazy"`
2. Implement component lazy loading dengan Intersection Observer
3. Minify assets dengan Vite build
4. Use WebP images dengan fallback
5. Enable gzip compression di server

### Q: Bagaimana cara debugging komponen yang tidak load?

**A:**
1. Cek console browser untuk error messages
2. Pastikan path file komponen benar
3. Cek konfigurasi di `components.config.js`
4. Pastikan HTML attribute `data-section` atau `data-layout` benar
5. Gunakan browser dev tools untuk inspect network requests

### Q: Bagaimana cara menggunakan dengan CMS atau backend API?

**A:**
1. Buat service layer untuk API calls:

```javascript
// src/scripts/services/ApiService.js
export class ApiService {
  static async getProducts() {
    const response = await fetch('/api/products');
    return response.json();
  }
}
```

2. Load data dalam komponen:

```javascript
// src/scripts/components/Products.js
import { ApiService } from '../services/ApiService.js';

export class Products {
  async init() {
    const products = await ApiService.getProducts();
    this.renderProducts(products);
  }
}
```

### Q: Bagaimana cara deploy ke production?

**A:**
1. Build production: `npm run build`
2. Test build: `npm run preview`
3. Upload folder `dist/` ke hosting
4. Configure web server untuk serve static files
5. Setup HTTPS dan domain

### Q: Bagaimana cara menambahkan analytics?

**A:**
```javascript
// src/scripts/utils/analytics.js
export function trackEvent(action, category, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}

// Usage dalam komponen
import { trackEvent } from '../utils/analytics.js';

handleButtonClick() {
  trackEvent('click', 'CTA', 'Hero Button');
}
```

---

## 📞 Support & Kontribusi

### Getting Help

1. **Documentation**: Baca dokumentasi ini terlebih dahulu
2. **Code Comments**: Cek komentar dalam kode untuk penjelasan detail
3. **Console Logs**: Aktifkan dev tools untuk melihat log aplikasi
4. **Issue Tracker**: Laporkan bugs atau request features

### Contributing

1. Fork repository
2. Buat feature branch: `git checkout -b feature/new-component`
3. Commit changes: `git commit -m 'Add new component'`
4. Push to branch: `git push origin feature/new-component`
5. Create Pull Request

### Code Review Checklist

- ✅ Follows coding standards
- ✅ Includes proper documentation
- ✅ Has error handling
- ✅ Mobile responsive
- ✅ Accessibility compliant
- ✅ Performance optimized
- ✅ Browser tested

---

**© 2024 MiWeb OmegaLight Template - Dokumentasi ini adalah panduan lengkap untuk pengembangan template berdasarkan standar MiWeb OmegaLight.**
