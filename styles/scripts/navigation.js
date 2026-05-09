// navigation.js — Responsive hamburger menu toggle

const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primary-nav');

if (menuToggle && primaryNav) {

  menuToggle.addEventListener('click', function () {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

}