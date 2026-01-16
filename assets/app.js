(() => {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');

  function setTheme(mode){
    root.setAttribute('data-theme', mode);
    try{ localStorage.setItem('lt_theme', mode); } catch(e){}
    if(themeBtn) themeBtn.textContent = (mode === 'dark') ? '🌙' : '☀️';
  }

  // init theme
  (function(){
    let saved = null;
    try{ saved = localStorage.getItem('lt_theme'); } catch(e){}
    if(saved === 'dark' || saved === 'light') return setTheme(saved);
    const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(preferDark ? 'dark' : 'light');
  })();

  themeBtn && themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // WhatsApp config
  const WA_NUMBER = window.LT_WA_NUMBER || ''; // e.g. "9725XXXXXXXX"
  function waLink(text){
    if(!WA_NUMBER) return '#';
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  const waText = 'שלום! אני רוצה דף נחיתה לעסק. אפשר הצעה?';
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink(waText);
    if(!WA_NUMBER){
      a.style.opacity = '.65';
      a.title = 'כדי להפעיל WhatsApp, הוסף מספר ב-WA_NUMBER בקובץ assets/app.js';
    }
  });

  // Feature explainer (home)
  const exp = document.querySelector('[data-explainer]');
  if(exp){
    const title = exp.querySelector('[data-exp-title]');
    const sub = exp.querySelector('[data-exp-sub]');
    const body = exp.querySelector('[data-exp-body]');

    const tiles = Array.from(document.querySelectorAll('[data-feature-tile]'));
    const set = (t) => {
      title.textContent = t.getAttribute('data-title') || '—';
      sub.textContent = t.getAttribute('data-sub') || '';
      body.textContent = t.getAttribute('data-desc') || '';
    };

    tiles.forEach(t => {
      const activate = () => set(t);
      t.addEventListener('mouseenter', activate);
      t.addEventListener('focus', activate);
      t.addEventListener('click', activate);
      t.addEventListener('touchstart', activate, {passive:true});
    });
  }

  // Mobile menu
  const burger = document.querySelector('[data-burger]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if(burger && mobileNav){
    const toggle = () => {
      const open = mobileNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', toggle);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      burger.setAttribute('aria-expanded','false');
    }));
  }

  // Count-up numbers
  const counters = document.querySelectorAll('[data-count]');
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target;
      if(el.dataset.done) return;
      el.dataset.done = '1';
      const to = parseFloat(el.getAttribute('data-count') || '0');
      const suf = el.getAttribute('data-suffix') || '';
      const dur = 900;
      const start = performance.now();
      const from = 0;

      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
        const out = (Number.isInteger(to) ? Math.round(v) : (Math.round(v*10)/10));
        el.textContent = `${out}${suf}`;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, {threshold: 0.25}) : null;

  counters.forEach(c => io && io.observe(c));

  // Current year
  const y = document.querySelector('[data-year]');
  if(y) y.textContent = new Date().getFullYear();
})();
