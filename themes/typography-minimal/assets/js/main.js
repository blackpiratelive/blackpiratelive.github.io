document.addEventListener('DOMContentLoaded', () => {
  // Global Lightbox logic for thought images
  document.body.addEventListener('click', (e) => {
    // Only target image elements within thoughts (.thought-content img)
    const img = e.target.closest('.thought-content img');
    if (!img) return;

    // Get original source and alt details
    const fullSrc = img.getAttribute('data-full-src') || img.src;
    const altText = img.getAttribute('alt') || '';

    // Find or create global lightbox modal
    let modal = document.getElementById('global-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'global-lightbox-modal';
      modal.className = 'global-lightbox';
      modal.innerHTML = `
        <span class="global-lightbox-close">&times;</span>
        <div class="global-lightbox-content">
          <img class="global-lightbox-image" src="" alt="">
          <div class="global-lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close modal on click on background or close button
      modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('global-lightbox-close')) {
          modal.classList.remove('active');
          document.body.classList.remove('body-lightbox-open');
        }
      });

      // Escape key handler
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.classList.remove('body-lightbox-open');
        }
      });
    }

    const modalImg = modal.querySelector('.global-lightbox-image');
    const modalCaption = modal.querySelector('.global-lightbox-caption');

    modalImg.src = fullSrc;
    modalImg.alt = altText;
    modalCaption.textContent = altText;

    modal.classList.add('active');
    document.body.classList.add('body-lightbox-open');
  });
});
