/* ============================================================
   PORTFOLIO — Main JavaScript
   Smooth scroll, mobile nav, scroll animations, contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu a:not(.btn)');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const sections = document.querySelectorAll('section[id]');


  // ============================================================
  // NAVBAR — Scroll Effect
  // ============================================================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check


  // ============================================================
  // MOBILE MENU — Toggle
  // ============================================================
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  // ============================================================
  // ACTIVE NAV LINK — Intersection Observer
  // ============================================================
  const navObserverOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0,
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        // Update desktop nav
        document.querySelectorAll('.navbar-links a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        // Update mobile nav
        document.querySelectorAll('.mobile-menu a:not(.btn)').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  // ============================================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));


  // ============================================================
  // SMOOTH SCROLL — For anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.offsetTop - 72; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });


  // ============================================================
  // CONTACT FORM — Client-side Handling
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return;
      }

      // Real form submission via Web3Forms
      const submitBtn = document.getElementById('contactSubmit');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Sending...
      `;

      const formData = new FormData(contactForm);
      formData.append('access_key', 'e08e1307-f220-45e3-9cea-8e09fc224c5f');

      // Add a fallback subject if they left it blank
      if (!formData.get('subject')) {
        formData.append('subject', 'New Contact from Portfolio Site');
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        if (response.status === 200) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          // Show success message
          formSuccess.classList.add('show');
          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 5000);
        } else {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          alert('Something went wrong. Please try emailing directly.');
        }
      })
      .catch((error) => {
        console.error(error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Network error. Please try emailing directly.');
      });
    });
  }


  // ============================================================
  // KEYBOARD ACCESSIBILITY — Escape to close mobile menu
  // ============================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      mobileToggle.focus();
    }
  });


  // ============================================================
  // HERO STATS — Count-up Animation
  // ============================================================
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const text = stat.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 1500;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        stat.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  // Trigger stats animation when hero is in view
  const heroSection = document.getElementById('hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateStats, 800);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (heroSection) {
    heroObserver.observe(heroSection);
  }
});


// ============================================================
// CSS SPIN ANIMATION (injected for loading spinner)
// ============================================================
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
