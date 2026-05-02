/**
 * Terapia - Professional Physical Therapy Website
 * Production-Ready JavaScript
 * Version: 2.0.0
 */

(function ($) {
    "use strict";

    // Performance optimization: Debounce function
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

    // Performance optimization: Throttle function
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

    // Enhanced Spinner with better UX
    var spinner = function () {
        const spinnerElement = $('#spinner');
        if (spinnerElement.length > 0) {
            // Hide spinner after a short delay for better perceived performance
            setTimeout(function () {
                spinnerElement.removeClass('show');
            }, 100);
        }
    };
    
    // Initialize spinner
    $(document).ready(function() {
        spinner();
    });

    // Fallback: Hide spinner after page load
    $(window).on('load', function() {
        $('#spinner').removeClass('show');
    });
    
    // Initialize WOW.js with better performance
    if (typeof WOW !== 'undefined') {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            callback: function(box) {
                // Callback after animation
            }
        }).init();
    }

    // Enhanced Sticky Navbar with throttling
    const stickyNavbar = throttle(function() {
        const navbar = $('.navbar');
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 45) {
            navbar.addClass('sticky-top shadow-sm');
        } else {
            navbar.removeClass('sticky-top shadow-sm');
        }
    }, 16); // ~60fps

    $(window).scroll(stickyNavbar);


    // Enhanced Hero Header carousel with better accessibility
    $(".header-carousel").owlCarousel({
        animateOut: 'slideOutDown',
        items: 1,
        autoplay: true,
        autoplayTimeout: 6000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left" aria-hidden="true"></i><span class="sr-only">Previous</span>',
            '<i class="bi bi-arrow-right" aria-hidden="true"></i><span class="sr-only">Next</span>'
        ],
        responsive: {
            0: {
                nav: false
            },
            768: {
                nav: true
            }
        },
        onInitialized: function() {
            // Add ARIA labels for accessibility
            $('.owl-nav button').attr('aria-label', function(index) {
                return index === 0 ? 'Previous slide' : 'Next slide';
            });
        }
    });


    // International carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        items: 1,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:1
            },
            1200:{
                items:1
            }
        }
    });

    
    // Enhanced Back to top button with smooth animation
    const backToTopBtn = $('.back-to-top');
    
    const toggleBackToTop = throttle(function() {
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 300) {
            backToTopBtn.addClass('show');
        } else {
            backToTopBtn.removeClass('show');
        }
    }, 16);

    $(window).scroll(toggleBackToTop);
    
    backToTopBtn.click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'easeInOutExpo');
        return false;
    });

    // Enhanced form validation and submission
    $('form').each(function() {
        const form = $(this);
        
        form.on('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.find('[required]');
            
            requiredFields.each(function() {
                const field = $(this);
                const value = field.val().trim();
                
                // Remove previous error states
                field.removeClass('error');
                field.next('.error-message').remove();
                
                if (!value) {
                    isValid = false;
                    field.addClass('error');
                    field.after('<div class="error-message">This field is required</div>');
                }
                
                // Email validation
                if (field.attr('type') === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        field.addClass('error');
                        field.after('<div class="error-message">Please enter a valid email</div>');
                    }
                }
            });
            
            if (isValid) {
                // Show success message (replace with actual form submission)
                const submitBtn = form.find('button[type="submit"]');
                const originalText = submitBtn.text();
                
                submitBtn.prop('disabled', true).text('Sending...');
                
                // Simulate form submission
                setTimeout(function() {
                    submitBtn.prop('disabled', false).text(originalText);
                    form.prepend('<div class="alert alert-success">Thank you! Your message has been sent.</div>');
                    form[0].reset();
                    
                    // Remove success message after 5 seconds
                    setTimeout(function() {
                        form.find('.alert-success').fadeOut();
                    }, 5000);
                }, 2000);
            }
        });
    });

    // Lazy loading for images (if Intersection Observer is supported)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800, 'easeInOutExpo');
        }
    });

    // Enhanced accessibility: Focus management
    $(document).on('keydown', function(e) {
        if (e.key === 'Tab') {
            $('body').addClass('keyboard-navigation');
        }
    });

    $(document).on('mousedown', function() {
        $('body').removeClass('keyboard-navigation');
    });

})(jQuery);

