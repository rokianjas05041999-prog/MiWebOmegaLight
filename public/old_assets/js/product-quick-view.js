// Quick View Module
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
            <div id="quickViewModal" class="fixed inset-0 z-50 hidden overflow-y-auto">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/70 transition-opacity" id="modalBackdrop"></div>
                
                <!-- Modal Content -->
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all scale-95 opacity-0" id="modalContent">
                        
                        <!-- Modal Header -->
                        <div class="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                            <h3 class="text-xl font-semibold text-neutral-900">Quick View</h3>
                            <button id="closeModal" class="text-neutral-400 hover:text-neutral-600 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Modal Body -->
                        <div class="grid md:grid-cols-2 gap-6 p-6">
                            
                            <!-- Product Images -->
                            <div class="space-y-4">
                                <!-- Main Image -->
                                <div class="relative overflow-hidden rounded-lg bg-neutral-100">
                                    <img id="modalImage" src="" alt="" class="w-full h-96 object-cover">
                                    <!-- Badge Container -->
                                    <div id="modalBadge" class="absolute top-3 left-3"></div>
                                </div>
                            </div>
                            
                            <!-- Product Info -->
                            <div class="space-y-4">
                                <!-- Brand -->
                                <p id="modalBrand" class="text-sm text-neutral-500 uppercase tracking-wider"></p>
                                
                                <!-- Product Name -->
                                <h2 id="modalName" class="text-2xl font-bold text-neutral-900"></h2>
                                
                                <!-- Rating -->
                                <div class="flex items-center gap-2">
                                    <div class="flex text-yellow-400">
                                        ${generateStars(4)}
                                    </div>
                                    <span class="text-sm text-neutral-600">(4.0/5)</span>
                                </div>
                                
                                <!-- Price -->
                                <div class="space-y-1">
                                    <div class="flex items-center gap-3">
                                        <span id="modalPrice" class="text-3xl font-bold text-primary-600"></span>
                                        <span id="modalOriginalPrice" class="text-lg text-neutral-400 line-through"></span>
                                    </div>
                                    <p id="modalDiscount" class="text-sm text-green-600"></p>
                                </div>
                                
                                <!-- Short Description -->
                                <p id="modalDesc" class="text-neutral-600"></p>
                                
                                <!-- Additional Details -->
                                <div id="modalDetails" class="border-t border-b border-neutral-200 py-4">
                                    <h4 class="font-semibold mb-2">Detail Produk:</h4>
                                    <ul id="modalDetailsList" class="text-sm space-y-1 text-neutral-600">
                                    </ul>
                                </div>
                                
                                <!-- Stock Status -->
                                <div id="modalStock" class="flex items-center gap-2">
                                </div>
                                
                                <!-- Quantity Selector -->
                                <div class="flex items-center gap-4">
                                    <label class="text-sm font-medium text-neutral-700">Jumlah:</label>
                                    <div class="flex items-center border border-neutral-300 rounded-lg">
                                        <button id="decreaseQty" class="px-3 py-2 hover:bg-neutral-100 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                            </svg>
                                        </button>
                                        <input type="number" id="qtyInput" value="1" min="1" class="w-16 text-center border-x border-neutral-300 py-2">
                                        <button id="increaseQty" class="px-3 py-2 hover:bg-neutral-100 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex gap-3">
                                    <button id="addToCartBtn" class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition duration-300 flex items-center justify-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        Tambah ke Keranjang
                                    </button>
                                    <button class="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- Additional Info -->
                                <div class="border-t pt-4 flex gap-6 text-sm text-neutral-600">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                                        </svg>
                                        <span>Gratis Ongkir</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                        <span>Garansi Resmi</span>
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
        
        // Add CSS for modal animations
        addModalStyles();
    }
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            } else {
                stars += '<svg class="w-5 h-5 fill-current opacity-30" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            }
        }
        return stars;
    }
    
    // Add modal styles
    function addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #modalContent {
                transform: scale(0.95);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            #modalContent.show {
                transform: scale(1);
                opacity: 1;
            }
            
            /* Hide number input spinners */
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            
            input[type="number"] {
                -moz-appearance: textfield;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Quick View button clicks (using event delegation)
        document.addEventListener('click', function(e) {
            const quickViewBtn = e.target.closest('.absolute.inset-0.bg-black\\/40 button');
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
        document.getElementById('decreaseQty').addEventListener('click', decreaseQuantity);
        document.getElementById('increaseQty').addEventListener('click', increaseQuantity);
        
        // Keyboard events
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !document.getElementById('quickViewModal').classList.contains('hidden')) {
                closeModal();
            }
        });
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
        
        // Check if out of stock
        data.isOutOfStock = card.querySelector('.bg-neutral-900.text-white') !== null;
        
        // Generate product details based on description
        data.details = generateProductDetails(data.name, data.description);
        
        return data;
    }
    
    // Generate product details based on product name and description
    function generateProductDetails(name, description) {
        const details = [];
        
        // Generic details based on product type
        if (name.toLowerCase().includes('lampu led')) {
            details.push('Teknologi LED hemat energi');
            details.push('Umur pemakaian hingga 15.000 jam');
            details.push('Tidak mengandung merkuri');
            details.push('Instant on - langsung terang');
        } else if (name.toLowerCase().includes('kabel')) {
            details.push('Standar SNI');
            details.push('Conductor tembaga murni');
            details.push('Isolasi PVC berkualitas');
            details.push('Tahan panas dan api');
        } else if (name.toLowerCase().includes('mcb')) {
            details.push('Proteksi overload dan short circuit');
            details.push('Breaking capacity 6kA');
            details.push('Standar IEC 60898-1');
            details.push('Indikator ON/OFF yang jelas');
        } else if (name.toLowerCase().includes('stop kontak')) {
            details.push('Child protection safety');
            details.push('Material tahan panas');
            details.push('Grounding untuk keamanan');
            details.push('Desain modern dan elegan');
        } else if (name.toLowerCase().includes('solar panel')) {
            details.push('Efisiensi konversi tinggi');
            details.push('Tahan cuaca ekstrem');
            details.push('Garansi performa 25 tahun');
            details.push('Ramah lingkungan');
        } else {
            // Generic details
            details.push('Produk berkualitas tinggi');
            details.push('Garansi resmi pabrik');
            details.push('Harga kompetitif');
            details.push('Ready stock');
        }
        
        return details;
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
        
        // Handle product details
        const detailsList = document.getElementById('modalDetailsList');
        detailsList.innerHTML = data.details.map(detail => `<li>• ${detail}</li>`).join('');
        
        // Handle stock status
        const stockContainer = document.getElementById('modalStock');
        if (data.isOutOfStock) {
            stockContainer.innerHTML = `
                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-red-600">Stok Habis</span>
            `;
            document.getElementById('addToCartBtn').disabled = true;
            document.getElementById('addToCartBtn').classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            stockContainer.innerHTML = `
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-green-600">Stok Tersedia</span>
            `;
            document.getElementById('addToCartBtn').disabled = false;
            document.getElementById('addToCartBtn').classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Reset quantity
        document.getElementById('qtyInput').value = 1;
        
        // Show modal
        const modal = document.getElementById('quickViewModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
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
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Quantity controls
    function increaseQuantity() {
        const input = document.getElementById('qtyInput');
        input.value = parseInt(input.value) + 1;
    }
    
    function decreaseQuantity() {
        const input = document.getElementById('qtyInput');
        const currentVal = parseInt(input.value);
        if (currentVal > 1) {
            input.value = currentVal - 1;
        }
    }
    
})();
