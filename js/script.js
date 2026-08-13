/* =========================================================
   SheSolves 2026 — interactions
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var current = null;

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Sticky header + back-to-top visibility ---------- */
  var toTopBtn = document.getElementById('to-top');

  function onScroll() {
    setActiveLink();
    if (toTopBtn) {
      toTopBtn.classList.toggle('visible', window.scrollY > 480);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.about-grid, .details-grid, .timeline-item, .why-card, .register-inner'
  );
  revealTargets.forEach(function (el) { el.setAttribute('data-reveal', ''); });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Countdown to event ---------- */
  var EVENT_DATE = new Date('2026-09-19T09:00:00');
  var cdDays = document.getElementById('cd-days');
  var cdHours = document.getElementById('cd-hours');
  var cdMins = document.getElementById('cd-mins');
  var cdSecs = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    var diff = EVENT_DATE - new Date();
    if (diff <= 0) {
      if (cdDays) cdDays.textContent = '0';
      if (cdHours) cdHours.textContent = '0';
      if (cdMins) cdMins.textContent = '0';
      if (cdSecs) cdSecs.textContent = '0';
      return;
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
  }

  if (cdDays) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---------- Registration management ---------- */

  var form = document.getElementById('register-form');
  var formNote = document.getElementById('form-note');

  var registrationCount = document.getElementById('registration-count');
  var seatsRemaining = document.getElementById('seats-remaining');
  var registrationList = document.getElementById('registration-list');
  var registrationSearch = document.getElementById('registration-search');
  var registrationFilter = document.getElementById('registration-filter');
  var exportButton = document.getElementById('export-registrations');

  var MAX_SEATS = 150;
  var STORAGE_KEY = 'shesolves_registrations';

  function getRegistrations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveRegistrations(registrations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  }

  function getTrackName(track) {
    if (track === 'dsa') return 'Track A — DSA Sprint';
    if (track === 'build') return 'Track B — Build-a-thon';
    return 'Not sure yet';
  }

  function renderRegistrations() {
    var registrations = getRegistrations();
    var search = registrationSearch ? registrationSearch.value.toLowerCase().trim() : '';
    var filter = registrationFilter ? registrationFilter.value : 'all';

    var filtered = registrations.filter(function (registration) {
      var matchesSearch =
        registration.name.toLowerCase().includes(search) ||
        registration.email.toLowerCase().includes(search);

      var matchesFilter =
        filter === 'all' || registration.track === filter;

      return matchesSearch && matchesFilter;
    });

    if (registrationCount) {
      registrationCount.textContent = registrations.length;
    }

    if (seatsRemaining) {
      seatsRemaining.textContent = Math.max(
        MAX_SEATS - registrations.length,
        0
      );
    }

    if (!registrationList) return;

    if (filtered.length === 0) {
      registrationList.innerHTML =
        '<tr><td colspan="4" class="empty-registrations">No matching registrations.</td></tr>';
      return;
    }

    registrationList.innerHTML = filtered.map(function (registration) {
      return (
        '<tr>' +
          '<td>' + escapeHtml(registration.name) + '</td>' +
          '<td>' + escapeHtml(registration.email) + '</td>' +
          '<td>' + escapeHtml(getTrackName(registration.track)) + '</td>' +
          '<td><button class="delete-registration" data-email="' +
            escapeHtml(registration.email) +
            '">Delete</button></td>' +
        '</tr>'
      );
    }).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim().toLowerCase();
      var track = form.track.value;

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var registrations = getRegistrations();

      if (!name || !emailPattern.test(email)) {
        formNote.textContent =
          'Please enter your name and a valid email address.';
        formNote.classList.add('is-error');
        return;
      }

      var duplicate = registrations.some(function (registration) {
        return registration.email === email;
      });

      if (duplicate) {
        formNote.textContent =
          'This email is already registered.';
        formNote.classList.add('is-error');
        return;
      }

      if (registrations.length >= MAX_SEATS) {
        formNote.textContent =
          'Registration is full. All 150 seats have been reserved.';
        formNote.classList.add('is-error');
        return;
      }

      registrations.push({
        name: name,
        email: email,
        track: track
      });

      saveRegistrations(registrations);
      renderRegistrations();

      formNote.classList.remove('is-error');
      formNote.textContent =
        'Registration confirmed for ' + name.split(' ')[0] + '!';
      form.reset();
    });
  }

  if (registrationSearch) {
    registrationSearch.addEventListener('input', renderRegistrations);
  }

  if (registrationFilter) {
    registrationFilter.addEventListener('change', renderRegistrations);
  }

  if (registrationList) {
    registrationList.addEventListener('click', function (e) {
      if (!e.target.classList.contains('delete-registration')) return;

      var email = e.target.getAttribute('data-email');

      var registrations = getRegistrations().filter(function (registration) {
        return registration.email !== email;
      });

      saveRegistrations(registrations);
      renderRegistrations();
    });
  }

  if (exportButton) {
    exportButton.addEventListener('click', function () {
      var registrations = getRegistrations();

      if (registrations.length === 0) {
        alert('There are no registrations to export.');
        return;
      }

      var csv = 'Name,Email,Preferred Track\n';

      registrations.forEach(function (registration) {
        csv += '"' +
          registration.name.replace(/"/g, '""') + '","' +
          registration.email.replace(/"/g, '""') + '","' +
          getTrackName(registration.track).replace(/"/g, '""') +
          '"\n';
      });

      var blob = new Blob([csv], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');

      link.href = url;
      link.download = 'shesolves-registrations.csv';
      link.click();

      URL.revokeObjectURL(url);
    });
  }

  renderRegistrations();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
