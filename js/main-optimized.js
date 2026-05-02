/**
 * Terapia - Professional Physical Therapy Website
 * Production-Ready JavaScript Framework
 * Version: 2.0.0
 * Author: Professional Development Team
 */

'use strict';

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for performance optimization
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class AnimationObserver {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observe all elements with animation classes
      document.querySelectorAll('[data-animate]').forEach(el => {
        this.observer.observe(el);
      });
    }
  }
}

// ===== LAZY LOADING IMAGES =====
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              this.loadImage(img);
              this.imageObserver.unobserve(img);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages();
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    }
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
}

// ===== NAVIGATION CONTROLLER =====
class NavigationController {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navToggler = document.querySelector('.navbar-toggler');
    this.navCollapse = document.querySelector('.navbar-collapse');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    if (this.navbar) {
      this.handleScroll();
      this.handleNavigation();
      this.handleMobileMenu();
    }
  }

  handleScroll() {
    const scrollHandler = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add/remove sticky class
      if (scrollTop > 100) {
        this.navbar.classList.add('sticky');
      } else {
        this.navbar.classList.remove('sticky');
      }

      // Hide/show navbar on scroll (optional)
      if (scrollTop > this.lastScrollTop && scrollTop > 200) {
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        this.navbar.style.transform = 'translateY(0)';
      }
      
      this.lastScrollTop = scrollTop;
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  handleNavigation() {
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
      const updateActiveLink = throttle(() => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          const id = section.getAttribute('id');
          
          if (scrollPos >= top && scrollPos < bottom) {
            this.navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, 16);

      window.addEventListener('scroll', updateActiveLink, { passive: true });
    }
  }

  handleMobileMenu() {
    if (this.navToggler && this.navCollapse) {
      this.navToggler.addEventListener('click', () => {
        this.navCollapse.classList.toggle('show');
        this.navToggler.setAttribute(
          'aria-expanded',
          this.navCollapse.classList.contains('show')
        );
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.navbar.contains(e.target) && this.navCollapse.classList.contains('show')) {
          this.navCollapse.classList.remove('show');
          this.navToggler.setAttribute('aria-expanded', 'false');
        }
      });

      // Close mobile menu when clicking on nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (this.navCollapse.classList.contains('show')) {
            this.navCollapse.classList.remove('show');
            this.navToggler.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  }
}

// ===== CAROUSEL CONTROLLER =====
class CarouselController {
  constructor() {
    this.carousels = document.querySelectorAll('[data-carousel]');
    this.init();
  }

  init() {
    this.carousels.forEach(carousel => {
      this.initCarousel(carousel);
    });
  }

  initCarousel(carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;

    const showSlide = (index) => {
      if (isAnimating) return;
      isAnimating = true;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });

      currentSlide = index;
      
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => showSlide(index));
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Autoplay
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };

    // Pause autoplay on hover/focus
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Start autoplay if enabled
    if (carousel.dataset.autoplay !== 'false') {
      startAutoplay();
    }

    // Initialize first slide
    showSlide(0);
  }
}

// ===== FORM CONTROLLER =====
class FormController {
  constructor() {
    this.forms = document.querySelectorAll('form[data-validate]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      this.initForm(form);
    });
  }

  initForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', debounce(() => this.validateField(input), 300));
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateForm(form)) {
        this.submitForm(form);
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let message = '';

    // Remove existing error states
    this.clearFieldError(field);

    // Required validation
    if (required && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Show error if invalid
    if (!isValid) {
      this.showFieldError(field, message);
    }

    return isValid;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  async submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showFormMessage(form, 'Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      
    } catch (error) {
      // Show error message
      this.showFormMessage(form, 'Sorry, there was an error sending your message. Please try again.', 'error');
      console.error('Form submission error:', error);
      
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      form.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.setAttribute('role', 'alert');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// ===== MODAL CONTROLLER =====
class ModalController {
  constructor() {
    this.modals = document.querySelectorAll('[data-modal]');
    this.init();
  }

  init() {
    // Modal triggers
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        this.openModal(modalId);
      });
    });

    // Modal close buttons
    document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        this.closeModal(closeBtn.closest('[data-modal]'));
      });
    });

    // Close modal on backdrop click
    this.modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[data-modal].show');
        if (openModal) {
          this.closeModal(openModal);
        }
      }
    });
  }

  openModal(modalId) {
    const modal = document.querySelector(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      
      // Focus management
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      
      // Trap focus within modal
      this.trapFocus(modal, focusableElements);
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  trapFocus(modal, focusableElements) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
  }
}

// ===== BACK TO TOP BUTTON =====
class BackToTopController {
  constructor() {
    this.button = document.querySelector('.back-to-top');
    this.init();
  }

  init() {
    if (this.button) {
      this.handleScroll();
      this.handleClick();
    }
  }

  handleScroll() {
    const scrollHandler = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 300) {
        this.button.classList.add('show');
      } else {
        this.button.classList.remove('show');
      }
    }, 16);

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  handleClick() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ===== LOADING SPINNER =====
class LoadingController {
  constructor() {
    this.spinner = document.querySelector('.spinner');
    this.init();
  }

  init() {
    // Hide spinner when page is loaded
    window.addEventListener('load', () => {
      this.hideSpinner();
    });

    // Fallback: hide spinner after 3 seconds
    setTimeout(() => {
      this.hideSpinner();
    }, 3000);
  }

  hideSpinner() {
    if (this.spinner) {
      this.spinner.classList.add('hide');
      
      // Remove from DOM after animation
      setTimeout(() => {
        this.spinner.remove();
      }, 500);
    }
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      this.monitorWebVitals();
    }

    // Monitor resource loading
    this.monitorResources();
    
    // Monitor JavaScript errors
    this.monitorErrors();
  }

  monitorWebVitals() {
    // This would integrate with web-vitals library
    // getCLS(console.log);
    // getFID(console.log);
    // getFCP(console.log);
    // getLCP(console.log);
    // getTTFB(console.log);
  }

  monitorResources() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      
      console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart);
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      console.log('Resources Loaded:', resources.length);
    });
  }

  monitorErrors() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
    });
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityController {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLinks();
    this.enhanceKeyboardNavigation();
    this.addAriaLabels();
    this.handleReducedMotion();
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Add visible focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  addAriaLabels() {
    // Add aria-labels to buttons without text
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i');
        if (icon) {
          const iconClass = icon.className;
          if (iconClass.includes('search')) {
            button.setAttribute('aria-label', 'Search');
          } else if (iconClass.includes('menu')) {
            button.setAttribute('aria-label', 'Menu');
          } else if (iconClass.includes('close')) {
            button.setAttribute('aria-label', 'Close');
          }
        }
      }
    });
  }

  handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }
}

// ===== MAIN APPLICATION =====
class TerapiaApp {
  constructor() {
    this.controllers = [];
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    try {
      // Initialize all controllers
      this.controllers = [
        new LoadingController(),
        new NavigationController(),
        new CarouselController(),
        new FormController(),
        new ModalController(),
        new BackToTopController(),
        new AnimationObserver(),
        new LazyImageLoader(),
        new AccessibilityController(),
        new PerformanceMonitor()
      ];

      console.log('Terapia App initialized successfully');
      
    } catch (error) {
      console.error('Error initializing Terapia App:', error);
    }
  }

  // Public API for external use
  getController(name) {
    return this.controllers.find(controller => 
      controller.constructor.name === name
    );
  }
}

// ===== INITIALIZE APPLICATION =====
const app = new TerapiaApp();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TerapiaApp;
}

// Global API
window.TerapiaApp = app;