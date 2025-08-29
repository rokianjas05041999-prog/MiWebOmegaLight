// Application Core
// Main application class that coordinates all managers and components

import { ThemeManager } from '../managers/ThemeManager.js';
import { LanguageManager } from '../managers/LanguageManager.js';
import { ComponentLoader } from '../managers/ComponentLoader.js';

import { AnimationController } from '../components/AnimationController.js';
import { ContactForm } from '../components/ContactForm.js';
import { Gallery } from '../components/Gallery.js';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel.js';
import { Navigation } from '../components/Navigation.js';
import { ProductQuickView } from '../components/ProductQuickView.js';
import { BrandsCarousel } from '../components/BrandsCarousel.js';
import { TestimonialsSlider } from '../components/TestimonialsSlider.js';
import { DetailGeneral } from '../components/DetailGeneral.js';
import { DetailCategory } from '../components/DetailCategory.js';
import { DetailProduct } from '../components/DetailProduct.js';
import { DetailArticle } from '../components/DetailArticle.js';
import { DetailPortfolio } from '../components/DetailPortfolio.js';
import { ArchiveProduct } from '../components/ArchiveProduct.js';
import { ArchiveCategory } from '../components/ArchiveCategory.js';
import { ArchivePortfolio } from '../components/ArchivePortfolio.js';
import { ArchiveFAQ } from '../components/ArchiveFAQ.js';
import { DetailFAQ } from '../components/DetailFAQ.js';
import { FAQ } from '../components/FAQ.js';

import { getLayoutComponentName, getSectionComponentName, getPageComponents, getComponentData, getMissingComponents } from '../configs/components.config.js';

/**
 * Main Application Class
 * Coordinates all managers and components
 */
export class App {
  constructor() {
    this.managers = {};
    this.components = {};
    this.isInitialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) return;

