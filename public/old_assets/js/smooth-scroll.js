// Smooth Scroll Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navHeight = document.querySelector('nav').offsetHeight;
    
    // Add smooth scroll to all anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate scroll position with navbar offset
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update active state
                updateActiveLink(this);
            }
        });
    });
    
    // Update active link based on scroll position
    function updateActiveLink(clickedLink) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active', 'text-primary-600');
            link.classList.add('text-neutral-700');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active', 'text-primary-600');
        clickedLink.classList.remove('text-neutral-700');
    }
    
    // Close mobile menu function
    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuPanel = document.getElementById('menu-panel');
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuPanel.classList.add('translate-x-full');
            menuPanel.classList.remove('translate-x-0');
        }
    }
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id], footer[id]');
        const scrollPosition = window.scrollY + navHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Find corresponding nav link
                const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (correspondingLink) {
                    // Remove active from all
                    navLinks.forEach(link => {
                        link.classList.remove('active', 'text-primary-600');
                        link.classList.add('text-neutral-700');
                    });
                    
                    // Add active to current
                    correspondingLink.classList.add('active', 'text-primary-600');
                    correspondingLink.classList.remove('text-neutral-700');
                }
            }
        });
    });
});

// Optional: Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollTopBtn.className = 'fixed bottom-8 right-8 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 opacity-0 invisible';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('opacity-0', 'invisible');
            scrollTopBtn.classList.add('opacity-100', 'visible');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'invisible');
            scrollTopBtn.classList.remove('opacity-100', 'visible');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
