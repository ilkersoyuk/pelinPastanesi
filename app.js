'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  navigation.classList.toggle('open', open);
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});

const filters = document.querySelectorAll('[data-filter]');
const products = document.querySelectorAll('.product');
filters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    let visible = 0;
    products.forEach(product => {
      product.hidden = category !== 'all' && product.dataset.category !== category;
      if (!product.hidden) visible++;
    });
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#filter-status').textContent = `${visible} ürün gösteriliyor.`;
  });
});

const dialog = document.querySelector('#product-dialog');
let lastProductTrigger = null;
document.querySelectorAll('.product-open').forEach(trigger => {
  trigger.addEventListener('click', () => {
    lastProductTrigger = trigger;
    const image = trigger.querySelector('img');
    document.querySelector('#dialog-image').src = image.src;
    document.querySelector('#dialog-image').alt = image.alt;
    document.querySelector('#dialog-title').textContent = trigger.querySelector('h3').textContent;
    document.querySelector('#dialog-description').textContent = trigger.closest('.product').querySelector('.product-description').textContent;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
function closeProductDialog() {
  dialog.close();
  document.body.classList.remove('modal-open');
  if (lastProductTrigger) lastProductTrigger.focus({ preventScroll: true });
}
document.querySelector('.dialog-close').addEventListener('click', closeProductDialog);
document.querySelector('#dialog-visit').addEventListener('click', closeProductDialog);
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeProductDialog();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProductDialog();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (lastProductTrigger) lastProductTrigger.focus({ preventScroll: true });
});
