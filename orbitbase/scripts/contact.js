// contact.js – Contact form validation + result display
// ES Module

import { initNav } from './nav.js';
import { showToast } from './toast.js';
import { setPrefs } from './storage.js';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(id, message) {
  const field = document.getElementById(id);
  const errEl = document.getElementById(`${id}-error`);
  if (field) field.setAttribute('aria-invalid', 'true');
  if (errEl) { errEl.textContent = message; errEl.style.display = 'block'; }
}

function clearFieldError(id) {
  const field = document.getElementById(id);
  const errEl = document.getElementById(`${id}-error`);
  if (field) field.removeAttribute('aria-invalid');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
}

function validateForm(data) {
  let valid = true;
  ['name', 'email', 'interest', 'message'].forEach(id => clearFieldError(id));

  if (!data.name.trim()) {
    showFieldError('name', 'Please enter your name.');
    valid = false;
  }
  if (!data.email.trim()) {
    showFieldError('email', 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(data.email)) {
    showFieldError('email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!data.interest) {
    showFieldError('interest', 'Please select an area of interest.');
    valid = false;
  }
  if (!data.message.trim() || data.message.trim().length < 10) {
    showFieldError('message', 'Please enter a message of at least 10 characters.');
    valid = false;
  }

  return valid;
}

function displayFormResult(data) {
  const resultSection = document.getElementById('form-result');
  const resultContent = document.getElementById('result-content');
  if (!resultSection || !resultContent) return;

  const submitTime = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  resultContent.innerHTML = `
    <div class="result-row"><span class="result-label">Name</span><span class="result-val">${data.name}</span></div>
    <div class="result-row"><span class="result-label">Email</span><span class="result-val">${data.email}</span></div>
    <div class="result-row"><span class="result-label">Interest</span><span class="result-val">${data.interest}</span></div>
    <div class="result-row"><span class="result-label">Updates</span><span class="result-val">${data.updates ? 'Yes, send me updates' : 'No thanks'}</span></div>
    <div class="result-row"><span class="result-label">Message</span><span class="result-val">${data.message}</span></div>
    <div class="result-row"><span class="result-label">Submitted</span><span class="result-val">${submitTime}</span></div>
  `;

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setPrefs({ lastVisited: 'contact', visitTime: new Date().toISOString() });

  const form = document.getElementById('contact-form');
  if (!form) return;

  // Live validation on blur
  ['name', 'email'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', () => {
      const val = document.getElementById(id)?.value || '';
      if (id === 'name' && !val.trim()) showFieldError('name', 'Please enter your name.');
      else if (id === 'name') clearFieldError('name');
      if (id === 'email' && val && !validateEmail(val)) showFieldError('email', 'Please enter a valid email address.');
      else if (id === 'email' && val) clearFieldError('email');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      name:     document.getElementById('name').value.trim(),
      email:    document.getElementById('email').value.trim(),
      interest: document.getElementById('interest').value,
      updates:  document.getElementById('updates').checked,
      message:  document.getElementById('message').value.trim(),
    };

    if (!validateForm(data)) return;

    setPrefs({
      subscriberName:  data.name,
      subscriberEmail: data.email,
      wantsUpdates:    data.updates
    });

    displayFormResult(data);
    showToast(`Thanks, ${data.name}! Your message has been received.`);
    form.reset();
  });
});