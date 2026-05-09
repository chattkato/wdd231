const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

document.querySelector('#lastModified').textContent =
`Last Modified: ${document.lastModified}`;