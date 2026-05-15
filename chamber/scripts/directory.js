// ============================================================
//  Abuja Chamber of Commerce — Directory Page Script
//  Handles: fetch members.json, grid/list rendering,
//           view toggle, copyright year, last modified date
// ============================================================

const memberDisplay = document.getElementById('memberDisplay');
const gridBtn       = document.getElementById('gridBtn');
const listBtn       = document.getElementById('listBtn');
const memberCount   = document.getElementById('memberCount');

let allMembers = [];
let currentView = 'grid';

// ---- Footer dates ----
document.getElementById('copyrightYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent  = document.lastModified;

// ---- Helpers ----
function badgeLabel(level) {
  if (level === 3) return 'Gold Member';
  if (level === 2) return 'Silver Member';
  return 'Member';
}

function badgeClass(level) {
  if (level === 3) return 'badge-gold';
  if (level === 2) return 'badge-silver';
  return 'badge-member';
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function cleanDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// ---- Build grid card ----
function buildCard(member) {
  const article = document.createElement('article');
  article.className = 'member-card';
  article.innerHTML = `
    <div class="card-img-wrap">
      <div class="card-img-placeholder">${initials(member.name)}</div>
    </div>
    <div class="card-body">
      <span class="card-badge ${badgeClass(member.membershipLevel)}">${badgeLabel(member.membershipLevel)}</span>
      <h2 class="card-name">${member.name}</h2>
      <p class="card-description">${member.description}</p>
      <div class="card-info">
        <p>📍 ${member.address}</p>
        <p>📞 <a href="tel:${member.phone.replace(/\s+/g, '')}">${member.phone}</a></p>
        <p>🌐 <a href="${member.website}" target="_blank" rel="noopener noreferrer">${cleanDomain(member.website)}</a></p>
      </div>
    </div>
  `;

  const img = new Image();
  img.alt = `${member.name} logo`;
  img.src = `images/${member.image}`;
  img.onload = () => {
    const wrap = article.querySelector('.card-img-wrap');
    wrap.innerHTML = '';
    wrap.appendChild(img);
  };

  return article;
}

// ---- Build list item ----
function buildListItem(member) {
  const li = document.createElement('div');
  li.className = 'member-list-item';
  li.innerHTML = `
    <div class="list-avatar">
      <span class="list-avatar-placeholder">${initials(member.name)}</span>
    </div>
    <div class="list-info">
      <div class="list-name">${member.name}</div>
      <div class="list-address">${member.address}</div>
    </div>
    <div class="list-right">
      <span class="card-badge ${badgeClass(member.membershipLevel)}">${badgeLabel(member.membershipLevel)}</span>
      <span class="list-phone">${member.phone}</span>
      <a href="${member.website}" target="_blank" rel="noopener noreferrer" style="font-size:0.78rem;">${cleanDomain(member.website)}</a>
    </div>
  `;

  const img = new Image();
  img.alt = '';
  img.src = `images/${member.image}`;
  img.onload = () => {
    const wrap = li.querySelector('.list-avatar');
    wrap.innerHTML = '';
    wrap.appendChild(img);
  };

  return li;
}

// ---- Render members ----
function renderMembers(members, view) {
  memberDisplay.innerHTML = '';

  if (view === 'grid') {
    memberDisplay.className = 'member-grid';
    members.forEach(m => memberDisplay.appendChild(buildCard(m)));
  } else {
    memberDisplay.className = 'member-list';
    members.forEach(m => memberDisplay.appendChild(buildListItem(m)));
  }

  memberCount.textContent = `Showing ${members.length} member${members.length !== 1 ? 's' : ''}`;
}

// ---- View toggle ----
gridBtn.addEventListener('click', () => {
  currentView = 'grid';
  gridBtn.classList.add('active');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.classList.remove('active');
  listBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'grid');
});

listBtn.addEventListener('click', () => {
  currentView = 'list';
  listBtn.classList.add('active');
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.classList.remove('active');
  gridBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'list');
});

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen.toString());
});

// ---- Fetch members ----
async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    allMembers = await response.json();
    renderMembers(allMembers, currentView);
  } catch (error) {
    memberDisplay.innerHTML = `
      <p style="grid-column:1/-1; text-align:center; color:#c0392b; padding:2rem;">
        Unable to load member data. Please try again later.<br>
        <small>${error.message}</small>
      </p>`;
    memberCount.textContent = 'No members loaded';
    console.error('Failed to load members:', error);
  }
}

loadMembers();