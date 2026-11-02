(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = $('.intro-screen');
  try {
    if (sessionStorage.getItem('decorpro-intro') || reduced) intro?.remove();
    else sessionStorage.setItem('decorpro-intro', '1');
  } catch { intro?.remove(); }

  const nav = $('[data-nav]'), burger = $('.burger'), menu = $('.mobile-menu');
  let lastY = scrollY;
  const closeMenu = () => {
    menu?.classList.remove('open'); if (menu) { menu.inert = true; menu.setAttribute('aria-hidden','true'); }
    burger?.classList.remove('open'); burger?.setAttribute('aria-expanded','false'); burger?.setAttribute('aria-label','Открыть меню');
    document.body.style.overflow = '';
  };
  burger?.addEventListener('click', () => {
    const opening = !menu.classList.contains('open');
    menu.classList.toggle('open', opening); menu.inert = !opening; menu.setAttribute('aria-hidden', String(!opening));
    burger.classList.toggle('open', opening); burger.setAttribute('aria-expanded', String(opening));
    burger.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = opening ? 'hidden' : '';
  });
  menu?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('scroll', () => {
    const y = scrollY;
    nav?.classList.toggle('scrolled', y > 20);
    if (!menu?.classList.contains('open')) nav?.classList.toggle('hidden', y > 170 && y > lastY + 4);
    lastY = y;
  }, { passive:true });

  const scrub = $('.word-scrub');
  if (scrub && !reduced) {
    scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map(word => `<span>${word} </span>`).join('');
    const spans = $$('span', scrub);
    const paint = () => {
      const r = scrub.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight-r.top)/(innerHeight+r.height*.25)));
      spans.forEach((span,i) => span.classList.toggle('on', i/spans.length < progress));
    };
    addEventListener('scroll', paint, { passive:true }); paint();
  }

  const gallery = $('[data-gallery]');
  if (gallery) {
    const image = $('[data-gallery-image]',gallery), label = $('[data-gallery-label]',gallery), title = $('[data-gallery-title]',gallery);
    const buttons = $$('.gallery-thumbs button',gallery);
    let active = 0, pending = 0, swipeStart = null;
    const select = index => {
      active = (index+buttons.length)%buttons.length;
      const button = buttons[active]; clearTimeout(pending); image.classList.add('fade');
      pending = setTimeout(() => {
        image.src = button.dataset.src; image.alt = button.dataset.alt;
        label.textContent = button.dataset.label; title.textContent = button.dataset.title;
        image.classList.remove('fade');
      }, 170);
      buttons.forEach((item,i) => { item.classList.toggle('active',i===active); item.setAttribute('aria-pressed',String(i===active)); });
    };
    buttons.forEach((button,i) => button.addEventListener('click', () => select(i)));
    $$('[data-gallery-select]').forEach(link => {
      link.addEventListener('click', () => select(Number(link.dataset.gallerySelect)));
    });
    if (new URLSearchParams(location.search).get('photo') === 'tiling') select(3);
    const main = $('.gallery-main',gallery);
    main.style.touchAction = 'pan-y';
    main.addEventListener('pointerdown',e => swipeStart=e.clientX);
    main.addEventListener('pointerup',e => {
      if (swipeStart === null) return;
      const delta=e.clientX-swipeStart; swipeStart=null;
      if (Math.abs(delta)>40) { e.preventDefault(); select(active+(delta<0?1:-1)); }
    });
  }
})();
