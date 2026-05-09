// course.js — Course list display, filter, and credit total

const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 341, title: 'Web Backend Development', credits: 2, completed: false },
  { subject: 'CSE', number: 212, title: 'Programming with Data Structures', credits: 2, completed: false },
  { subject: 'CSE', number: 222, title: 'Advanced Web Programming', credits: 2, completed: false },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development', credits: 2, completed: false },
  { subject: 'WDD', number: 330, title: 'Web Design', credits: 2, completed: false },
  { subject: 'WDD', number: 430, title: 'Web Framework Development', credits: 2, completed: false },
  { subject: 'CSE', number: 310, title: 'Applied Programming', credits: 2, completed: false },
];

const courseGrid = document.getElementById('course-grid');
const totalCreditsEl = document.getElementById('total-credits');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCourses(filter) {
  if (!courseGrid) return;

  const filtered = filter === 'all'
    ? courses
    : courses.filter(c => c.subject === filter);

  courseGrid.innerHTML = filtered.map(course => `
    <article class="course-card${course.completed ? ' completed' : ''}" aria-label="${course.subject} ${course.number}">
      <span class="course-code">${course.subject} ${course.number}</span>
      <span class="course-name">${course.title}</span>
      <span class="course-credits">${course.credits} cr</span>
      ${course.completed ? '<span class="course-badge">Done</span>' : ''}
    </article>
  `).join('');

  const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
  if (totalCreditsEl) {
    totalCreditsEl.textContent = totalCredits;
  }
}

// Attach filter button listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.filter);
  });
});

// Initial render
renderCourses('all');