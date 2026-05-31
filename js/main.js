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
      this.vx       = (Math.random() - 0.5) * 0.3;
      this.vy       = -(Math.random() * 0.4 + 0.15);
      this.size     = Math.random() * 100 + 60;
      this.alpha    = 0;
      this.maxAlpha = Math.random() * 0.09 + 0.03;
      this.growing  = true;
      // Desert smoke: warm amber, dusty sand, faint rust
      const palette = [28, 35, 22, 40]; // hues: amber/orange/yellow range
      this.hue = palette[Math.floor(Math.random() * palette.length)];
      this.sat = Math.floor(Math.random() * 30 + 20); // low saturation — dusty
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
      grad.addColorStop(0, `hsla(${this.hue},${this.sat}%,55%,${this.alpha})`);
      grad.addColorStop(1, `hsla(${this.hue},${this.sat}%,40%,0)`);
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

/* ── Language switcher ── */
function setLang(lang) {
  // Toggle body class
  document.body.classList.remove('lang-en', 'lang-ru');
  document.body.classList.add('lang-' + lang);

  // Update button states
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-ru').classList.toggle('active', lang === 'ru');

  // Update <html lang> attribute
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';

  // Persist choice
  try { localStorage.setItem('bb-lang', lang); } catch(e) {}
}

/* Restore saved language on load */
(function initLang() {
  let saved = 'en';
  try { saved = localStorage.getItem('bb-lang') || 'en'; } catch(e) {}
  if (saved === 'ru') setLang('ru');
})();

/* ── Custom Audio Player ── */
(function initAudioPlayer() {
  const audio       = document.getElementById('bb-audio');
  const playBtn     = document.getElementById('bb-play-btn');
  const iconPlay    = document.getElementById('bb-icon-play');
  const iconPause   = document.getElementById('bb-icon-pause');
  const progressBar = document.getElementById('bb-progress-bar');
  const thumb       = document.getElementById('bb-thumb');
  const timeDisplay = document.getElementById('bb-time');
  const volBar      = document.getElementById('bb-vol-bar');
  const volWrap     = document.getElementById('bb-vol-wrap');
  const volIcon     = document.getElementById('bb-vol-icon');

  if (!audio || !playBtn) return;

  /* ── Helpers ── */
  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  function updateProgress() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct + '%';
    thumb.style.left        = pct + '%';
    timeDisplay.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    const wrap = document.getElementById('bb-progress-wrap');
    if (wrap) wrap.setAttribute('aria-valuenow', Math.round(pct));
  }

  function setPlayState(playing) {
    iconPlay.style.display  = playing ? 'none'  : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  /* ── Events ── */
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('ended', () => setPlayState(false));

  /* ── Global functions called from HTML onclick ── */
  window.bbTogglePlay = function() {
    if (audio.paused) {
      audio.play().catch(() => {});
      setPlayState(true);
    } else {
      audio.pause();
      setPlayState(false);
    }
  };

  window.bbSeek = function(e) {
    const wrap = document.getElementById('bb-progress-wrap');
    if (!wrap || !audio.duration) return;
    const rect = wrap.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    updateProgress();
  };

  window.bbSeekKey = function(e) {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
    updateProgress();
  };

  window.bbSetVolume = function(e) {
    if (!volWrap) return;
    const rect = volWrap.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pct;
    audio.muted  = false;
    volBar.style.width = (pct * 100) + '%';
    volWrap.setAttribute('aria-valuenow', Math.round(pct * 100));
    updateVolIcon(pct);
  };

  window.bbToggleMute = function() {
    audio.muted = !audio.muted;
    const vol = audio.muted ? 0 : audio.volume;
    volBar.style.width = (vol * 100) + '%';
    updateVolIcon(audio.muted ? 0 : audio.volume);
  };

  function updateVolIcon(vol) {
    if (!volIcon) return;
    if (vol === 0) {
      volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else if (vol < 0.5) {
      volIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
    } else {
      volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  /* ── Drag on progress bar ── */
  let dragging = false;
  const wrap = document.getElementById('bb-progress-wrap');
  if (wrap) {
    wrap.addEventListener('mousedown', (e) => { dragging = true; window.bbSeek(e); });
    document.addEventListener('mousemove', (e) => { if (dragging) window.bbSeek(e); });
    document.addEventListener('mouseup',   ()  => { dragging = false; });
  }
})();

/* ── Scroll-to-top button ── */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display  = 'flex';
      btn.style.opacity  = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity  = '0';
      btn.style.transform = 'translateY(8px)';
      // hide after fade
      setTimeout(() => { if (window.scrollY <= 400) btn.style.display = 'none'; }, 300);
    }
  }, { passive: true });
})();

