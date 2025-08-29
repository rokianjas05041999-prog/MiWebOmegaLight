/**
 * Component Loader
 * Manages loading and rendering of modular HTML components
 * 
 * Features:
 * - Dynamic component loading from HTML files
 * - Template variable replacement
 * - Async loading with error handling
 * - Component caching for performance
 * - Translation integration
 * - Event emission for component lifecycle
 */

import { DOMUtils } from '../utils/dom.js';
import { HttpUtils } from '../utils/http.js';

export class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.basePath = './src/components';
    
    console.log('ComponentLoader initialized');
  }

  /**
   * Load and render a component
   * @param {string} componentName - Name of the component to load
   * @param {string} targetSelector - CSS selector for target element
   * @param {Object} data - Data to pass to the component
   * @param {Object} options - Loading options
   */
  async loadComponent(componentName, targetSelector, data = {}, options = {}) {
    const startTime = performance.now();
    
    try {
      const {
        cache = true,
        replace = true,
        section = 'sections'
      } = options;

      const target = DOMUtils.select(targetSelector);
      if (!target) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }

      // Show loading state
      if (options.showLoading) {
        target.innerHTML = this.getLoadingHTML();
      }

      // Load component HTML
      const html = await this.fetchComponent(componentName, section, cache);
      
      // Process template variables
      const processedHTML = this.processTemplate(html, data);
      
      // Render component
      if (replace) {
        target.innerHTML = processedHTML;
      } else {
        target.insertAdjacentHTML('beforeend', processedHTML);
      }

      const loadTime = performance.now() - startTime;

      // Dispatch component loaded event
      this.dispatchComponentEvent('componentLoaded', {
        componentName,
        targetSelector,
        data,
        loadTime
      });

      console.log(`Component '${componentName}' loaded successfully in ${loadTime.toFixed(2)}ms`);
      return true;

    } catch (error) {
      const loadTime = performance.now() - startTime;
      
      console.error(`❌ ComponentLoader: Failed to load component '${componentName}':`, error);
      
      // Dispatch component failed event
      this.dispatchComponentEvent('componentFailed', {
        componentName,
        targetSelector,
        error,
        loadTime
      });
      
      // Show error state
      const target = DOMUtils.select(targetSelector);
      if (target && options.showError !== false) {
        target.innerHTML = this.getErrorHTML(componentName, error.message);
      }

      return false;
    }
  }

  /**
   * Load multiple components
   * @param {Array} components - Array of component configs
   */
  async loadComponents(components) {
    const promises = components.map(config => {
      const { name, target, data, options } = config;
      return this.loadComponent(name, target, data, options);
    });

    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed = results.length - successful;

      console.log(`Loaded ${successful}/${results.length} components successfully`);
      
      if (failed > 0) {
        console.warn(`${failed} components failed to load`);
      }

      return results;
    } catch (error) {
      console.error('Error loading multiple components:', error);
      return [];
    }
  }

  /**
   * Fetch component HTML from file
   * @param {string} componentName - Component name
   * @param {string} section - Component section (sections, layouts, etc.)
   * @param {boolean} useCache - Whether to use cache
   */
  async fetchComponent(componentName, section = 'sections', useCache = true) {
    const cacheKey = `${section}/${componentName}`;
    
    // Return cached version if available
    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Create loading promise
    const loadingPromise = this.doFetchComponent(componentName, section);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const html = await loadingPromise;
      
      // Cache the result
      if (useCache) {
        this.cache.set(cacheKey, html);
      }

      return html;
    } finally {
      // Clean up loading promise
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Actually fetch the component
   * @param {string} componentName - Component name
   * @param {string} section - Component section
   */
  async doFetchComponent(componentName, section) {
    const url = `${this.basePath}/${section}/${componentName}.html`;
    
    const result = await HttpUtils.fetchText(url);
    
    if (!result.success) {
      throw new Error(`Failed to fetch component: ${result.error || 'Unknown error'}`);
    }

    return result.data;
  }

  /**
   * Process template variables in HTML
   * @param {string} html - HTML template
   * @param {Object} data - Data for template variables
   */
  processTemplate(html, data = {}) {
    let processedHTML = html;

    // Replace template variables {{variable}}
    processedHTML = processedHTML.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = this.getNestedValue(data, key.trim());
      return value !== undefined ? value : match;
    });

    // Replace conditional blocks {{#if condition}}...{{/if}}
    processedHTML = processedHTML.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const value = this.getNestedValue(data, condition.trim());
      return value ? content : '';
    });

    // Replace loop blocks {{#each array}}...{{/each}}
    processedHTML = processedHTML.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayKey, template) => {
      const array = this.getNestedValue(data, arrayKey.trim());
      if (!Array.isArray(array)) return '';

      return array.map((item, index) => {
        let itemHTML = template;
        
        // Replace {{this}} with current item
        itemHTML = itemHTML.replace(/\{\{this\}\}/g, item);
        
        // Replace {{@index}} with current index
        itemHTML = itemHTML.replace(/\{\{@index\}\}/g, index);
        
        // Replace {{item.property}} with item properties
        if (typeof item === 'object') {
          itemHTML = this.processTemplate(itemHTML, item);
        }
        
        return itemHTML;
      }).join('');
    });

    return processedHTML;
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - Object to search
   * @param {string} path - Dot notation path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get loading HTML
   */
  getLoadingHTML() {
    return `
      <div class="component-loading flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    `;
  }

  /**
   * Get error HTML
   * @param {string} componentName - Component name that failed
   * @param {string} errorMessage - Error message
   */
  getErrorHTML(componentName, errorMessage) {
    return `
      <div class="component-error bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <iconify-icon icon="heroicons:exclamation-triangle" class="text-red-500 text-2xl mb-2"></iconify-icon>
        <h3 class="text-red-800 font-medium">Failed to load component</h3>
        <p class="text-red-600 text-sm mt-1">${componentName}: ${errorMessage}</p>
      </div>
    `;
  }

  /**
   * Dispatch component event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   */
  dispatchComponentEvent(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Clear component cache
   * @param {string} componentName - Specific component to clear, or null for all
   */
  clearCache(componentName = null) {
    if (componentName) {
      this.cache.delete(componentName);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      components: Array.from(this.cache.keys())
    };
  }
}
