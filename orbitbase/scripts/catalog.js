// js/catalog.js - Catalog page functionality

import { fetchSatellites, getUniqueValues } from './data.js';
import { showModal } from './modal.js';

// DOM Elements
const grid = document.getElementById('catalog-grid');
const loader = document.getElementById('catalog-loader');
const resultCount = document.getElementById('result-count');
const searchInput = document.getElementById('search-input');
const orbitFilter = document.getElementById('filter-orbit');
const typeFilter = document.getElementById('filter-type');
const statusFilter = document.getElementById('filter-status');
const sortSelect = document.getElementById('sort-select');
const resetBtn = document.getElementById('reset-btn');
const modalContainer = document.querySelector('.modal-overlay');

// State
let satellites = [];
let filteredSatellites = [];
let currentFilters = {
  search: '',
  orbit: 'all',
  type: 'all',
  status: 'all',
  sort: 'name'
};

// Local Storage key
const STORAGE_KEY = 'orbitbase_catalog_filters';

/**
 * Load saved filters from local storage
 */
function loadSavedFilters() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      currentFilters = { ...currentFilters, ...parsed };
      
      // Update form elements
      if (searchInput) searchInput.value = currentFilters.search || '';
      if (orbitFilter) orbitFilter.value = currentFilters.orbit || 'all';
      if (typeFilter) typeFilter.value = currentFilters.type || 'all';
      if (statusFilter) statusFilter.value = currentFilters.status || 'all';
      if (sortSelect) sortSelect.value = currentFilters.sort || 'name';
    }
  } catch (e) {
    console.warn('Could not load filters from localStorage:', e);
  }
}

/**
 * Save current filters to local storage
 */
function saveFilters() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentFilters));
  } catch (e) {
    console.warn('Could not save filters to localStorage:', e);
  }
}

/**
 * Render satellite cards
 * @param {Array} items - Array of satellite objects
 */
function renderSatellites(items) {
  if (!grid) return;
  
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="error-msg" style="grid-column: 1/-1;">
        No satellites match your filters. Try adjusting your search criteria.
      </div>
    `;
    return;
  }
  
  const cards = items.map(sat => createSatelliteCard(sat)).join('');
  grid.innerHTML = cards;
  resultCount.textContent = `Showing ${items.length} of ${satellites.length} satellites`;
  
  // Add click handlers for cards
  grid.querySelectorAll('.sat-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      const sat = satellites.find(s => s.id === id);
      if (sat) showModal(sat, modalContainer);
    });
  });
}

/**
 * Create a satellite card HTML string
 * @param {Object} sat - Satellite object
 * @returns {string} HTML string
 */
function createSatelliteCard(sat) {
  const statusClass = sat.status === 'Active' ? '' : 'retired';
  
  return `
    <article class="sat-card" data-id="${sat.id}" role="button" tabindex="0">
      <div class="card-img-wrap">
        <img 
          src="${sat.image || 'https://placehold.co/600x400/0D1526/4FC3F7?text=No+Image'}" 
          alt="${sat.image_alt || sat.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/600x400/0D1526/4FC3F7?text=No+Image'"
        >
        <span class="card-orbit-badge">${sat.orbit || 'N/A'}</span>
        <span class="card-status-dot ${statusClass}" title="${sat.status || 'Unknown'}"></span>
      </div>
      <div class="card-body">
        <div class="card-type">${sat.type || 'Unknown'}</div>
        <h3 class="card-name">${sat.name}</h3>
        <div class="card-operator">${sat.operator || 'Unknown Operator'}</div>
        <div class="card-meta">
          <span>${sat.country || 'N/A'}</span>
          <span>${sat.altitude || 'N/A'}</span>
          <span>${sat.status || 'Unknown'}</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Apply filters and sorting to satellite data
 */
function applyFilters() {
  if (!satellites.length) return;
  
  // First apply filters
  let filtered = satellites.filter(sat => {
    // Search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      const matchName = sat.name.toLowerCase().includes(searchLower);
      const matchOperator = (sat.operator || '').toLowerCase().includes(searchLower);
      const matchCountry = (sat.country || '').toLowerCase().includes(searchLower);
      if (!matchName && !matchOperator && !matchCountry) return false;
    }
    
    // Orbit filter
    if (currentFilters.orbit !== 'all' && sat.orbit !== currentFilters.orbit) {
      return false;
    }
    
    // Type filter
    if (currentFilters.type !== 'all' && sat.type !== currentFilters.type) {
      return false;
    }
    
    // Status filter
    if (currentFilters.status !== 'all' && sat.status !== currentFilters.status) {
      return false;
    }
    
    return true;
  });
  
  // Then apply sorting
  switch (currentFilters.sort) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'launch_date':
      filtered.sort((a, b) => {
        if (!a.launch_date) return 1;
        if (!b.launch_date) return -1;
        return new Date(b.launch_date) - new Date(a.launch_date);
      });
      break;
    case 'altitude':
      filtered.sort((a, b) => {
        const aVal = parseInt(a.altitude, 10) || 0;
        const bVal = parseInt(b.altitude, 10) || 0;
        return aVal - bVal;
      });
      break;
    case 'mass':
      filtered.sort((a, b) => {
        const aVal = parseInt(a.mass, 10) || 0;
        const bVal = parseInt(b.mass, 10) || 0;
        return bVal - aVal;
      });
      break;
    default:
      break;
  }
  
  filteredSatellites = filtered;
  renderSatellites(filtered);
}

