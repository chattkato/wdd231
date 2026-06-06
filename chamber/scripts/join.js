/* join.js — Scripts for Join page, Abuja Chamber of Commerce */

document.addEventListener('DOMContentLoaded', function () {

  /* Timestamp: populate hidden field with the time the form loaded */
  var tsField = document.getElementById('timestamp');
  if (tsField) {
    tsField.value = new Date().toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  /* Footer: last modified date */
  var lastmod = document.getElementById('lastmod');
  if (lastmod) {
    lastmod.textContent = 'Last Modified: ' + document.lastModified;
  }

  /* Membership cards: trigger slide-in animation on load */
  document.querySelectorAll('.mem-card').forEach(function (card) {
    card.classList.add('animate');
  });

  /* Modals: open via data-modal attribute on Details links */
  document.querySelectorAll('.info-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.getAttribute('data-modal');
      openModal(targetId);
    });
  });

  /* Modals: close via data-close attribute on close buttons */
  document.querySelectorAll('.modal-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlayId = btn.getAttribute('data-close');
      closeModal(overlayId);
    });
  });

  /* Modals: close on overlay background click */
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  /* Modals: close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (o) {
        closeModal(o.id);
      });
    }
  });

});

function openModal(overlayId) {
  var overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
}

function closeModal(overlayId) {
  var overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}