document.addEventListener('click', e => {
  const a = e.target.closest('a[data-smooth-scroll]');
  if (!a) return;

  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  e.preventDefault();

  const el = document.querySelector(href);
  if (!el) return;

  const baseOffset = parseInt(a.dataset.smoothScroll, 10) || 0;
  const extraOffset = a.dataset.extra === 'true' ? 30 : 0;
  const offset = baseOffset + extraOffset;

  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
});