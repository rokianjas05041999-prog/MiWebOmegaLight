// DOM Utilities
// Helper functions untuk manipulasi DOM

export class DOMUtils {
  /**
   * Select element dengan error handling
   */
  static select(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element) {
      console.warn(`Element tidak ditemukan: ${selector}`);
    }
    return element;
  }

  /**
   * Select multiple elements
   */
  static selectAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
  }

  /**
   * Add event listener dengan cleanup otomatis
   */
  static addEventListener(element, event, handler, options = {}) {
    if (!element) return null;
    
    element.addEventListener(event, handler, options);
    
    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  }

  /**
   * Toggle class dengan smooth transition
   */
  static toggleClass(element, className, force) {
    if (!element) return;
    
    if (force !== undefined) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  }

  /**
   * Wait for element to exist
   */
  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} tidak ditemukan dalam ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Create element dengan attributes
   */
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  }

  /**
   * Smooth scroll ke element
   */
  static smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }
}
