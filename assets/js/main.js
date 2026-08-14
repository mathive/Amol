// MDB/Bootstrap handles the responsive navbar collapse.
// Keep the current section visibly selected as visitors navigate the page.
const navItems = Array.from(document.querySelectorAll('.top-app-bar .nav-item'));
const navLinks = Array.from(document.querySelectorAll('.top-app-bar .nav-link'));

function setActiveNavItem(targetHash) {
  navItems.forEach((item) => item.classList.remove('active'));

  const matchedLink = navLinks.find((link) => {
    const href = link.getAttribute('href');
    return href === targetHash || (targetHash === '' && href === '#top');
  });

  if (matchedLink) {
    matchedLink.parentElement.classList.add('active');
  }
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetHash = link.getAttribute('href') || '#top';
    setActiveNavItem(targetHash);
  });
});

function syncNavStateFromHash() {
  const hash = window.location.hash || '#top';
  setActiveNavItem(hash);
}

window.addEventListener('hashchange', syncNavStateFromHash);
window.addEventListener('load', syncNavStateFromHash);

const appBar = document.querySelector('.top-app-bar');
function updateAppBar() {
  appBar.classList.toggle('top-nav-collapse', window.scrollY > 40);
}
window.addEventListener('scroll', updateAppBar, { passive: true });
updateAppBar();

// MDB picker controls for the booking form.
if (window.jQuery) {
  const $date = window.jQuery('#ride-date');
  const $time = window.jQuery('#ride-time');

  if (typeof $date.pickadate === 'function') {
    $date.pickadate({ format: 'mm/dd/yyyy', min: true, closeOnSelect: true });
  }
  if (typeof $time.pickatime === 'function') {
    $time.pickatime({ cleartext: 'Clear', close: 'Done', interval: 15 });
  }
}

const rideForm = document.getElementById('ride-form');
if (rideForm) {
  const fields = {
    pickup: document.getElementById('pickup'),
    dropoff: document.getElementById('dropoff'),
    date: document.getElementById('ride-date'),
    time: document.getElementById('ride-time'),
    passengers: document.getElementById('passengers'),
    mobile: document.getElementById('mobile')
  };
  const submitButton = rideForm.querySelector('.form-submit');

  const isFutureDate = (value) => {
    const parts = value.split('/').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
    const selected = new Date(parts[2], parts[0] - 1, parts[1]);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return selected instanceof Date && !Number.isNaN(selected.getTime()) && selected >= today;
  };
  const rules = {
    pickup: (value) => value.trim().length >= 3,
    dropoff: (value) => value.trim().length >= 3,
    date: isFutureDate,
    time: (value) => /^([0-1]?\d|2[0-3]):[0-5]\d\s?(AM|PM)?$/i.test(value.trim()),
    passengers: (value) => value !== '',
    mobile: (value) => /^(?:91)?[6-9]\d{9}$/.test(value.replace(/\D/g, ''))
  };

  function validateField(name) {
    const field = fields[name];
    const valid = rules[name](field.value);
    field.classList.toggle('is-valid', valid);
    field.classList.toggle('is-invalid', !valid && field.value.trim() !== '');
    return valid;
  }
  function validateForm() {
    const valid = Object.keys(fields).every(validateField);
    submitButton.disabled = !valid;
    return valid;
  }
  Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener('input', validateForm);
    field.addEventListener('change', validateForm);
    field.addEventListener('blur', () => validateField(name));
  });
  rideForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const message = `Hello, I would like to book a ride.%0A%0APick up: ${encodeURIComponent(fields.pickup.value)}%0ADrop off: ${encodeURIComponent(fields.dropoff.value)}%0ADate: ${encodeURIComponent(fields.date.value)}%0ATime: ${encodeURIComponent(fields.time.value)}%0APassengers: ${encodeURIComponent(fields.passengers.value)}%0AMobile: ${encodeURIComponent(fields.mobile.value)}`;
    window.open(`https://wa.me/917588483221?text=${message}`, '_blank', 'noopener');
  });
  validateForm();
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const nameField = document.getElementById('contact-name');
  const phoneField = document.getElementById('contact-phone');
  const messageField = document.getElementById('contact-message');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameField.value.trim();
    const phone = phoneField.value.trim();
    const message = messageField.value.trim();

    if (!name || !phone || !message) {
      return;
    }

    const payload = `Hello Premium Taxi,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/917588483221?text=${payload}`, '_blank', 'noopener');
  });
}
