/* ============================================================
   Zaryab Khan — Portfolio Script
   Vanilla JavaScript only.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 700);
  });
  // Fallback in case 'load' already fired or is slow to fire
  setTimeout(() => loader && loader.classList.add('is-hidden'), 3000);

  /* ---------- Hero particles ---------- */
  const particleField = document.getElementById('heroParticles');
  if (particleField) {
    const count = window.innerWidth < 700 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      particleField.appendChild(p);
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');

  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksWrap.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksWrap.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', () => {
        navLinksWrap.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  const navHeightPx = () => document.getElementById('nav')?.offsetHeight || 0;

  function updateActiveNav() {
    const scrollPos = window.scrollY + navHeightPx() + 40;
    let currentId = sections[0]?.id;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ---------- Combined scroll listener (throttled via rAF) ---------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        updateBackToTop();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Skill bar animation on scroll into view ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-card__fill');
          const pct = entry.target.getAttribute('data-skill');
          if (fill && pct) fill.style.width = pct + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skillCards.forEach(card => skillObserver.observe(card));
  } else {
    skillCards.forEach(card => {
      const fill = card.querySelector('.skill-card__fill');
      const pct = card.getAttribute('data-skill');
      if (fill && pct) fill.style.width = pct + '%';
    });
  }

  /* ---------- Typing text animation (hero role) ---------- */
  const typedRoleEl = document.getElementById('typedRole');
  const roles = [
    'Frontend Web Developer',
    'UI Focused Coder',
    'Responsive Design Enthusiast',
    'Problem Solver'
  ];

  if (typedRoleEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        typedRoleEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typedRoleEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      const speed = isDeleting ? 35 : 65;
      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  /* ---------- Project filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const matches = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (error) error.textContent = message;
    if (input) input.closest('.form-group')?.classList.toggle('has-error', Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      let valid = true;

      if (name.length < 2) {
        setError('name', 'nameError', 'Please enter your name.');
        valid = false;
      } else {
        setError('name', 'nameError', '');
      }

      if (!isValidEmail(email)) {
        setError('email', 'emailError', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('email', 'emailError', '');
      }

      if (subject.length < 2) {
        setError('subject', 'subjectError', 'Please add a short subject.');
        valid = false;
      } else {
        setError('subject', 'subjectError', '');
      }

      if (message.length < 10) {
        setError('message', 'messageError', 'Message should be at least 10 characters.');
        valid = false;
      } else {
        setError('message', 'messageError', '');
      }

      if (!valid) return;

      // No backend wired up — simulate a successful send.
      formSuccess && formSuccess.classList.add('is-visible');
      form.reset();

      setTimeout(() => {
        formSuccess && formSuccess.classList.remove('is-visible');
      }, 5000);
    });
  }

  /* ---------- Download CV placeholder ---------- */
  const downloadCv = document.getElementById('downloadCv');
  if (downloadCv) {
    downloadCv.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Add your CV file and link it from the "Download CV" button in index.html.');
    });
  }

});
