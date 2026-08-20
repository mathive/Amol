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
  if (appBar) {
    appBar.classList.toggle('top-nav-collapse', window.scrollY > 40);
  }
}
window.addEventListener('scroll', updateAppBar, { passive: true });
updateAppBar();

// Ensure background videos play smoothly
document.querySelectorAll('.hero-media video, .footer-media video').forEach((video) => {
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
});

// MDB picker controls and carousel for the booking form & testimonials.
if (window.jQuery) {
  const $ = window.jQuery;

  // Initialize Carousel
  if (typeof $.fn.carousel === 'function') {
    $('#vehicleRatesCarousel').carousel({ interval: 6000, pause: 'hover' });
    $('#testimonialCarousel').carousel({ interval: 5000, pause: 'hover' });
    $('#momentsGallery').carousel({ interval: 4000, pause: 'hover' });
  }

  // Initialize all Datepickers across all tabs
  if (typeof $.fn.pickadate === 'function') {
    $('.datepicker').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit: 'dd/mm/yyyy',
      min: true,
      closeOnSelect: true,
      closeOnClear: true,
      selectMonths: true,
      selectYears: 2
    });
  }

  // Initialize all Timepickers across all tabs
  if (typeof $.fn.pickatime === 'function') {
    $('.timepicker').pickatime({
      twelvehour: true,
      autoclose: true,
      donetext: 'Done',
      cleartext: 'Clear'
    });
  }

  // Clicking field icons triggers input focus to open picker smoothly
  $('.mdb-field .field-icon').on('click', function () {
    $(this).siblings('input, select').focus().trigger('click');
  });

  // Re-ensure picker positioning when switching Bootstrap tabs
  $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    const target = $(this).attr('href');
    if (typeof $.fn.pickadate === 'function') {
      $(target).find('.datepicker:not(.picker__input)').pickadate({
        format: 'dd/mm/yyyy',
        min: true,
        closeOnSelect: true
      });
    }
    if (typeof $.fn.pickatime === 'function') {
      $(target).find('.timepicker:not(.picker__input)').pickatime({
        twelvehour: true,
        autoclose: true
      });
    }
  });
}

// Cabs Packages & Travel Booking Form -> WhatsApp Message Submission
document.querySelectorAll('.travel-booking-form').forEach((form) => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const tripType = this.getAttribute('data-trip-type') || 'Cab Booking';
    const formData = new FormData(this);

    let messageLines = [
      '🚕 *Cab Booking Inquiry - Mahadeo Cab Services*',
      '━━━━━━━━━━━━━━━━━━━━',
      `📌 *Trip Type:* ${tripType}`
    ];

    const fromLoc = formData.get('from_location');
    if (fromLoc && fromLoc.trim()) {
      messageLines.push(`📍 *From:* ${fromLoc.trim()}`);
    }

    const toLoc = formData.get('to_location');
    if (toLoc && toLoc.trim()) {
      messageLines.push(`🎯 *To:* ${toLoc.trim()}`);
    }

    const airport = formData.get('airport_name');
    if (airport && airport.trim()) {
      messageLines.push(`✈️ *Airport:* ${airport.trim()}`);
    }

    const transferType = formData.get('transfer_type');
    if (transferType && transferType.trim()) {
      messageLines.push(`🔄 *Transfer Type:* ${transferType.trim()}`);
    }

    const cityAddress = formData.get('city_address');
    if (cityAddress && cityAddress.trim()) {
      messageLines.push(`📍 *City / Address:* ${cityAddress.trim()}`);
    }

    const localPkg = formData.get('local_package');
    if (localPkg && localPkg.trim()) {
      messageLines.push(`⏱️ *Package:* ${localPkg.trim()}`);
    }

    const pickupDate = formData.get('pickup_date');
    if (pickupDate && pickupDate.trim()) {
      messageLines.push(`📅 *Date:* ${pickupDate.trim()}`);
    }

    const startDate = formData.get('start_date');
    if (startDate && startDate.trim()) {
      messageLines.push(`📅 *Departure Date:* ${startDate.trim()}`);
    }

    const endDate = formData.get('end_date');
    if (endDate && endDate.trim()) {
      messageLines.push(`📅 *Return Date:* ${endDate.trim()}`);
    }

    const pickupTime = formData.get('pickup_time');
    if (pickupTime && pickupTime.trim()) {
      messageLines.push(`⏰ *Time:* ${pickupTime.trim()}`);
    }

    messageLines.push('━━━━━━━━━━━━━━━━━━━━');
    messageLines.push('Please confirm availability and share fare details.');

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/917588483221?text=${encodeURIComponent(fullMessage)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
});

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

    const payload = `Hello Mahadeo Cab Services,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/917588483221?text=${payload}`, '_blank', 'noopener');
  });
}

// =========================================================
// HTML5 Background Video Controller for Kumbh Mela Section
// Loops video strictly between 2:15 (135s) and 2:45 (165s)
// =========================================================
(function initKumbhVideoPlayer() {
  const kumbhVideo = document.getElementById('kumbhBgVideo');
  if (!kumbhVideo) return;

  const startTime = 135; // 2:15 in seconds
  const endTime = 165;   // 2:45 in seconds

  const startPlayback = () => {
    kumbhVideo.muted = true;
    kumbhVideo.currentTime = startTime;
    const playPromise = kumbhVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback for strict browser autoplay policies
        kumbhVideo.muted = true;
        kumbhVideo.play().catch(() => {});
      });
    }
  };

  kumbhVideo.addEventListener('loadedmetadata', startPlayback);
  if (kumbhVideo.readyState >= 1) {
    startPlayback();
  }

  // Constantly monitor time to loop seamlessly between 135s and 165s
  kumbhVideo.addEventListener('timeupdate', () => {
    if (kumbhVideo.currentTime >= endTime || kumbhVideo.currentTime < (startTime - 2)) {
      kumbhVideo.currentTime = startTime;
    }
  });

  // Ensure seamless playback if tab becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && kumbhVideo.paused) {
      kumbhVideo.play().catch(() => {});
    }
  });
})();


