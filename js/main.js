/* Noble Shield Limited — Main JS */

// ── Navigation scroll effect
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ── Active nav link
const _path = window.location.pathname;
const _filename = _path.split('/').pop() || 'index.html';
const _inServicesDir = _path.includes('/services/') && _filename !== 'services.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const hrefFile = link.getAttribute('href').split('/').pop();
  if (hrefFile === _filename) {
    link.classList.add('active');
  } else if (_inServicesDir && hrefFile === 'services.html') {
    link.classList.add('active');
  }
});

// ── Fade-up animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Counter animation
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, 1800, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Cookie banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (cookieBanner && !localStorage.getItem('nsl_cookies')) {
  cookieBanner.classList.remove('hidden');
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('nsl_cookies', 'accepted');
    cookieBanner.classList.add('hidden');
  });
}
if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    localStorage.setItem('nsl_cookies', 'declined');
    cookieBanner.classList.add('hidden');
  });
}

// ── Contact form — validate only, no submission yet
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    this.querySelectorAll('.form-group').forEach(g => g.classList.remove('form-error'));

    // Validate required fields
    let valid = true;
    this.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      const empty = field.tagName === 'SELECT' ? !field.value : !field.value.trim();
      const badEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (empty || badEmail) {
        if (group) group.classList.add('form-error');
        valid = false;
      }
    });

    if (!valid) return;

    // All valid — show success, hide form
    this.style.display = 'none';
    const success = document.createElement('div');
    success.className = 'form-success';
    success.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <h3>Message Received</h3>
      <p>Thank you for your enquiry. We'll be in touch shortly.</p>
    `;
    this.parentNode.appendChild(success);
  });
}

// ── Back to top button
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
