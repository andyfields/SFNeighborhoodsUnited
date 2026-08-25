/*
 * Click any photo inside a post to see it full size; click again to dismiss.
 *
 * Only images inside <article class="post"> take part. The thumbnails on the
 * blog index are links to their posts and must keep behaving as links.
 */
(function () {
  'use strict';

  var post = document.querySelector('article.post');
  if (!post) return;

  var images = post.querySelectorAll('img');
  if (!images.length) return;

  var overlay = null;
  var lastFocused = null;

  function close() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKeydown);
    document.body.classList.remove('has-lightbox');
    overlay.remove();
    overlay = null;
    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function open(image) {
    lastFocused = document.activeElement;

    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', image.alt || 'Full size image');
    overlay.tabIndex = -1;

    var full = document.createElement('img');
    full.src = image.currentSrc || image.src;
    full.alt = image.alt;

    /*
     * Small images open at their own pixel size, which can be smaller than the
     * viewport allows. data-zoom on the source image scales that size up; the
     * max-width/max-height caps in the stylesheet still apply.
     */
    var zoom = parseFloat(image.getAttribute('data-zoom'));
    if (zoom > 0) {
      var natural = image.naturalWidth || image.width;
      if (natural) full.style.width = Math.round(natural * zoom) + 'px';
    }

    overlay.appendChild(full);

    // A click anywhere, including on the image itself, dismisses it.
    overlay.addEventListener('click', close);

    document.body.appendChild(overlay);
    document.body.classList.add('has-lightbox');
    document.addEventListener('keydown', onKeydown);
    overlay.focus();
  }

  Array.prototype.forEach.call(images, function (image) {
    // Skip any image that is already inside a link.
    if (image.closest('a')) return;

    image.classList.add('is-zoomable');
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'View full size: ' + (image.alt || 'image'));

    image.addEventListener('click', function () {
      if (overlay) {
        close();
      } else {
        open(image);
      }
    });

    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(image);
      }
    });
  });
})();
