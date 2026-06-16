// js/home.js - Home page functionality

import { fetchSatellites, getSatelliteStats } from './data.js';
import { showModal } from './modal.js';

// DOM Elements
const featuredGrid = document.getElementById('featured-grid');
const featuredLoader = document.getElementById('featured-loader');
const statTotal = document.getElementById('stat-total');
const statOperators = document.getElementById('stat-operators');
const statActive = document.getElementById('stat-active');
const modalContainer = document.querySelector('.modal-overlay');

// Featured satellite IDs
const FEATURED_IDS = [1, 2, 6, 7, 3, 5];

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
 * Render featured satellites
 * @param {Array} items - Array of featured satellite objects
 */
function renderFeatured(items) {
  if (!featuredGrid) return;
  
  if (items.length === 0) {
    featuredGrid.innerHTML = `
      <div class="error-msg" style="grid-column: 1/-1;">
        No featured satellites available.
      </div>
    `;
    return;
  }
  
  const cards = items.map(sat => createSatelliteCard(sat)).join('');
  featuredGrid.innerHTML = cards;
  
  // Add click handlers for cards
  featuredGrid.querySelectorAll('.sat-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      const sat = items.find(s => s.id === id);
      if (sat) showModal(sat, modalContainer);
    });
  });
}

/**
 * Update statistics display
 * @param {Array} satellites - Array of satellite objects
 */
function updateStats(satellites) {
  if (!satellites.length) return;
  
  const stats = getSatelliteStats(satellites);
  
  // Animate number counting
  if (statTotal) animateNumber(statTotal, 0, stats.total);
  if (statOperators) animateNumber(statOperators, 0, stats.operators);
  if (statActive) animateNumber(statActive, 0, stats.active);
}

/**
 * Animate number counting
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, start, end, duration = 1000) {
  if (!element) return;
  
  const startTime = performance.now();
  const suffix = element.dataset.suffix || '';
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    
    element.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Initialize home page
 */
async function initHome() {
  try {
    // Show loader
    if (featuredLoader) featuredLoader.style.display = 'block';
    
    // Load data
    const satellites = await fetchSatellites();
    
    // Update stats
    updateStats(satellites);
    
    // Get featured satellites
    const featured = satellites.filter(sat => FEATURED_IDS.includes(sat.id));
    
    // Render featured
    renderFeatured(featured);
    
    // Hide loader
    if (featuredLoader) featuredLoader.style.display = 'none';
    
  } catch (error) {
    console.error('Error initializing home page:', error);
    if (featuredLoader) {
      featuredLoader.innerHTML = `
        <div class="error-msg">
          <strong>Error loading satellite data:</strong> ${error.message}
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHome);