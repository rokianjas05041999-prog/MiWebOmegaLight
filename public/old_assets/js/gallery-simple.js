// src/js/gallery-simple.js - Gallery Lightbox with Module Export and Multi-language Support

class GalleryLightbox {
    constructor() {
        // Static image URLs (tidak perlu translate)
        this.galleryImages = [
            'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200',
            'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=1200',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200'
        ];
        
        // Gallery data akan diisi dengan translations
        this.galleryData = [];
        
        // Get current language
        this.currentLang = localStorage.getItem('selectedLanguage') || 'id';
        
        this.currentIndex = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Bind methods SEBELUM init
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.onDOMReady = this.onDOMReady.bind(this);
        
        // Initialize
        this.init();
    }
    
    async init() {
        console.log('Initializing Gallery Lightbox...');
        
        // Load gallery data dengan bahasa saat ini
        await this.loadGalleryData();
        
        // Make functions globally accessible for backward compatibility
        window.openLightbox = (index) => this.openLightbox(index);
        window.closeLightbox = (event) => this.closeLightbox(event);
        window.prevImage = (event) => this.prevImage(event);
        window.nextImage = (event) => this.nextImage(event);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup language change listener
        this.setupLanguageListener();
        
        // Preload images
        this.preloadImages();
        
        // Add animation styles
        this.addAnimationStyles();
        
        console.log('Gallery Lightbox initialized');
    }
    
