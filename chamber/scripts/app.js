// ============================================
// Chamber of Commerce – app.js
// ============================================

// Replace 'YOUR_API_KEY_HERE' with your OpenWeatherMap API key
// Get a free key at: https://openweathermap.org/api
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
const WEATHER_CITY    = 'Abuja';
const WEATHER_COUNTRY = 'NG';
const WEATHER_UNITS   = 'metric';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

function getWeatherIcon(iconCode) {
  return WEATHER_ICONS[iconCode] || '🌡️';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', { weekday: 'short' });
}

async function fetchCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return response.json();
}

async function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast API error: ${response.status}`);
  return response.json();
}

function extractDailyForecasts(forecastData) {
  const today    = new Date().toDateString();
  const seen     = new Set();
  const days     = [];

  for (const item of forecastData.list) {
    const date    = new Date(item.dt_txt);
    const dateStr = date.toDateString();
    const hour    = date.getHours();

    if (dateStr === today) continue;
    if (seen.has(dateStr)) continue;
    if (hour >= 11 && hour <= 14) {
      seen.add(dateStr);
      days.push(item);
    }
    if (days.length === 3) break;
  }

  // Fallback: grab first entry per remaining day if noon slots are missing
  if (days.length < 3) {
    const fallbackSeen = new Set(days.map(d => new Date(d.dt_txt).toDateString()));
    for (const item of forecastData.list) {
      const dateStr = new Date(item.dt_txt).toDateString();
      if (dateStr === today) continue;
      if (fallbackSeen.has(dateStr)) continue;
      fallbackSeen.add(dateStr);
      days.push(item);
      if (days.length === 3) break;
    }
  }

  return days.slice(0, 3);
}

function renderWeather(current, forecasts) {
  const container = document.getElementById('weather-container');
  if (!container) return;

  const icon = getWeatherIcon(current.weather[0].icon);
  const temp = Math.round(current.main.temp);
  const desc = capitalizeFirst(current.weather[0].description);

  const forecastHTML = forecasts.map(day => {
    const dayName = getDayName(day.dt_txt);
    const dayIcon = getWeatherIcon(day.weather[0].icon);
    const dayTemp = Math.round(day.main.temp);
    return `
      <div class="forecast-day">
        <div class="forecast-day-name">${dayName}</div>
        <div class="forecast-day-icon">${dayIcon}</div>
        <div class="forecast-day-temp">${dayTemp}&deg;C</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <p class="weather-location">&#128205; ${WEATHER_CITY}, Nigeria</p>
    <div class="weather-current">
      <div class="weather-icon">${icon}</div>
      <div class="weather-temp">${temp}&deg;C</div>
    </div>
    <p class="weather-desc">${desc}</p>
    <hr class="weather-divider">
    <p class="forecast-title">3-Day Forecast</p>
    <div class="forecast-grid">${forecastHTML}</div>
  `;
}

function renderWeatherFallback() {
  const container = document.getElementById('weather-container');
  if (!container) return;

  container.innerHTML = `
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
  const container = document.getElementById('weather-container');
  if (!container) return;

  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
    renderWeatherFallback();
    return;
  }

  container.innerHTML = '<p class="weather-loading">Loading weather data&hellip;</p>';

  try {
    const [current, forecastData] = await Promise.all([
      fetchCurrentWeather(),
      fetchForecast()
    ]);
    const forecasts = extractDailyForecasts(forecastData);
    renderWeather(current, forecasts);
  } catch (error) {
    console.error('Weather load failed:', error);
    renderWeatherFallback();
  }
}

// ============================================
// COMPANY SPOTLIGHTS
// ============================================

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderSpotlights(members) {
  const container = document.getElementById('spotlight-grid');
  if (!container) return;

  const eligible = members.filter(m => m.membership >= 2);
  const shuffled = shuffleArray(eligible);
  const count    = Math.random() < 0.5 ? 2 : 3;
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (selected.length === 0) {
    container.innerHTML = '<p class="spotlight-loading">No spotlight members found.</p>';
    return;
  }

  container.innerHTML = selected.map(member => {
    const initials   = getInitials(member.name);
    const badgeClass = member.membership === 3 ? 'badge-gold' : 'badge-silver';

    return `
      <div class="spotlight-card">
        <div class="spotlight-logo-placeholder" aria-hidden="true">${initials}</div>
        <p class="spotlight-name">${member.name}</p>
        <span class="spotlight-badge ${badgeClass}">${member.membershipLabel} Member</span>
        <div class="spotlight-info">
          <span>&#128222; ${member.phone}</span>
          <span>&#128205; ${member.address}</span>
        </div>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="spotlight-website">
          ${member.website.replace('https://', '')}
        </a>
      </div>
    `;
  }).join('');
}

async function loadSpotlights() {
  const container = document.getElementById('spotlight-grid');
  if (!container) return;

  container.innerHTML = '<p class="spotlight-loading">Loading member spotlights&hellip;</p>';

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`Members fetch failed: ${response.status}`);
    const data = await response.json();
    renderSpotlights(data.members);
  } catch (error) {
    console.error('Spotlight load failed:', error);
    container.innerHTML = '<p class="spotlight-loading">Could not load spotlights.</p>';
  }
}

// ============================================
// NAVIGATION TOGGLE
// ============================================
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
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
// FOOTER YEAR
// ============================================
function setCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setCurrentYear();
  loadWeather();
  loadSpotlights();
});