/* ── Lightbox ── */
(function initLightbox() {
  // Build index of all gallery cards
  window._lbCards = Array.from(document.querySelectorAll('[data-lb-src]'));
  window._lbIndex = 0;
})();

window.bbLightboxOpen = function(card) {
  const lb      = document.getElementById('lightbox');
  const img     = document.getElementById('lb-img');
  const title   = document.getElementById('lb-title');
  const episode = document.getElementById('lb-episode');
  const counter = document.getElementById('lb-counter');
  if (!lb) return;

  const cards = window._lbCards;
  const idx   = cards.indexOf(card);
  window._lbIndex = idx >= 0 ? idx : 0;

  function show(i) {
    const c    = cards[i];
    const lang = document.body.classList.contains('lang-ru') ? 'ru' : 'en';
    img.src    = c.dataset.lbSrc;
    img.alt    = lang === 'ru' ? (c.dataset.lbTitleRu || c.dataset.lbTitle) : c.dataset.lbTitle;
    title.textContent   = lang === 'ru' ? (c.dataset.lbTitleRu || c.dataset.lbTitle) : c.dataset.lbTitle;
    episode.textContent = c.dataset.lbEpisode || '';
    counter.textContent = (i + 1) + ' / ' + cards.length;
    // hide prev/next if only one image
    document.getElementById('lb-prev').style.display = cards.length > 1 ? 'flex' : 'none';
    document.getElementById('lb-next').style.display = cards.length > 1 ? 'flex' : 'none';
  }

  show(window._lbIndex);
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  lb.focus();
};

window.bbLightboxClose = function(e) {
  if (e && e.target !== document.getElementById('lightbox') && e.type === 'click') return;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.style.display = 'none';
  document.body.style.overflow = '';
};

window.bbLightboxNav = function(dir) {
  const cards = window._lbCards;
  window._lbIndex = (window._lbIndex + dir + cards.length) % cards.length;
  // re-open with new index card
  const fakeCard = cards[window._lbIndex];
  const img     = document.getElementById('lb-img');
  const title   = document.getElementById('lb-title');
  const episode = document.getElementById('lb-episode');
  const counter = document.getElementById('lb-counter');
  const lang    = document.body.classList.contains('lang-ru') ? 'ru' : 'en';
  img.src    = fakeCard.dataset.lbSrc;
  img.alt    = lang === 'ru' ? (fakeCard.dataset.lbTitleRu || fakeCard.dataset.lbTitle) : fakeCard.dataset.lbTitle;
  title.textContent   = lang === 'ru' ? (fakeCard.dataset.lbTitleRu || fakeCard.dataset.lbTitle) : fakeCard.dataset.lbTitle;
  episode.textContent = fakeCard.dataset.lbEpisode || '';
  counter.textContent = (window._lbIndex + 1) + ' / ' + cards.length;
};

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.style.display === 'none') return;
  if (e.key === 'Escape')      bbLightboxClose({});
  if (e.key === 'ArrowRight')  bbLightboxNav(1);
  if (e.key === 'ArrowLeft')   bbLightboxNav(-1);
});

// Keyboard open for scene cards
document.querySelectorAll('[data-lb-src]').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bbLightboxOpen(card); }
  });
});

