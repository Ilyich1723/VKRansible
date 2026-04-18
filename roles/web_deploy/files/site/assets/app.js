const quotes = [
  "War. War never changes.",
  "Каждое убежище скрывает историю, а не просто бетон и сталь.",
  "В Fallout важны не только руины, но и выбор, который ты делаешь среди них.",
  "Пустошь помнит все: старые войны, старые идеи и старые ошибки."
];

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalized = href.replace('.html', '');
    if ((page === 'home' && href === 'index.html') || normalized === page) {
      link.classList.add('active');
    }
  });
}

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initTheme() {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  const saved = localStorage.getItem('fallout-theme');
  if (saved === 'light') document.body.classList.add('light');
  button.textContent = document.body.classList.contains('light') ? 'Тёмная тема' : 'Светлая тема';

  button.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('fallout-theme', isLight ? 'light' : 'dark');
    button.textContent = isLight ? 'Тёмная тема' : 'Светлая тема';
  });
}

function initQuoteBox() {
  const box = document.getElementById('quote-box');
  if (!box) return;
  let index = 0;
  setInterval(() => {
    box.classList.add('fade');
    setTimeout(() => {
      index = (index + 1) % quotes.length;
      box.textContent = quotes[index];
      box.classList.remove('fade');
    }, 220);
  }, 3600);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 35));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = `${current}${suffix}`;
      }, 32);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  items.forEach((item) => observer.observe(item));
}

function initSearch(inputId, itemsSelector, emptyId) {
  const input = document.getElementById(inputId);
  const items = document.querySelectorAll(itemsSelector);
  const empty = emptyId ? document.getElementById(emptyId) : null;
  if (!input || !items.length) return;
  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const haystack = (item.dataset.search || item.textContent).toLowerCase();
      const matched = haystack.includes(value);
      item.classList.toggle('hidden', !matched);
      if (matched) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  });
}

function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = group.querySelectorAll('.filter-btn');
    const targetSelector = group.dataset.target;
    const items = document.querySelectorAll(targetSelector);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        items.forEach((item) => {
          const category = item.dataset.category || '';
          const show = filter === 'all' || category.split(' ').includes(filter);
          item.classList.toggle('hidden', !show);
        });
      });
    });
  });
}

function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab-button]');
    const panels = document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.tabButton;
        buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tabId !== id;
        });
      });
    });
  });
}

function initProgress() {
  const bar = document.querySelector('.scroll-progress span');
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initParallax() {
  const item = document.querySelector('[data-parallax]');
  if (!item) return;
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * 0.18, 80);
    item.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

function initSpotlight() {
  const cards = document.querySelectorAll('.spotlight');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });
  });
}

function initSlider() {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prev = slider.querySelector('.slider-prev');
    const next = slider.querySelector('.slider-next');
    if (!track || !slides.length || !prev || !next) return;
    let index = 0;
    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };
    prev.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
    next.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      render();
    });
    setInterval(() => {
      index = (index + 1) % slides.length;
      render();
    }, 5000);
  });
}

function initLightbox() {
  const images = document.querySelectorAll('[data-lightbox]');
  const modal = document.querySelector('.lightbox');
  if (!images.length || !modal) return;
  const img = modal.querySelector('img');
  const caption = modal.querySelector('p');
  const close = modal.querySelector('.lightbox-close');

  images.forEach((image) => {
    image.addEventListener('click', () => {
      img.src = image.dataset.lightbox;
      img.alt = image.alt || '';
      caption.textContent = image.dataset.caption || image.alt || '';
      modal.classList.add('open');
      document.body.classList.add('no-scroll');
    });
  });

  const hide = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };

  close?.addEventListener('click', hide);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) hide();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
}

function initYearBadge() {
  const badge = document.getElementById('year-badge');
  if (!badge) return;
  badge.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMenu();
  initTheme();
  initQuoteBox();
  initCounters();
  initReveal();
  initFilters();
  initTabs();
  initProgress();
  initParallax();
  initSpotlight();
  initSlider();
  initLightbox();
  initYearBadge();
  initSearch('game-search', '.game-card', 'games-empty');
  initSearch('plot-search', '.plot-entry', 'plots-empty');
});