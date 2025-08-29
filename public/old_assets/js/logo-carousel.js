// Logo Carousel with Manual Controls
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('logoSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    const itemsPerView = 5; // Adjust based on screen size
    const totalItems = slider.children.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    
    function updateSlider() {
        const offset = currentIndex * (100 / itemsPerView);
        slider.style.transform = `translateX(-${offset}%)`;
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
    });
    
    // Auto-play option
    setInterval(() => {
        currentIndex = (currentIndex + 1) % (maxIndex + 1);
        updateSlider();
    }, 4000);
});
