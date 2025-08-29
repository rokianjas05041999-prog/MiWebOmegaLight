// Product Quick View Component
// Handles product quick view modal functionality

import { DOMUtils } from '../utils/dom.js';

export class ProductQuickView {
  constructor() {
    this.isOpen = false;
    this.currentProduct = null;
    this.modal = null;
    
    this.init();
  }

  init() {
    this.createModal();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  /**
   * Create the quick view modal structure
   */
  createModal() {
    // Create modal overlay
    this.modal = document.createElement('div');
    this.modal.className = 'quick-view-overlay';
    this.modal.innerHTML = `
      <div class="quick-view-container">
        <!-- Close Button -->
        <button class="quick-view-close" aria-label="Close quick view">
          <iconify-icon icon="material-symbols:close"></iconify-icon>
        </button>
        
        <!-- Modal Content -->
        <div class="quick-view-content">
          
          <!-- Product Image Section -->
          <div class="quick-view-image-section">
            <!-- Product Badge -->
            <div class="quick-view-badge-wrapper">
              <span class="quick-view-badge"></span>
            </div>
            
            <!-- Product Image -->
            <img class="quick-view-image" src="" alt="" loading="lazy">
          </div>
          
          <!-- Product Info Section -->
          <div class="quick-view-info-section">
            <!-- Brand -->
            <p class="quick-view-brand"></p>
            
            <!-- Product Title -->
            <h2 class="quick-view-title"></h2>
            
            <!-- Product Description -->
            <p class="quick-view-description"></p>
            
            <!-- Price Section -->
            <div class="quick-view-price-section">
              <span class="quick-view-price-current"></span>
              <span class="quick-view-price-original"></span>
            </div>
            
            <!-- Stock Status -->
            <div class="quick-view-stock">
              <iconify-icon icon="material-symbols:check-circle" class="quick-view-stock-icon"></iconify-icon>
              <span class="quick-view-stock-text" data-translate="products.quickView.inStock">Tersedia</span>
            </div>
            
            <!-- Shop Links -->
            <div class="quick-view-shop-links">
              <p class="quick-view-shop-text" data-translate="products.quickView.findAt">Temukan produk kami di:</p>
              <div class="quick-view-shop-buttons">
                <a href="#" class="quick-view-shop-btn quick-view-shop-tokopedia">
                  <iconify-icon icon="simple-icons:tokopedia"></iconify-icon>
                  <span>Tokopedia</span>
                </a>
                <a href="#" class="quick-view-shop-btn quick-view-shop-shopee">
                  <iconify-icon icon="simple-icons:shopee"></iconify-icon>
                  <span>Shopee</span>
                </a>
                <a href="#" class="quick-view-shop-btn quick-view-shop-tiktok">
                  <iconify-icon icon="simple-icons:tiktok"></iconify-icon>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="quick-view-actions">
              <button class="quick-view-btn quick-view-btn-detail">
                <iconify-icon icon="material-symbols:info" class="quick-view-btn-icon"></iconify-icon>
                <span data-translate="products.quickView.detail">Detail</span>
              </button>
              <button class="quick-view-btn quick-view-btn-whatsapp">
                <iconify-icon icon="ic:baseline-whatsapp" class="quick-view-btn-icon"></iconify-icon>
                <span data-translate="products.quickView.whatsapp">WhatsApp</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(this.modal);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Quick view button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.product-quick-view')) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          this.openQuickView(productCard);
        }
      }
    });

    // Close button click
    this.modal.querySelector('.quick-view-close').addEventListener('click', () => {
      this.closeQuickView();
    });

    // Overlay click to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeQuickView();
      }
    });

    // Prevent modal content click from closing
    this.modal.querySelector('.quick-view-container').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Action button clicks
    this.modal.querySelector('.quick-view-btn-whatsapp').addEventListener('click', () => {
      this.handleWhatsAppClick();
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      switch (e.key) {
        case 'Escape':
          this.closeQuickView();
          break;
      }
    });
  }

  /**
   * Extract product data from product card
   */
  extractProductData(productCard) {
    const data = {
      brand: '',
      name: '',
      description: '',
      currentPrice: '',
      originalPrice: '',
      image: '',
      alt: '',
      badge: '',
      badgeType: '',
      isDisabled: false
    };

    // Extract brand
    const brandElement = productCard.querySelector('.product-brand');
    if (brandElement) {
      data.brand = brandElement.textContent.trim();
    }

    // Extract name
    const nameElement = productCard.querySelector('.product-name');
    if (nameElement) {
      data.name = nameElement.textContent.trim();
    }

    // Extract description
    const descElement = productCard.querySelector('.product-description');
    if (descElement) {
      data.description = descElement.textContent.trim();
    }

    // Extract prices
    const currentPriceElement = productCard.querySelector('.product-price-current');
    if (currentPriceElement) {
      data.currentPrice = currentPriceElement.textContent.trim();
    }

    const originalPriceElement = productCard.querySelector('.product-price-original');
    if (originalPriceElement) {
      data.originalPrice = originalPriceElement.textContent.trim();
    }

    // Extract image
    const imageElement = productCard.querySelector('.product-image');
    if (imageElement) {
      data.image = imageElement.src;
      data.alt = imageElement.alt || data.name;
    }

    // Extract badge
    const badgeElement = productCard.querySelector('.product-badge');
    if (badgeElement) {
      data.badge = badgeElement.textContent.trim();
      // Get badge type from class
      if (badgeElement.classList.contains('product-badge-sale')) {
        data.badgeType = 'sale';
      } else if (badgeElement.classList.contains('product-badge-new')) {
        data.badgeType = 'new';
      } else if (badgeElement.classList.contains('product-badge-hot')) {
        data.badgeType = 'hot';
      } else if (badgeElement.classList.contains('product-badge-bestseller')) {
        data.badgeType = 'bestseller';
      } else if (badgeElement.classList.contains('product-badge-limited')) {
        data.badgeType = 'limited';
      }
    }

    // Check if product is disabled
    data.isDisabled = productCard.classList.contains('product-card-disabled');

    return data;
  }

  /**
   * Open quick view modal
   */
  openQuickView(productCard) {
    this.currentProduct = this.extractProductData(productCard);
    this.populateModal();
    
    // Show modal
    this.modal.classList.add('active');
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.modal.querySelector('.quick-view-close').focus();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('quickViewOpened', {
      detail: { product: this.currentProduct }
    }));
  }

  /**
   * Close quick view modal
   */
  closeQuickView() {
    this.modal.classList.remove('active');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear current product
    this.currentProduct = null;
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('quickViewClosed'));
  }

  /**
   * Populate modal with product data
   */
  populateModal() {
    if (!this.currentProduct) return;

    const product = this.currentProduct;

    // Set brand
    const brandElement = this.modal.querySelector('.quick-view-brand');
    brandElement.textContent = product.brand;

    // Set title
    const titleElement = this.modal.querySelector('.quick-view-title');
    titleElement.textContent = product.name;

    // Set description
    const descElement = this.modal.querySelector('.quick-view-description');
    descElement.textContent = product.description;

    // Set image
    const imageElement = this.modal.querySelector('.quick-view-image');
    imageElement.src = product.image;
    imageElement.alt = product.alt;

    // Set badge
    const badgeElement = this.modal.querySelector('.quick-view-badge');
    const badgeWrapper = this.modal.querySelector('.quick-view-badge-wrapper');
    
    if (product.badge && product.badgeType) {
      badgeElement.textContent = product.badge;
      badgeElement.className = `quick-view-badge quick-view-badge-${product.badgeType}`;
      badgeWrapper.style.display = 'block';
    } else {
      badgeWrapper.style.display = 'none';
    }

    // Set prices
    const currentPriceElement = this.modal.querySelector('.quick-view-price-current');
    const originalPriceElement = this.modal.querySelector('.quick-view-price-original');
    
    currentPriceElement.textContent = product.currentPrice;
    
    if (product.originalPrice) {
      originalPriceElement.textContent = product.originalPrice;
      originalPriceElement.style.display = 'inline';
    } else {
      originalPriceElement.style.display = 'none';
    }

    // Set stock status
    const stockSection = this.modal.querySelector('.quick-view-stock');
    const stockIcon = this.modal.querySelector('.quick-view-stock-icon');
    const stockText = this.modal.querySelector('.quick-view-stock-text');
    
    if (product.isDisabled) {
      stockIcon.setAttribute('icon', 'material-symbols:cancel');
      stockText.setAttribute('data-translate', 'products.quickView.outOfStock');
      stockText.textContent = 'Stok Habis';
      stockSection.classList.add('out-of-stock');
    } else {
      stockIcon.setAttribute('icon', 'material-symbols:check-circle');
      stockText.setAttribute('data-translate', 'products.quickView.inStock');
      stockText.textContent = 'Tersedia';
      stockSection.classList.remove('out-of-stock');
    }
  }

  /**
   * Handle WhatsApp button click
   */
  handleWhatsAppClick() {
    if (!this.currentProduct) return;

    const product = this.currentProduct;
    const message = `Halo, saya tertarik dengan produk ${product.brand} ${product.name} dengan harga ${product.currentPrice}. Apakah masih tersedia?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Public method to open quick view programmatically
   */
  open(productData) {
    this.currentProduct = productData;
    this.populateModal();
    this.modal.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Public method to close quick view programmatically
   */
  close() {
    this.closeQuickView();
  }

  /**
   * Check if quick view is open
   */
  isOpened() {
    return this.isOpen;
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.modal) {
      this.modal.remove();
    }
    document.removeEventListener('keydown', this.handleKeydown);
  }
}
