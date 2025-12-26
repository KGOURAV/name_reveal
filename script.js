// Reveal + confetti + lightbox + slideshows
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('revealOverlay');
  const card = document.getElementById('revealCard');
  const nameEl = document.getElementById('babyName');
  const revealBtn = document.getElementById('revealBtn');
  const closeBtn = document.getElementById('closeReveal');

  // Set name from data attribute on the card. Edit this value in index.html.
  const babyName = card?.dataset?.name || 'Baby';
  if (nameEl) nameEl.textContent = babyName;

  function openReveal(){
    overlay.classList.add('show');
    requestAnimationFrame(()=> card.classList.add('show'));
    
    if (window.confetti) {
      // Center confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5, x: 0.5 }
      });
      
      // Left side burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { y: 0.5, x: 0 }
        });
      }, 100);
      
      // Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { y: 0.5, x: 1 }
        });
      }, 100);
      
      // Top burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 90,
          origin: { y: 0, x: 0.5 }
        });
      }, 200);
    }
  }
  function closeReveal(){
    card.classList.remove('show');
    setTimeout(()=> overlay.classList.remove('show'), 250);
  }

  revealBtn.addEventListener('click', openReveal);
  closeBtn.addEventListener('click', closeReveal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeReveal(); });

  // Lightbox helper
  function openLightbox(src){
    const light = document.createElement('div');
    light.className = 'lightbox';
    const big = document.createElement('img');
    big.src = src;
    light.appendChild(big);
    light.addEventListener('click', ()=> document.body.removeChild(light));
    document.body.appendChild(light);
  }

  // Add click handlers to gallery images
  document.querySelectorAll('.gallery-img').forEach(img=>{
    img.addEventListener('click', (e)=> openLightbox(e.currentTarget.getAttribute('src')));
  });

  // For carousel items, only attach to the active one dynamically
  function attachCarouselClickHandlers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const carousel = container.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-item') && e.target.classList.contains('active')) {
          openLightbox(e.target.getAttribute('src'));
        }
      });
    }
  }

  // Slideshow functionality (fade in/out instead of scroll)
  function initSlideshow(containerId, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = Array.from(container.querySelectorAll('.carousel-item'));
    if (items.length === 0) return;
    
    let currentIndex = 0;
    let isAutoplay = opts.autoplay || false;
    let autoplayTimer;

    function showSlide(index) {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      showSlide((currentIndex + 1) % items.length);
    }

    function prevSlide() {
      showSlide((currentIndex - 1 + items.length) % items.length);
    }

    // Bind navigation buttons
    document.querySelectorAll(`.carousel-btn[data-target="${containerId}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = Number(btn.dataset.dir);
        dir > 0 ? nextSlide() : prevSlide();
        if (isAutoplay) clearInterval(autoplayTimer);
      });
    });

    // Initialize first slide
    showSlide(0);

    // Autoplay
    if (isAutoplay) {
      autoplayTimer = setInterval(nextSlide, opts.delay || 4000);
      container.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
      container.addEventListener('mouseleave', () => {
        autoplayTimer = setInterval(nextSlide, opts.delay || 4000);
      });
    }
  }

  initSlideshow('mainCarousel', { autoplay: true, delay: 2800 });
  initSlideshow('miniCarousel', { autoplay: false });

  // Attach click handlers for lightbox to carousels
  attachCarouselClickHandlers('mainCarousel');
  attachCarouselClickHandlers('miniCarousel');

  // keyboard arrows for main carousel
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight') document.querySelector('.carousel-btn[data-target="mainCarousel"][data-dir="1"]')?.click();
    if (e.key === 'ArrowLeft') document.querySelector('.carousel-btn[data-target="mainCarousel"][data-dir="-1"]')?.click();
  });
});