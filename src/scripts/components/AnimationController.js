// Animation Controller
// Handles scroll-based animations and intersection observer

import { DOMUtils } from '../utils/dom.js';

export class AnimationController {
  constructor() {
    this.observer = null;
    this.animatedElements = new Set();
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.observeElements();
    this.setupScrollAnimations();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Observe elements with animation classes
    const animationSelectors = [
      '.animate-fade-in-up',
      '.animate-fade-in',
      '.animate-slide-up',
      '.animate-bounce-in',
      '[data-animate]'
    ];

    animationSelectors.forEach(selector => {
      const elements = DOMUtils.selectAll(selector);
      elements.forEach(element => {
        // Initially hide elements that will be animated
        if (!element.style.opacity) {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
        }
        
        this.observer.observe(element);
      });
    });
  }

  animateElement(element) {
    // Get animation type
    const animationType = this.getAnimationType(element);
    
    // Apply animation based on type
    switch (animationType) {
      case 'fade-in-up':
        this.fadeInUp(element);
        break;
      case 'fade-in':
        this.fadeIn(element);
        break;
      case 'slide-up':
        this.slideUp(element);
        break;
      case 'bounce-in':
        this.bounceIn(element);
        break;
      default:
        this.fadeInUp(element);
    }
  }

  getAnimationType(element) {
    // Check for data attribute first
    const dataAnimate = element.getAttribute('data-animate');
    if (dataAnimate) return dataAnimate;

    // Check CSS classes
    if (element.classList.contains('animate-fade-in-up')) return 'fade-in-up';
    if (element.classList.contains('animate-fade-in')) return 'fade-in';
    if (element.classList.contains('animate-slide-up')) return 'slide-up';
    if (element.classList.contains('animate-bounce-in')) return 'bounce-in';

    return 'fade-in-up';
  }

  fadeInUp(element) {
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  fadeIn(element) {
    element.style.transition = 'opacity 0.5s ease-in-out';
    element.style.opacity = '1';
  }

  slideUp(element) {
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  bounceIn(element) {
    element.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.6s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'scale(1) translateY(0)';
  }

  setupScrollAnimations() {
    // Add staggered animation delays for elements in the same container
    const containers = DOMUtils.selectAll('[data-stagger]');
    
    containers.forEach(container => {
      const children = container.querySelectorAll('[class*="animate-"], [data-animate]');
      const delay = parseInt(container.getAttribute('data-stagger')) || 100;
      
      children.forEach((child, index) => {
        child.style.animationDelay = `${index * delay}ms`;
      });
    });
  }

  // Parallax effect for hero section
  setupParallax() {
    const parallaxElements = DOMUtils.selectAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    DOMUtils.addEventListener(window, 'scroll', () => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Typing animation effect
  typeWriter(element, text, speed = 100) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  // Counter animation
  animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Clean up observer
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
