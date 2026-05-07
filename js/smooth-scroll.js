/**
 * AMERTALOKA - Lenis Smooth Scrolling
 * Buttery smooth scrolling with GSAP integration
 */

// Initialize Lenis
let lenis;

function initSmoothScroll() {
  // Check if Lenis is available
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded, using native scroll');
    return;
  }

  // Create Lenis instance
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Integrate with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: Use requestAnimationFrame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Add class to html element
  document.documentElement.classList.add('lenis');

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -80, // Offset for navbar
          duration: 1.5,
        });
      }
    });
  });
}

// Stop/start scroll (useful for modals)
function stopScroll() {
  if (lenis) lenis.stop();
}

function startScroll() {
  if (lenis) lenis.start();
}

// Scroll to top
function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.5 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initSmoothScroll);

// Export functions for global use
window.smoothScroll = {
  stop: stopScroll,
  start: startScroll,
  toTop: scrollToTop,
  instance: () => lenis,
};
