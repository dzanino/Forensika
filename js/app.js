// Forensika PWA — i18n, animácia „rozostrené → ostré", inštalácia, auto-update.
(function () {
  'use strict';

  var DEFAULT_LANG = 'sk';
  var STORE_KEY = 'forensika-lang';
  var currentLang = DEFAULT_LANG;

  // Nainštalovaná appka (standalone) — skryjeme inštalačné prvky.
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  if (standalone) document.documentElement.classList.add('standalone');

  // ---- i18n ----
  function dict(lang) {
    var I = window.I18N || {};
    return I[lang] && Object.keys(I[lang]).length ? I[lang] : I.en || I.sk || {};
  }
  function t(lang, key) {
    var d = dict(lang), en = (window.I18N || {}).en || {};
    return (d[key] != null ? d[key] : (en[key] != null ? en[key] : null));
  }
  function applyLang(lang) {
    currentLang = lang;
    var el, i, nodes = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      var v = t(lang, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    }
    nodes = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      var h = t(lang, el.getAttribute('data-i18n-html'));
      if (h != null) el.innerHTML = h;
    }
    var titleVal = t(lang, 'meta.title');
    if (titleVal) document.title = titleVal;
    document.documentElement.lang = lang;

    var btns = document.querySelectorAll('.lang');
    for (i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-lang') === lang);
    }
    setYear();
  }
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    var nav = (navigator.language || 'sk').slice(0, 2).toLowerCase();
    var start = saved || (nav === 'en' ? 'en' : DEFAULT_LANG);
    if (!dict(start) || !Object.keys(dict(start)).length) start = DEFAULT_LANG;
    applyLang(start);

    var btns = document.querySelectorAll('.lang');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        var d = (window.I18N || {})[lang];
        if (!d || !Object.keys(d).length) { return; } // DE zatiaľ nedostupné
        applyLang(lang);
        try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      });
    }
  }

  // ---- Menu ----
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

  // ---- Zaostrovanie (blur -> sharp) ----
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.14 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

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
    if (!standalone && banner) banner.classList.add('show');
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
  if (btnNo) btnNo.addEventListener('click', function () { if (banner) banner.classList.remove('show'); });
  window.addEventListener('appinstalled', function () { if (banner) banner.classList.remove('show'); });

  // ---- Service worker + AUTO-UPDATE pri deploji ----
  if ('serviceWorker' in navigator) {
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').then(function (reg) {
        // Skontroluj aktualizáciu hneď a pri návrate na kartu.
        reg.update();
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') reg.update();
        });
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              nw.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      }).catch(function (err) { console.warn('SW registrácia zlyhala:', err); });
    });
  }

  // Umožní iným skriptom znovu aplikovať aktuálny jazyk (napr. po vykreslení zoznamov).
  window.forensikaApplyLang = function () { applyLang(currentLang); };

  // ---- Štart ----
  initLang();
  initReveal();
  setYear();
})();
