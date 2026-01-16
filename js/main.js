// =================================================================
// Acupuncture Website - Main JavaScript
// Handles navigation, scroll effects, and interactive elements
// =================================================================

(function () {
  'use strict';

  // =================================================================
  // Navigation Toggle
  // =================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // =================================================================
  // Smooth Scrolling
  // =================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =================================================================
  // Header Scroll Effect
  // =================================================================
  const header = document.querySelector('.header');
  // Header scroll effect - only activate after hero section
  window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');

    // Get hero height or use default if no hero exists on page
    const heroHeight = hero ? hero.offsetHeight : 500;

    if (window.scrollY > heroHeight - 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // =================================================================
  // Active Navigation Link
  // =================================================================
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink);
  setActiveNavLink();

  // =================================================================
  // Scroll Animations
  // =================================================================
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

  // Observe elements for scroll animations
  document.querySelectorAll('.service-card, .card').forEach(el => {
    observer.observe(el);
  });

  // =================================================================
  // Form Validation
  // =================================================================
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Basic validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');

          // Remove error class on input
          field.addEventListener('input', function () {
            this.classList.remove('error');
          }, { once: true });
        }
      });

      // Email validation
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          emailField.classList.add('error');
        }
      }

      if (isValid) {
        // Show success message
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
      } else {
        showMessage('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  // =================================================================
  // Message Display Helper
  // =================================================================
  function showMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-align: center;
      animation: fadeInUp 0.3s ease-out;
      background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
      color: ${type === 'success' ? '#155724' : '#721c24'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;

    if (contactForm) {
      contactForm.appendChild(messageDiv);
      setTimeout(() => messageDiv.remove(), 5000);
    }
  }

  // =================================================================
  // Lazy Loading Images
  // =================================================================
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // =================================================================
  // Back to Top Button
  // =================================================================
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  backToTop.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
  });

  backToTop.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  });

  // =================================================================
  // Initialize on DOM Content Loaded
  // =================================================================
  console.log('Acupuncture Website - Initialized');

})();
