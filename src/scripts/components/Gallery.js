// Gallery Component
// Handles gallery lightbox functionality and image carousel

import { DOMUtils } from '../utils/dom.js';

export class Gallery {
  constructor() {
    this.isOpen = false;
    this.currentIndex = 0;
    this.images = [];
    
    this.init();
  }

  init() {
    this.setupGalleryData();
    this.createLightbox();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  setupGalleryData() {
    // Gallery images data - matches gallery.html structure
    this.images = [
      {
        src: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200',
        thumb: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600',
        title: 'gallery.items.panel.title',
        description: 'gallery.items.panel.location'
      },
      {
        src: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=1200',
        thumb: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=600',
        title: 'gallery.items.industrial.title',
        description: 'gallery.items.industrial.location'
      },
      {
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        title: 'gallery.items.cable.title',
        description: 'gallery.items.cable.location'
      },
      {
        src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200',
        thumb: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600',
        title: 'gallery.items.smart.title',
        description: 'gallery.items.smart.location'
      },
      {
        src: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200',
        thumb: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600',
        title: 'gallery.items.solar.title',
        description: 'gallery.items.solar.location'
      },
      {
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
        thumb: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
        title: 'gallery.items.maintenance.title',
        description: 'gallery.items.maintenance.location'
      }
    ];
  }

  createLightbox() {
    const lightboxHTML = `
      <div id="gallery-lightbox" class="lightbox-overlay">
        <div class="lightbox-container">
          <button class="lightbox-close" data-lightbox-close>
            <iconify-icon icon="heroicons:x-mark"></iconify-icon>
          </button>
          
          <button class="lightbox-nav lightbox-prev" data-lightbox-prev>
            <iconify-icon icon="heroicons:chevron-left"></iconify-icon>
          </button>
          
          <button class="lightbox-nav lightbox-next" data-lightbox-next>
            <iconify-icon icon="heroicons:chevron-right"></iconify-icon>
          </button>
          
          <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="" />
            <div class="lightbox-info">
              <h3 class="lightbox-title"></h3>
              <p class="lightbox-description"></p>
            </div>
          </div>
          
          <div class="lightbox-counter">
            <span class="lightbox-current">1</span> / <span class="lightbox-total">${this.images.length}</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  setupEventListeners() {
    const lightbox = DOMUtils.select('#gallery-lightbox');
    const closeBtn = DOMUtils.select('[data-lightbox-close]');
    const prevBtn = DOMUtils.select('[data-lightbox-prev]');
    const nextBtn = DOMUtils.select('[data-lightbox-next]');

    // Gallery item clicks
    const galleryItems = DOMUtils.selectAll('[data-gallery-item]');
    galleryItems.forEach(item => {
      DOMUtils.addEventListener(item, 'click', (e) => {
        e.preventDefault();
        const index = parseInt(item.getAttribute('data-gallery-item'));
        this.openLightbox(index);
      });
    });

    // Close lightbox
    DOMUtils.addEventListener(closeBtn, 'click', () => this.closeLightbox());
    DOMUtils.addEventListener(lightbox, 'click', (e) => {
      if (e.target === lightbox) this.closeLightbox();
    });

    // Navigation
    DOMUtils.addEventListener(prevBtn, 'click', () => this.previousImage());
    DOMUtils.addEventListener(nextBtn, 'click', () => this.nextImage());

    // Make openLightbox globally available for backward compatibility
    window.openLightbox = (index) => this.openLightbox(index);
  }

  setupKeyboardNavigation() {
    DOMUtils.addEventListener(document, 'keydown', (e) => {
      if (!this.isOpen) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.previousImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.isOpen = true;
    
    const lightbox = DOMUtils.select('#gallery-lightbox');
    const image = DOMUtils.select('.lightbox-image');
    const title = DOMUtils.select('.lightbox-title');
    const description = DOMUtils.select('.lightbox-description');
    const current = DOMUtils.select('.lightbox-current');
    
    // Update content
    const currentImage = this.images[index];
    image.src = currentImage.src;
    image.alt = currentImage.title;
    title.setAttribute('data-translate', currentImage.title);
    description.setAttribute('data-translate', currentImage.description);
    current.textContent = index + 1;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Trigger translation update if LanguageManager is available
    if (window.App && window.App.languageManager) {
      window.App.languageManager.updateTranslations();
    }
  }

  closeLightbox() {
    this.isOpen = false;
    
    const lightbox = DOMUtils.select('#gallery-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateLightboxContent();
  }

  previousImage() {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const image = DOMUtils.select('.lightbox-image');
    const title = DOMUtils.select('.lightbox-title');
    const description = DOMUtils.select('.lightbox-description');
    const current = DOMUtils.select('.lightbox-current');
    
    const currentImage = this.images[this.currentIndex];
    
    // Add loading class
    image.classList.add('loading');
    
    // Update image
    image.onload = () => {
      image.classList.remove('loading');
    };
    
    image.src = currentImage.src;
    image.alt = currentImage.title;
    title.setAttribute('data-translate', currentImage.title);
    description.setAttribute('data-translate', currentImage.description);
    current.textContent = this.currentIndex + 1;
    
    // Update translations
    if (window.App && window.App.languageManager) {
      window.App.languageManager.updateTranslations();
    }
  }
}

export default Gallery;
