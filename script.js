// ===== Mobile Performance & Responsiveness =====
// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Optimize animations for mobile
if (isMobile) {
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
}

// Prevent zoom on input focus (iOS)
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
}

// Handle orientation change
window.addEventListener('orientationchange', function() {
    // Force reflow to fix layout issues
    setTimeout(function() {
        window.scrollTo(0, window.scrollY);
    }, 100);
});

// Optimize scroll performance
let ticking = false;

function updateScrollElements() {
    // Your scroll-based updates here
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
}

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS with mobile-optimized settings
    AOS.init({
        duration: isMobile ? 600 : 1000,
        easing: 'ease-in-out',
        once: true,
        offset: isMobile ? 50 : 100,
        disable: function() {
            return window.innerWidth < 768 && window.innerHeight < 600; // Disable on very small screens
        }
    });
    
    // Initialize all functions
    initNavbar();
    initCounters();
    initTypingEffect();
    initParticles();
    initScrollToTop();
    initSmoothScroll();
    initLoadingAnimation();
    initVideoPlayers();
    initMobileOptimizations();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    // Enhanced scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });
    
    // Enhanced dropdown animation
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Close other dropdowns
            dropdownMenus.forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                    otherMenu.parentElement.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
            menu.classList.toggle('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdownMenus.forEach(menu => {
                menu.classList.remove('show');
                menu.parentElement.classList.remove('show');
            });
        }
    });
    
    // Mobile menu animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Add pulse effect to toggler
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Animate collapse
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.style.opacity = '0';
                navbarCollapse.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    navbarCollapse.classList.remove('show');
                }, 300);
            } else {
                navbarCollapse.classList.add('show');
                setTimeout(() => {
                    navbarCollapse.style.opacity = '1';
                    navbarCollapse.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    }
    
    // Smooth hover effects for nav items
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Click effect
        link.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(30, 64, 175, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-link {
            overflow: hidden;
        }
        
        .navbar-brand {
            position: relative;
            overflow: hidden;
        }
        
        .navbar-toggler {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// ===== Animated Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== Typing Effect =====
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderLeft = '2px solid #667eea';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                element.style.borderLeft = 'none';
            }
        };
        
        // Start typing when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== Particle Animation =====
function initParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1;
    `;
    
    heroSection.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: floatParticle ${duration}s linear infinite;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        createParticle(container); // Create new particle
    }, duration * 1000);
}

// ===== Scroll to Top Button =====
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 18px;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(-5deg)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// ===== Smooth Scroll for Navigation Links =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
}

// ===== Loading Animation =====
function initLoadingAnimation() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <i class="fas fa-brain"></i>
            </div>
            <div class="loading-text">المحفظة الذكية</div>
            <div class="loading-spinner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">جاري التحميل...</span>
                </div>
            </div>
        </div>
    `;
    
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: all 0.5s ease;
    `;
    
    // Add styles for loading content
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-content {
            text-align: center;
            color: white;
        }
        
        .loading-logo i {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        .loading-text {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            font-family: 'Tajawal', sans-serif;
        }
        
        .loading-spinner {
            display: flex;
            justify-content: center;
        }
        
        .spinner-border {
            color: white;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loadingOverlay);
    
    // Hide loading overlay after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loadingOverlay);
                document.head.removeChild(loadingStyles);
            }, 500);
        }, 1000);
    });
}

// ===== Card 3D Tilt Effect =====
function init3DTilt() {
    const cards = document.querySelectorAll('.feature-card, .problem-card, .vision-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== Initialize 3D Effects after DOM load =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(init3DTilt, 1000);
});

// ===== Button Click Effects =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        createRippleEffect(e);
    }
});

function createRippleEffect(e) {
    const button = e.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== Add Ripple Animation CSS =====
const rippleCSS = document.createElement('style');
rippleCSS.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(rippleCSS);

// ===== Intersection Observer for Animations =====
const observerCallback = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
};

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-card, .problem-card, .vision-card, .value-item, .feature-item');
    animateElements.forEach(el => observer.observe(el));
});

// ===== Performance Optimization =====
// Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here if needed
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.warn('JavaScript error handled:', e.message);
});

// ===== Mobile Touch Improvements =====
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const touchCSS = document.createElement('style');
    touchCSS.textContent = `
        .touch-device .feature-card:hover,
        .touch-device .problem-card:hover,
        .touch-device .vision-card:hover {
            transform: none;
        }
        
        .touch-device .btn:hover::before {
            width: 0;
            height: 0;
        }
    `;
    document.head.appendChild(touchCSS);
}

// ===== Video Players Enhancement =====
function initVideoPlayers() {
    const videoCards = document.querySelectorAll('.video-card');
    const videos = document.querySelectorAll('.video-player');
    
    videoCards.forEach((card, index) => {
        const video = card.querySelector('.video-player');
        const overlay = card.querySelector('.video-overlay');
        const playButton = card.querySelector('.play-button');
        
        // Play button click
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (video.paused) {
                    // Pause all other videos
                    videos.forEach(v => {
                        if (v !== video) {
                            v.pause();
                        }
                    });
                    
                    video.play();
                    overlay.style.display = 'none';
                } else {
                    video.pause();
                    overlay.style.display = 'flex';
                }
            });
        }
        
        // Video events
        if (video) {
            video.addEventListener('play', () => {
                overlay.style.display = 'none';
                card.classList.add('playing');
            });
            
            video.addEventListener('pause', () => {
                overlay.style.display = 'flex';
                card.classList.remove('playing');
            });
            
            video.addEventListener('ended', () => {
                overlay.style.display = 'flex';
                card.classList.remove('playing');
            });
            
            // Add loading indicator
            video.addEventListener('loadstart', () => {
                overlay.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
            });
            
            video.addEventListener('canplay', () => {
                overlay.innerHTML = '<div class="play-button"><i class="fas fa-play"></i></div>';
            });
        }
    });
    
    // Intersection Observer for lazy loading
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                }
                videoObserver.unobserve(video);
            }
        });
    });
    
    videos.forEach(video => {
        if (video.dataset.src) {
            videoObserver.observe(video);
        }
    });
}

// ===== Mobile-Specific Optimizations =====
function initMobileOptimizations() {
    // Touch feedback for buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .feature-card');
    
    buttons.forEach(button => {
        if (isTouch) {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
    });
    
    // Optimize video loading for mobile
    if (isMobile) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.setAttribute('preload', 'none');
            video.setAttribute('playsinline', 'true');
        });
    }
    
    // Handle mobile menu
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // Smooth scroll with offset for mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - (isMobile ? 80 : 100);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Prevent body scroll when mobile menu is open
    const body = document.body;
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            }, 100);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth >= 992) {
            body.style.overflow = '';
            navbarCollapse.classList.remove('show');
        }
        
        // Recalculate AOS elements
        AOS.refresh();
    }, 250));
    
    // Lazy load images for better performance
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add loading states for better UX
    const interactiveElements = document.querySelectorAll('.btn, .video-card, .feature-card');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
}

// Debounce function for performance
function debounce(func, wait, immediate) {
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
}

// Check network connection and adjust accordingly
if ('navigator' in window && 'connection' in navigator) {
    const connection = navigator.connection;
    
    // Reduce animations on slow connections
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        document.documentElement.style.setProperty('--transition', 'none');
        AOS.init({ disable: true });
    }
}

// Add CSS for loading states
const loadingCSS = `
    .loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 1000;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);

console.log('المحفظة الذكية - تم تحميل JavaScript بنجاح! 🚀');
console.log('تم تفعيل تحسينات الأجهزة المحمولة 📱');
