// course.js – course array, filtering (filter), credit total (reduce)

const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to programming using Python.',
    technology: ['Python'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to HTML, CSS, and basic web design.',
    technology: ['HTML', 'CSS'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Functions, modules, and intermediate Python.',
    technology: ['Python'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Object-oriented programming using C#.',
    technology: ['C#'],
    completed: false,
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'JavaScript, DOM manipulation, and responsive design.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Advanced HTML, CSS, and JavaScript frontend practices.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false,
  },
];

const courseList   = document.getElementById('course-list');
const creditTotal  = document.getElementById('credit-total');
const filterBtns   = document.querySelectorAll('.filter-btn');

function displayCourses(filter) {
  const filtered = filter === 'all'
    ? courses
    : courses.filter(course => course.subject === filter);

  courseList.setAttribute('role', 'list');
  courseList.innerHTML = filtered.map(course => `
    <div class="course-card${course.completed ? ' completed' : ''}"
         role="listitem"
         aria-label="${course.subject} ${course.number}${course.completed ? ', completed' : ''}">
      ${course.subject} ${course.number}
    </div>
  `).join('');

  const total = filtered.reduce((sum, course) => sum + course.credits, 0);
  creditTotal.textContent =
    `The total credits for the courses listed above is ${total}`;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    displayCourses(btn.dataset.filter);
  });
});

// Initial render — show all courses on page load
displayCourses('all');