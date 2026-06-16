// js/contact.js - Contact page functionality

// DOM Elements
const form = document.getElementById('contact-form');
const resultSection = document.getElementById('form-result');
const resultContent = document.getElementById('result-content');

/**
 * Get URL search parameters and display form data
 */
function displayFormResult() {
  const params = new URLSearchParams(window.location.search);
  
  // Check if form was submitted
  if (!params.has('submitted')) {
    return;
  }
  
  // Get form data
  const formData = {
    name: params.get('name') || 'Not provided',
    email: params.get('email') || 'Not provided',
    interest: params.get('interest') || 'Not selected',
    message: params.get('message') || 'No message provided',
    updates: params.get('updates') === 'on' ? 'Yes' : 'No'
  };
  
  // Show result section
  if (resultSection) resultSection.hidden = false;
  if (form) form.style.display = 'none';
  
  // Build result table
  if (resultContent) {
    resultContent.innerHTML = `
      <div class="result-row">
        <span class="result-label">Full Name</span>
        <span class="result-val">${escapeHTML(formData.name)}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Email</span>
        <span class="result-val">${escapeHTML(formData.email)}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Interest</span>
        <span class="result-val">${escapeHTML(formData.interest)}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Message</span>
        <span class="result-val">${escapeHTML(formData.message)}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Subscribe to Updates</span>
        <span class="result-val">${formData.updates}</span>
      </div>
    `;
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(form);
  const params = new URLSearchParams();
  
  // Add form data to URL params
  for (const [key, value] of formData.entries()) {
    if (value) {
      params.append(key, value);
    }
  }
  params.append('submitted', 'true');
  
  // Redirect to same page with query parameters
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}

/**
 * Initialize contact page
 */
function initContact() {
  // Check for form result display
  displayFormResult();
  
  // Set up form submission handler
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initContact);