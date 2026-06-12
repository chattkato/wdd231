// discover.mjs — Discover page scripts for Abuja Chamber of Commerce

import { attractions } from '../data/attractions.mjs';

// ============================================
// BUILD ATTRACTION CARDS
// ============================================

function buildCards() {
  const grid = document.getElementById('attractions-grid');
  if (!grid) return;

  grid.innerHTML = attractions.map((place, index) => `
    <div class="attraction-card" style="grid-area: card${index + 1}">
      <h2 class="card-title">${place.name}</h2>
      <figure class="card-figure">
        <img
          src="${place.image}"
          alt="${place.alt}"
          width="300"
          height="200"
          loading="${index < 2 ? 'eager' : 'lazy'}">
      </figure>
      <address class="card-address">${place.address}</address>
      <p class="card-description">${place.description}</p>
      <button class="card-btn" type="button" aria-label="Learn more about ${place.name}">
        Learn More
      </button>
    </div>
  `).join('');
}

// ============================================
// VISITOR MESSAGE — localStorage
// ============================================

function handleVisitorMessage() {
  const msgEl = document.getElementById('visitor-message');
  if (!msgEl) return;

  const lastVisit = localStorage.getItem('discoverLastVisit');
  const now = Date.now();

  let message = '';

  if (!lastVisit) {
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSince = Math.floor((now - Number(lastVisit)) / msPerDay);

    if (daysSince < 1) {
      message = 'Back so soon! Awesome!';
    } else if (daysSince === 1) {
      message = 'You last visited 1 day ago.';
    } else {
      message = `You last visited ${daysSince} days ago.`;
    }
  }

  localStorage.setItem('discoverLastVisit', String(now));
  msgEl.textContent = message;
  msgEl.classList.add('visible');
}

// ============================================
// NAV TOGGLE
// ============================================

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================
// FOOTER YEAR
// ============================================

function setCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  buildCards();
  handleVisitorMessage();
  initNavToggle();
  setCurrentYear();
});