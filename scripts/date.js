// date.js – dynamic copyright year and last modified date

const currentYear = new Date().getFullYear();
document.getElementById('copyright').textContent =
  `© ${currentYear} • Chatt • Abuja, Nigeria`;

document.getElementById('lastModified').textContent =
  `Last Modification: ${document.lastModified}`;