/**
 * animations.js — Sabiora Scroll Reveal & Interactive UI Behavior
 * Uses IntersectionObserver for high-performance scroll triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons across static page content
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // 1. Single-instance IntersectionObserver for scroll reveals
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Observe once — element stays visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
    
    // MutationObserver to observe dynamically rendered items from render.js
    const dynamicContainers = ['projects-grid', 'team-grid', 'testimonials-grid'];
    dynamicContainers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        const mutObserver = new MutationObserver(() => {
          const newReveals = container.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
          newReveals.forEach(el => revealObserver.observe(el));
        });
        mutObserver.observe(container, { childList: true, subtree: true });
      }
    });
  } else {
    // Fallback for older browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Header Backdrop Scroll Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }, { passive: true });
  }

  // 3. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on clicking any link inside it
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Smooth Anchor Link Scrolling with Offset for Sticky Header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
