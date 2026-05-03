// ========================================
// DOM Elements
// ========================================
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const html = document.documentElement;

// ========================================
// Burger Menu
// ========================================
function toggleBurgerMenu() {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
}

burger.addEventListener('click', toggleBurgerMenu);

// Close burger menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Close burger menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = nav.contains(e.target);
    const isClickOnBurger = burger.contains(e.target);

    if (!isClickInsideNav && !isClickOnBurger && burger.classList.contains('active')) {
        burger.classList.remove('active');
        nav.classList.remove('active');
    }
});

// ========================================
// Smooth Scroll to Anchors
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.offsetTop - headerHeight;
                
                html.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle smooth scroll for buttons as well
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') && e.target.getAttribute('href')) {
        const href = e.target.getAttribute('href');
        if (href === '#portfolio') {
            e.preventDefault();
            const targetElement = document.getElementById('portfolio');
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.offsetTop - headerHeight;
                html.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// ========================================
// Update Active Navigation Link on Scroll
// ========================================
function updateActiveNavLink() {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const sections = document.querySelectorAll('section');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
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

window.addEventListener('scroll', updateActiveNavLink);

// ========================================
// Back to Top Button
// ========================================
function showBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

backToTop.addEventListener('click', () => {
    html.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', showBackToTopButton);

// ========================================
// Scroll Animation - Observe Elements
// ========================================
const animateOnScrollElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateOnScrollElements.forEach(element => {
    observer.observe(element);
});

// Add data-animate attribute to all animatable elements
function addAnimateAttributes() {
    const animatableElements = [
        ...document.querySelectorAll('.skill-card'),
        ...document.querySelectorAll('.portfolio-card'),
        ...document.querySelectorAll('.service-item'),
        ...document.querySelectorAll('.about__content'),
        ...document.querySelectorAll('.about__heading')
    ];
    
    animatableElements.forEach(element => {
        if (!element.hasAttribute('data-animate')) {
            element.setAttribute('data-animate', 'true');
            observer.observe(element);
        }
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', addAnimateAttributes);

// ========================================
// Contact Form Handling
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate
    if (!name || !email || !subject || !message) {
        showFormNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormNotification('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Show success message
    showFormNotification('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в течение 24 часов.', 'success');
    
    // Reset form
    contactForm.reset();
    
    // Log to console (for demo purposes)
    console.log('Form submitted:', { name, email, subject, message });
    
    // In a real app, you would send this data to a backend server
    // Example:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, subject, message })
    // });
});

// Show notification for form
function showFormNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1100;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// Set First Button Href
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const firstButton = document.querySelector('.hero__buttons .btn--primary');
    if (firstButton) {
        firstButton.addEventListener('click', () => {
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = portfolioSection.offsetTop - headerHeight;
                html.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    const secondButton = document.querySelector('.hero__buttons .btn--secondary');
    if (secondButton) {
        secondButton.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = contactSection.offsetTop - headerHeight;
                html.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// ========================================
// Enhanced Scroll Animation with Stagger Effect
// ========================================
function initScrollAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const serviceItems = document.querySelectorAll('.service-item');
    
    const allAnimatableElements = [...skillCards, ...portfolioCards, ...serviceItems];
    
    allAnimatableElements.forEach((element, index) => {
        element.style.setProperty('--animation-delay', `${index * 100}ms`);
    });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Escape key closes burger menu
    if (e.key === 'Escape' && burger.classList.contains('active')) {
        burger.classList.remove('active');
        nav.classList.remove('active');
    }
});

// ========================================
// Prevent Multiple Form Submissions
// ========================================
let isFormSubmitting = false;

contactForm.addEventListener('submit', (e) => {
    if (isFormSubmitting) {
        e.preventDefault();
        return;
    }
    
    isFormSubmitting = true;
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправляю...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        isFormSubmitting = false;
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
});

// ========================================
// Initialize
// ========================================
console.log('✓ Portfolio website initialized successfully');
console.log('✓ Mobile menu: Click burger icon');
console.log('✓ Smooth scroll: Click navigation links');
console.log('✓ Back to top: Scroll down and click button');
