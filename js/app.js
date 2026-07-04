// Forensika PWA — interakcia, animácia „rozostrené → ostré", inštalácia, offline.
(function () {
  'use strict';

  // Rok v pätičke
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobilné menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Zaostrovanie obsahu pri scrollovaní (blur -> sharp)
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Hero: zaostrenie loga a nadpisu po načítaní
  var hero = document.querySelector('.hero');
  var heroMark = document.getElementById('heroMark');
  if (heroMark) {
    heroMark.style.filter = 'blur(12px)';
    heroMark.style.opacity = '0';
    heroMark.style.transition = 'filter 1.2s ease, opacity 1.2s ease';
  }
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (heroMark) { heroMark.style.filter = 'blur(0)'; heroMark.style.opacity = '1'; }
      if (hero) hero.classList.add('sharp');
    }, 120);
  });

  // ---- PWA inštalácia ----
  var deferredPrompt = null;
  var banner = document.getElementById('installBanner');
  var btnHero = document.getElementById('installBtn');
  var btnYes = document.getElementById('installYes');
  var btnNo = document.getElementById('installNo');

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (banner) banner.classList.add('show');
  });

  function doInstall() {
    if (!deferredPrompt) {
      alert('Aplikáciu nainštalujete cez menu prehliadača: „Pridať na plochu“ / „Install“.');
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      if (banner) banner.classList.remove('show');
    });
  }
  if (btnHero) btnHero.addEventListener('click', doInstall);
  if (btnYes) btnYes.addEventListener('click', doInstall);
  if (btnNo) btnNo.addEventListener('click', function () {
    if (banner) banner.classList.remove('show');
  });
  window.addEventListener('appinstalled', function () {
    if (banner) banner.classList.remove('show');
  });

  // ---- Service worker (offline) ----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function (err) {
        console.warn('SW registrácia zlyhala:', err);
      });
    });
  }
})();
