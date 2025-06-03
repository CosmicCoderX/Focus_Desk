// Focus Desk Interactive JavaScript
// Enhanced functionality for the Focus Desk website

document.addEventListener('DOMContentLoaded', function () {

    // ==================== MOBILE NAVIGATION ====================
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    // Create overlay if it doesn't exist
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.id = 'overlay';
        newOverlay.className = 'nav-overlay';
        document.body.appendChild(newOverlay);
    }

    // Mobile menu toggle functionality
    function toggleMobileMenu() {
        const isActive = navLinks.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        navLinks.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        body.style.overflow = 'hidden';
        mobileMenu.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        body.style.overflow = '';
        mobileMenu.setAttribute('aria-expanded', 'false');
    }

    // Event listeners for mobile menu
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking overlay
    document.addEventListener('click', function (e) {
        if (e.target.id === 'overlay') {
            closeMobileMenu();
        }
    });

    // Close menu when clicking nav links (mobile)
    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ==================== SMOOTH SCROLLING ====================
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Easing function
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                smoothScroll(target);
            }
        });
    });

    // ==================== WORKSPACE FILTERING ====================
    const tabButtons = document.querySelectorAll('.tab-button');
    const workspaceCards = document.querySelectorAll('.workspace-card');

    // Add data attributes to workspace cards for filtering
    const workspaceData = [
        { element: workspaceCards[0], category: 'private-pods' },
        { element: workspaceCards[1], category: 'shared-desks' },
        { element: workspaceCards[2], category: 'group-rooms' }
    ];

    workspaceData.forEach(item => {
        if (item.element) {
            item.element.setAttribute('data-category', item.category);
        }
    });

    // Filter functionality
    function filterWorkspaces(category) {
        workspaceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                // Animate in
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Tab button functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter category
            const filterText = this.textContent.toLowerCase().replace(/\s+/g, '-');
            const category = filterText === 'all' ? 'all' :
                filterText === 'private-pods' ? 'private-pods' :
                    filterText === 'shared-desks' ? 'shared-desks' :
                        filterText === 'group-rooms' ? 'group-rooms' : 'all';

            // Filter workspaces
            filterWorkspaces(category);
        });
    });

    // ==================== SCROLL ANIMATIONS ====================
    function isElementInViewport(el, threshold = 0.1) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    }

    function animateOnScroll() {
        const animationElements = document.querySelectorAll('.feature-card, .workspace-card, .testimonial-card');

        animationElements.forEach((element, index) => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(animateOnScroll);
    });

    // Initial check for elements in viewport
    animateOnScroll();

    // ==================== HEADER SCROLL EFFECT ====================
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }

        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ==================== TESTIMONIAL SLIDER ====================
    const testimonials = [
        {
            text: "Focus Desk has completely changed my study habits. The quiet pods help me concentrate like never before, and I've seen my grades improve significantly since I started coming here.",
            name: "Priya Sharma",
            role: "CA Student, Delhi University",
            image: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
            text: "As a freelancer, I needed a professional workspace that wasn't my home. Focus Desk provides the perfect environment with all the amenities I need to be productive.",
            name: "Arjun Patel",
            role: "Freelance Developer",
            image: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        {
            text: "The group study rooms are fantastic! My study group meets here every week and we've become so much more efficient with our collaborative learning.",
            name: "Sneha Gupta",
            role: "Medical Student, AIIMS",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    let currentTestimonialIndex = 0;
    const testimonialCard = document.querySelector('.testimonial-card');

    function updateTestimonial(index) {
        const testimonial = testimonials[index];

        // Fade out
        testimonialCard.style.opacity = '0';
        testimonialCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Update content
            testimonialCard.querySelector('.testimonial-text').textContent = testimonial.text;
            testimonialCard.querySelector('.author-info h5').textContent = testimonial.name;
            testimonialCard.querySelector('.author-info p').textContent = testimonial.role;
            testimonialCard.querySelector('.author-avatar img').src = testimonial.image;
            testimonialCard.querySelector('.author-avatar img').alt = testimonial.name;

            // Fade in
            testimonialCard.style.opacity = '1';
            testimonialCard.style.transform = 'translateY(0)';
        }, 300);
    }

    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial(currentTestimonialIndex);
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);

    // Add navigation dots for testimonials
    function createTestimonialDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';
        dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 30px;
        `;

        testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background-color: #ddd;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            if (index === 0) {
                dot.style.backgroundColor = 'var(--primary)';
            }

            dot.addEventListener('click', () => {
                currentTestimonialIndex = index;
                updateTestimonial(index);
                updateDots();
            });

            dotsContainer.appendChild(dot);
        });

        testimonialCard.parentNode.appendChild(dotsContainer);
    }

    function updateDots() {
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            if (index === currentTestimonialIndex) {
                dot.style.backgroundColor = 'var(--primary)';
            } else {
                dot.style.backgroundColor = '#ddd';
            }
        });
    }

    createTestimonialDots();

    // ==================== FORM INTERACTIONS ====================
    // Add interactive hover effects to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(1px) scale(0.98)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });

    // ==================== WORKSPACE CARD INTERACTIONS ====================
    workspaceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ==================== LOADING ANIMATIONS ====================
    function initializeLoadingAnimations() {
        // Add staggered animations to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    // Initialize loading animations
    setTimeout(initializeLoadingAnimations, 100);

    // ==================== ACCESSIBILITY ENHANCEMENTS ====================

    // Add keyboard navigation for tabs
    tabButtons.forEach(button => {
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', '0');

        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add focus management for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Apply focus trapping to mobile navigation
    if (navLinks) {
        trapFocus(navLinks);
    }

    // ==================== PERFORMANCE OPTIMIZATIONS ====================

    // Lazy loading for images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading if supported
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }

    // ==================== WINDOW RESIZE HANDLING ====================
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }

            // Recalculate animations
            animateOnScroll();
        }, 250);
    });

    // ==================== ENHANCED USER FEEDBACK ====================

    // Add click feedback to interactive elements
    function addClickFeedback() {
        const interactiveElements = document.querySelectorAll(
            'button, .cta-button, .secondary-button, .tab-button, .workspace-card'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('click', function (e) {
                // Create ripple effect
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize click feedback
    addClickFeedback();

    // ==================== INITIALIZATION ====================
    console.log('Focus Desk interactive features initialized successfully!');
});