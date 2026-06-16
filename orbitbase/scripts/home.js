// home.js – Home page JavaScript
// ES Module

import { initNav } from './nav.js';
import { initModal, openModal } from './modal.js';
import { getPrefs, setPrefs } from './storage.js';

const FEATURED_COUNT = 6;

async function fetchSatellites() {
  try {
    const res = await fetch('./data/satellites.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('OrbitBase: Failed to fetch satellite data', err);
    return null;
  }
}

function buildCard(sat) {
  const isRetired = sat.status !== 'Active';
  const card = document.createElement('article');
  card.className = 'sat-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${sat.name}`);

  card.innerHTML = `
    <div class="card-img-wrap">
      <img
        src="${sat.image}"
        alt="${sat.name}"
        loading="lazy"
        onerror="this.src='https://placehold.co/400x160/0D1526/4FC3F7?text=OrbitBase'"
      >
      <span class="card-orbit-badge">${sat.orbit}</span>
      <span class="card-status-dot ${isRetired ? 'retired' : ''}" title="${sat.status}"></span>
    </div>
    <div class="card-body">
      <p class="card-type">${sat.type}</p>
      <h3 class="card-name">${sat.name}</h3>
      <p class="card-operator">${sat.operator}</p>
      <div class="card-meta">
        <span>${sat.country}</span>
        <span>${new Date(sat.launch_date).getFullYear()}</span>
        <span>${sat.status}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(sat));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openModal(sat);
  });

  return card;
}

function renderFeatured(satellites) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = satellites.slice(0, FEATURED_COUNT);
  grid.innerHTML = '';
  featured.forEach(sat => grid.appendChild(buildCard(sat)));
}

function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start.toLocaleString() + (el.dataset.suffix || '');
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initStats(satellites) {
  const totalEl   = document.getElementById('stat-total');
  const opsEl     = document.getElementById('stat-operators');
  const activeEl  = document.getElementById('stat-active');
  if (!totalEl || !opsEl || !activeEl) return;

  const operators = new Set(satellites.map(s => s.operator)).size;
  const active    = satellites.filter(s => s.status === 'Active').length;

  const statsSection = document.getElementById('stats-section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(totalEl, satellites.length);
        animateCounter(opsEl, operators);
        animateCounter(activeEl, active);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  if (statsSection) observer.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initModal();
  setPrefs({ lastVisited: 'home', visitTime: new Date().toISOString() });

  const loader = document.getElementById('featured-loader');
  const satellites = await fetchSatellites();

  if (!satellites) {
    if (loader) loader.innerHTML = '<p class="error-msg">Could not load satellite data. Please try again later.</p>';
    return;
  }

  if (loader) loader.remove();
  renderFeatured(satellites);
  initStats(satellites);
});