/**
 * Initialize catalog page
 */
async function initCatalog() {
  try {
    // Show loader
    if (loader) loader.style.display = 'block';
    
    // Load data
    satellites = await fetchSatellites();
    
    // Load saved filters
    loadSavedFilters();
    
    // Populate filter options
    populateFilters();
    
    // Apply filters and render
    applyFilters();
    
    // Hide loader
    if (loader) loader.style.display = 'none';
    
  } catch (error) {
    console.error('Error initializing catalog:', error);
    if (loader) {
      loader.innerHTML = `
        <div class="error-msg">
          <strong>Error loading satellite data:</strong> ${error.message}
        </div>
      `;
    }
  }
}

/**
 * Populate filter dropdowns with unique values
 */
function populateFilters() {
  if (!satellites.length) return;
  
  // Get unique values
  const orbits = [...new Set(satellites.map(s => s.orbit).filter(Boolean))].sort();
  const types = [...new Set(satellites.map(s => s.type).filter(Boolean))].sort();
  const statuses = [...new Set(satellites.map(s => s.status).filter(Boolean))].sort();
  
  // Populate orbit filter
  if (orbitFilter) {
    const currentValue = orbitFilter.value;
    orbitFilter.innerHTML = `<option value="all">All Orbits</option>`;
    orbits.forEach(orbit => {
      orbitFilter.innerHTML += `<option value="${orbit}">${orbit}</option>`;
    });
    orbitFilter.value = currentValue;
  }
  
  // Populate type filter
  if (typeFilter) {
    const currentValue = typeFilter.value;
    typeFilter.innerHTML = `<option value="all">All Types</option>`;
    types.forEach(type => {
      typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
    });
    typeFilter.value = currentValue;
  }
  
  // Populate status filter
  if (statusFilter) {
    const currentValue = statusFilter.value;
    statusFilter.innerHTML = `<option value="all">All Status</option>`;
    statuses.forEach(status => {
      typeFilter.innerHTML += `<option value="${status}">${status}</option>`;
    });
    statusFilter.value = currentValue;
  }
}

// ── Event Listeners ─────────────────────────────────────────

// Search input with debounce
let searchTimeout;
if (searchInput) {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilters.search = searchInput.value.trim();
      saveFilters();
      applyFilters();
    }, 300);
  });
}

// Filter change handlers
if (orbitFilter) {
  orbitFilter.addEventListener('change', () => {
    currentFilters.orbit = orbitFilter.value;
    saveFilters();
    applyFilters();
  });
}

if (typeFilter) {
  typeFilter.addEventListener('change', () => {
    currentFilters.type = typeFilter.value;
    saveFilters();
    applyFilters();
  });
}

if (statusFilter) {
  statusFilter.addEventListener('change', () => {
    currentFilters.status = statusFilter.value;
    saveFilters();
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    currentFilters.sort = sortSelect.value;
    saveFilters();
    applyFilters();
  });
}

// Reset button
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    // Reset filter state
    currentFilters = {
      search: '',
      orbit: 'all',
      type: 'all',
      status: 'all',
      sort: 'name'
    };
    
    // Reset form elements
    if (searchInput) searchInput.value = '';
    if (orbitFilter) orbitFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortSelect) sortSelect.value = 'name';
    
    // Clear local storage
    localStorage.removeItem(STORAGE_KEY);
    
    applyFilters();
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCatalog);