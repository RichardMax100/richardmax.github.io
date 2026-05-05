/* ============================================================
   RICHARD MAX — PORTFOLIO JAVASCRIPT
   Features:
   · Custom cursor tracking
   · Navbar scroll behaviour + active link highlight
   · Mobile hamburger menu
   · Scroll-reveal animations (IntersectionObserver)
   · Skill bar animations
   · Smooth contact form with validation
   · Footer year injection
   ============================================================ */

/* ── 1. UTILITY: wait for DOM to be ready ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 2. CUSTOM CURSOR ──────────────────────────────────── */
  const dot = document.getElementById('cursorDot');

  // Only activate on devices that support hover (non-touch)
  if (window.matchMedia('(hover: hover)').matches && dot) {
    document.addEventListener('mousemove', e => {
      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';
      });
    });

    // Expand cursor when hovering over interactive elements
    const interactives = document.querySelectorAll(
      'a, button, input, textarea, .project-card, .contact-card'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('expanded'));
      el.addEventListener('mouseleave', () => dot.classList.remove('expanded'));
    });
  }


  /* ── 3. NAVBAR: scroll state ───────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load


  /* ── 4. NAVBAR: active link highlight on scroll ────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      // Match link href like "#about" to section id "about"
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ── 5. MOBILE HAMBURGER MENU ──────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks  = document.querySelectorAll('.drawer-link');

  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    // Prevent body scroll when drawer is open
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close drawer when a link is clicked
  drawerLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close drawer when clicking outside (on the dimmed area)
  document.addEventListener('click', e => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });


  /* ── 6. SCROLL-REVEAL (IntersectionObserver) ───────────── */
  // All elements with class "reveal" will animate in when visible
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Small stagger delay based on order within parent
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 70, 350); // cap delay at 350ms

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          // Unobserve after animation to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,        // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'  // slightly before the bottom of viewport
    }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ── 7. SKILL BAR ANIMATION ────────────────────────────── */
  // Skill bars animate their width when scrolled into view
  const skillBars = document.querySelectorAll('.bar-fill');

  const barObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so the reveal animation finishes first
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, 300);
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => barObserver.observe(bar));


  /* ── 8. CONTACT FORM HANDLING ──────────────────────────── */
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className   = `form-feedback ${type}`;

    // Clear after 5 seconds
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className   = 'form-feedback';
    }, 5000);
  }

  function validateEmail(email) {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault(); // prevent page reload

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name) {
        showFeedback('Please enter your name.', 'error');
        document.getElementById('name').focus();
        return;
      }
      if (!email || !validateEmail(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        document.getElementById('email').focus();
        return;
      }
      if (!message || message.length < 10) {
        showFeedback('Please enter a message (at least 10 characters).', 'error');
        document.getElementById('message').focus();
        return;
      }

      // Simulate form submission (replace with real backend / Formspree / EmailJS)
      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText   = submitBtn.querySelector('span');

      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';

      setTimeout(() => {
        // Reset button
        submitBtn.disabled  = false;
        btnText.textContent = 'Send Message';

        // Success feedback & reset form
        showFeedback('✅ Message sent! I\'ll get back to you within 24 hours.', 'success');
        form.reset();
      }, 1600); // simulated network delay
    });
  }


  /* ── 9. FOOTER: inject current year ───────────────────── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ── 10. SMOOTH SCROLL POLYFILL (for older Safari) ────── */
  // Native scroll-behavior: smooth is set in CSS, but this handles
  // anchor clicks that might be intercepted before CSS takes effect
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 11. HERO TEXT: subtle entrance animation ──────────── */
  // Hero elements use the shared .reveal class, but we also
  // stagger them with custom delays via a quick loop
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    // Trigger immediately since hero is always in view on load
    requestAnimationFrame(() => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 120);
    });
  });

}); // end DOMContentLoaded
