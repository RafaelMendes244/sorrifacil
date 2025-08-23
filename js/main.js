// ======================== JAVASCRIPT ========================

document.addEventListener('DOMContentLoaded', () => {

    // Helper: Throttling function for performance optimization
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // --- Element Selectors ---
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const backdrop = document.getElementById('backdrop');
    const offcanvas = document.getElementById('offcanvas');
    const navLinks = document.querySelectorAll('[data-navlink]');
    const scrollUp = document.getElementById('scrollUp');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav__menu a');
    const counterElements = document.querySelectorAll('[data-counter]');
    const yearSpan = document.getElementById('year');
    
    // --- Offcanvas (Mobile Menu) ---
    function openOffcanvas() {
        backdrop.hidden = false;
        backdrop.classList.add('is-open');
        offcanvas.classList.add('is-open');
        offcanvas.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeOffcanvas() {
        backdrop.classList.remove('is-open');
        offcanvas.classList.remove('is-open');
        offcanvas.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => backdrop.hidden = true, 250);
    }

    navToggle.addEventListener('click', openOffcanvas);
    navClose.addEventListener('click', closeOffcanvas);
    backdrop.addEventListener('click', closeOffcanvas);
    navLinks.forEach(link => link.addEventListener('click', closeOffcanvas));


    // --- Scroll-based Effects ---
    function handleScrollEffects() {
        const scrollY = window.scrollY;
        // Header style
        header.classList.toggle('is-scrolled', scrollY > 50);
        // Scroll-up button visibility
        scrollUp.classList.toggle('is-visible', scrollY > 300);
        // Active nav link
        setActiveLink(scrollY);
    }

    function setActiveLink(scrollY) {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navMenuLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('is-active');
            }
        });
    }
    
    // Attach the throttled scroll handler
    window.addEventListener('scroll', throttle(handleScrollEffects, 100));


    // --- Form Validation and Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const feedbackEl = document.getElementById('form-feedback');
            let isValid = true;
            
            // Clear previous feedback
            feedbackEl.textContent = '';
            feedbackEl.className = '';

            // Simple validation
            ['responsavel', 'email', 'telefone'].forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!data[field] || data[field].trim() === '') {
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });
            
            // Email regex validation
            const emailInput = this.querySelector('[name="email"]');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                emailInput.classList.remove('is-valid');
                isValid = false;
            }
            
            if (isValid) {
                // Professional feedback instead of alert()
                feedbackEl.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                feedbackEl.classList.add('success');
                
                this.reset();
                this.querySelectorAll('.form__control').forEach(input => input.classList.remove('is-valid', 'is-invalid'));
                
                // Clear the message after 5 seconds
                setTimeout(() => {
                    feedbackEl.textContent = '';
                    feedbackEl.classList.remove('success');
                }, 5000);
            }
        });
    }

    // --- Intersection Observer for Counter Animation ---
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const suffix = element.textContent.includes('%') ? '%' : '+';
        let current = 0;
        const increment = target / 100;

        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    }
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => counterObserver.observe(el));
    
    // --- Footer Year ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});