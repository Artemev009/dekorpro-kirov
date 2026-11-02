(() => {
  const dialog = document.querySelector('[data-image-dialog]');
  const trigger = document.querySelector('[data-open-image]');
  if (!dialog || !trigger) return;
  const large = dialog.querySelector('img');
  trigger.addEventListener('click', () => {
    const selected = document.querySelector('[data-gallery-image]');
    large.src = selected.src;
    large.alt = selected.alt;
    dialog.showModal();
  });
  dialog.querySelector('[data-image-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
