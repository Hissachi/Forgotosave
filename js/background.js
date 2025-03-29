document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 7000; // 7  segundos
    
    // Pré-carrega todas as imagens
    function preloadImages() {
        slides.forEach(slide => {
            const img = new Image();
            const imageContainer = slide.querySelector('.image-container');
            img.src = imageContainer.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        });
    }
    
    // Troca para o próximo slide
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Inicialização
    function initSlideshow() {
        preloadImages();
        slides[0].classList.add('active'); // Ativa o primeiro slide
        setInterval(nextSlide, slideInterval); // Inicia o ciclo
    }
    
    initSlideshow();
});