// catalog.js – Full catalog with filter, search, sort
// ES Module

import { initNav } from './nav.js';
import { initModal, openModal } from './modal.js';
import { getPrefs, setPrefs } from './storage.js';

async function fetchSatellites() {
  try {
    const res = await fetch('./data/satellites.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
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

function renderCatalog(satellites) {
  const grid    = document.getElementById('catalog-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  grid.innerHTML = '';

  if (satellites.length === 0) {
    grid.innerHTML = `
      <div class="error-msg" style="grid-column:1/-1; padding:2rem;">
        No satellites match your filters.
        <button onclick="window.resetFilters()" style="color:var(--accent);background:none;border:none;cursor:pointer;font-size:inherit;">
          Clear filters
        </button>
      </div>`;
    if (countEl) countEl.textContent = '0 results';
    return;
  }

  satellites.forEach(sat => grid.appendChild(buildCard(sat)));
  if (countEl) countEl.textContent = `${satellites.length} result${satellites.length !== 1 ? 's' : ''}`;
}

let allSatellites = [];

function getFilteredSorted() {
  const search  = document.getElementById('search-input')?.value.toLowerCase() || '';
  const orbit   = document.getElementById('filter-orbit')?.value  || 'all';
  const type    = document.getElementById('filter-type')?.value   || 'all';
  const status  = document.getElementById('filter-status')?.value || 'all';
  const sortBy  = document.getElementById('sort-select')?.value   || 'name';

  let results = allSatellites.filter(sat => {
    const matchSearch = !search ||
      sat.name.toLowerCase().includes(search) ||
      sat.operator.toLowerCase().includes(search) ||
      sat.country.toLowerCase().includes(search);
    const matchOrbit  = orbit  === 'all' || sat.orbit  === orbit;
    const matchType   = type   === 'all' || sat.type   === type;
    const matchStatus = status === 'all' || sat.status === status;
    return matchSearch && matchOrbit && matchType && matchStatus;
  });

  results = results.sort((a, b) => {
    if (sortBy === 'name')        return a.name.localeCompare(b.name);
    if (sortBy === 'launch_date') return new Date(b.launch_date) - new Date(a.launch_date);
    if (sortBy === 'altitude')    return a.altitude_km - b.altitude_km;
    if (sortBy === 'mass')        return b.mass_kg - a.mass_kg;
    return 0;
  });

  setPrefs({ lastOrbitFilter: orbit, lastTypeFilter: type, lastSort: sortBy });
  return results;
}

function applyFilters() {
  renderCatalog(getFilteredSorted());
}

window.resetFilters = function () {
  document.getElementById('search-input').value  = '';
  document.getElementById('filter-orbit').value  = 'all';
  document.getElementById('filter-type').value   = 'all';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('sort-select').value   = 'name';
  applyFilters();
};

function restorePrefs() {
  const prefs = getPrefs();
  if (prefs.lastOrbitFilter) {
    const el = document.getElementById('filter-orbit');
    if (el) el.value = prefs.lastOrbitFilter;
  }
  if (prefs.lastTypeFilter) {
    const el = document.getElementById('filter-type');
    if (el) el.value = prefs.lastTypeFilter;
  }
  if (prefs.lastSort) {
    const el = document.getElementById('sort-select');
    if (el) el.value = prefs.lastSort;
  }
}

function initControls() {
  ['search-input', 'filter-orbit', 'filter-type', 'filter-status', 'sort-select'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });
  document.getElementById('search-input')?.addEventListener('input', applyFilters);
  document.getElementById('reset-btn')?.addEventListener('click', window.resetFilters);
}

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initModal();
  setPrefs({ lastVisited: 'catalog', visitTime: new Date().toISOString() });

  const loader = document.getElementById('catalog-loader');
  const data = await fetchSatellites();

  if (!data) {
    if (loader) loader.innerHTML = '<p class="error-msg">Could not load satellite data. Please try again later.</p>';
    return;
  }

  allSatellites = data;
  if (loader) loader.remove();
  restorePrefs();
  initControls();
  applyFilters();
});