/* =========================================================
   NICE-EV 2026 — Main JS
   1. Countdown
   2. Nav: mobile toggle, scrolled state, scroll-spy
   3. Reveal-on-scroll
   4. Theme toggle (light = default, dark = optional)
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. Countdown ---------- */
  const deadline = new Date('2026-07-25T23:59:59').getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  const pad = (n) => String(n).padStart(2, '0');

  function updateCountdown() {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.mins.textContent = '00';
      els.secs.textContent = '00';
      return false;
    }
    els.days.textContent = pad(Math.floor(diff / 86400000));
    els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    els.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
    return true;
  }

  if (els.days) {
    updateCountdown();
    const interval = setInterval(() => {
      if (!updateCountdown()) clearInterval(interval);
    }, 1000);
  }

  /* ---------- 2. Nav ---------- */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', String(expanded));
    });
    links.forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    lastScroll = y;
  }, { passive: true });

  // Scroll-spy: highlight nav link of section currently in view
  const sections = document.querySelectorAll('section[id]');
  const linkMap = new Map();
  links.forEach((a) => {
    const id = a.getAttribute('href')?.replace('#', '');
    if (id) linkMap.set(id, a);
  });

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => a.classList.remove('active'));
            const active = linkMap.get(entry.target.id);
            if (active) active.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 4. Theme toggle ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const STORAGE_KEY = 'nice-ev-theme';
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
      }
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();
