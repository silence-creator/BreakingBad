/* ═══════════════════════════════════════════════════════════════
   Breaking Bad — Main JavaScript
   Modules: Navbar · Scroll Reveal · Smoke Particles · Parallax
            · Trivia Cards · Nav Highlight · Char Cards
═══════════════════════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
})();

/* ── Scroll reveal ── */
(function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
})();

/* ── Progress bars animate on scroll into view ── */
(function initProgressBars() {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-bar').forEach(bar => bar.classList.add('active'));
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.glass').forEach(el => {
    if (el.querySelector('.progress-bar')) barObserver.observe(el);
  });
})();

/* ── Smoke particle system ── */
(function initSmoke() {
  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 28;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x        = Math.random() * canvas.width;
      this.y        = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.vx       = (Math.random() - 0.5) * 0.4;
      this.vy       = -(Math.random() * 0.5 + 0.2);
      this.size     = Math.random() * 80 + 40;
      this.alpha    = 0;
      this.maxAlpha = Math.random() * 0.12 + 0.04;
      this.growing  = true;
      this.hue      = Math.random() > 0.6 ? 120 : 180; // green or cyan
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.size += 0.3;

      if (this.growing) {
        this.alpha += 0.003;
        if (this.alpha >= this.maxAlpha) this.growing = false;
      } else {
        this.alpha -= 0.002;
      }

      if (this.alpha <= 0 || this.y < -this.size) this.reset();
    }

    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, `hsla(${this.hue},100%,60%,${this.alpha})`);
      grad.addColorStop(1, `hsla(${this.hue},100%,60%,0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq.matches) animate();
  mq.addEventListener('change', e => {
    if (e.matches) cancelAnimationFrame(animId);
    else animate();
  });
})();

/* ── Parallax hero formulas on mouse move ── */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const formulas = hero.querySelectorAll('.formula-bg');

  hero.addEventListener('mousemove', (e) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const rect = hero.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;

    formulas.forEach((el, i) => {
      const depth = (i % 3 + 1) * 8;
      el.style.transform = `translate(${cx * depth}px, ${cy * depth}px) rotate(${el.dataset.rot || 0}deg)`;
    });
  });
})();

/* ── Trivia flip cards ── */
(function initTriviaCards() {
  document.querySelectorAll('.trivia-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
})();

/* ── Active nav link highlight on scroll ── */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('text-bb-green', isActive);
        link.classList.toggle('text-bb-muted',  !isActive);
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Periodic badge hover scale ── */
(function initBadgeHover() {
  document.querySelectorAll('.periodic-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return;
      badge.style.transition = 'transform 0.3s ease';
      badge.style.transform  = 'scale(1.05)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = 'scale(1)';
    });
  });
})();

/* ── Character cards stagger entrance ── */
(function initCharCards() {
  document.querySelectorAll('.char-card').forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  });

  const charGrid = document.querySelector('#characters .grid');
  if (!charGrid) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.char-card').forEach(card => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  observer.observe(charGrid);
})();
