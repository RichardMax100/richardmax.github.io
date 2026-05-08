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


  /* ── 8. CONTACT FORM — Formspree integration ──────────────
     Endpoint : https://formspree.io/f/xvzlqbzb
     Method   : fetch() with JSON — no page reload, works on
                GitHub Pages (purely client-side).
     Flow     :
       1. User fills name / email / message and clicks Send.
       2. We validate fields before touching the network.
       3. Button switches to a "Sending…" loading state.
       4. fetch() POSTs JSON to Formspree; Formspree emails
          richardlock342@gmail.com with the submission.
       5a. Success → show success banner, reset form fields.
       5b. Error   → show error banner, re-enable button.
  ─────────────────────────────────────────────────────────── */

  // ── Formspree endpoint (your personal form URL) ──────────
  const FORMSPREE_URL = 'https://formspree.io/f/xvzlqbzb';

  // ── Grab DOM elements ────────────────────────────────────
  const form       = document.getElementById('contactForm');
  const feedback   = document.getElementById('formFeedback');
  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = document.getElementById('btnLabel');
  const btnIcon    = document.getElementById('btnIcon');

  // ── Helper: show a feedback banner ──────────────────────
  // type = 'success' | 'error'
  function showFeedback(message, type) {
    feedback.textContent = message;

    // Remove both state classes first, then add the right one
    feedback.classList.remove(
      'form-feedback--success',
      'form-feedback--error',
      'form-feedback--hidden'
    );
    feedback.classList.add(`form-feedback--${type}`);

    // Automatically fade out after 7 seconds
    setTimeout(() => {
      feedback.classList.add('form-feedback--hidden');
    }, 7000);
  }

  // ── Helper: basic email format check ────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Helper: set button to loading / ready state ─────────
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled    = true;
      btnLabel.textContent  = 'Sending…';
      btnIcon.className     = 'ph ph-circle-notch'; // spinner icon
      submitBtn.style.opacity = '0.75';
    } else {
      submitBtn.disabled    = false;
      btnLabel.textContent  = 'Send Message';
      btnIcon.className     = 'ph ph-paper-plane-tilt';
      submitBtn.style.opacity = '1';
    }
  }

  // ── Main submit handler ──────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      // IMPORTANT: prevent the browser from navigating away
      e.preventDefault();

      // ── Step 1: read & trim field values ──────────────
      const nameVal    = document.getElementById('senderName').value.trim();
      const emailVal   = document.getElementById('senderEmail').value.trim();
      const messageVal = document.getElementById('senderMessage').value.trim();

      // ── Step 2: client-side validation ────────────────
      // We do this before hitting the network to give instant
      // feedback without burning a Formspree request.
      if (!nameVal) {
        showFeedback('⚠️ Please enter your name.', 'error');
        document.getElementById('senderName').focus();
        return;
      }
      if (!emailVal || !isValidEmail(emailVal)) {
        showFeedback('⚠️ Please enter a valid email address.', 'error');
        document.getElementById('senderEmail').focus();
        return;
      }
      if (!messageVal || messageVal.length < 10) {
        showFeedback('⚠️ Please write a message (at least 10 characters).', 'error');
        document.getElementById('senderMessage').focus();
        return;
      }

      // ── Step 3: switch button to loading state ─────────
      setLoading(true);

      // ── Step 4: POST to Formspree via fetch ─────────────
      // We send JSON and set the Accept header so Formspree
      // returns a JSON response instead of redirecting.
      try {
        const response = await fetch(FORMSPREE_URL, {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept'       : 'application/json'
          },
          body: JSON.stringify({
            name   : nameVal,
            email  : emailVal,
            message: messageVal
          })
        });

        // ── Step 5a: handle Formspree success ─────────────
        if (response.ok) {
          // Show the exact success message requested
          showFeedback(
            '✅ Message sent, you will receive a reply with due time.',
            'success'
          );
          // Clear all form fields
          form.reset();
        } else {
          // ── Step 5b: Formspree returned an error status ──
          // Parse the error body if available
          const data = await response.json().catch(() => ({}));
          const errMsg = (data.errors && data.errors[0] && data.errors[0].message)
            ? data.errors[0].message
            : 'Something went wrong. Please try again.';
          showFeedback(`❌ ${errMsg}`, 'error');
        }

      } catch (networkError) {
        // ── Network failure (offline, DNS, etc.) ──────────
        showFeedback(
          '❌ Could not send message. Please check your connection and try again.',
          'error'
        );
      } finally {
        // Always re-enable the button, success or failure
        setLoading(false);
      }
    }); // end submit handler
  } // end if (form)


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