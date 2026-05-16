// ============================================================
//  Abuja Chamber of Commerce — Directory Script
//  Grid view:  white cards with logo + info (Images 1 & 2)
//  List view:  mobile = centered logo + stacked info + dividers
//              desktop = table layout, 4 columns, no images
// ============================================================

var memberDisplay = document.getElementById('memberDisplay');
var gridBtn       = document.getElementById('gridBtn');
var listBtn       = document.getElementById('listBtn');

var allMembers  = [];
var currentView = 'grid';

// ---- Footer dates ----
document.getElementById('copyrightYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent  = document.lastModified;

// ---- Helper: strip www. for display ----
function cleanDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}

// ---- Helper: initials from name ----
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(function(w) {
    return w[0].toUpperCase();
  }).join('');
}

// ====================
// BUILD: Grid card
// ====================
function buildCard(member) {
  var article = document.createElement('article');
  article.className = 'member-card';

  // Logo wrap
  var logoWrap = document.createElement('div');
  logoWrap.className = 'card-logo-wrap';

  var img = new Image();
  img.alt = member.name + ' logo';
  img.src = 'images/' + member.image;

  var placeholder = document.createElement('div');
  placeholder.className = 'card-logo-placeholder';
  placeholder.textContent = getInitials(member.name);
  logoWrap.appendChild(placeholder);

  img.onload = function() {
    logoWrap.innerHTML = '';
    logoWrap.appendChild(img);
  };

  // Name
  var nameEl = document.createElement('p');
  nameEl.className = 'card-name';
  nameEl.textContent = member.name;

  // Address
  var addrEl = document.createElement('p');
  addrEl.className = 'card-address';
  addrEl.textContent = member.address;

  // Phone
  var phoneEl = document.createElement('p');
  phoneEl.className = 'card-phone';
  phoneEl.textContent = member.phone;

  // Website
  var siteEl = document.createElement('a');
  siteEl.className = 'card-website';
  siteEl.href = member.website;
  siteEl.target = '_blank';
  siteEl.rel = 'noopener noreferrer';
  siteEl.textContent = member.website;

  article.appendChild(logoWrap);
  article.appendChild(nameEl);
  article.appendChild(addrEl);
  article.appendChild(phoneEl);
  article.appendChild(siteEl);

  return article;
}

// =============================================
// BUILD: List item
// Mobile  → centered logo + stacked text
// Desktop → becomes table row via CSS display:table-row
// =============================================
function buildListItem(member) {
  var row = document.createElement('div');
  row.className = 'member-list-item';

  // Logo (hidden on desktop via CSS, visible mobile)
  var logoWrap = document.createElement('div');
  logoWrap.className = 'list-logo-wrap';

  var img = new Image();
  img.alt = member.name + ' logo';
  img.src = 'images/' + member.image;
  img.onload = function() {
    logoWrap.appendChild(img);
  };

  // Name — becomes first table cell on desktop
  var nameEl = document.createElement('div');
  nameEl.className = 'list-name-text';
  nameEl.textContent = member.name;

  // Address — second cell
  var addrEl = document.createElement('div');
  addrEl.className = 'list-address-text';
  addrEl.textContent = member.address;

  // Phone — third cell
  var phoneEl = document.createElement('div');
  phoneEl.className = 'list-phone-text';
  phoneEl.textContent = member.phone;

  // Website — fourth cell
  var siteEl = document.createElement('a');
  siteEl.className = 'list-website-link';
  siteEl.href = member.website;
  siteEl.target = '_blank';
  siteEl.rel = 'noopener noreferrer';
  siteEl.textContent = member.website;

  row.appendChild(logoWrap);
  row.appendChild(nameEl);
  row.appendChild(addrEl);
  row.appendChild(phoneEl);
  row.appendChild(siteEl);

  return row;
}

// ---- Render ----
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
}

// ---- Toggle: Grid ----
gridBtn.addEventListener('click', function() {
  currentView = 'grid';
  gridBtn.classList.add('active');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.classList.remove('active');
  listBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'grid');
});

// ---- Toggle: List ----
listBtn.addEventListener('click', function() {
  currentView = 'list';
  listBtn.classList.add('active');
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.classList.remove('active');
  gridBtn.setAttribute('aria-pressed', 'false');
  renderMembers(allMembers, 'list');
});

// ---- Mobile nav ----
var navToggle = document.getElementById('navToggle');
var mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', function() {
  var isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen.toString());
});

// ---- Fetch ----
async function loadMembers() {
  try {
    var response = await fetch('data/members.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    allMembers = await response.json();
    renderMembers(allMembers, currentView);
  } catch (err) {
    var msg = document.createElement('p');
    msg.textContent = 'Could not load members. Please try again later.';
    memberDisplay.appendChild(msg);
    console.error('loadMembers error:', err);
  }
}

loadMembers();