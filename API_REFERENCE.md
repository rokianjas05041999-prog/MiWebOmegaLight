# MiWeb OmegaLight - API Reference

## 📋 Daftar Isi

1. [Core Classes](#core-classes)
2. [Manager Classes](#manager-classes)
3. [Component Classes](#component-classes)
4. [Utility Classes](#utility-classes)
5. [Configuration](#configuration)
6. [Events](#events)
7. [Data Structures](#data-structures)

---

## 🏗️ Core Classes

### App Class

**File**: `src/scripts/core/App.js`

Main application orchestrator yang mengelola semua managers dan components.

#### Constructor
```javascript
new App()
```

#### Properties
- `managers: Object` - Dictionary of initialized managers
- `components: Object` - Dictionary of initialized components
- `isInitialized: boolean` - Application initialization status

#### Methods

##### `init(): Promise<void>`
Initialize the entire application.

```javascript
const app = new App();
await app.init();
```

##### `getManager(name: string): Object`
Get manager instance by name.

```javascript
const themeManager = app.getManager('themeManager');
const langManager = app.getManager('languageManager');
```

**Available Managers:**
- `themeManager` - Theme management
- `languageManager` - Language/translation management  
- `componentLoader` - HTML component loading
- `animationController` - Animation management

##### `getComponent(name: string): Object`
Get component instance by name.

```javascript
const gallery = app.getComponent('gallery');
const navigation = app.getComponent('navigation');
```

##### `isReady(): boolean`
Check if application is fully initialized.

```javascript
if (app.isReady()) {
  console.log('App is ready');
}
```

##### `cleanup(): void`
Cleanup all resources and destroy managers/components.

```javascript
app.cleanup();
```

---

## 🎛️ Manager Classes

### ThemeManager Class

**File**: `src/scripts/managers/ThemeManager.js`

Manages application themes and dark/light mode.

#### Constructor
```javascript
new ThemeManager()
```

#### Properties
- `currentTheme: string` - Current active theme name
- `themes: Array<string>` - Available theme names
- `storageKey: string` - localStorage key for persistence

#### Methods

##### `setTheme(theme: string): void`
Set active theme.

```javascript
themeManager.setTheme('dark');
themeManager.setTheme('light');
themeManager.setTheme('blue');
```

##### `getTheme(): string`
Get current active theme.

```javascript
const currentTheme = themeManager.getTheme(); // 'dark'
```

##### `toggleTheme(): void`
Toggle between light and dark themes.

```javascript
themeManager.toggleTheme();
```

##### `getAvailableThemes(): Array<string>`
Get list of available themes.

```javascript
const themes = themeManager.getAvailableThemes();
// ['light', 'dark', 'blue', 'green']
```

#### Events

##### `themeChanged`
Fired when theme changes.

```javascript
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
  console.log('Previous theme:', event.detail.previousTheme);
});
```

### LanguageManager Class

**File**: `src/scripts/managers/LanguageManager.js`

Manages multi-language support and translations.

#### Constructor
```javascript
new LanguageManager()
```

#### Properties
- `currentLanguage: string` - Current active language code
- `supportedLanguages: Array<string>` - Supported language codes
- `translations: Object` - Loaded translation data
- `storageKey: string` - localStorage key for persistence

#### Methods

##### `setLanguage(language: string): Promise<void>`
Set active language and load translations.

```javascript
await languageManager.setLanguage('id');
await languageManager.setLanguage('en');
await languageManager.setLanguage('ms');
```

##### `getLanguage(): string`
Get current active language.

```javascript
const currentLang = languageManager.getLanguage(); // 'en'
```

##### `translate(key: string, fallback?: string): string`
Get translation for key.

```javascript
const title = languageManager.translate('hero.title');
const desc = languageManager.translate('hero.desc', 'Default description');
```

##### `getSupportedLanguages(): Array<Object>`
Get supported languages with metadata.

```javascript
const languages = languageManager.getSupportedLanguages();
// [
//   { code: 'en', name: 'English', nativeName: 'English' },
//   { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
//   { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' }
// ]
```

##### `reapplyLanguage(): void`
Re-apply translations to DOM elements.

```javascript
languageManager.reapplyLanguage();
```

#### Events

##### `languageChanged`
Fired when language changes.

```javascript
window.addEventListener('languageChanged', (event) => {
  console.log('Language changed to:', event.detail.language);
  console.log('Previous language:', event.detail.previousLanguage);
});
```

##### `translationsLoaded`
Fired when translations are loaded.

```javascript
window.addEventListener('translationsLoaded', (event) => {
  console.log('Translations loaded for:', event.detail.language);
});
```

### ComponentLoader Class

**File**: `src/scripts/managers/ComponentLoader.js`

Manages dynamic loading of HTML components.

#### Constructor
```javascript
new ComponentLoader()
```

#### Methods

##### `loadComponent(name: string, target: string, data?: Object, options?: Object): Promise<void>`
Load HTML component into target element.

```javascript
await componentLoader.loadComponent(
  'hero',                    // Component name
  '[data-section="hero"]',   // Target selector
  { title: 'Welcome' },      // Template data
  { section: 'sections' }    // Options
);
```

**Parameters:**
- `name: string` - Component filename (without .html)
- `target: string` - CSS selector for target element
- `data?: Object` - Data for template variable replacement
- `options?: Object` - Loading options
  - `section?: string` - Component section ('layouts' or 'sections')
  - `cache?: boolean` - Enable caching (default: true)

##### `getComponentPath(name: string, section?: string): string`
Get full path to component file.

```javascript
const path = componentLoader.getComponentPath('hero', 'sections');
// Returns: 'src/components/sections/hero.html'
```

##### `clearCache(): void`
Clear component cache.

```javascript
componentLoader.clearCache();
```

#### Events

##### `componentLoaded`
Fired when component is loaded.

```javascript
window.addEventListener('componentLoaded', (event) => {
  console.log('Component loaded:', event.detail.name);
  console.log('Target:', event.detail.target);
  console.log('Load time:', event.detail.loadTime, 'ms');
});
```

##### `componentLoadError`
Fired when component loading fails.

```javascript
window.addEventListener('componentLoadError', (event) => {
  console.error('Component load failed:', event.detail.name);
  console.error('Error:', event.detail.error);
});
```

---

## 🧩 Component Classes

### Navigation Class

**File**: `src/scripts/components/Navigation.js`

Mobile-responsive navigation menu.

#### Constructor
```javascript
new Navigation()
```

#### Properties
- `initialized: boolean` - Initialization status
- `elements: Object` - Cached DOM elements
- `isOpen: boolean` - Menu open state

#### Methods

##### `init(): void`
Initialize navigation component.

```javascript
const navigation = new Navigation();
navigation.init();
```

##### `open(): void`
Open mobile menu.

```javascript
navigation.open();
```

##### `close(): void`
Close mobile menu.

```javascript
navigation.close();
```

##### `toggle(): void`
Toggle mobile menu.

```javascript
navigation.toggle();
```

##### `setActiveItem(href: string): void`
Set active navigation item.

```javascript
navigation.setActiveItem('/products');
```

### Gallery Class

**File**: `src/scripts/components/Gallery.js`

Image gallery with lightbox functionality.

#### Constructor
```javascript
new Gallery()
```

#### Properties
- `initialized: boolean` - Initialization status
- `elements: Object` - Cached DOM elements
- `currentIndex: number` - Current image index
- `images: Array<Object>` - Image data array
- `currentFilter: string` - Active filter

#### Methods

##### `init(): void`
Initialize gallery component.

```javascript
const gallery = new Gallery();
gallery.init();
```

##### `openLightbox(index: number): void`
Open lightbox at specific image index.

```javascript
gallery.openLightbox(2);
```

##### `closeLightbox(): void`
Close lightbox.

```javascript
gallery.closeLightbox();
```

##### `filterImages(filter: string): void`
Filter images by category.

```javascript
gallery.filterImages('residential');
gallery.filterImages('commercial');
gallery.filterImages('all');
```

##### `nextImage(): void`
Navigate to next image in lightbox.

```javascript
gallery.nextImage();
```

##### `prevImage(): void`
Navigate to previous image in lightbox.

```javascript
gallery.prevImage();
```

### ContactForm Class

**File**: `src/scripts/components/ContactForm.js`

Contact form with validation and submission.

#### Constructor
```javascript
new ContactForm()
```

#### Properties
- `initialized: boolean` - Initialization status
- `elements: Object` - Cached DOM elements
- `validationRules: Object` - Validation configuration
- `isSubmitting: boolean` - Form submission state

#### Methods

##### `init(): void`
Initialize contact form component.

```javascript
const contactForm = new ContactForm();
contactForm.init();
```

##### `validateField(field: HTMLElement): boolean`
Validate single form field.

```javascript
const isValid = contactForm.validateField(emailInput);
```

##### `validateForm(): boolean`
Validate entire form.

```javascript
const isValid = contactForm.validateForm();
```

##### `submitForm(data: Object): Promise<Object>`
Submit form data.

```javascript
const result = await contactForm.submitForm({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello world'
});
```

##### `showMessage(type: string, message: string): void`
Show success/error message.

```javascript
contactForm.showMessage('success', 'Message sent successfully');
contactForm.showMessage('error', 'Please fix the errors');
```

### ArchiveProduct Class

**File**: `src/scripts/components/ArchiveProduct.js`

Product listing with filtering and search.

#### Constructor
```javascript
new ArchiveProduct()
```

#### Properties
- `initialized: boolean` - Initialization status
- `elements: Object` - Cached DOM elements
- `filters: Object` - Active filters
- `products: Array<Object>` - Product data
- `filteredProducts: Array<Object>` - Filtered product data

#### Methods

##### `init(): void`
Initialize archive product component.

```javascript
const archiveProduct = new ArchiveProduct();
archiveProduct.init();
```

##### `applyFilters(): void`
Apply current filters to products.

```javascript
archiveProduct.applyFilters();
```

##### `searchProducts(query: string): void`
Search products by query.

```javascript
archiveProduct.searchProducts('LED light');
```

##### `sortProducts(sortBy: string): void`
Sort products by criteria.

```javascript
archiveProduct.sortProducts('price_asc');
archiveProduct.sortProducts('name');
archiveProduct.sortProducts('newest');
```

##### `loadMore(): void`
Load more products (pagination).

```javascript
archiveProduct.loadMore();
```

#### Filter Methods

##### `filterByCategory(categories: Array<string>): void`
Filter by product categories.

```javascript
archiveProduct.filterByCategory(['lights', 'cables']);
```

##### `filterByPriceRange(min: number, max: number): void`
Filter by price range.

```javascript
archiveProduct.filterByPriceRange(100, 500);
```

##### `filterByBrand(brands: Array<string>): void`
Filter by brands.

```javascript
archiveProduct.filterByBrand(['Philips', 'Osram']);
```

##### `clearFilters(): void`
Clear all active filters.

```javascript
archiveProduct.clearFilters();
```

---

## 🛠️ Utility Classes

### DOMUtils Class

**File**: `src/scripts/utils/dom.js`

DOM manipulation utilities.

#### Static Methods

##### `DOMUtils.find(selector: string, parent?: Element): Element`
Find element by selector.

```javascript
const element = DOMUtils.find('.my-class');
const child = DOMUtils.find('.child', parentElement);
```

##### `DOMUtils.findAll(selector: string, parent?: Element): NodeList`
Find all elements by selector.

```javascript
const elements = DOMUtils.findAll('.item');
```

##### `DOMUtils.create(tag: string, attributes?: Object, content?: string): Element`
Create new element.

```javascript
const div = DOMUtils.create('div', {
  class: 'my-class',
  'data-id': '123'
}, 'Hello World');
```

##### `DOMUtils.addClass(element: Element, className: string): void`
Add CSS class to element.

```javascript
DOMUtils.addClass(element, 'active');
```

##### `DOMUtils.removeClass(element: Element, className: string): void`
Remove CSS class from element.

```javascript
DOMUtils.removeClass(element, 'hidden');
```

##### `DOMUtils.toggleClass(element: Element, className: string): void`
Toggle CSS class on element.

```javascript
DOMUtils.toggleClass(element, 'collapsed');
```

##### `DOMUtils.hasClass(element: Element, className: string): boolean`
Check if element has CSS class.

```javascript
const hasActive = DOMUtils.hasClass(element, 'active');
```

### HttpUtils Class

**File**: `src/scripts/utils/http.js`

HTTP request utilities.

#### Static Methods

##### `HttpUtils.get(url: string, options?: Object): Promise<Response>`
Perform GET request.

```javascript
const response = await HttpUtils.get('/api/products');
const data = await response.json();
```

##### `HttpUtils.post(url: string, data: Object, options?: Object): Promise<Response>`
Perform POST request.

```javascript
const response = await HttpUtils.post('/api/contact', {
  name: 'John',
  email: 'john@example.com'
});
```

##### `HttpUtils.put(url: string, data: Object, options?: Object): Promise<Response>`
Perform PUT request.

```javascript
const response = await HttpUtils.put('/api/products/123', {
  name: 'Updated Product'
});
```

##### `HttpUtils.delete(url: string, options?: Object): Promise<Response>`
Perform DELETE request.

```javascript
const response = await HttpUtils.delete('/api/products/123');
```

### StorageUtils Class

**File**: `src/scripts/utils/storage.js`

Browser storage utilities.

#### Static Methods

##### `StorageUtils.setItem(key: string, value: any, type?: string): void`
Store data in browser storage.

```javascript
StorageUtils.setItem('theme', 'dark');
StorageUtils.setItem('user', { name: 'John' });
StorageUtils.setItem('temp', 'value', 'session'); // sessionStorage
```

##### `StorageUtils.getItem(key: string, defaultValue?: any, type?: string): any`
Get data from browser storage.

```javascript
const theme = StorageUtils.getItem('theme', 'light');
const user = StorageUtils.getItem('user');
```

##### `StorageUtils.removeItem(key: string, type?: string): void`
Remove item from storage.

```javascript
StorageUtils.removeItem('temp');
StorageUtils.removeItem('session-data', 'session');
```

##### `StorageUtils.clear(type?: string): void`
Clear storage.

```javascript
StorageUtils.clear(); // Clear localStorage
StorageUtils.clear('session'); // Clear sessionStorage
```

---

## ⚙️ Configuration

### Component Configuration

**File**: `src/scripts/configs/components.config.js`

#### Constants

##### `LAYOUT_COMPONENTS: Object`
Layout component mappings.

```javascript
export const LAYOUT_COMPONENTS = {
  'header': 'header',
  'footer': 'footer'
};
```

##### `SECTION_COMPONENTS: Object`
Section component mappings.

```javascript
export const SECTION_COMPONENTS = {
  'hero': 'hero',
  'about': 'about',
  'products': 'products',
  'contact': 'contact',
  'archive-product': 'archive-product',
  'detail-product': 'detail-product'
};
```

##### `COMPONENT_LOAD_ORDER: Object`
Component loading order.

```javascript
export const COMPONENT_LOAD_ORDER = {
  layouts: ['header', 'footer'],
  sections: ['hero', 'about', 'products', 'contact']
};
```

#### Functions

##### `getLayoutComponentName(layoutName: string): string`
Get layout component file name.

```javascript
const componentName = getLayoutComponentName('header'); // 'header'
```

##### `getSectionComponentName(sectionName: string): string`
Get section component file name.

```javascript
const componentName = getSectionComponentName('hero'); // 'hero'
```

##### `getPageComponents(): Object`
Auto-detect components from current page.

```javascript
const { layouts, sections } = getPageComponents();
// { layouts: ['header', 'footer'], sections: ['hero', 'about'] }
```

##### `validateComponent(componentName: string, type: string): boolean`
Validate if component exists.

```javascript
const exists = validateComponent('hero', 'sections'); // true
```

---

## 📡 Events

### Global Events

#### Application Events

##### `appInitialized`
Application fully initialized.

```javascript
window.addEventListener('appInitialized', (event) => {
  const app = event.detail.app;
  console.log('App initialized:', app);
});
```

##### `pageComponentsLoaded`
All page components loaded.

```javascript
window.addEventListener('pageComponentsLoaded', (event) => {
  const { layouts, sections } = event.detail;
  console.log('Components loaded:', layouts, sections);
});
```

#### Theme Events

##### `themeChanged`
Theme changed.

```javascript
window.addEventListener('themeChanged', (event) => {
  const { theme, previousTheme } = event.detail;
  console.log(`Theme changed from ${previousTheme} to ${theme}`);
});
```

#### Language Events

##### `languageChanged`
Language changed.

```javascript
window.addEventListener('languageChanged', (event) => {
  const { language, previousLanguage } = event.detail;
  console.log(`Language changed from ${previousLanguage} to ${language}`);
});
```

##### `translationsLoaded`
Translations loaded for language.

```javascript
window.addEventListener('translationsLoaded', (event) => {
  const { language, translations } = event.detail;
  console.log('Translations loaded for:', language);
});
```

#### Component Events

##### `componentLoaded`
Component loaded successfully.

```javascript
window.addEventListener('componentLoaded', (event) => {
  const { name, target, loadTime } = event.detail;
  console.log(`Component ${name} loaded in ${loadTime}ms`);
});
```

##### `componentLoadError`
Component loading failed.

```javascript
window.addEventListener('componentLoadError', (event) => {
  const { name, error } = event.detail;
  console.error(`Component ${name} failed to load:`, error);
});
```

### Custom Events

#### Creating Custom Events

```javascript
// Dispatch custom event
const customEvent = new CustomEvent('productAdded', {
  detail: {
    product: { id: 1, name: 'LED Light' },
    timestamp: Date.now()
  }
});
window.dispatchEvent(customEvent);

// Listen for custom event
window.addEventListener('productAdded', (event) => {
  const { product, timestamp } = event.detail;
  console.log('Product added:', product);
});
```

---

## 📊 Data Structures

### Translation Structure

```typescript
interface Translation {
  [key: string]: string | Translation;
}
```

**Example:**
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": {
      "title": "Services",
      "installation": "Installation"
    }
  },
  "hero": {
    "title": "Welcome",
    "cta": {
      "primary": "Get Started",
      "secondary": "Learn More"
    }
  }
}
```

### Product Data Structure

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  specifications: {
    [key: string]: string;
  };
  tags: string[];
}
```

**Example:**
```javascript
{
  id: 1,
  name: "LED Strip Light 5M",
  description: "Flexible LED strip with warm white light",
  price: 25.99,
  image: "/images/products/led-strip-1.jpg",
  category: "lighting",
  brand: "Philips",
  inStock: true,
  specifications: {
    "Length": "5 meters",
    "Color Temperature": "3000K",
    "Power": "12W",
    "Voltage": "12V DC"
  },
  tags: ["LED", "Strip Light", "Warm White", "Flexible"]
}
```

### Component Configuration Structure

```typescript
interface ComponentConfig {
  name: string;
  path: string;
  section: 'layouts' | 'sections';
  dependencies?: string[];
  lazy?: boolean;
}
```

### Filter State Structure

```typescript
interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  inStock: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
```

### Theme Configuration Structure

```typescript
interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
}
```

---

## 🔌 Plugin System

### Creating Custom Components

```javascript
// src/scripts/components/MyCustomComponent.js
export class MyCustomComponent {
  constructor(options = {}) {
    this.options = {
      autoInit: true,
      ...options
    };
    
    this.initialized = false;
    this.elements = {};
    
    if (this.options.autoInit) {
      this.init();
    }
  }

  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupInitialState();
      this.initialized = true;
      
      console.log('✅ MyCustomComponent initialized');
    } catch (error) {
      console.error('❌ MyCustomComponent failed:', error);
    }
  }

  cacheElements() {
    this.elements = {
      container: document.querySelector('.my-component'),
      // ... other elements
    };
  }

  bindEvents() {
    // Event listeners
  }

  setupInitialState() {
    // Initial setup
  }

  destroy() {
    // Cleanup
    this.initialized = false;
  }
}
```

### Registering Components

```javascript
// src/scripts/core/App.js
import { MyCustomComponent } from '../components/MyCustomComponent.js';

// Add to component initializers
const componentInitializers = [
  // ... existing components
  { name: 'myCustomComponent', class: MyCustomComponent, critical: false }
];
```

---

## 📝 Type Definitions

### Core Types

```typescript
// App types
interface AppConfig {
  debug: boolean;
  apiBaseUrl: string;
  defaultLanguage: string;
  defaultTheme: string;
}

interface Manager {
  init(): Promise<void> | void;
  destroy?(): void;
}

interface Component {
  init(): Promise<void> | void;
  destroy?(): void;
}

// Event types
interface CustomEventDetail {
  [key: string]: any;
}

interface AppEvent extends CustomEvent {
  detail: CustomEventDetail;
}
```

### Utility Types

```typescript
// DOM utilities
type Selector = string;
type ElementAttributes = { [key: string]: string };
type StorageType = 'local' | 'session';

// HTTP utilities
interface RequestOptions {
  headers?: { [key: string]: string };
  timeout?: number;
  cache?: boolean;
}

// Component types
interface ComponentElement {
  [key: string]: Element | NodeList | null;
}

interface ComponentState {
  [key: string]: any;
}
```

---

**API Reference ini menyediakan dokumentasi lengkap untuk semua class, method, dan interface yang tersedia dalam template MiWeb OmegaLight. Gunakan sebagai referensi saat mengembangkan komponen atau mengintegrasikan dengan sistem yang ada.**
