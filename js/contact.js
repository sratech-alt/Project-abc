/**
 * contact.js — Sabiora Contact Form & EmailJS Integration
 * Handles validation, submission states, and EmailJS API wiring.
 */

// EmailJS Credentials Placeholders — Clearly marked per architecture.md guidelines
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // Replace with client's EmailJS Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID',   // Replace with client's EmailJS Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID'  // Replace with client's EmailJS Template ID
};

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name')?.value.trim();
      const email = document.getElementById('user-email')?.value.trim();
      const subject = document.getElementById('user-subject')?.value.trim();
      const message = document.getElementById('user-message')?.value.trim();

      // Basic Validation
      if (!name || !email || !message) {
        showStatus('Please complete all required fields (Name, Email, Message).', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // UI Loading State
      setButtonLoading(true);
      showStatus('Sending your message...', 'info');

      // Check if placeholders are still present
      if (
        EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || 
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
      ) {
        // Simulated response during placeholder/dev mode
        setTimeout(() => {
          setButtonLoading(false);
          showStatus(
            '<strong>Demo Mode Active:</strong> Form validated successfully! Replace <code>YOUR_SERVICE_ID</code>, <code>YOUR_TEMPLATE_ID</code>, and <code>YOUR_PUBLIC_KEY</code> in <code>js/contact.js</code> to enable live EmailJS delivery.', 
            'success'
          );
          contactForm.reset();
        }, 1000);
        return;
      }

      // Live EmailJS Call
      try {
        const response = await emailjs.sendForm(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          contactForm
        );

        if (response.status === 200) {
          showStatus('Thank you! Your message has been sent successfully. We will respond shortly.', 'success');
          contactForm.reset();
        } else {
          showStatus('Failed to send message. Please try again or email us directly.', 'error');
        }
      } catch (error) {
        console.error('EmailJS Error:', error);
        showStatus('An unexpected error occurred. Please check your network connection and try again.', 'error');
      } finally {
        setButtonLoading(false);
      }
    });
  }

  /**
   * Display Status Alert Box
   * @param {string} message 
   * @param {'info' | 'success' | 'error'} type 
   */
  function showStatus(message, type) {
    if (!formStatus) return;

    formStatus.className = 'p-4 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm';

    if (type === 'error') {
      formStatus.classList.add('bg-rose-50', 'text-rose-800', 'border', 'border-rose-200');
    } else if (type === 'success') {
      formStatus.classList.add('bg-emerald-50', 'text-emerald-900', 'border', 'border-emerald-200');
    } else {
      formStatus.classList.add('bg-amber-50', 'text-amber-900', 'border', 'border-amber-200');
    }

    formStatus.innerHTML = message;
    formStatus.classList.remove('hidden');
  }

  /**
   * Toggle Submit Button Loading State
   * @param {boolean} isLoading 
   */
  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="flex items-center gap-2">
          <i data-lucide="loader-2" class="animate-spin w-4 h-4 text-white"></i>
          Sending...
        </span>
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
          Send Message
          <i data-lucide="send" class="w-4 h-4"></i>
        </span>
      `;
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
});
