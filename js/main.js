/**
 * Umbrax Website - Main JavaScript File
 * Professional Digital Solutions Theme
 */

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeCounters();
    initializeScrollToTop();
    initializeParallax();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const mobileMenuToggle = $('#mobileMenuToggle');
    const navMenu = $('#navMenu');
    const navLinks = $$('.nav-link');
    const header = $('.header');

    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = $(`#${targetId}`);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Header background on scroll
    const handleScroll = debounce(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateActiveNavLinkOnScroll();
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = $$('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = $$('.feature-card, .service-card, .about-feature, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Typing animation for hero title
    const heroTitle = $('.hero-title');
    if (heroTitle) {
        animateTyping(heroTitle);
    }

    // Number counting animation for stats
    const statNumbers = $$('.stat-number');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
}

// Typing animation effect
function animateTyping(element) {
    const text = element.innerHTML;
    element.innerHTML = '';
    element.style.borderRight = '2px solid #6366f1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// ===== COUNTER ANIMATION =====
function initializeCounters() {
    // This will be called by the intersection observer
}

function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+/.test(target);
    
    if (!isNumber) return;
    
    const finalNumber = parseInt(target.replace(/[^\d]/g, ''));
    const suffix = target.replace(/[\d.]/g, '');
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current >= finalNumber) {
            element.textContent = finalNumber.toLocaleString() + suffix;
        } else {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
        }
    };
    
    updateCounter();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = $('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                showFormLoading(this);
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showFormSuccess();
                    this.reset();
                }, 2000);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateContactForm(data) {
    let isValid = true;
    const form = $('.contact-form');
    
    // Remove previous error states
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Validate name
    if (!data.name || data.name.length < 2) {
        showFieldError(form.querySelector('[name="name"]'), 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError(form.querySelector('[name="email"]'), 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate service selection
    if (!data.service) {
        showFieldError(form.querySelector('[name="service"]'), 'Please select a service');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.length < 10) {
        showFieldError(form.querySelector('[name="message"]'), 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    switch (field.name) {
        case 'name':
            isValid = value.length >= 2;
            message = 'Name must be at least 2 characters';
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            message = 'Please enter a valid email address';
            break;
        case 'service':
            isValid = value !== '';
            message = 'Please select a service';
            break;
        case 'message':
            isValid = value.length >= 10;
            message = 'Message must be at least 10 characters';
            break;
    }
    
    if (isValid) {
        field.classList.remove('error');
        removeFieldError(field);
    } else {
        showFieldError(field, message);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    removeFieldError(field);
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Store original text for later restoration
    submitBtn.dataset.originalText = originalText;
}

function showFormSuccess() {
    const form = $('.contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Restore button
    submitBtn.innerHTML = submitBtn.dataset.originalText || '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = $('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    Object.assign(scrollToTopBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
        transition: 'all 0.3s ease',
        opacity: '0',
        visibility: 'hidden',
        zIndex: '1000'
    });
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide on scroll
    const handleScroll = debounce(() => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-2px)';
        scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    const parallaxElements = $$('.hero-bg-image, .hero-logo');
    
    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('hero-bg-image')) {
                element.style.transform = `translate3d(0, ${rate * 0.3}px, 0)`;
            } else if (element.classList.contains('hero-logo')) {
                element.style.transform = `translate3d(0, ${rate * 0.1}px, 0)`;
            }
        });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/logo.png',
        'assets/mainbg.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Enable keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== BROWSER COMPATIBILITY CHECKS =====
function checkBrowserSupport() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        const fallbackElements = $$('[class*="fade-in"]');
        fallbackElements.forEach(el => {
            el.classList.add('fade-in-up');
        });
    }
}

checkBrowserSupport();
