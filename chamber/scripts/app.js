// ============================================
// Chamber of Commerce – app.js
// ============================================

const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
const WEATHER_CITY    = 'Abuja';
const WEATHER_COUNTRY = 'NG';
const WEATHER_UNITS   = 'metric';

const WEATHER_ICONS = {
  '01d': '☀️',  '01n': '🌙',
  '02d': '⛅',  '02n': '☁️',
  '03d': '☁️',  '03n': '☁️',
  '04d': '☁️',  '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️',  '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

function getWeatherIcon(code) {
  return WEATHER_ICONS[code] || '🌡️';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', { weekday: 'short' });
}

async function fetchCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather error: ${res.status}`);
  return res.json();
}

async function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast error: ${res.status}`);
  return res.json();
}

function extractDailyForecasts(data) {
  const today = new Date().toDateString();
  const seen  = new Set();
  const days  = [];

  for (const item of data.list) {
    const d    = new Date(item.dt_txt);
    const dStr = d.toDateString();
    const hr   = d.getHours();
    if (dStr === today || seen.has(dStr)) continue;
    if (hr >= 11 && hr <= 14) {
      seen.add(dStr);
      days.push(item);
    }
    if (days.length === 3) break;
  }

  if (days.length < 3) {
    const fb = new Set(days.map(d => new Date(d.dt_txt).toDateString()));
    for (const item of data.list) {
      const dStr = new Date(item.dt_txt).toDateString();
      if (dStr === today || fb.has(dStr)) continue;
      fb.add(dStr);
      days.push(item);
      if (days.length === 3) break;
    }
  }
  return days.slice(0, 3);
}

function renderWeather(current, forecasts) {
  const el = document.getElementById('weather-container');
  if (!el) return;

  const icon = getWeatherIcon(current.weather[0].icon);
  const temp = Math.round(current.main.temp);
  const desc = capitalizeFirst(current.weather[0].description);

  const fHTML = forecasts.map(day => `
    <div class="forecast-day">
      <div class="forecast-day-name">${getDayName(day.dt_txt)}</div>
      <div class="forecast-day-icon">${getWeatherIcon(day.weather[0].icon)}</div>
      <div class="forecast-day-temp">${Math.round(day.main.temp)}&deg;C</div>
    </div>
  `).join('');

  el.innerHTML = `
    <p class="weather-location">&#128205; ${WEATHER_CITY}, Nigeria</p>
    <div class="weather-current">
      <div class="weather-icon">${icon}</div>
      <div class="weather-temp">${temp}&deg;C</div>
    </div>
    <p class="weather-desc">${desc}</p>
    <hr class="weather-divider">
    <p class="forecast-title">3-Day Forecast</p>
    <div class="forecast-grid">${fHTML}</div>
  `;
}

function renderWeatherFallback() {
  const el = document.getElementById('weather-container');
  if (!el) return;
  el.innerHTML = `
    <p class="weather-location">&#128205; ${WEATHER_CITY}, Nigeria</p>
    <div class="weather-current">
      <div class="weather-icon">&#9728;&#65039;</div>
      <div class="weather-temp">33&deg;C</div>
    </div>
    <p class="weather-desc">Sunny with light breeze</p>
    <hr class="weather-divider">
    <p class="forecast-title">3-Day Forecast</p>
    <div class="forecast-grid">
      <div class="forecast-day">
        <div class="forecast-day-name">Fri</div>
        <div class="forecast-day-icon">&#127780;&#65039;</div>
        <div class="forecast-day-temp">34&deg;C</div>
      </div>
      <div class="forecast-day">
        <div class="forecast-day-name">Sat</div>
        <div class="forecast-day-icon">&#127750;&#65039;</div>
        <div class="forecast-day-temp">29&deg;C</div>
      </div>
      <div class="forecast-day">
        <div class="forecast-day-name">Sun</div>
        <div class="forecast-day-icon">&#9925;</div>
        <div class="forecast-day-temp">31&deg;C</div>
      </div>
    </div>
    <p class="weather-api-note">Add your OpenWeatherMap API key in scripts/app.js for live data.</p>
  `;
}

async function loadWeather() {
  const el = document.getElementById('weather-container');
  if (!el) return;
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
    renderWeatherFallback();
    return;
  }
  el.innerHTML = '<p class="weather-loading">Loading weather data&hellip;</p>';
  try {
    const [current, forecastData] = await Promise.all([
      fetchCurrentWeather(), fetchForecast()
    ]);
    renderWeather(current, extractDailyForecasts(forecastData));
  } catch (err) {
    console.error('Weather load failed:', err);
    renderWeatherFallback();
  }
}

// ============================================
// SPOTLIGHTS
// ============================================

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function renderSpotlights(members) {
  const el = document.getElementById('spotlight-grid');
  if (!el) return;

  const eligible = members.filter(m => m.membership >= 2);
  const selected = shuffleArray(eligible).slice(0, Math.random() < 0.5 ? 2 : 3);

  if (!selected.length) {
    el.innerHTML = '<p class="spotlight-loading">No spotlight members found.</p>';
    return;
  }

  el.innerHTML = selected.map(m => {
    const badgeClass = m.membership === 3 ? 'badge-gold' : 'badge-silver';
    return `
      <div class="spotlight-card">
        <div class="spotlight-logo-placeholder" aria-hidden="true">${getInitials(m.name)}</div>
        <p class="spotlight-name">${m.name}</p>
        <span class="spotlight-badge ${badgeClass}">${m.membershipLabel} Member</span>
        <div class="spotlight-info">
          <span>&#128222; ${m.phone}</span>
          <span>&#128205; ${m.address}</span>
        </div>
        <a href="${m.website}" target="_blank" rel="noopener noreferrer" class="spotlight-website">
          ${m.website.replace('https://', '')}
        </a>
      </div>
    `;
  }).join('');
}

async function loadSpotlights() {
  const el = document.getElementById('spotlight-grid');
  if (!el) return;
  el.innerHTML = '<p class="spotlight-loading">Loading member spotlights&hellip;</p>';
  try {
    const res  = await fetch('data/members.json');
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    renderSpotlights(data.members);
  } catch (err) {
    console.error('Spotlight load failed:', err);
    el.innerHTML = '<p class="spotlight-loading">Could not load spotlights.</p>';
  }
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
// INIT
// ============================================

function setCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setCurrentYear();
  loadWeather();
  loadSpotlights();
});