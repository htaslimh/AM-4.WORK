/**
 * AMERTALOKA - Main Application
 * Core functionality and utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
  initLazyLoading();
  initContactForm();
  initWhatsAppLinks();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMobile');
  const body = document.body;

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active', isOpen);
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      body.style.overflow = 'hidden';
      if (window.smoothScroll) window.smoothScroll.stop();
    } else {
      body.style.overflow = '';
      if (window.smoothScroll) window.smoothScroll.start();
    }
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
      if (window.smoothScroll) window.smoothScroll.start();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
      if (window.smoothScroll) window.smoothScroll.start();
    }
  });
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll (optional)
    // if (currentScrollY > lastScrollY && currentScrollY > 300) {
    //   navbar.style.transform = 'translateY(-100%)';
    // } else {
    //   navbar.style.transform = 'translateY(0)';
    // }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
  // Native lazy loading is supported, but we can enhance it
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

/**
 * Contact Form Handling
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Check for pre-filled product from URL
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const messageField = form.querySelector('[name="message"]');
  
  if (product && messageField) {
    messageField.value = `Halo, saya tertarik dengan produk: ${product}\n\n`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
    };

    // Validate
    if (!validateForm(data)) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    // Store in localStorage (demo purposes)
    saveMessage(data);

    // Show success
    showFormSuccess(form);

    // Reset form
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

/**
 * Validate form data
 */
function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Nama harus diisi minimal 2 karakter');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email tidak valid');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Pesan harus diisi minimal 10 karakter');
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }

  return true;
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Save message to localStorage
 */
function saveMessage(data) {
  const messages = JSON.parse(localStorage.getItem('amertaloka_messages') || '[]');
  messages.push({
    ...data,
    id: Date.now(),
    read: false,
  });
  localStorage.setItem('amertaloka_messages', JSON.stringify(messages));
}

/**
 * Show form success message
 */
function showFormSuccess(form) {
  const successEl = document.createElement('div');
  successEl.className = 'form__success';
  successEl.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
  `;

  form.insertBefore(successEl, form.firstChild);

  // Remove after 5 seconds
  setTimeout(() => {
    successEl.remove();
  }, 5000);
}

/**
 * WhatsApp Links
 */
function initWhatsAppLinks() {
  const whatsappNumber = '6281234567890'; // Replace with actual number
  const defaultMessage = 'Halo AMERTALOKA, saya tertarik dengan produk hidroponik Anda.';

  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    const customMessage = link.dataset.whatsapp || defaultMessage;
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  });
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle utility
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date to Indonesian locale
 */
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Export utilities
window.utils = {
  debounce,
  throttle,
  formatDate,
  isValidEmail,
};