/* ── Random Quote ── */
(function() {
  const quotes = [
    {
      en: 'I am the one who knocks.',
      ru: 'Я тот, кто стучится.',
      ep_en: 'Season 4, Episode 6 — "Cornered"',
      ep_ru: 'Сезон 4, Эпизод 6 — «В ловушке»',
      who_en: 'Walter White · Season 4',
      who_ru: 'Уолтер Уайт · Сезон 4',
    },
    {
      en: 'Say my name.',
      ru: 'Назови моё имя.',
      ep_en: 'Season 5, Episode 7 — "Say My Name"',
      ep_ru: 'Сезон 5, Эпизод 7 — «Назови моё имя»',
      who_en: 'Walter White · Season 5',
      who_ru: 'Уолтер Уайт · Сезон 5',
    },
    {
      en: 'I did it for me. I liked it. I was good at it. And I was really... I was alive.',
      ru: 'Я делал это для себя. Мне нравилось. Я был хорош в этом. И я был по-настоящему... живым.',
      ep_en: 'Season 5, Episode 16 — "Felina"',
      ep_ru: 'Сезон 5, Эпизод 16 — «Фелина»',
      who_en: 'Walter White · Season 5',
      who_ru: 'Уолтер Уайт · Сезон 5',
    },
    {
      en: 'No more half measures, Walter.',
      ru: 'Никаких полумер, Уолтер.',
      ep_en: 'Season 3, Episode 12 — "Half Measures"',
      ep_ru: 'Сезон 3, Эпизод 12 — «Полумеры»',
      who_en: 'Mike Ehrmantraut · Season 3',
      who_ru: 'Майк Эрмантраут · Сезон 3',
    },
    {
      en: 'I am not in danger, Skyler. I am the danger.',
      ru: 'Я не в опасности, Скайлер. Я сам — опасность.',
      ep_en: 'Season 4, Episode 6 — "Cornered"',
      ep_ru: 'Сезон 4, Эпизод 6 — «В ловушке»',
      who_en: 'Walter White · Season 4',
      who_ru: 'Уолтер Уайт · Сезон 4',
    },
    {
      en: 'Yeah, science!',
      ru: 'Да, наука!',
      ep_en: 'Season 1, Episode 1 — "Pilot"',
      ep_ru: 'Сезон 1, Эпизод 1 — «Пилот»',
      who_en: 'Jesse Pinkman · Season 1',
      who_ru: 'Джесси Пинкман · Сезон 1',
    },
    {
      en: 'Stay out of my territory.',
      ru: 'Держись подальше от моей территории.',
      ep_en: 'Season 2, Episode 6 — "Peekaboo"',
      ep_ru: 'Сезон 2, Эпизод 6 — «Ку-ку»',
      who_en: 'Walter White · Season 2',
      who_ru: 'Уолтер Уайт · Сезон 2',
    },
    {
      en: 'I have spent my whole life scared. And then it hit me — fear is the worst of it.',
      ru: 'Я провёл всю жизнь в страхе. А потом понял — страх — это самое худшее.',
      ep_en: 'Season 2, Episode 6 — "Peekaboo"',
      ep_ru: 'Сезон 2, Эпизод 6 — «Ку-ку»',
      who_en: 'Walter White · Season 2',
      who_ru: 'Уолтер Уайт · Сезон 2',
    },
    {
      en: "If you don't know who I am, then maybe your best course would be to tread lightly.",
      ru: 'Если ты не знаешь, кто я такой, то, возможно, тебе стоит ступать осторожнее.',
      ep_en: 'Season 5, Episode 9 — "Blood Money"',
      ep_ru: 'Сезон 5, Эпизод 9 — «Кровавые деньги»',
      who_en: 'Walter White · Season 5',
      who_ru: 'Уолтер Уайт · Сезон 5',
    },
    {
      en: 'I watched Jane die. I was there. And I watched her die.',
      ru: 'Я видел, как умерла Джейн. Я был там. И я смотрел, как она умирает.',
      ep_en: 'Season 4, Episode 13 — "Face Off"',
      ep_ru: 'Сезон 4, Эпизод 13 — «Лицом к лицу»',
      who_en: 'Walter White · Season 4',
      who_ru: 'Уолтер Уайт · Сезон 4',
    },
  ];

  window.bbRandomQuote = function() {
    const lang    = document.body.classList.contains('lang-ru') ? 'ru' : 'en';
    const q       = quotes[Math.floor(Math.random() * quotes.length)];
    const block   = document.querySelector('#quote-banner blockquote');
    const epEl    = document.querySelector('#quote-banner .quote-episode');
    const whoEl   = document.querySelector('#quote-banner .quote-who');
    if (!block) return;

    // Fade out
    block.style.transition = 'opacity 0.25s';
    block.style.opacity    = '0';
    if (epEl)  epEl.style.opacity  = '0';
    if (whoEl) whoEl.style.opacity = '0';

    setTimeout(() => {
      const text  = lang === 'ru' ? q.ru : q.en;
      const words = text.split(' ');
      const mid   = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ').toUpperCase();
      const line2 = words.slice(mid).join(' ').toUpperCase();

      block.innerHTML =
        '<span style="color:#d4bc8a;">' + line1 + '</span>' +
        (line2 ? '<br/><span style="color:#e8c547;">' + line2 + '</span>' : '');

      if (epEl)  epEl.textContent  = lang === 'ru' ? q.ep_ru  : q.ep_en;
      if (whoEl) whoEl.textContent = lang === 'ru' ? q.who_ru : q.who_en;

      block.style.opacity = '1';
      if (epEl)  epEl.style.opacity  = '1';
      if (whoEl) whoEl.style.opacity = '1';
    }, 250);
  };
})();

