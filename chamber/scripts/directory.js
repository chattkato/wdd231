// directory.js — loads all members into the directory page

let allMembers  = [];
let currentView = 'grid';

const badgeMap = {
  3: { label: 'Gold',   cls: 'dir-badge-gold' },
  2: { label: 'Silver', cls: 'dir-badge-silver' },
  1: { label: 'Bronze', cls: 'dir-badge-bronze' },
};

function renderDirectory(members, view) {
  const container = document.getElementById('directory-container');
  if (!container) return;

  const wrapClass = view === 'list' ? 'directory-list' : 'directory-grid';

  const html = `<div class="${wrapClass}">
    ${members.map(m => {
      const badge = badgeMap[m.membership] || { label: 'Member', cls: '' };
      return `
        <div class="dir-card">
          <h3>${m.name}</h3>
          <span class="dir-badge ${badge.cls}">${badge.label}</span>
          <p>&#128222; ${m.phone}</p>
          <p>&#128205; ${m.address}</p>
          <a href="${m.website}" target="_blank" rel="noopener noreferrer">
            ${m.website.replace('https://', '')}
          </a>
        </div>
      `;
    }).join('')}
  </div>`;

  container.innerHTML = html;
}

async function loadDirectory() {
  const container = document.getElementById('directory-container');
  if (!container) return;

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Failed to load members');
    const data  = await response.json();
    allMembers  = data.members;
    renderDirectory(allMembers, currentView);
  } catch (error) {
    console.error('Directory load error:', error);
    container.innerHTML = '<p>Could not load directory. Please try again later.</p>';
  }
}

function initViewToggle() {
  const gridBtn = document.getElementById('grid-btn');
  const listBtn = document.getElementById('list-btn');
  if (!gridBtn || !listBtn) return;

  gridBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridBtn.classList.add('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'false');
    renderDirectory(allMembers, currentView);
  });

  listBtn.addEventListener('click', () => {
    currentView = 'list';
    listBtn.classList.add('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'false');
    renderDirectory(allMembers, currentView);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDirectory();
  initViewToggle();
});