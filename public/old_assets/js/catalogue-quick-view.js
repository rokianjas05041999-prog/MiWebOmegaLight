// Quick View Module - Improved Responsive Version
(function() {
    'use strict';
    
    // Initialize Quick View when DOM is ready
    document.addEventListener('DOMContentLoaded', initQuickView);
    
    function initQuickView() {
        // Create modal structure
        createQuickViewModal();
        
        // Attach event listeners
        attachEventListeners();
    }
    
    // Create Quick View Modal dynamically
    function createQuickViewModal() {
        const modalHTML = `
            <div id="quickViewModal" class="fixed inset-0 z-50 hidden">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/70 transition-opacity" id="modalBackdrop"></div>
                
                <!-- Modal Container with Scroll -->
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex items-center justify-center min-h-full p-4 sm:p-6">
                        <div class="bg-white rounded-lg w-full max-w-4xl shadow-2xl transform transition-all scale-95 opacity-0" id="modalContent">
                            
                            <!-- Modal Header - Sticky on Mobile -->
                            <div class="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg">
                                <h3 class="text-lg sm:text-xl font-semibold text-neutral-900">Quick View</h3>
                                <button id="closeModal" class="p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
                                    <iconify-icon icon="heroicons:x-mark" width="24" height="24"></iconify-icon>
                                </button>
                            </div>
                            
                            <!-- Modal Body with Scroll -->
                            <div class="max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                                    
                                    <!-- Product Images -->
                                    <div class="space-y-4">
                                        <!-- Main Image -->
                                        <div class="relative overflow-hidden rounded-lg bg-neutral-100">
                                            <img id="modalImage" src="" alt="" class="w-full h-64 sm:h-80 md:h-96 object-cover">
                                            <!-- Badge Container -->
                                            <div id="modalBadge" class="absolute top-3 left-3"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Product Info -->
                                    <div class="space-y-4">
                                        <!-- Brand -->
                                        <p id="modalBrand" class="text-sm text-neutral-500 uppercase tracking-wider"></p>
                                        
                                        <!-- Product Name -->
                                        <h2 id="modalName" class="text-xl sm:text-2xl font-bold text-neutral-900"></h2>
                                        
                                        <!-- Price -->
                                        <div class="space-y-1">
                                            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                                                <span id="modalPrice" class="text-2xl sm:text-3xl font-bold text-primary-600"></span>
                                                <span id="modalOriginalPrice" class="text-base sm:text-lg text-neutral-400 line-through"></span>
                                            </div>
                                            <p id="modalDiscount" class="text-sm text-green-600"></p>
                                        </div>
                                        
                                        <!-- Short Description -->
                                        <p id="modalDesc" class="text-sm sm:text-base text-neutral-600"></p>
                                        
                                        <!-- Action Buttons - Stack on Mobile -->
                                        <div class="flex flex-col sm:flex-row gap-3">
                                            <button id="detailBtn" class="flex-1 btn-primary text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary-700 transition duration-300 flex items-center justify-center gap-2">
                                                <iconify-icon icon="heroicons:shopping-cart" width="20" height="20"></iconify-icon>
                                                <span>Detail</span>
                                            </button>
                                            
                                            <div class="flex gap-3">
                                                <!-- WhatsApp Button -->
                                                <a href="#" id="whatsappBtn" target="_blank" class="flex-1 sm:flex-initial px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                                                    <iconify-icon icon="ri:whatsapp-fill" width="20" height="20"></iconify-icon>
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <!-- Additional Info -->
                                        
                                        <!-- Marketplace Links -->
                                        <div class="border-t pt-4">
                                            <p class="text-sm text-neutral-600 mb-3">Temukan produk kami di:</p>
                                            <div class="grid grid-cols-3 sm:flex sm:flex-row gap-2 sm:gap-3">
                                                <!-- Tokopedia -->
                                                <a href="https://tokopedia.link/omegalight" target="_blank" class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                                                    <iconify-icon icon="simple-icons:tokopedia" width="20" height="20" class="text-green-500"></iconify-icon>
                                                    <span class="text-xs text-neutral-600">Tokopedia</span>
                                                </a>
                                                
                                                <!-- Shopee -->
                                                <a href="https://shopee.co.id/omegalight" target="_blank" class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                                                    <iconify-icon icon="simple-icons:shopee" width="20" height="20" class="text-orange-500"></iconify-icon>
                                                    <span class="text-xs text-neutral-600">Shopee</span>
                                                </a>
                                                
                                                <!-- TikTok Shop -->
                                                <a href="https://tiktok.com/@omegalight" target="_blank" class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                                                    <iconify-icon icon="simple-icons:tiktok" width="20" height="20"></iconify-icon>
                                                    <span class="text-xs text-neutral-600">TikTok</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add CSS for modal animations and responsive styles
        addModalStyles();
    }
    
    // Add modal styles
    function addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Modal Animation */
            #modalContent {
                transform: scale(0.95);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            #modalContent.show {
                transform: scale(1);
                opacity: 1;
            }
            
            /* Prevent body scroll when modal is open */
            body.modal-open {
                overflow: hidden;
            }
            
            /* Mobile optimizations */
            @media (max-width: 640px) {
                #quickViewModal .max-h-\\[calc\\(100vh-8rem\\)\\] {
                    max-height: calc(100vh - 6rem);
                }
                
                /* Make modal full screen on very small devices */
                @media (max-height: 600px) {
                    #modalContent {
                        margin: 0;
                        height: 100vh;
                        max-width: 100%;
                        border-radius: 0;
                    }
                    
                    #modalContent .rounded-t-lg {
                        border-radius: 0;
                    }
                }
            }
            
            /* Smooth scrolling */
            #quickViewModal .overflow-y-auto {
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
            }
            
            #quickViewModal .overflow-y-auto::-webkit-scrollbar {
                width: 6px;
            }
            
            #quickViewModal .overflow-y-auto::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #quickViewModal .overflow-y-auto::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.5);
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Quick View button clicks (using event delegation)
        document.addEventListener('click', function(e) {
            const quickViewBtn = e.target.closest('.quick-view-btn') || 
                                e.target.closest('.absolute.inset-0.bg-black\\/40 button');
            if (quickViewBtn) {
                e.preventDefault();
                const productCard = quickViewBtn.closest('.product-card');
                if (productCard) {
                    openQuickView(productCard);
                }
            }
        });
        
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('modalBackdrop').addEventListener('click', closeModal);
        
        // Keyboard events
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !document.getElementById('quickViewModal').classList.contains('hidden')) {
                closeModal();
            }
        });
        
        // Prevent backdrop scroll on touch devices
        document.getElementById('modalBackdrop').addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    
    // Extract product data from card
    function extractProductData(card) {
        const data = {};
        
        // Get image
        const img = card.querySelector('.product-image');
        data.image = img ? img.src.replace('w=400', 'w=800') : '';
        data.imageAlt = img ? img.alt : '';
        
        // Get badge
        const badgeElement = card.querySelector('.absolute.top-3.left-3 span');
        if (badgeElement) {
            data.badge = {
                text: badgeElement.textContent.trim(),
                class: badgeElement.className
            };
        }
        
        // Get brand
        const brandElement = card.querySelector('.text-xs.text-neutral-500.uppercase');
        data.brand = brandElement ? brandElement.textContent.trim() : '';
        
        // Get product name
        const nameElement = card.querySelector('.text-lg.font-semibold');
        data.name = nameElement ? nameElement.textContent.trim() : '';
        
        // Get description
        const descElement = card.querySelector('.text-sm.text-neutral-600');
        data.description = descElement ? descElement.textContent.trim() : '';
        
        // Get price
        const priceElement = card.querySelector('.text-xl.font-bold.text-primary-600');
        data.price = priceElement ? priceElement.textContent.trim() : '';
        
        // Get original price
        const originalPriceElement = card.querySelector('.line-through');
        data.originalPrice = originalPriceElement ? originalPriceElement.textContent.trim() : '';
        
        return data;
    }
    
    // Open Quick View modal
    function openQuickView(productCard) {
        const data = extractProductData(productCard);
        
        // Populate modal with data
        document.getElementById('modalImage').src = data.image;
        document.getElementById('modalImage').alt = data.imageAlt;
        document.getElementById('modalBrand').textContent = data.brand;
        document.getElementById('modalName').textContent = data.name;
        document.getElementById('modalPrice').textContent = data.price;
        document.getElementById('modalDesc').textContent = data.description;
        
        // Handle badge
        const badgeContainer = document.getElementById('modalBadge');
        if (data.badge) {
            badgeContainer.innerHTML = `<span class="${data.badge.class}">${data.badge.text}</span>`;
        } else {
            badgeContainer.innerHTML = '';
        }
        
        // Handle original price and discount
        const originalPriceEl = document.getElementById('modalOriginalPrice');
        const discountEl = document.getElementById('modalDiscount');
        
        if (data.originalPrice) {
            originalPriceEl.textContent = data.originalPrice;
            originalPriceEl.style.display = 'inline';
            
            // Calculate discount
            const price = parseInt(data.price.replace(/\D/g, ''));
            const originalPrice = parseInt(data.originalPrice.replace(/\D/g, ''));
            const discount = Math.round((1 - price / originalPrice) * 100);
            discountEl.textContent = `Hemat ${discount}%`;
            discountEl.style.display = 'block';
        } else {
            originalPriceEl.style.display = 'none';
            discountEl.style.display = 'none';
        }
        
        // Update WhatsApp link with product info
        const whatsappBtn = document.getElementById('whatsappBtn');
        const whatsappNumber = '6281234567890'; // Ganti dengan nomor WhatsApp Anda
        const whatsappMessage = `Halo, saya tertarik dengan produk:\n\n*${data.name}*\nHarga: ${data.price}\n\nApakah stok masih tersedia?`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        whatsappBtn.href = whatsappUrl;
        
        // Show modal
        const modal = document.getElementById('quickViewModal');
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Animate modal
        setTimeout(() => {
            document.getElementById('modalContent').classList.add('show');
        }, 10);
    }
    
    // Close modal
    function closeModal() {
        const modalContent = document.getElementById('modalContent');
        modalContent.classList.remove('show');
        
        setTimeout(() => {
            document.getElementById('quickViewModal').classList.add('hidden');
            document.body.classList.remove('modal-open');
        }, 300);
    }
    
})();
