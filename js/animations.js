/**
 * animations.js — Sabiora Scroll Reveal & Interactive UI Behavior
 * Uses IntersectionObserver for high-performance scroll triggers.
 * Added Comment to make change for commiting
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

  // 5. Theme Toggle (Light / Dark)
  const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
  if (themeToggleButtons.length > 0) {
    themeToggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('sabiora-theme', next);
        } catch (e) {
          /* localStorage unavailable — theme still applies for this session */
        }
      });
    });
  }

  // 6. Active Navigation State (scroll-spy)
  // Tracks which section is currently in view and highlights the matching
  // nav link (desktop + mobile) — animated underline, styled in index.css
  // via .nav-link / .nav-link.is-active.
  initNavScrollSpy();

  // 7. Services Dropdown (desktop nav)
  initServicesDropdown();
});

function initNavScrollSpy() {
  const navSectionIds = ['about', 'services', 'projects', 'why-us', 'team', 'testimonials'];
  const sections = navSectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  if (sections.length === 0 || navLinks.length === 0) return;

  function setActiveNav(id) {
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  }

  // Suppress scroll-spy updates briefly after a manual nav click so the
  // clicked item doesn't flicker to a different section mid-scroll.
  let manualOverrideId = null;
  let manualOverrideTimeout = null;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = (link.getAttribute('href') || '').replace('#', '');
      if (!navSectionIds.includes(id)) return;
      manualOverrideId = id;
      setActiveNav(id);
      clearTimeout(manualOverrideTimeout);
      manualOverrideTimeout = setTimeout(() => {
        manualOverrideId = null;
      }, 900);
    });
  });

  // Page loaded at a hash URL — reflect it immediately, before any scrolling.
  const initialId = (window.location.hash || '').replace('#', '');
  if (navSectionIds.includes(initialId)) {
    setActiveNav(initialId);
  }

  if (!('IntersectionObserver' in window)) {
    setActiveNav(navSectionIds[0]);
    return;
  }

  let currentActive = initialId && navSectionIds.includes(initialId) ? initialId : null;

  const navObserver = new IntersectionObserver((entries) => {
    if (manualOverrideId) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentActive = entry.target.id;
      }
    });

    if (currentActive) setActiveNav(currentActive);
  }, {
    root: null,
    // A thin horizontal band near the vertical center of the viewport —
    // whichever section crosses it is considered "current".
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));

  // Keep the last nav section highlighted once the user scrolls past it
  // into the Contact section / footer, rather than clearing the active state.
  window.addEventListener('scroll', () => {
    if (manualOverrideId) return;
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (scrolledToBottom) {
      setActiveNav(navSectionIds[navSectionIds.length - 1]);
    }
  }, { passive: true });
}

/**
 * Services dropdown — click-toggled (not hover-only, so it works the same
 * with touch and keyboard), closes on outside click, Escape, or item select.
 */
function initServicesDropdown() {
  document.querySelectorAll('[data-dropdown]').forEach(wrapper => {
    const trigger = wrapper.querySelector('[data-dropdown-trigger]');
    const panel = wrapper.querySelector('[data-dropdown-panel]');
    const chevron = wrapper.querySelector('[data-dropdown-chevron]');
    if (!trigger || !panel) return;

    function openPanel() {
      panel.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.classList.add('is-rotated');
    }

    function closePanel() {
      panel.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.classList.remove('is-rotated');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('is-open');
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    panel.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', closePanel);
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closePanel();
        trigger.focus();
      }
    });
  });
}
