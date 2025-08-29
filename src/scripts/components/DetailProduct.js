// Detail Product Component
// Handles interactive functionality for the product detail page

export class DetailProduct {
  constructor() {
    this.initialized = false;
    this.elements = {};
    this.currentImageIndex = 0;
    this.selectedVariants = {};
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    this.handleImageZoom = this.handleImageZoom.bind(this);
    this.handleVariantSelection = this.handleVariantSelection.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
    this.handleWhatsAppContact = this.handleWhatsAppContact.bind(this);
    this.handlePhoneContact = this.handlePhoneContact.bind(this);
    this.handleInquiry = this.handleInquiry.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.setupBreadcrumb = this.setupBreadcrumb.bind(this);
  }

  /**
   * Initialize the detail product component
   */
  init() {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.setupBreadcrumb();
      this.initializeVariants();
      this.setupKeyboardNavigation();
      this.initialized = true;
      
      console.log('✅ DetailProduct component initialized');
    } catch (error) {
      console.error('❌ DetailProduct initialization failed:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector('.detail-product-section'),
      mainImage: document.querySelector('.detail-product-main-image'),
      thumbnails: document.querySelectorAll('.detail-product-thumbnail'),
      imageZoomBtn: document.querySelector('.detail-product-image-zoom'),
      variantOptions: document.querySelectorAll('.detail-product-variant-option'),
      tabBtns: document.querySelectorAll('.detail-product-tab-btn'),
      tabPanels: document.querySelectorAll('.detail-product-tab-panel'),
      whatsappBtn: document.querySelector('.detail-product-contact-whatsapp'),
      phoneBtn: document.querySelector('.detail-product-contact-phone'),
      inquiryBtn: document.querySelector('.detail-product-inquiry'),
      compareBtn: document.querySelector('.detail-product-compare'),
      shareBtn: document.querySelector('.detail-product-share'),
      breadcrumbList: document.querySelector('.detail-product-breadcrumb-list'),
      relatedBtns: document.querySelectorAll('.detail-product-related-btn'),
      loadReviewsBtn: document.querySelector('.detail-product-load-reviews')
    };

    // Validate required elements
    if (!this.elements.section) {
      throw new Error('Detail product section not found');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Image thumbnails
    this.elements.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.handleThumbnailClick(index));
    });

    // Image zoom
    if (this.elements.imageZoomBtn) {
      this.elements.imageZoomBtn.addEventListener('click', this.handleImageZoom);
    }

    // Variant selection
    this.elements.variantOptions.forEach(option => {
      option.addEventListener('click', this.handleVariantSelection);
    });

    // Tab navigation
    this.elements.tabBtns.forEach(btn => {
      btn.addEventListener('click', this.handleTabSwitch);
    });

    // Contact buttons
    if (this.elements.whatsappBtn) {
      this.elements.whatsappBtn.addEventListener('click', this.handleWhatsAppContact);
    }

    if (this.elements.phoneBtn) {
      this.elements.phoneBtn.addEventListener('click', this.handlePhoneContact);
    }

    if (this.elements.inquiryBtn) {
      this.elements.inquiryBtn.addEventListener('click', this.handleInquiry);
    }

    if (this.elements.compareBtn) {
      this.elements.compareBtn.addEventListener('click', this.handleCompare);
    }

    if (this.elements.shareBtn) {
      this.elements.shareBtn.addEventListener('click', this.handleShare);
    }

    // Related products
    this.elements.relatedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleRelatedProductClick(btn);
      });
    });

    // Load more reviews
    if (this.elements.loadReviewsBtn) {
      this.elements.loadReviewsBtn.addEventListener('click', this.handleLoadMoreReviews);
    }
  }

  /**
   * Setup dynamic breadcrumb functionality
   */
  setupBreadcrumb() {
    if (!this.elements.breadcrumbList) return;

    // Get product information
    const productInfo = this.getProductInfo();
    
    // Update breadcrumb dynamically
    this.updateBreadcrumb(productInfo);
    
    console.log('🍞 Product breadcrumb setup completed');
  }

  /**
   * Get product information for breadcrumb
   */
  getProductInfo() {
    const title = document.querySelector('.detail-product-title')?.textContent || 'Product Detail';
    const brand = document.querySelector('.detail-product-brand')?.textContent || '';
    const category = this.extractCategoryFromURL() || 'Lampu LED';
    
    return {
      category: category,
      categoryUrl: '/#products',
      brand: brand,
      productName: title,
      currentUrl: window.location.pathname
    };
  }

  /**
   * Extract category from URL or other sources
   */
  extractCategoryFromURL() {
    const url = window.location.pathname;
    const pathParts = url.split('/').filter(part => part);
    
    // Try to extract category from URL structure
    if (pathParts.length >= 2) {
      return this.formatBreadcrumbText(pathParts[1]);
    }
    
    return null;
  }

  /**
   * Format text for breadcrumb display
   */
  formatBreadcrumbText(text) {
    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Update breadcrumb with product information
   */
  updateBreadcrumb(productInfo) {
    const categoryLink = this.elements.breadcrumbList.querySelector('a[data-translate="detail.product.breadcrumb.category"]');
    const currentProduct = this.elements.breadcrumbList.querySelector('[data-translate="detail.product.breadcrumb.currentProduct"]');
    
    if (categoryLink && productInfo.category) {
      categoryLink.textContent = productInfo.category;
      categoryLink.href = productInfo.categoryUrl;
    }
    
    if (currentProduct && productInfo.productName) {
      currentProduct.textContent = productInfo.productName;
    }
  }

  /**
   * Initialize variant selections
   */
  initializeVariants() {
    // Set initial variant selections
    this.elements.variantOptions.forEach(option => {
      if (option.classList.contains('active')) {
        const group = option.closest('.detail-product-variant-group');
        const label = group?.querySelector('.detail-product-variant-label')?.textContent;
        if (label) {
          this.selectedVariants[label] = option.dataset.variant;
        }
      }
    });
    
    console.log('🎛️ Initial variants:', this.selectedVariants);
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Arrow key navigation for thumbnails
    this.elements.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
          this.elements.thumbnails[index - 1].focus();
          this.handleThumbnailClick(index - 1);
        } else if (e.key === 'ArrowRight' && index < this.elements.thumbnails.length - 1) {
          this.elements.thumbnails[index + 1].focus();
          this.handleThumbnailClick(index + 1);
        }
      });
    });

    // Tab key navigation for tabs
    this.elements.tabBtns.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
          this.elements.tabBtns[index - 1].focus();
          this.elements.tabBtns[index - 1].click();
        } else if (e.key === 'ArrowRight' && index < this.elements.tabBtns.length - 1) {
          this.elements.tabBtns[index + 1].focus();
          this.elements.tabBtns[index + 1].click();
        }
      });
    });
  }

  /**
   * Handle thumbnail click
   */
  handleThumbnailClick(index) {
    const thumbnail = this.elements.thumbnails[index];
    if (!thumbnail) return;

    // Update active thumbnail
    this.elements.thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');

    // Update main image
    const newImageSrc = thumbnail.dataset.image;
    if (newImageSrc && this.elements.mainImage) {
      this.elements.mainImage.src = newImageSrc;
      this.currentImageIndex = index;
    }

    // Add visual feedback
    this.addImageTransition();
    
    console.log(`🖼️ Image changed to index: ${index}`);
  }

  /**
   * Add smooth transition effect to image change
   */
  addImageTransition() {
    if (!this.elements.mainImage) return;
    
    this.elements.mainImage.style.opacity = '0.7';
    this.elements.mainImage.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      this.elements.mainImage.style.opacity = '1';
      this.elements.mainImage.style.transform = 'scale(1)';
    }, 150);
  }

  /**
   * Handle image zoom functionality
   */
  handleImageZoom(e) {
    e.preventDefault();
    
    try {
      const imageUrl = this.elements.mainImage.src;
      const imageAlt = this.elements.mainImage.alt;
      
      // Create lightbox overlay
      const lightbox = this.createLightbox(imageUrl, imageAlt);
      document.body.appendChild(lightbox);
      
      // Show lightbox with animation
      requestAnimationFrame(() => {
        lightbox.classList.add('active');
      });
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      console.log('🔍 Product image zoom opened');
    } catch (error) {
      console.error('❌ Image zoom failed:', error);
    }
  }

  /**
   * Create lightbox for image zoom
   */
  createLightbox(imageUrl, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'detail-product-lightbox';
    lightbox.innerHTML = `
      <div class="detail-product-lightbox-overlay">
        <div class="detail-product-lightbox-container">
          <button class="detail-product-lightbox-close">
            <iconify-icon icon="heroicons:x-mark" class="detail-product-lightbox-close-icon"></iconify-icon>
          </button>
          <img src="${imageUrl}" alt="${imageAlt}" class="detail-product-lightbox-image">
          <div class="detail-product-lightbox-nav">
            <button class="detail-product-lightbox-prev" ${this.currentImageIndex === 0 ? 'disabled' : ''}>
              <iconify-icon icon="heroicons:chevron-left" class="detail-product-lightbox-nav-icon"></iconify-icon>
            </button>
            <button class="detail-product-lightbox-next" ${this.currentImageIndex === this.elements.thumbnails.length - 1 ? 'disabled' : ''}>
              <iconify-icon icon="heroicons:chevron-right" class="detail-product-lightbox-nav-icon"></iconify-icon>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .detail-product-lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      .detail-product-lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      .detail-product-lightbox-container {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      .detail-product-lightbox-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      }
      .detail-product-lightbox-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .detail-product-lightbox-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .detail-product-lightbox-nav {
        position: absolute;
        top: 50%;
        left: -60px;
        right: -60px;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        pointer-events: none;
      }
      .detail-product-lightbox-prev,
      .detail-product-lightbox-next {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
        pointer-events: auto;
      }
      .detail-product-lightbox-prev:hover,
      .detail-product-lightbox-next:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .detail-product-lightbox-prev:disabled,
      .detail-product-lightbox-next:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .detail-product-lightbox-close-icon,
      .detail-product-lightbox-nav-icon {
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(style);

    // Setup lightbox functionality
    this.setupLightboxControls(lightbox, style);

    return lightbox;
  }

  /**
   * Setup lightbox controls
   */
  setupLightboxControls(lightbox, style) {
    const closeBtn = lightbox.querySelector('.detail-product-lightbox-close');
    const prevBtn = lightbox.querySelector('.detail-product-lightbox-prev');
    const nextBtn = lightbox.querySelector('.detail-product-lightbox-next');
    const overlay = lightbox.querySelector('.detail-product-lightbox-overlay');
    const image = lightbox.querySelector('.detail-product-lightbox-image');
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (lightbox.parentNode) {
          lightbox.parentNode.removeChild(lightbox);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    };

    const navigateImage = (direction) => {
      const newIndex = this.currentImageIndex + direction;
      if (newIndex >= 0 && newIndex < this.elements.thumbnails.length) {
        const newImageSrc = this.elements.thumbnails[newIndex].dataset.image;
        image.src = newImageSrc;
        this.currentImageIndex = newIndex;
        
        // Update navigation buttons
        prevBtn.disabled = newIndex === 0;
        nextBtn.disabled = newIndex === this.elements.thumbnails.length - 1;
        
        // Update main page thumbnail
        this.handleThumbnailClick(newIndex);
      }
    };

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateImage(-1));
    nextBtn.addEventListener('click', () => navigateImage(1));
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeLightbox();
      }
    });

    // Keyboard controls
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          if (!prevBtn.disabled) navigateImage(-1);
          break;
        case 'ArrowRight':
          if (!nextBtn.disabled) navigateImage(1);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Cleanup on close
    const originalCloseLightbox = closeLightbox;
    closeLightbox = () => {
      document.removeEventListener('keydown', handleKeydown);
      originalCloseLightbox();
    };
  }

  /**
   * Handle variant selection
   */
  handleVariantSelection(e) {
    const option = e.currentTarget;
    const group = option.closest('.detail-product-variant-group');
    const label = group?.querySelector('.detail-product-variant-label')?.textContent;
    
    if (!label) return;
    
    // Update active state within group
    group.querySelectorAll('.detail-product-variant-option').forEach(opt => {
      opt.classList.remove('active');
    });
    option.classList.add('active');
    
    // Update selected variants
    this.selectedVariants[label] = option.dataset.variant;
    
    // Update price if needed (mock implementation)
    this.updatePriceForVariant(option.dataset.variant);
    
    // Add visual feedback
    this.addVariantFeedback(option);
    
    console.log(`🎛️ Variant selected: ${label} = ${option.dataset.variant}`);
    console.log('Selected variants:', this.selectedVariants);
  }

  /**
   * Update price based on variant selection (mock implementation)
   */
  updatePriceForVariant(variant) {
    const priceElement = document.querySelector('.detail-product-price-current');
    if (!priceElement) return;
    
    // Mock price updates based on variant
    const basePrices = {
      '9w': 35000,
      '12w': 45000,
      '15w': 55000
    };
    
    const newPrice = basePrices[variant] || 35000;
    priceElement.textContent = `Rp ${newPrice.toLocaleString('id-ID')}`;
    
    // Animate price change
    priceElement.style.transform = 'scale(1.1)';
    priceElement.style.color = 'var(--color-secondary-600)';
    
    setTimeout(() => {
      priceElement.style.transform = 'scale(1)';
      priceElement.style.color = 'var(--color-primary-600)';
    }, 200);
  }

  /**
   * Add visual feedback for variant selection
   */
  addVariantFeedback(option) {
    option.style.transform = 'scale(0.95)';
    setTimeout(() => {
      option.style.transform = 'scale(1)';
    }, 150);
  }

  /**
   * Handle tab switching
   */
  handleTabSwitch(e) {
    const btn = e.currentTarget;
    const targetTab = btn.dataset.tab;
    
    if (!targetTab) return;
    
    // Update active tab button
    this.elements.tabBtns.forEach(tabBtn => {
      tabBtn.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Update active tab panel
    this.elements.tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.dataset.panel === targetTab) {
        panel.classList.add('active');
      }
    });
    
    // Scroll to tabs section
    this.elements.section.querySelector('.detail-product-tabs').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Track tab view
    this.trackTabView(targetTab);
    
    console.log(`📑 Tab switched to: ${targetTab}`);
  }

  /**
   * Handle WhatsApp contact
   */
  handleWhatsAppContact(e) {
    e.preventDefault();
    
    const productData = this.getProductData();
    const message = `Halo, saya tertarik dengan produk ${productData.name} (${productData.sku}). Bisa minta informasi lebih lanjut?`;
    const phoneNumber = '6281234567890'; // Replace with actual WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Add visual feedback
    this.addButtonFeedback(e.currentTarget, 'Membuka WhatsApp...');
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    console.log('📱 WhatsApp contact initiated:', message);
  }

  /**
   * Handle phone contact
   */
  handlePhoneContact(e) {
    e.preventDefault();
    
    const phoneNumber = '+622112345678'; // Replace with actual phone number
    
    // Add visual feedback
    this.addButtonFeedback(e.currentTarget, 'Menghubungi...');
    
    // Initiate phone call
    window.location.href = `tel:${phoneNumber}`;
    
    console.log('📞 Phone contact initiated:', phoneNumber);
  }

  /**
   * Handle inquiry form
   */
  handleInquiry(e) {
    e.preventDefault();
    
    const productData = this.getProductData();
    
    // Add visual feedback
    this.addButtonFeedback(e.currentTarget, 'Membuka form...');
    
    // Create inquiry modal or redirect to contact form
    this.showInquiryModal(productData);
    
    console.log('📧 Inquiry initiated for:', productData.name);
  }

  /**
   * Show inquiry modal
   */
  showInquiryModal(productData) {
    const modal = document.createElement('div');
    modal.className = 'detail-product-inquiry-modal';
    modal.innerHTML = `
      <div class="detail-product-inquiry-overlay">
        <div class="detail-product-inquiry-container">
          <div class="detail-product-inquiry-header">
            <h3>Kirim Inquiry Produk</h3>
            <button class="detail-product-inquiry-close">
              <iconify-icon icon="heroicons:x-mark"></iconify-icon>
            </button>
          </div>
          <div class="detail-product-inquiry-content">
            <div class="detail-product-inquiry-product">
              <img src="${productData.image}" alt="${productData.name}" class="detail-product-inquiry-image">
              <div class="detail-product-inquiry-info">
                <h4>${productData.name}</h4>
                <p>SKU: ${productData.sku}</p>
                <p>Harga: ${productData.price}</p>
              </div>
            </div>
            <form class="detail-product-inquiry-form">
              <div class="detail-product-inquiry-field">
                <label>Nama Lengkap *</label>
                <input type="text" name="name" required>
              </div>
              <div class="detail-product-inquiry-field">
                <label>Email *</label>
                <input type="email" name="email" required>
              </div>
              <div class="detail-product-inquiry-field">
                <label>Nomor Telepon *</label>
                <input type="tel" name="phone" required>
              </div>
              <div class="detail-product-inquiry-field">
                <label>Pesan</label>
                <textarea name="message" rows="4" placeholder="Tulis pertanyaan atau kebutuhan Anda..."></textarea>
              </div>
              <div class="detail-product-inquiry-actions">
                <button type="button" class="detail-product-inquiry-cancel">Batal</button>
                <button type="submit" class="detail-product-inquiry-submit">Kirim Inquiry</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .detail-product-inquiry-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      .detail-product-inquiry-modal.active {
        opacity: 1;
        visibility: visible;
      }
      .detail-product-inquiry-container {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }
      .detail-product-inquiry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .detail-product-inquiry-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      .detail-product-inquiry-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .detail-product-inquiry-content {
        padding: 1.5rem;
      }
      .detail-product-inquiry-product {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
      }
      .detail-product-inquiry-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
      }
      .detail-product-inquiry-info h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      .detail-product-inquiry-info p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
        color: #6b7280;
      }
      .detail-product-inquiry-field {
        margin-bottom: 1rem;
      }
      .detail-product-inquiry-field label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
      }
      .detail-product-inquiry-field input,
      .detail-product-inquiry-field textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
      }
      .detail-product-inquiry-field input:focus,
      .detail-product-inquiry-field textarea:focus {
        outline: none;
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .detail-product-inquiry-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }
      .detail-product-inquiry-cancel {
        padding: 0.75rem 1.5rem;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      .detail-product-inquiry-submit {
        padding: 0.75rem 1.5rem;
        background: var(--color-primary-600);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      .detail-product-inquiry-submit:hover {
        background: var(--color-primary-700);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // Show modal
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    // Setup modal controls
    this.setupInquiryModalControls(modal, style);
  }

  /**
   * Setup inquiry modal controls
   */
  setupInquiryModalControls(modal, style) {
    const closeBtn = modal.querySelector('.detail-product-inquiry-close');
    const cancelBtn = modal.querySelector('.detail-product-inquiry-cancel');
    const form = modal.querySelector('.detail-product-inquiry-form');
    const overlay = modal.querySelector('.detail-product-inquiry-overlay');

    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const inquiryData = Object.fromEntries(formData);
      
      // Mock form submission
      this.submitInquiry(inquiryData);
      closeModal();
    });
  }

  /**
   * Submit inquiry (mock implementation)
   */
  submitInquiry(inquiryData) {
    console.log('📧 Inquiry submitted:', inquiryData);
    this.showNotification('Inquiry berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
    
    // In real implementation, this would send data to server
    // fetch('/api/inquiry', { method: 'POST', body: JSON.stringify(inquiryData) })
  }

  /**
   * Handle compare functionality
   */
  handleCompare = (e) => {
    e.preventDefault();
    
    const productData = this.getProductData();
    
    // Add visual feedback
    this.addButtonFeedback(e.currentTarget);
    
    // Mock compare functionality
    this.showNotification('Fitur perbandingan akan segera tersedia', 'info');
    
    console.log('⚖️ Product added to compare:', productData.name);
  }

  /**
   * Handle share functionality
   */
  handleShare(e) {
    e.preventDefault();
    
    const productData = this.getProductData();
    const shareData = {
      title: productData.name,
      text: `Lihat produk ini: ${productData.name}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showNotification('Link produk disalin ke clipboard!', 'success');
      }).catch(() => {
        this.showNotification('Gagal menyalin link', 'error');
      });
    }
    
    // Add visual feedback
    this.addButtonFeedback(e.currentTarget);
    
    console.log('📤 Product shared:', shareData);
  }

  /**
   * Get current product data
   */
  getProductData() {
    return {
      name: document.querySelector('.detail-product-title')?.textContent || '',
      brand: document.querySelector('.detail-product-brand')?.textContent || '',
      price: document.querySelector('.detail-product-price-current')?.textContent || '',
      sku: document.querySelector('.detail-product-meta-value')?.textContent || '',
      variants: { ...this.selectedVariants },
      image: this.elements.mainImage?.src || ''
    };
  }

  /**
   * Handle related product clicks
   */
  handleRelatedProductClick(btn) {
    const productItem = btn.closest('.detail-product-related-item');
    const productName = productItem.querySelector('.detail-product-related-name')?.textContent;
    
    // Add visual feedback
    this.addButtonFeedback(btn);
    
    // In a real application, this would navigate to the product page
    console.log(`🔗 Related product clicked: ${productName}`);
    
    // Mock navigation
    this.showNotification(`Memuat ${productName}...`, 'info');
  }

  /**
   * Handle load more reviews
   */
  handleLoadMoreReviews = (e) => {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const originalText = btn.querySelector('span').textContent;
    
    // Show loading state
    btn.querySelector('span').textContent = 'Memuat...';
    btn.disabled = true;
    
    // Mock loading delay
    setTimeout(() => {
      // In a real application, this would load more reviews
      this.showNotification('Fitur memuat ulasan akan segera tersedia', 'info');
      
      // Reset button
      btn.querySelector('span').textContent = originalText;
      btn.disabled = false;
    }, 1000);
  }

  /**
   * Add visual feedback to button clicks
   */
  addButtonFeedback(btn, tempText = null) {
    const originalTransform = btn.style.transform;
    btn.style.transform = 'scale(0.95)';
    
    if (tempText) {
      const originalText = btn.textContent;
      btn.textContent = tempText;
      
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
    
    setTimeout(() => {
      btn.style.transform = originalTransform;
    }, 150);
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `detail-product-notification detail-product-notification-${type}`;
    notification.textContent = message;
    
    const colors = {
      success: 'var(--color-accent-600)',
      error: 'var(--color-secondary-600)',
      info: 'var(--color-primary-600)'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  /**
   * Track tab view for analytics
   */
  trackTabView(tabName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tab_view', {
        event_category: 'product_detail',
        event_label: tabName
      });
    }
  }

  /**
   * Public method to update product data
   */
  updateProduct(productData) {
    // Update product information
    if (productData.title) {
      const titleElement = document.querySelector('.detail-product-title');
      if (titleElement) titleElement.textContent = productData.title;
    }
    
    if (productData.price) {
      const priceElement = document.querySelector('.detail-product-price-current');
      if (priceElement) priceElement.textContent = productData.price;
    }
    
    if (productData.images && productData.images.length > 0) {
      this.updateProductImages(productData.images);
    }
    
    // Update breadcrumb
    this.setupBreadcrumb();
    
    console.log('🔄 Product data updated:', productData);
  }

  /**
   * Update product images
   */
  updateProductImages(images) {
    // Update main image
    if (this.elements.mainImage && images[0]) {
      this.elements.mainImage.src = images[0];
    }
    
    // Update thumbnails
    this.elements.thumbnails.forEach((thumbnail, index) => {
      if (images[index]) {
        thumbnail.dataset.image = images[index];
        const img = thumbnail.querySelector('.detail-product-thumbnail-image');
        if (img) {
          img.src = images[index].replace('w=600&h=600', 'w=100&h=100');
        }
      }
    });
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.elements.thumbnails.forEach((thumbnail, index) => {
      thumbnail.removeEventListener('click', () => this.handleThumbnailClick(index));
    });

    if (this.elements.imageZoomBtn) {
      this.elements.imageZoomBtn.removeEventListener('click', this.handleImageZoom);
    }

    this.elements.variantOptions.forEach(option => {
      option.removeEventListener('click', this.handleVariantSelection);
    });

    this.elements.tabBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleTabSwitch);
    });

    // Clear stored data
    this.selectedVariants = {};
    this.currentImageIndex = 0;

    this.initialized = false;
    console.log('🗑️ DetailProduct component destroyed');
  }
}