    console.log('🚀 Initializing TechCorp Application...');

    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
      } else {
        await this.handleDOMContentLoaded();
      }
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
    }
  }

  /**
   * Handle DOM ready event
   */
  async handleDOMContentLoaded() {
    try {
      // 1. Initialize core managers first
      await this.initializeManagers();
      
      // 2. Auto-load page components (HTML)
      await this.autoLoadPageComponents();
      
      // 3. Initialize interactive components after HTML is loaded
      await this.initializeInteractiveComponents();
      
      // 4. Setup global event listeners
      this.setupGlobalEventListeners();
      
      // 5. Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      this.isInitialized = true;
      console.log('✅ TechCorp Application initialized successfully');
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('appInitialized', {
        detail: { app: this }
      }));
    } catch (error) {
      console.error('❌ DOM initialization failed:', error);
    }
  }

  /**
   * Initialize core managers (Theme, Language, ComponentLoader, Navigation)
   */
  async initializeManagers() {
    console.log('📦 Initializing core managers...');

    const managerInitializers = [
      { name: 'themeManager', class: ThemeManager, critical: true },
      { name: 'languageManager', class: LanguageManager, critical: true },
      { name: 'componentLoader', class: ComponentLoader, critical: true },
      { name: 'animationController', class: AnimationController, critical: false }
    ];

    for (const { name, class: ManagerClass, critical } of managerInitializers) {
      try {
        console.log(`  🔧 Initializing ${name}...`);
        this.managers[name] = new ManagerClass();
        console.log(`  ✅ ${name} initialized`);
      } catch (error) {
        console.error(`  ❌ Failed to initialize ${name}:`, error);
        
        if (critical) {
          throw new Error(`Critical manager ${name} failed to initialize`);
        }
      }
    }
  }

  /**
   * Auto-load page components based on data attributes in HTML
   */
  async autoLoadPageComponents() {
    console.log('🔄 Auto-loading page components...');
    
    const componentLoader = this.managers.componentLoader;
    if (!componentLoader) {
      console.error('ComponentLoader not available');
      return;
    }

    // Get components from current page
    const { layouts, sections } = getPageComponents();
    
    console.log(`📋 Found components - Layouts: [${layouts.join(', ')}], Sections: [${sections.join(', ')}]`);

    // Validate components
    const missing = getMissingComponents(layouts, sections);
    if (missing.layouts.length > 0 || missing.sections.length > 0) {
      console.warn('⚠️ Missing component files detected:', missing);
    }

    // Load layout components first (header, footer)
    const layoutPromises = layouts.map(async (layoutName) => {
      const componentName = getLayoutComponentName(layoutName);
      const targetSelector = `[data-layout="${layoutName}"]`;
      const element = document.querySelector(targetSelector);
      const componentData = element ? getComponentData(element) : {};
      
      try {
        await componentLoader.loadComponent(
          componentName, 
          targetSelector, 
          componentData, 
          { section: 'layouts' }
        );
        console.log(`  ✅ Layout loaded: ${layoutName} -> ${componentName}`);
      } catch (error) {
        console.error(`  ❌ Failed to load layout ${layoutName}:`, error);
      }
    });

    // Load section components
    const sectionPromises = sections.map(async (sectionName) => {
      const componentName = getSectionComponentName(sectionName);
      const targetSelector = `[data-section="${sectionName}"]`;
      const element = document.querySelector(targetSelector);
      const componentData = element ? getComponentData(element) : {};
      
      try {
        await componentLoader.loadComponent(
          componentName, 
          targetSelector, 
          componentData, 
          { section: 'sections' }
        );
        console.log(`  ✅ Section loaded: ${sectionName} -> ${componentName}`);
      } catch (error) {
        console.error(`  ❌ Failed to load section ${sectionName}:`, error);
      }
    });

    // Wait for all components to load
    try {
      await Promise.all([...layoutPromises, ...sectionPromises]);
      console.log('✅ All page components loaded successfully');
      
      // Dispatch event when all components are loaded
      window.dispatchEvent(new CustomEvent('pageComponentsLoaded', {
        detail: { layouts, sections }
      }));

      // Re-apply language translations after components are loaded
      if (this.managers.languageManager) {
        console.log('🌍 Re-applying language translations to loaded components...');
        this.managers.languageManager.reapplyLanguage();
      }
    } catch (error) {
      console.error('❌ Some components failed to load:', error);
    }
  }

  /**
   * Initialize interactive components that depend on HTML content being loaded
   */
  async initializeInteractiveComponents() {
    console.log('🔧 Initializing interactive components...');

    const componentInitializers = [
      { name: 'navigation', class: Navigation, critical: false },
      { name: 'contactForm', class: ContactForm, critical: false },
      { name: 'gallery', class: Gallery, critical: false },
      { name: 'testimonialsCarousel', class: TestimonialsCarousel, critical: false },
      { name: 'testimonialsSlider', class: TestimonialsSlider, critical: false },
      { name: 'productQuickView', class: ProductQuickView, critical: false },
      { name: 'brandsCarousel', class: BrandsCarousel, critical: false },
      { name: 'faq', class: FAQ, critical: false },
      { name: 'detailGeneral', class: DetailGeneral, critical: false },
      { name: 'detailCategory', class: DetailCategory, critical: false },
      { name: 'detailProduct', class: DetailProduct, critical: false },
      { name: 'detailArticle', class: DetailArticle, critical: false },
      { name: 'detailPortfolio', class: DetailPortfolio, critical: false },
      { name: 'detailFAQ', class: DetailFAQ, critical: false },
      { name: 'archiveProduct', class: ArchiveProduct, critical: false },
      { name: 'archiveCategory', class: ArchiveCategory, critical: false },
      { name: 'archivePortfolio', class: ArchivePortfolio, critical: false },
      { name: 'archiveFAQ', class: ArchiveFAQ, critical: false }
    ];

    for (const { name, class: ComponentClass, critical } of componentInitializers) {
      try {
        console.log(`  🔧 Initializing ${name}...`);
        this.components[name] = new ComponentClass();
        
        // Initialize the component if it has an init method
        if (this.components[name].init && typeof this.components[name].init === 'function') {
          this.components[name].init();
        }
        
        console.log(`  ✅ ${name} initialized`);
      } catch (error) {
        console.error(`  ❌ Failed to initialize ${name}:`, error);
        
        if (critical) {
          throw new Error(`Critical interactive component ${name} failed to initialize`);
        }
      }
    }

    console.log('✅ Interactive components initialized');
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Theme change handler
    window.addEventListener('themeChanged', (event) => {
      console.log('🎨 Theme changed:', event.detail.theme);
    });

    // Language change handler
    window.addEventListener('languageChanged', (event) => {
      console.log('🌍 Language changed:', event.detail.language);
    });

    // Re-apply language when components are loaded
    window.addEventListener('componentLoaded', (event) => {
      if (this.managers.languageManager) {
        setTimeout(() => {
          this.managers.languageManager.reapplyLanguage();
        }, 10);
      }
    });

    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Before unload handler
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (window.innerWidth >= 1024 && this.components.navigation) {
      this.components.navigation.close();
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
          
          console.log('📊 Performance Metrics:');
          console.log(`  • DOM Ready: ${domReady}ms`);
          console.log(`  • Page Load: ${loadTime}ms`);
        }, 0);
      });
    }
  }

  /**
   * Get manager or component instance
   */
  get(name) {
    return this.managers[name] || this.components[name];
  }

  /**
   * Get manager instance
   */
  getManager(name) {
    return this.managers[name];
  }

  /**
   * Get component instance
   */
  getComponent(name) {
    return this.components[name];
  }

  /**
   * Check if app is initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Cleanup managers
    Object.values(this.managers).forEach(manager => {
      if (manager.destroy && typeof manager.destroy === 'function') {
        manager.destroy();
      }
    });
    
    // Cleanup components
    Object.values(this.components).forEach(component => {
      if (component.destroy && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
  }
}