/* ── Read progress bar ── */
(function initReadProgress() {
  const bar = document.getElementById('read-progress');
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* ── Custom cursor ── */
(function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('bb-cursor');
  if (!cursor) return;

  let x = 0, y = 0;

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  // Hover на кликабельных элементах
  const HOVER_SEL = 'a, button, [role="button"], [tabindex], label, input, select, textarea, .char-card, .scene-card, .trivia-card, .tl-ep, [data-lb-src]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SEL)) cursor.classList.add('is-hovering');
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SEL)) cursor.classList.remove('is-hovering');
  }, { passive: true });

  document.addEventListener('mousedown', () => cursor.classList.add('is-clicking'),    { passive: true });
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-clicking'), { passive: true });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; }, { passive: true });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; }, { passive: true });
})();

/* ── Location map (Leaflet) ── */
(function initLocMap() {
  const LOC_DATA = [
    {
      lat: 35.0853, lng: -106.6056,
      img: 'static/images/abq.jpg', imgAlt: 'Aerial view of Albuquerque',
      coords: '35.0853\u00b0 N \u00b7 106.6056\u00b0 W', color: '#e8c547',
      title: { en: 'ALBUQUERQUE', ru: '\u0410\u041b\u042c\u0411\u0423\u041a\u0415\u0420\u041a\u0415' },
      desc: {
        en: 'New Mexico. Population 560,000. The city that became the backdrop for the greatest transformation in television history.',
        ru: '\u041d\u044c\u044e-\u041c\u0435\u043a\u0441\u0438\u043a\u043e. \u041d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u0435 560 000. \u0413\u043e\u0440\u043e\u0434, \u0441\u0442\u0430\u0432\u0448\u0438\u0439 \u0444\u043e\u043d\u043e\u043c \u0434\u043b\u044f \u0432\u0435\u043b\u0438\u0447\u0430\u0439\u0448\u0435\u0433\u043e \u043f\u0440\u0435\u0432\u0440\u0430\u0449\u0435\u043d\u0438\u044f \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0422\u0412.',
      },
      tags: [{ en: 'Primary Setting', ru: '\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043b\u043e\u043a\u0430\u0446\u0438\u044f', color: '#e8c547', border: '#a88a2a' }, { en: 'All 5 Seasons', ru: '\u0412\u0441\u0435 5 \u0441\u0435\u0437\u043e\u043d\u043e\u0432' }],
    },
    {
      lat: 34.68, lng: -106.90,
      img: 'static/images/rv_lab.jpg', imgAlt: 'RV in the New Mexico desert',
      coords: '34.68\u00b0 N \u00b7 106.90\u00b0 W', color: '#c8a96e',
      title: { en: 'THE DESERT', ru: '\u041f\u0423\u0421\u0422\u042b\u041d\u042f' },
      desc: {
        en: 'The Chihuahuan Desert. Where it all began. An RV, two men, and 99.1% pure blue sky.',
        ru: '\u041f\u0443\u0441\u0442\u044b\u043d\u044f \u0427\u0438\u0443\u0430\u0443\u0430. \u0417\u0434\u0435\u0441\u044c \u0432\u0441\u0451 \u043d\u0430\u0447\u0430\u043b\u043e\u0441\u044c. \u0424\u0443\u0440\u0433\u043e\u043d, \u0434\u0432\u0430 \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u0430 \u0438 99.1% \u0447\u0438\u0441\u0442\u043e\u0442\u044b.',
      },
      tags: [{ en: 'RV Lab', ru: '\u041b\u0430\u0431 \u0432 \u0444\u0443\u0440\u0433\u043e\u043d\u0435', color: '#c8a96e', border: '#5c3d1e' }, { en: 'Season 1', ru: '\u0421\u0435\u0437\u043e\u043d 1' }],
    },
    {
      lat: 35.0619, lng: -106.5408,
      img: 'static/images/los_pollos.jpg', imgAlt: 'Los Pollos Hermanos',
      coords: '35.0619\u00b0 N \u00b7 106.5408\u00b0 W', color: '#c97d20',
      title: { en: 'LOS POLLOS HERMANOS', ru: 'LOS POLLOS HERMANOS' },
      desc: {
        en: "A fast food chain. A legitimate front. The nerve centre of Gus Fring's distribution empire.",
        ru: '\u0421\u0435\u0442\u044c \u0444\u0430\u0441\u0442\u0444\u0443\u0434\u0430. \u041b\u0435\u0433\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u0438\u043a\u0440\u044b\u0442\u0438\u0435. \u041d\u0435\u0440\u0432\u043d\u044b\u0439 \u0446\u0435\u043d\u0442\u0440 \u0438\u043c\u043f\u0435\u0440\u0438\u0438 \u0413\u0443\u0441\u0430 \u0424\u0440\u0438\u043d\u0433\u0430.',
      },
      tags: [{ en: 'Gus Fring', ru: '\u0413\u0443\u0441 \u0424\u0440\u0438\u043d\u0433', color: '#c97d20', border: '#5c3d1e' }, { en: 'Seasons 3\u20134', ru: '\u0421\u0435\u0437\u043e\u043d\u044b 3\u20134' }],
    },
    {
      lat: 35.0580, lng: -106.5380,
      img: 'static/images/the_superlab.jpg', imgAlt: 'Underground superlab',
      coords: 'CLASSIFIED \u00b7 UNDERGROUND', color: '#d4bc8a',
      title: { en: 'THE SUPERLAB', ru: '\u0421\u0423\u041f\u0415\u0420\u041b\u0410\u0411\u041e\u0420\u0410\u0422\u041e\u0420\u0418\u042f' },
      desc: {
        en: "Beneath Los Pollos Hermanos. $8M to build. 200 lbs per week. Walt's kingdom.",
        ru: '\u041f\u043e\u0434 Los Pollos Hermanos. $8 \u043c\u043b\u043d. 200 \u0444\u0443\u043d\u0442\u043e\u0432 \u0432 \u043d\u0435\u0434\u0435\u043b\u044e. \u041a\u043e\u0440\u043e\u043b\u0435\u0432\u0441\u0442\u0432\u043e \u0423\u043e\u043b\u0442\u0435\u0440\u0430.',
      },
      tags: [{ en: 'Underground', ru: '\u041f\u043e\u0434\u0437\u0435\u043c\u043d\u0430\u044f', color: '#d4bc8a', border: '#5c3d1e' }, { en: 'Seasons 3\u20134', ru: '\u0421\u0435\u0437\u043e\u043d\u044b 3\u20134' }],
    },
    {
      lat: 35.1267, lng: -106.5364,
      img: 'static/images/walter_white.webp', imgAlt: '308 Negra Arroyo Lane',
      coords: '308 Negra Arroyo Lane, ABQ', color: '#8a7355',
      title: { en: 'WHITE RESIDENCE', ru: '\u0414\u041e\u041c \u0423\u0410\u0419\u0422\u041e\u0412' },
      desc: {
        en: 'A modest home in a quiet suburb. Where a family fell apart. Where lies were born.',
        ru: '\u0421\u043a\u0440\u043e\u043c\u043d\u044b\u0439 \u0434\u043e\u043c \u0432 \u0442\u0438\u0445\u043e\u043c \u043f\u0440\u0438\u0433\u043e\u0440\u043e\u0434\u0435. \u0413\u0434\u0435 \u0440\u0430\u0441\u043f\u0430\u043b\u0430\u0441\u044c \u0441\u0435\u043c\u044c\u044f.',
      },
      tags: [{ en: 'Family Home', ru: '\u0421\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u0434\u043e\u043c' }, { en: 'All 5 Seasons', ru: '\u0412\u0441\u0435 5 \u0441\u0435\u0437\u043e\u043d\u043e\u0432' }],
    },
  ];

  const mapEl    = document.getElementById('loc-leaflet');
  const defPanel = document.getElementById('loc-default');
  const detPanel = document.getElementById('loc-detail');
  const detImg   = document.getElementById('loc-detail-img');
  const detCoords= document.getElementById('loc-detail-coords');
  const detTitle = document.getElementById('loc-detail-title');
  const detDesc  = document.getElementById('loc-detail-desc');
  const detTags  = document.getElementById('loc-detail-tags');

  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('loc-leaflet', {
    center: [35.05, -106.65],
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Fix map size when section becomes visible
  setTimeout(() => map.invalidateSize(), 400);
  const locSection = document.getElementById('locations');
  if (locSection) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { map.invalidateSize(); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(locSection);
  }

  function makeIcon(color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.625 14 22 14 22S28 23.625 28 14C28 6.27 21.73 0 14 0z"
            fill="${color}" stroke="#0d0b08" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5" fill="#0d0b08" opacity="0.7"/>
    </svg>`;
    return L.divIcon({ html: svg, className: '', iconSize: [28, 36], iconAnchor: [14, 36] });
  }

  LOC_DATA.forEach((loc, idx) => {
    L.marker([loc.lat, loc.lng], { icon: makeIcon(loc.color) })
      .addTo(map)
      .on('click', () => locSelect(idx));
  });

  // Style Leaflet controls
  const s = document.createElement('style');
  s.textContent = `
    #loc-leaflet .leaflet-control-zoom a { background:#1f1a0f!important;color:#e8c547!important;border-color:#2e2416!important; }
    #loc-leaflet .leaflet-control-zoom a:hover { background:#2e2416!important; }
    #loc-leaflet .leaflet-control-attribution { background:rgba(13,11,8,0.85)!important;color:#4a3820!important;font-size:9px!important; }
    #loc-leaflet .leaflet-control-attribution a { color:#7a6545!important; }
  `;
  document.head.appendChild(s);

  window.locSelect = function(idx) {
    const loc  = LOC_DATA[idx];
    const lang = document.body.classList.contains('lang-ru') ? 'ru' : 'en';
    map.flyTo([loc.lat, loc.lng], 13, { duration: 1.2 });
    detImg.src            = loc.img;
    detImg.alt            = loc.imgAlt;
    detCoords.textContent = loc.coords;
    detTitle.textContent  = loc.title[lang];
    detTitle.style.color  = loc.color;
    detDesc.textContent   = loc.desc[lang];
    detTags.innerHTML = loc.tags.map(t =>
      `<span style="font-family:'Share Tech Mono',monospace;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;padding:2px 8px;border:1px solid ${t.border||'#2e2416'};color:${t.color||'#7a6545'};background:rgba(13,11,8,0.6);">${t[lang]}</span>`
    ).join('');
    defPanel.style.display = 'none';
    detPanel.style.display = 'flex';
  };

  const _orig = window.setLang;
  window.setLang = function(lang) {
    _orig(lang);
    if (detPanel.style.display !== 'none') {
      const title = detTitle.textContent;
      const idx = LOC_DATA.findIndex(l => l.title.en === title || l.title.ru === title);
      if (idx >= 0) locSelect(idx);
    }
  };
})();
