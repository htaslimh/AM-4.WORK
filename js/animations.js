/**
 * AMERTALOKA - GSAP Animations
 * Cinematic scroll-triggered animations
 */

// Wait for DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    // Fallback: show all elements
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize all animations
  initHeroAnimations();
  initRevealAnimations();
  initBentoAnimations();
  initTimelineAnimations();
  initProductAnimations();
  initGalleryAnimations();
  initNavbarAnimations();
});

/**
 * Hero Section Animations
 */
function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Initial state
  gsap.set('.hero__badge', { opacity: 0, y: 20 });
  gsap.set('.hero__title-line', { opacity: 0, y: 50 });
  gsap.set('.hero__description', { opacity: 0, y: 30 });
  gsap.set('.hero__cta', { opacity: 0, y: 30 });
  gsap.set('.scroll-indicator', { opacity: 0, y: 20 });

  // Animation sequence
  tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .to('.hero__title-line', { 
      opacity: 1, 
      y: 0, 
      duration: 1,
      stagger: 0.15 
    }, 0.5)
    .to('.hero__description', { opacity: 1, y: 0, duration: 0.8 }, 1)
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, 1.2)
    .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.6 }, 1.5);

  // Parallax effect on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero__content', {
      y: 100,
      opacity: 0.3,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }
}

/**
 * General Reveal Animations
 */
function initRevealAnimations() {
  if (typeof ScrollTrigger === 'undefined') {
    // Fallback: just show elements
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    return;
  }

  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/**
 * Bento Grid Animations
 */
function initBentoAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const bentoItems = document.querySelectorAll('.bento__item');

  bentoItems.forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        delay: index * 0.1,
      }
    );

    // Hover animation
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}

/**
 * Timeline Section Animations
 */
function initTimelineAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const timelineItems = document.querySelectorAll('.timeline__item');
  const timelineLine = document.querySelector('.timeline__line');

  // Animate the timeline line
  if (timelineLine) {
    gsap.fromTo(
      timelineLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline__container',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    );
  }

  // Animate each timeline item
  timelineItems.forEach((item, index) => {
    const dot = item.querySelector('.timeline__dot');
    const content = item.querySelector('.timeline__content');
    const isOdd = index % 2 !== 0;

    // Dot animation
    gsap.fromTo(
      dot,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Content animation
    gsap.fromTo(
      content,
      {
        opacity: 0,
        x: isOdd ? -50 : 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/**
 * Product Card Animations
 */
function initProductAnimations() {
  // Products are loaded dynamically, so we use event delegation
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  // Observe for new product cards
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList.contains('product-card')) {
          animateProductCard(node);
        }
      });
    });
  });

  observer.observe(productsGrid, { childList: true });

  // Animate existing cards
  document.querySelectorAll('.product-card').forEach(animateProductCard);
}

function animateProductCard(card) {
  if (typeof ScrollTrigger === 'undefined') return;

  gsap.fromTo(
    card,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  );

  // Hover effects
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -12,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
}

/**
 * Horizontal Gallery Scroll
 */
function initGalleryAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const galleryWrapper = document.getElementById('galleryWrapper');
  const galleryTrack = document.getElementById('galleryTrack');

  if (!galleryWrapper || !galleryTrack) return;

  // Calculate the scroll distance
  const getScrollAmount = () => {
    const trackWidth = galleryTrack.scrollWidth;
    const viewportWidth = window.innerWidth;
    return -(trackWidth - viewportWidth + 100);
  };

  // Create the horizontal scroll animation
  gsap.to(galleryTrack, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: galleryWrapper,
      start: 'top top',
      end: () => `+=${galleryTrack.scrollWidth - window.innerWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Animate individual items
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryItems.forEach((item, index) => {
    gsap.fromTo(
      item,
      { opacity: 0.5, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          containerAnimation: gsap.getById ? undefined : undefined,
          start: 'left 80%',
          end: 'left 20%',
          scrub: true,
        },
      }
    );
  });
}

/**
 * Navbar Scroll Effects
 */
function initNavbarAnimations() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for background
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Text Split Animation Helper
 */
function splitText(element) {
  const text = element.textContent;
  const words = text.split(' ');

  element.innerHTML = words
    .map(
      (word) =>
        `<span class="word"><span class="word-inner">${word}</span></span>`
    )
    .join(' ');

  return element.querySelectorAll('.word-inner');
}

/**
 * Counter Animation
 */
function animateCounter(element, target, duration = 2) {
  gsap.to(element, {
    textContent: target,
    duration: duration,
    ease: 'power1.out',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

// Export for use in other scripts
window.animations = {
  splitText,
  animateCounter,
  animateProductCard,
};
