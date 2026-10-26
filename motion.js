'use strict';
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#motion-toggle');
  let userPaused = false;
  try { userPaused = localStorage.getItem('pelin-motion-paused') === 'true'; } catch { /* Yerel dosyada depolama kapalı olabilir. */ }

  function applyMotionPreference() {
    const paused = userPaused || reducedMotion.matches;
    root.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = paused ? 'Hareketi başlat <span aria-hidden="true">▷</span>' : 'Hareketi durdur <span aria-hidden="true">Ⅱ</span>';
    toggle.disabled = reducedMotion.matches;
    toggle.title = reducedMotion.matches ? 'Cihazınızın azaltılmış hareket ayarı kullanılıyor.' : '';
    if (paused) document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-visible'));
  }
  toggle.addEventListener('click', () => {
    userPaused = !root.classList.contains('motion-paused');
    try { localStorage.setItem('pelin-motion-paused', String(userPaused)); } catch { /* Etkileşim depolama olmadan da çalışır. */ }
    applyMotionPreference();
  });
  reducedMotion.addEventListener('change', applyMotionPreference);
  applyMotionPreference();

  const ribbon = document.querySelector('.ribbon');
  const group = document.createElement('div');
  group.className = 'ribbon-group';
  while (ribbon.firstChild) group.appendChild(ribbon.firstChild);
  const track = document.createElement('div');
  track.className = 'ribbon-track';
  track.append(group, group.cloneNode(true));
  ribbon.appendChild(track);

  if ('IntersectionObserver' in window && !reducedMotion.matches && !userPaused) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading,.product,.story-image,.story-copy,.visit-copy,.visit-note-card').forEach((el, index) => {
      if (el.getBoundingClientRect().top <= window.innerHeight) return;
      el.classList.add('reveal-ready');
      el.style.transitionDelay = `${Math.min(index % 3, 2) * 65}ms`;
      observer.observe(el);
    });
  }

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      if (root.classList.contains('motion-paused')) return;
      document.querySelectorAll('.product:not([hidden])').forEach((product, index) => {
        product.classList.add('is-visible');
        if (!product.animate) return;
        product.getAnimations().forEach(animation => animation.cancel());
        product.animate([{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }], {
          duration: 360, delay: index * 40, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'
        });
      });
    });
  });

  const progress = document.querySelector('.scroll-progress');
  let scrollQueued = false;
  function updateProgress() {
    const distance = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  document.addEventListener('visibilitychange', () => root.classList.toggle('tab-inactive', document.hidden));
  updateProgress();
})();
