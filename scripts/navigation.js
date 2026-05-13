// navigation.js – responsive hamburger menu toggle

const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primary-nav');

hamburger.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Close nav when a link is clicked (good mobile UX)
primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});