    setupLanguageListener() {
        // Remove existing listener if any
        document.removeEventListener('languageChanged', this.handleLanguageChange);
        
        // Add new listener
        document.addEventListener('languageChanged', this.handleLanguageChange);
        
        // Also listen for storage changes (for multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'selectedLanguage' && e.newValue && e.newValue !== this.currentLang) {
                console.log('Storage language change detected:', e.newValue);
                this.handleLanguageChange({ detail: { language: e.newValue } });
            }
        });
        
        console.log('Gallery language listener setup complete');
    }
    
    async handleLanguageChange(event) {
        console.log('Gallery received language change event:', event);
        
        const newLang = event.detail?.language || event.detail;
        if (!newLang || newLang === this.currentLang) {
            console.log('Same language, skipping update');
            return;
        }
        
        console.log(`Gallery language changing from ${this.currentLang} to ${newLang}`);
        this.currentLang = newLang;
        
        try {
            // Reload gallery data dengan bahasa baru
            await this.loadGalleryData();
            
            // Update gallery items di HTML
            this.updateGalleryItems();
            
            // Update lightbox content jika sedang terbuka
            const lightbox = document.getElementById('lightbox');
            if (lightbox && !lightbox.classList.contains('hidden') && lightbox.style.display === 'flex') {
                this.updateLightboxContent();
            }
            
            console.log('Gallery updated to language:', this.currentLang);
        } catch (error) {
            console.error('Error updating gallery language:', error);
        }
    }
    
    async loadGalleryData() {
        console.log('Loading gallery data for language:', this.currentLang);
        
        try {
            // Try to fetch translation file
            const response = await fetch(`/languages/${this.currentLang}.json`);
            if (response.ok) {
                const translations = await response.json();
                console.log('Fetched translations:', translations);
                
                if (translations.gallery?.items && Array.isArray(translations.gallery.items)) {
                    // Merge image URLs dengan translated text
                    this.galleryData = this.galleryImages.map((src, index) => ({
                        src: src,
                        title: translations.gallery.items[index]?.title || '',
                        desc: translations.gallery.items[index]?.desc || ''
                    }));
                    console.log('Gallery data loaded from JSON:', this.galleryData);
                    return;
                }
            } else {
                console.warn(`Failed to fetch language file: ${response.status}`);
            }
        } catch (error) {
            console.warn('Failed to load gallery translations, using fallback:', error);
        }
        
        // Use fallback data
        this.loadFallbackData();
    }
    
    loadFallbackData() {
        console.log('Loading fallback data for language:', this.currentLang);
        
        // Fallback translations embedded dalam code
        const fallbackTranslations = {
            'id': [
                { title: 'Instalasi Panel Listrik', desc: 'Gedung Perkantoran Jakarta' },
                { title: 'Instalasi Lampu Industrial', desc: 'Pabrik Tekstil Bandung' },
                { title: 'Instalasi Kabel Tray', desc: 'Mall Thamrin City' },
                { title: 'Smart Home Installation', desc: 'Perumahan Elite BSD' },
                { title: 'Instalasi Solar Panel', desc: 'Hotel Grand Indonesia' },
                { title: 'Maintenance Rutin', desc: 'Apartemen Sudirman Park' }
            ],
            'en': [
                { title: 'Electrical Panel Installation', desc: 'Jakarta Office Building' },
                { title: 'Industrial Lighting Installation', desc: 'Bandung Textile Factory' },
                { title: 'Cable Tray Installation', desc: 'Thamrin City Mall' },
                { title: 'Smart Home Installation', desc: 'BSD Elite Housing' },
                { title: 'Solar Panel Installation', desc: 'Grand Indonesia Hotel' },
                { title: 'Routine Maintenance', desc: 'Sudirman Park Apartment' }
            ],
            'my': [
                { title: 'Pemasangan Panel Elektrik', desc: 'Bangunan Pejabat Jakarta' },
                { title: 'Pemasangan Lampu Industri', desc: 'Kilang Tekstil Bandung' },
                { title: 'Pemasangan Cable Tray', desc: 'Mall Thamrin City' },
                { title: 'Pemasangan Rumah Pintar', desc: 'Perumahan Elite BSD' },
                { title: 'Pemasangan Panel Solar', desc: 'Hotel Grand Indonesia' },
                { title: 'Penyelenggaraan Rutin', desc: 'Apartmen Sudirman Park' }
            ]
        };
        
        const langData = fallbackTranslations[this.currentLang] || fallbackTranslations['id'];
        this.galleryData = this.galleryImages.map((src, index) => ({
            src: src,
            title: langData[index]?.title || '',
            desc: langData[index]?.desc || ''
        }));
        
        console.log('Fallback data loaded:', this.galleryData);
    }
    
    setupEventListeners() {
        // DOMContentLoaded handler
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.onDOMReady);
        } else {
            // DOM already loaded
            this.onDOMReady();
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch support
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    onDOMReady() {
        console.log('DOM Ready - Setting up gallery items');
        
        // Add click event listeners to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        console.log(`Found ${galleryItems.length} gallery items`);
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(parseInt(item.dataset.index || index));
            });
        });
        
        // Add intersection observer for gallery items animation
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = '';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            galleryItems.forEach(item => {
                observer.observe(item);
            });
        }
        
        // Initial update of gallery items
        this.updateGalleryItems();
    }
    
    updateGalleryItems() {
        // Update text di gallery cards sesuai bahasa
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryItems.length === 0) {
            console.warn('No gallery items found in DOM');
            return;
        }
        
        console.log(`Updating ${galleryItems.length} gallery items with language: ${this.currentLang}`);
        
        galleryItems.forEach((item, index) => {
            if (this.galleryData[index]) {
                // Find title and description elements within the overlay
                const overlay = item.querySelector('.absolute.inset-0');
                if (overlay) {
                    const titleElement = overlay.querySelector('h3');
                    const descElement = overlay.querySelector('p');
                    
                    if (titleElement) {
                        titleElement.textContent = this.galleryData[index].title;
                    }
                    if (descElement) {
                        descElement.textContent = this.galleryData[index].desc;
                    }
                }
                
                // Also update img alt attribute
                const img = item.querySelector('img');
                if (img) {
                    img.alt = this.galleryData[index].title;
                }
            }
        });
        
        console.log('Gallery items updated');
    }
    
    openLightbox(index) {
        if (index < 0 || index >= this.galleryData.length) {
            console.error('Invalid gallery index:', index);
            return;
        }
        
        this.currentIndex = index;
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            console.error('Lightbox element not found');
            return;
        }
        
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        
        // Update content before showing
        this.updateLightboxContent();
        
        // Show lightbox with animation
        lightbox.classList.remove('hidden');
        lightbox.style.display = 'flex';
        lightbox.classList.add('lightbox-fade-in');
        
        if (lightboxContent) {
            lightboxContent.classList.add('lightbox-scale-in');
        }
        
        document.body.style.overflow = 'hidden';
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            lightbox.classList.remove('lightbox-fade-in');
            if (lightboxContent) {
                lightboxContent.classList.remove('lightbox-scale-in');
            }
        }, 300);
    }
    
    closeLightbox(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        
        // Add fade out animation
        lightbox.style.animation = 'fadeOut 0.3s ease-out';
        if (lightboxContent) {
            lightboxContent.style.animation = 'scaleOut 0.3s ease-out';
        }
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.classList.add('hidden');
            lightbox.style.animation = '';
            if (lightboxContent) {
                lightboxContent.style.animation = '';
            }
            document.body.style.overflow = '';
        }, 300);
    }
    
    prevImage(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const image = document.getElementById('lightbox-image');
        
        // Fade out current image
        if (image) {
            image.classList.remove('loaded');
        }
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex - 1 + this.galleryData.length) % this.galleryData.length;
            this.updateLightboxContent();
            this.isAnimating = false;
        }, 150);
    }
    
    nextImage(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const image = document.getElementById('lightbox-image');
        
        // Fade out current image
        if (image) {
            image.classList.remove('loaded');
        }
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
            this.updateLightboxContent();
            this.isAnimating = false;
        }, 150);
    }
    
    updateLightboxContent() {
        const current = this.galleryData[this.currentIndex];
        if (!current) {
            console.error('No data for current index:', this.currentIndex);
            return;
        }
        
        const image = document.getElementById('lightbox-image');
        const captionTitle = document.getElementById('caption-title');
        const captionDesc = document.getElementById('caption-desc');
        const counter = document.getElementById('image-counter');
        
        console.log('Updating lightbox content:', current);
        
        // Remove loaded class for transition
        if (image) {
            image.classList.remove('loaded');
            
            // Update image source
            image.src = current.src;
            image.alt = current.title;
            
            // Add loaded class when image loads
            image.onload = function() {
                setTimeout(() => {
                    image.classList.add('loaded');
                }, 50);
            };
            
            image.onerror = function() {
                console.error('Failed to load image:', current.src);
            };
        }
        
        // Update caption dengan text yang sudah di-translate
        if (captionTitle) {
            captionTitle.textContent = current.title;
        }
        
        if (captionDesc) {
            captionDesc.textContent = current.desc;
        }
        
        // Update counter
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.galleryData.length}`;
        }
    }
    
    handleKeydown(e) {
        const lightbox = document.getElementById('lightbox');
        
        if (lightbox && !lightbox.classList.contains('hidden') && lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImage(e);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage(e);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeLightbox(e);
                    break;
            }
        }
    }
    
    handleTouchStart(e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            this.touchStartX = e.changedTouches[0].screenX;
        }
    }
    
    handleTouchEnd(e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                this.nextImage(null);
            } else {
                // Swipe right - previous image
                this.prevImage(null);
            }
        }
    }
    
    preloadImages() {
        console.log('Preloading gallery images...');
        this.galleryImages.forEach((src, index) => {
            // Delay preloading to avoid blocking
            setTimeout(() => {
                const img = new Image();
                img.src = src;
            }, index * 100);
        });
    }
    
    addAnimationStyles() {
        if (document.getElementById('gallery-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'gallery-animations';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes scaleOut {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(0.9); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            .lightbox-fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            .lightbox-scale-in {
                animation: scaleIn 0.3s ease-out;
            }
            
            #lightbox-image {
                transition: opacity 0.3s ease;
            }
            
            #lightbox-image.loaded {
                opacity: 1;
            }
            
            #lightbox-image:not(.loaded) {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Create instance
const galleryLightbox = new GalleryLightbox();

// Export
export default galleryLightbox;
export { GalleryLightbox };
