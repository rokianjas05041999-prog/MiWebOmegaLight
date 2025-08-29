// src/js/language-switcher.js
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLanguage') || 'id';
        this.translations = {};
        this.init();
    }

    async init() {
        console.log('Initializing Language Switcher...');
        
        // Load translations from public directory
        await this.loadTranslations();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply saved language
        this.switchLanguage(this.currentLang);
    }

    async loadTranslations() {
        try {
            // PERBAIKAN: Gunakan path tanpa /public karena files di public directory served at root
            const [idRes, enRes, myRes] = await Promise.all([
                fetch('/languages/id.json'),    // Bukan /public/languages/id.json
                fetch('/languages/en.json'),    // Bukan /public/languages/en.json
                fetch('/languages/my.json')     // Bukan /public/languages/my.json
            ]);

            // Check if all responses are OK
            if (!idRes.ok || !enRes.ok || !myRes.ok) {
                throw new Error('Failed to load one or more language files');
            }

            // Parse JSON
            this.translations = {
                'id': await idRes.json(),
                'en': await enRes.json(),
                'my': await myRes.json()
            };

            console.log('Translations loaded successfully:', this.translations);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Use embedded fallback
            this.loadFallbackTranslations();
        }
    }

    loadFallbackTranslations() {
        console.log('Using fallback translations');
        this.translations = {
            'id': {
                "navbar": {
                    "home": "Home",
                    "category": "Kategori",
                    "gallery": "Galeri",
                    "products": "Produk",
                    "blog": "Blog",
                    "about": "Tentang Kami",
                    "contact": "Hubungi Kami",
                    "search_placeholder": "Cari..."
                },
                "hero": {
                    "title": "Solusi Kelistrikan Terpercaya",
                    "subtitle": "Toko Listrik Lengkap untuk Kebutuhan Anda",
                    "description": "Melayani kebutuhan listrik rumah dan industri sejak 1995. Kami menyediakan produk berkualitas dari brand ternama dengan harga kompetitif dan layanan instalasi profesional oleh teknisi berpengalaman.",
                    "cta": "Lihat Produk"
                },
                "categories": {
                    "section_title": "Kategori Produk",
                    "section_subtitle": "Temukan Kebutuhan Listrik Anda",
                    "section_desc": "Berbagai macam peralatan listrik berkualitas dari brand ternama untuk kebutuhan rumah tangga hingga industri."
                },
                "about": {
                    "section_title": "Tentang Kami",
                    "subtitle": "Toko Listrik Terpercaya Sejak 1998",
                    "description": "Melayani kebutuhan peralatan listrik untuk rumah tangga dan industri dengan produk berkualitas dan harga kompetitif.",
                    "company": "CV. Elektro Jaya Abadi",
                    "tagline": "Spesialis Peralatan Listrik & Instalasi"
                },
                "statistics": {
                    "products": "Produk Tersedia",
                    "customers": "Pelanggan Puas",
                    "experience": "Tahun Pengalaman",
                    "brands": "Brand Partner"
                },
                "gallery": {
                    "section_title": "Galeri Proyek",
                    "subtitle": "Dokumentasi Hasil Kerja Kami",
                    "short_description": "Lihat berbagai proyek instalasi listrik yang telah kami selesaikan dengan standar kualitas tinggi.",
                    "cta": "Lihat Semua Proyek"
                },
                "products": {
                    "section_title": "Produk Unggulan",
                    "subtitle": "Peralatan Listrik Berkualitas Terbaik",
                    "short_description": "Temukan berbagai produk kelistrikan original dengan harga kompetitif. Semua produk bergaransi resmi dari distributor.",
                    "detail": "Detail",
                    "more": "Lihat Produk Lainnya",
                    "outstock": "Stok Habis",
                    "badges": {
                        "sale": "SALE",
                        "new": "BARU",
                        "hot": "HOT",
                        "bestseller": "BEST SELLER",
                        "limited": "LIMITED"
                    }
                },
                "blog": {
                    "section_title": "Blog & Artikel",
                    "subtitle": "Informasi Terkini Seputar Kelistrikan",
                    "short_description": "Dapatkan tips, panduan, dan berita terbaru seputar dunia kelistrikan, instalasi, dan produk-produk inovatif untuk kebutuhan Anda.",
                    "readmore": "Baca Selengkapnya",
                    "cta": "Lihat Semua Artikel"
                },
                "testimonial": {
                    "section_title": "Apa Kata Mereka",
                    "subtitle": "Kepercayaan Pelanggan adalah Kebanggaan Kami",
                    "description": "Ribuan pelanggan telah mempercayakan kebutuhan listrik mereka kepada kami. Berikut adalah cerita mereka."
                },
                "footer": {
                    "follow": "Ikuti Kami",
                    "menu": "Menu Utama",
                    "info": "Informasi",
                    "contact": "Hubungi Kami",
                    "newsletter": "Newsletter",
                    "newsletter_desc": "Dapatkan info promo dan produk terbaru",
                    "subscribe": "Daftar"
                }
            },
            'en': {
                "navbar": {
                    "home": "Home",
                    "category": "Categories",
                    "gallery": "Gallery",
                    "products": "Products",
                    "blog": "Blog",
                    "about": "About Us",
                    "contact": "Contact Us",
                    "search_placeholder": "Search..."
                },
                "hero": {
                    "title": "Trusted Electrical Solutions",
                    "subtitle": "Complete Electrical Store for Your Needs",
                    "description": "Serving electrical needs for homes and industries since 1995. We provide quality products from renowned brands at competitive prices and professional installation services by experienced technicians.",
                    "cta": "View Products"
                },
                "categories": {
                    "section_title": "Product Categories",
                    "section_subtitle": "Find Your Electrical Needs",
                    "section_desc": "Various quality electrical equipment from renowned brands for household to industrial needs."
                },
                "about": {
                    "section_title": "About Us",
                    "subtitle": "Trusted Electrical Store Since 1998",
                    "description": "Serving electrical equipment needs for households and industries with quality products and competitive prices.",
                    "company": "CV. Elektro Jaya Abadi",
                    "tagline": "Electrical Equipment & Installation Specialist"
                },
                "statistics": {
                    "products": "Products Available",
                    "customers": "Satisfied Customers",
                    "experience": "Years of Experience",
                    "brands": "Partner Brands"
                },
                "gallery": {
                    "section_title": "Project Gallery",
                    "subtitle": "Documentation of Our Work",
                    "short_description": "See various electrical installation projects that we have completed with high quality standards.",
                    "cta": "View All Projects"
                },
                "products": {
                    "section_title": "Featured Products",
                    "subtitle": "Best Quality Electrical Equipment",
                    "short_description": "Find various original electrical products at competitive prices. All products come with official warranty from distributors.",
                    "detail": "Details",
                    "more": "View More Products",
                    "outstock": "Out of Stock",
                    "badges": {
                        "sale": "SALE",
                        "new": "NEW",
                        "hot": "HOT",
                        "bestseller": "BEST SELLER",
                        "limited": "LIMITED"
                    }
                },
                "blog": {
                    "section_title": "Blog & Articles",
                    "subtitle": "Latest Electrical Information",
                    "short_description": "Get tips, guides, and latest news about the electrical world, installations, and innovative products for your needs.",
                    "readmore": "Read More",
                    "cta": "View All Articles"
                },
                "testimonial": {
                    "section_title": "What They Say",
                    "subtitle": "Customer Trust is Our Pride",
                    "description": "Thousands of customers have entrusted their electrical needs to us. Here are their stories."
                },
                "footer": {
                    "follow": "Follow Us",
                    "menu": "Main Menu",
                    "info": "Information",
                    "contact": "Contact Us",
                    "newsletter": "Newsletter",
                    "newsletter_desc": "Get the latest promo and product info",
                    "subscribe": "Subscribe"
                }
            },
            'my': {
                "navbar": {
                    "home": "Laman Utama",
                    "category": "Kategori",
                    "gallery": "Galeri",
                    "products": "Produk",
                    "blog": "Blog",
                    "about": "Tentang Kami",
                    "contact": "Hubungi Kami",
                    "search_placeholder": "Cari..."
                },
                "hero": {
                    "title": "Penyelesaian Elektrik Dipercayai",
                    "subtitle": "Kedai Elektrik Lengkap untuk Keperluan Anda",
                    "description": "Melayani keperluan elektrik rumah dan industri sejak 1995. Kami menyediakan produk berkualiti dari jenama terkenal dengan harga kompetitif dan perkhidmatan pemasangan profesional oleh juruteknik berpengalaman.",
                    "cta": "Lihat Produk"
                },
                "categories": {
                    "section_title": "Kategori Produk",
                    "section_subtitle": "Cari Keperluan Elektrik Anda",
                    "section_desc": "Pelbagai peralatan elektrik berkualiti dari jenama terkenal untuk keperluan rumah tangga hingga industri."
                },
                "about": {
                    "section_title": "Tentang Kami",
                    "subtitle": "Kedai Elektrik Dipercayai Sejak 1998",
                    "description": "Melayani keperluan peralatan elektrik untuk rumah tangga dan industri dengan produk berkualiti dan harga kompetitif.",
                    "company": "CV. Elektro Jaya Abadi",
                    "tagline": "Pakar Peralatan Elektrik & Pemasangan"
                },
                "statistics": {
                    "products": "Produk Tersedia",
                    "customers": "Pelanggan Berpuas Hati",
                    "experience": "Tahun Pengalaman",
                    "brands": "Jenama Rakan Kongsi"
                },
                "gallery": {
                    "section_title": "Galeri Projek",
                    "subtitle": "Dokumentasi Hasil Kerja Kami",
                    "short_description": "Lihat pelbagai projek pemasangan elektrik yang telah kami siapkan dengan standard kualiti tinggi.",
                    "cta": "Lihat Semua Projek"
                },
                "products": {
                    "section_title": "Produk Unggulan",
                    "subtitle": "Peralatan Elektrik Berkualiti Terbaik",
                    "short_description": "Cari pelbagai produk elektrik asli dengan harga kompetitif. Semua produk berwaranti rasmi dari pengedar.",
                    "detail": "Butiran",
                    "more": "Lihat Produk Lain",
                    "outstock": "Stok Habis",
                    "badges": {
                        "sale": "JUALAN",
                        "new": "BARU",
                        "hot": "HOT",
                        "bestseller": "TERLARIS",
                        "limited": "TERHAD"
                    }
                },
                "blog": {
                    "section_title": "Blog & Artikel",
                    "subtitle": "Maklumat Terkini Seputar Elektrik",
                    "short_description": "Dapatkan tip, panduan, dan berita terkini seputar dunia elektrik, pemasangan, dan produk-produk inovatif untuk keperluan anda.",
                    "readmore": "Baca Selanjutnya",
                    "cta": "Lihat Semua Artikel"
                },
                "testimonial": {
                    "section_title": "Apa Kata Mereka",
                    "subtitle": "Kepercayaan Pelanggan adalah Kebanggaan Kami",
                    "description": "Ribuan pelanggan telah mempercayakan keperluan elektrik mereka kepada kami. Berikut adalah cerita mereka."
                },
                "footer": {
                    "follow": "Ikuti Kami",
                    "menu": "Menu Utama",
                    "info": "Maklumat",
                    "contact": "Hubungi Kami",
                    "newsletter": "Buletin",
                    "newsletter_desc": "Dapatkan maklumat promosi dan produk terkini",
                    "subscribe": "Daftar"
                }
            }
        };
    }

    setupEventListeners() {
        const langToggleBtn = document.getElementById('langToggleBtn');
        const langSelectorPanel = document.getElementById('langSelectorPanel');
        
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langSelectorPanel.classList.toggle('active');
            });
        }
        
        const langRadios = document.querySelectorAll('input[name="language"]');
        langRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
                langSelectorPanel?.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.floating-lang-container')) {
                langSelectorPanel?.classList.remove('active');
            }
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        
        // Debug log
        console.log('Switching to language:', lang);
        console.log('Gallery translations:', this.translations[lang]?.gallery);
        
        document.documentElement.lang = lang === 'my' ? 'ms' : lang;
        this.updatePageContent(lang);
        
        const langRadio = document.querySelector(`input[name="language"][value="${lang}"]`);
        if (langRadio) {
            langRadio.checked = true;
        }
        
        this.updateFloatingButton(lang);
        //Dispatch custom event untuk notify components lain
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang },
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
        console.log('Language change event dispatched:', lang);
    }

    updateFloatingButton(lang) {
        const langToggleBtn = document.getElementById('langToggleBtn');
        if (!langToggleBtn) return;
        
        const flagMap = {
            'id': '🇮🇩',
            'en': '🇬🇧',
            'my': '🇲🇾'
        };
        
        langToggleBtn.innerHTML = `
            <iconify-icon icon="heroicons:language" class="text-2xl"></iconify-icon>
            <span class="absolute -top-1 -left-1 text-xs bg-red-500 text-white rounded-full px-1">${flagMap[lang]}</span>
        `;
    }

    // NEW METHOD: Handle nested keys for data-translate attributes
    updateTextElements(translations) {
        // Helper function to get nested property with dot notation
        const getNestedProperty = (obj, path) => {
            if (!path.includes('.')) {
                return obj[path];
            }
            
            return path.split('.').reduce((current, prop) => {
                return current && current[prop] !== undefined ? current[prop] : null;
            }, obj);
        };
        
        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getNestedProperty(translations, key);
            
            if (translation !== null && translation !== undefined) {
                element.textContent = translation;
            } else {
                console.warn(`Translation not found for key: ${key}`);
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = getNestedProperty(translations, key);
            
            if (translation !== null && translation !== undefined) {
                element.placeholder = translation;
            }
        });
    }

    updatePageContent(lang) {
        const translations = this.translations[lang];
        if (!translations) {
            console.error('No translations found for language:', lang);
            return;
        }
        
        // IMPORTANT: Update elements with data-translate first
        this.updateTextElements(translations);
        
        // Then update specific elements that don't use data-translate
        this.updateNavbar(translations);
        this.updateHeroSection(translations);
        this.updateOtherSections(translations);
    }

    updateNavbar(translations) {
        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        const navKeys = ['home', 'category', 'gallery', 'products', 'blog', 'about'];
        
        navLinks.forEach((link, index) => {
            if (navKeys[index] && translations.navbar?.[navKeys[index]]) {
                link.textContent = translations.navbar[navKeys[index]];
            }
        });
        
        // Update search placeholder
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput && translations.navbar?.search_placeholder) {
            searchInput.placeholder = translations.navbar.search_placeholder;
        }
        
        // Update CTA button
        const ctaButton = document.querySelector('.nav-cta-button');
        if (ctaButton && translations.navbar?.contact) {
            ctaButton.innerHTML = `
                <iconify-icon icon="heroicons:phone" class="w-4 h-4 mr-2"></iconify-icon>
                ${translations.navbar.contact}
            `;
        }
    }

    updateHeroSection(translations) {
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle && translations.hero?.title) {
            heroTitle.textContent = translations.hero.title;
        }
        
        const heroSubtitle = document.querySelector('#hero p.text-xl');
        if (heroSubtitle && translations.hero?.subtitle) {
            heroSubtitle.textContent = translations.hero.subtitle;
        }
        
        const heroDesc = document.querySelector('#hero p.text-lg');
        if (heroDesc && translations.hero?.description) {
            heroDesc.textContent = translations.hero.description;
        }
        
        const heroCta = document.querySelector('#hero a span');
        if (heroCta && translations.hero?.cta) {
            heroCta.textContent = translations.hero.cta;
        }
    }

    updateOtherSections(translations) {
        // Categories
        const catTitle = document.querySelector('#productCategories h2');
        if (catTitle && translations.categories?.section_title) {
            catTitle.textContent = translations.categories.section_title;
        }
        
        const catSubtitle = document.querySelector('#productCategories p.text-xl');
        if (catSubtitle && translations.categories?.section_subtitle) {
            catSubtitle.textContent = translations.categories.section_subtitle;
        }
        
        const catDesc = document.querySelector('#productCategories p.text-l');
        if (catDesc && translations.categories?.section_desc) {
            catDesc.textContent = translations.categories.section_desc;
        }
        
        // About
        const aboutTitle = document.querySelector('.section-gray h2');
        if (aboutTitle && translations.about?.section_title) {
            aboutTitle.textContent = translations.about.section_title;
        }
        
        // Statistics
        const statItems = document.querySelectorAll('#statistics p.text-sm');
        const statKeys = ['products', 'customers', 'experience', 'brands'];
        statItems.forEach((item, index) => {
            if (statKeys[index] && translations.statistics?.[statKeys[index]]) {
                item.textContent = translations.statistics[statKeys[index]];
            }
        });
        
        // Gallery - Manual update for elements without data-translate
        const galleryCta = document.querySelector('#gallery .text-center a');
        if (galleryCta && translations.gallery?.cta) {
            // Only update the text, preserve the icon
            const icon = galleryCta.querySelector('svg');
            galleryCta.textContent = translations.gallery.cta;
            if (icon) {
                galleryCta.appendChild(icon);
            }
        }
        
        // Products
        const productsTitle = document.querySelector('#productCatalogue h2');
        if (productsTitle && translations.products?.section_title) {
            productsTitle.textContent = translations.products.section_title;
        }
        
        const productsSubtitle = document.querySelector('#productCatalogue p.text-xl');
        if (productsSubtitle && translations.products?.subtitle) {
            productsSubtitle.textContent = translations.products.subtitle;
        }
        
        // Update product buttons
        document.querySelectorAll('.product-card button').forEach(button => {
            if (!button.disabled && button.textContent.includes('Detail')) {
                const icon = button.querySelector('iconify-icon');
                if (icon && translations.products?.detail) {
                    button.innerHTML = '';
                    button.appendChild(icon.cloneNode(true));
                    button.appendChild(document.createTextNode(' ' + translations.products.detail));
                }
            } else if (button.disabled && translations.products?.outstock) {
                button.textContent = translations.products.outstock;
            }
        });
        
        // Blog
        const blogTitle = document.querySelector('#blogSection h2');
        if (blogTitle && translations.blog?.section_title) {
            blogTitle.textContent = translations.blog.section_title;
        }
        
        const blogSubtitle = document.querySelector('#blogSection p.text-xl');
        if (blogSubtitle && translations.blog?.subtitle) {
            blogSubtitle.textContent = translations.blog.subtitle;
        }
        
        // Update "Baca Selengkapnya" links
        document.querySelectorAll('.blog-card a').forEach(link => {
            if (link.textContent.includes('Selengkapnya') || link.textContent.includes('More')) {
                const icon = link.querySelector('iconify-icon');
                if (translations.blog?.readmore) {
                    link.textContent = translations.blog.readmore;
                    if (icon) link.appendChild(icon);
                }
            }
        });
        
        // Testimonials
        const testimonialTitle = document.querySelector('.testimonial-section h2');
        if (testimonialTitle && translations.testimonial?.section_title) {
            testimonialTitle.textContent = translations.testimonial.section_title;
        }
        
        const testimonialSubtitle = document.querySelector('.testimonial-section p.text-xl');
        if (testimonialSubtitle && translations.testimonial?.subtitle) {
            testimonialSubtitle.textContent = translations.testimonial.subtitle;
        }
        
        // Footer
        const footerTitles = document.querySelectorAll('.footer-title');
        const footerKeys = ['menu', 'info', 'contact'];
        footerTitles.forEach((title, index) => {
            if (footerKeys[index] && translations.footer?.[footerKeys[index]]) {
                title.textContent = translations.footer[footerKeys[index]];
            }
        });
        
        // Newsletter
        const newsletterTitle = document.querySelector('.newsletter-section h4');
        if (newsletterTitle && translations.footer?.newsletter) {
            newsletterTitle.textContent = translations.footer.newsletter;
        }
        
        const newsletterDesc = document.querySelector('.newsletter-section p');
        if (newsletterDesc && translations.footer?.newsletter_desc) {
            newsletterDesc.textContent = translations.footer.newsletter_desc;
        }
        
        const newsletterBtn = document.querySelector('.newsletter-btn');
        if (newsletterBtn && translations.footer?.subscribe) {
            newsletterBtn.textContent = translations.footer.subscribe;
        }
        
        // Update badges
        this.updateBadges(translations);
    }

    updateBadges(translations) {
        if (!translations.products?.badges) return;
        
        const badgeMap = {
            'SALE': 'sale',
            'NEW': 'new',
            'BARU': 'new',
            'HOT': 'hot',
            'BEST SELLER': 'bestseller',
            'TERLARIS': 'bestseller',
            'LIMITED': 'limited',
            'TERHAD': 'limited',
            'JUALAN': 'sale'
        };
        
        document.querySelectorAll('.badge-sale, span[class*="bg-"][class*="text-white"]').forEach(badge => {
            const currentText = badge.textContent.trim().toUpperCase();
            const badgeKey = badgeMap[currentText];
            
            if (badgeKey && translations.products.badges[badgeKey]) {
                badge.textContent = translations.products.badges[badgeKey];
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

export default LanguageSwitcher;
