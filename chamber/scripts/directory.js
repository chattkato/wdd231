// ============================================================
//  Abuja Chamber of Commerce — Directory Page Script
//
//  Fixes applied:
//  - No inline style attributes in generated HTML (rubric + audit)
//  - List view renders text only, no images (rubric criterion 10)
//  - Copyright year and last modified generated via JS
// ============================================================

const memberDisplay = document.getElementById('memberDisplay');
const gridBtn       = document.getElementById('gridBtn');
const listBtn       = document.getElementById('listBtn');
const memberCount   = document.getElementById('memberCount');

let allMembers = [];
let currentView = 'grid';

// ---- Footer: copyright year and last modified ----
document.getElementById('copyrightYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent  = document.lastModified;

// ---- Helper: membership badge label ----
function badgeLabel(level) {
  if (level === 3) return 'Gold Member';
  if (level === 2) return 'Silver Member';
  return 'Member';
}

// ---- Helper: membership badge CSS class ----
function badgeClass(level) {
  if (level === 3) return 'badge-gold';
  if (level === 2) return 'badge-silver';
  return 'badge-member';
}

// ---- Helper: initials from company name ----
function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(function(word) { return word[0].toUpperCase(); })
    .join('');
}

// ---- Helper: strip www. from URL for display ----
function cleanDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}

// ---- Build a grid card for one member ----
function buildCard(member) {
  const article = document.createElement('article');
  article.className = 'member-card';

  // Placeholder shown until/unless real image loads
  const placeholder = document.createElement('div');
  placeholder.className = 'card-img-placeholder';
  placeholder.textContent = initials(member.name);

  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-img-wrap';
  imgWrap.appendChild(placeholder);

  // Try loading real image; swap out placeholder on success
  const img = new Image();
  img.alt = member.name + ' logo';
  img.src = 'images/' + member.image;
  img.onload = function() {
    imgWrap.innerHTML = '';
    imgWrap.appendChild(img);
  };

  // Card body built safely with DOM (no innerHTML with user data)
  const badge = document.createElement('span');
  badge.className = 'card-badge ' + badgeClass(member.membershipLevel);
  badge.textContent = badgeLabel(member.membershipLevel);

  const name = document.createElement('h2');
  name.className = 'card-name';
  name.textContent = member.name;

  const desc = document.createElement('p');
  desc.className = 'card-description';
  desc.textContent = member.description;

  const addrP = document.createElement('p');
  addrP.textContent = '\uD83D\uDCCD ' + member.address;

  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:' + member.phone.replace(/\s+/g, '');
  phoneLink.textContent = member.phone;
  const phoneP = document.createElement('p');
  phoneP.textContent = '\uD83D\uDCDE ';
  phoneP.appendChild(phoneLink);

  const siteLink = document.createElement('a');
  siteLink.href = member.website;
  siteLink.target = '_blank';
  siteLink.rel = 'noopener noreferrer';
  siteLink.textContent = cleanDomain(member.website);
  const siteP = document.createElement('p');
  siteP.textContent = '\uD83C\uDF10 ';
  siteP.appendChild(siteLink);

  const info = document.createElement('div');
  info.className = 'card-info';
  info.appendChild(addrP);
  info.appendChild(phoneP);
  info.appendChild(siteP);

  const body = document.createElement('div');
  body.className = 'card-body';
  body.appendChild(badge);
  body.appendChild(name);
  body.appendChild(desc);
  body.appendChild(info);

  article.appendChild(imgWrap);
  article.appendChild(body);

  return article;
}

// ---- Build a list row for one member (no images — rubric criterion 10) ----
function buildListItem(member) {
  const row = document.createElement('div');
  row.className = 'member-list-item';

  const info = document.createElement('div');
  info.className = 'list-info';

  const nameEl = document.createElement('div');
  nameEl.className = 'list-name';
  nameEl.textContent = member.name;

  const addrEl = document.createElement('div');
  addrEl.className = 'list-address';
  addrEl.textContent = member.address;

  info.appendChild(nameEl);
  info.appendChild(addrEl);

  const right = document.createElement('div');
  right.className = 'list-right';

  const badge = document.createElement('span');
  badge.className = 'card-badge ' + badgeClass(member.membershipLevel);
  badge.textContent = badgeLabel(member.membershipLevel);

  const phone = document.createElement('span');
  phone.className = 'list-phone';
  phone.textContent = member.phone;

  const siteLink = document.createElement('a');
  siteLink.className = 'list-website';
  siteLink.href = member.website;
  siteLink.target = '_blank';
  siteLink.rel = 'noopener noreferrer';
  siteLink.textContent = cleanDomain(member.website);

  right.appendChild(badge);
  right.appendChild(phone);
  right.appendChild(siteLink);

  row.appendChild(info);
  row.appendChild(right);

  return row;
}

// ---- Render all members in the chosen view ----
function renderMembers(members, view) {
  memberDisplay.innerHTML = '';

  if (view === 'grid') {
    memberDisplay.className = 'member-grid';
    members.forEach(function(m) {
      memberDisplay.appendChild(buildCard(m));
    });
  } else {
    memberDisplay.className = 'member-list';
    members.forEach(function(m) {
      memberDisplay.appendChild(buildListItem(m));
    });
  }

  var label = members.length === 1 ? 'member' : 'members';
  memberCount.textContent = 'Showing ' + members.length + ' ' + label;
}

// ---- View toggle: Grid ----
gridBtn.addEventListener('click', function() {
  currentView = 'grid';
  gridBtn.classList.add('active');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.classList.remove('active');
  listBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'grid');
});

// ---- View toggle: List ----
listBtn.addEventListener('click', function() {
  currentView = 'list';
  listBtn.classList.add('active');
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.classList.remove('active');
  gridBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'list');
});

// ---- Mobile nav toggle ----
var navToggle = document.getElementById('navToggle');
var mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', function() {
  var isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen.toString());
});

// ---- Fetch members from JSON ----
async function loadMembers() {
  try {
    var response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }
    allMembers = await response.json();
    renderMembers(allMembers, currentView);
  } catch (error) {
    var errP = document.createElement('p');
    errP.textContent = 'Unable to load member data. Please try again later.';
    memberDisplay.appendChild(errP);
    memberCount.textContent = 'No members loaded';
    console.error('Failed to load members:', error);
  }
}

loadMembers();