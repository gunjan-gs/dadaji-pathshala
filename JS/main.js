/**
 * ========================================
 * DADA JI'S PATHSHALA - ENHANCED JAVASCRIPT
 *
 * Version: 3.0 (Final Deployment Ready)
 *
 * TABLE OF CONTENTS
 * -----------------
 * 1.  initPageLoader()
 * 2.  initNavigation()
 * 3.  initSlider()
 * 4.  initSmoothScroll()
 * 5.  initFadeInAnimations()
 * 6.  initScrollToTop()
 * 7.  initParallaxEffect()
 * 8.  initLazyLoading()
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPageLoader();
    initNavigation();
    initSlider();
    initSmoothScroll();
    initFadeInAnimations();
    initScrollToTop();
    initParallaxEffect();
    initLazyLoading();
});

/**
 * 1. Page Loader
 * Creates and manages the pre-loading animation
 */
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.prepend(loader);

    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
}

/**
 * 2. Navigation
 * Handles mobile hamburger toggle, menu clicks, and scroll behavior
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (!navToggle || !navMenu || !navbar) return;

    // Close menu function
    function closeMenu() {
        navMenu.classList.remove('active');
        navbar.classList.remove('navbar-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = navMenu.classList.toggle('active');
        navbar.classList.toggle('navbar-open');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            closeMenu();
        }
    });

    // Navbar shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        let currentSection = '';
        const scrollPos = window.scrollY + navbar.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPos >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(`#${currentSection}`)) {
                link.classList.add('active');
            }
        });

        // Failsafe for top of page
        if (window.pageYOffset < 200) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href*="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();
}

/**
 * 3. Image Slider
 * Manages the image slider with dots, arrows, autoslide, and touch support
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoSlideInterval;
    let isTransitioning = false;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');

            if (i === index) {
                slide.classList.add('active');
                dots[i].classList.add('active');
            }
        });
        
        currentSlide = index;
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        let prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function goToSlide(index) {
        if (index !== currentSlide) {
            showSlide(index);
            resetAutoSlide();
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector('.slider-container');

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
                resetAutoSlide();
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide();
                resetAutoSlide();
            }
        }

        // Pause on hover
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
}

/**
 * 4. Smooth Scroll
 * Smoothly scrolls to anchors, accounting for the sticky navbar height
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;

            const targetId = href.split('#')[1];
            if (!targetId) return;

            const target = document.getElementById(targetId);

            if (target) {
                e.preventDefault();
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 5. Fade-in Animations
 * Uses Intersection Observer to fade in elements as they enter the viewport
 */
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .course-card, .mentor-card, .facility-card, .event-card, .gallery-item, .contact-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = (index % 3) * 100;
                entry.target.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

/**
 * 6. Scroll to Top Button
 * Shows a "scroll to top" button after scrolling down
 */
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 7. Parallax Effect
 * Applies a simple parallax effect to the hero/banner logo
 */
function initParallaxEffect() {
    const heroLogo = document.querySelector('.hero-logo-main, .banner-logo');
    
    if (heroLogo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroLogo.style.transform = `translateY(${parallax}px)`;
            }
        });
    }
}

/**
 * 8. Lazy Loading Images
 * Implements native lazy loading for better performance
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization: Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll-heavy functions if needed
const debouncedParallax = debounce(initParallaxEffect, 10);

// Console message for developers
console.log('%c🎓 DADA Ji\'s Pathshala', 'color: #c23b3b; font-size: 20px; font-weight: bold;');
console.log('%cWebsite designed and developed with ❤️ by Gunjan', 'color: #666; font-size: 12px;');