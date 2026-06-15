// modal.js – Modal dialog for satellite detail view
// ES Module

const overlay = document.querySelector('.modal-overlay');
const modalEl = document.querySelector('.modal');

function formatAltitude(km) {
  if (km >= 1000000) return `${(km / 1000000).toFixed(1)}M km`;
  if (km >= 1000)    return `${(km / 1000).toFixed(0).toLocaleString()} km`;
  return `${km.toLocaleString()} km`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function openModal(sat) {
  if (!overlay || !modalEl) return;

  const isRetired = sat.status !== 'Active';

  modalEl.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${sat.name}</h2>
      <button class="modal-close" aria-label="Close details">&times;</button>
    </div>
    <img
      class="modal-img"
      src="${sat.image}"
      alt="${sat.name}"
      loading="lazy"
      onerror="this.src='https://placehold.co/600x220/0D1526/4FC3F7?text=OrbitBase'"
    >
    <div class="modal-body">
      <p>${sat.purpose}</p>
      <div class="modal-grid">
        <div class="modal-stat">
          <p class="modal-stat-label">Operator</p>
          <p class="modal-stat-value" style="font-size:0.9rem;">${sat.operator}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Type</p>
          <p class="modal-stat-value" style="font-size:0.9rem;">${sat.type}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Orbit</p>
          <p class="modal-stat-value">${sat.orbit}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Altitude</p>
          <p class="modal-stat-value">${formatAltitude(sat.altitude_km)}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Launch Date</p>
          <p class="modal-stat-value" style="font-size:0.88rem;">${formatDate(sat.launch_date)}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Mass</p>
          <p class="modal-stat-value">${sat.mass_kg.toLocaleString()} kg</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Country / Region</p>
          <p class="modal-stat-value" style="font-size:0.9rem;">${sat.country}</p>
        </div>
        <div class="modal-stat">
          <p class="modal-stat-label">Status</p>
          <p class="modal-stat-value" style="${isRetired ? 'color:var(--muted)' : 'color:var(--success)'}">${sat.status}</p>
        </div>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  modalEl.querySelector('.modal-close').addEventListener('click', closeModal);
  modalEl.querySelector('.modal-close').focus();
}

export function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

export function initModal() {
  if (!overlay) return;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}