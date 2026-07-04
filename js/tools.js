// Forensika — interaktívne nástroje: žiadosť o List, znalci, spätná väzba.
(function () {
  'use strict';

  var CONFIG = {
    // Doplň e-mail pre spätnú väzbu (napr. "ty@domena.sk").
    // Ak ostane prázdny, hodnotenie sa uloží lokálne a zobrazí sa poďakovanie.
    feedbackEmail: '',
    // Centrálny kontakt sekcie SLaPA ÚDZS (žiadosť o List sa smeruje sem).
    listRequestEmail: 'sslapa@udzs-sk.sk'
  };

  // SLaPA pracoviská (adresáti žiadosti). Zdroj: ÚDZS.
  var WORKPLACES = [
    'Sekcia SLaPA ÚDZS (centrálne)',
    'SLaPA Bratislava, Antolská 11',
    'SLaPA Banská Bystrica, nám. L. Svobodu 1',
    'SLaPA Martin, Kuzmányho 27/B',
    'SLaPA Košice, Ipeľská 1',
    'SLaPA Žilina, V. Spanyola 43',
    'SLaPA Poprad, Zdravotnícka 3253/3'
  ];

  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value.trim() : ''; }

  // ---------- Žiadosť o List o prehliadke mŕtveho tela ----------
  function fillPlaces() {
    var sel = $('f_place');
    if (!sel) return;
    for (var i = 0; i < WORKPLACES.length; i++) {
      var o = document.createElement('option');
      o.value = WORKPLACES[i];
      o.textContent = WORKPLACES[i];
      sel.appendChild(o);
    }
  }

  function buildLetter() {
    var dec = val('f_dec') || '…………';
    var born = val('f_born');
    var died = val('f_died') || '…………';
    var rel = val('f_rel') || '…………';
    var name = val('f_name') || '…………';
    var contact = val('f_contact') || '…………';
    var place = val('f_place') || WORKPLACES[0];
    var today = new Date().toLocaleDateString('sk-SK');

    var L = [];
    L.push('Adresát: ' + place);
    L.push('');
    L.push('Vec: Žiadosť o vydanie Listu o prehliadke mŕtveho tela');
    L.push('');
    L.push('Týmto Vás zdvorilo žiadam o vydanie Listu o prehliadke mŕtveho tela (potvrdenia o prehliadke mŕtveho tela) zosnulého/zosnulej:');
    L.push('');
    L.push('  Meno a priezvisko: ' + dec);
    if (born) L.push('  Dátum narodenia: ' + born);
    L.push('  Dátum a miesto úmrtia: ' + died);
    L.push('');
    L.push('Žiadateľ (vzťah k zosnulému: ' + rel + '):');
    L.push('  Meno a priezvisko: ' + name);
    L.push('  Kontakt: ' + contact);
    L.push('');
    L.push('Doklad, prosím, vydajte v súlade s platnými predpismi. O spôsobe prevzatia (osobne / poštou / e-mailom) sa rád/rada dohodnem podľa možností pracoviska.');
    L.push('');
    L.push('Vopred ďakujem za ústretovosť.');
    L.push('');
    L.push('V ................ dňa ' + today);
    L.push('Podpis: ...............................');
    return L.join('\n');
  }

  function initList() {
    var gen = $('listGen'), out = $('f_out'), mail = $('listMail'),
        copy = $('listCopy'), print = $('listPrint');
    if (!gen || !out) return;
    fillPlaces();

    gen.addEventListener('click', function () { out.value = buildLetter(); });

    if (mail) mail.addEventListener('click', function (e) {
      if (!out.value) out.value = buildLetter();
      var subj = 'Žiadosť o List o prehliadke mŕtveho tela';
      mail.setAttribute('href',
        'mailto:' + CONFIG.listRequestEmail +
        '?subject=' + encodeURIComponent(subj) +
        '&body=' + encodeURIComponent(out.value));
    });

    if (copy) copy.addEventListener('click', function () {
      if (!out.value) out.value = buildLetter();
      var orig = copy.textContent;
      var done = function () {
        copy.textContent = '✓';
        setTimeout(function () { copy.textContent = orig; }, 1600);
      };
      if (navigator.clipboard) { navigator.clipboard.writeText(out.value).then(done, done); }
      else { out.select(); try { document.execCommand('copy'); } catch (e) {} done(); }
    });

    if (print) print.addEventListener('click', function () {
      if (!out.value) out.value = buildLetter();
      var w = window.open('', '_blank');
      if (!w) return;
      w.document.write('<pre style="font:14px/1.5 -apple-system,Arial,sans-serif;white-space:pre-wrap;padding:24px">' +
        out.value.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</pre>');
      w.document.close(); w.focus(); w.print();
    });
  }

  // ---------- Znalci ----------
  function initExperts() {
    var box = $('expertsList');
    if (!box || !window.FORENSIKA_EXPERTS) return;
    var data = window.FORENSIKA_EXPERTS, list = data.list || [];
    if (!list.length) {
      var p = document.createElement('p');
      p.className = 'note';
      p.setAttribute('data-i18n', 'srv.zn.empty');
      box.appendChild(p);
      if (window.forensikaApplyLang) window.forensikaApplyLang();
      return;
    }
    list.forEach(function (z) {
      var d = document.createElement('div');
      d.className = 'expert';
      var html = '<strong>' + esc(z.name) + '</strong>';
      if (z.code) html += ' <span class="code">' + esc(z.code) + '</span>';
      var meta = [];
      if (z.city) meta.push(esc(z.city));
      if (z.phone) meta.push('<a href="tel:' + esc(z.phone.replace(/\s/g, '')) + '">' + esc(z.phone) + '</a>');
      if (z.email) meta.push('<a href="mailto:' + esc(z.email) + '">' + esc(z.email) + '</a>');
      if (meta.length) html += '<div class="expert-meta">' + meta.join(' · ') + '</div>';
      d.innerHTML = html;
      box.appendChild(d);
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- Spätná väzba ----------
  function initFeedback() {
    var rating = $('rating'), send = $('fbSend'), thanks = $('fbThanks'), msg = $('fb_msg');
    if (!rating || !send) return;
    var value = 0;
    var stars = rating.querySelectorAll('.star');
    function paint() { for (var i = 0; i < stars.length; i++) stars[i].classList.toggle('on', i < value); }
    stars.forEach(function (s) {
      s.addEventListener('click', function () { value = parseInt(s.getAttribute('data-v'), 10); paint(); });
    });

    send.addEventListener('click', function () {
      var text = msg ? msg.value.trim() : '';
      try { localStorage.setItem('forensika-feedback', JSON.stringify({ rating: value, msg: text, at: Date.now() })); } catch (e) {}
      if (CONFIG.feedbackEmail) {
        var body = 'Hodnotenie: ' + (value || '-') + '/5\n\n' + text;
        window.location.href = 'mailto:' + CONFIG.feedbackEmail +
          '?subject=' + encodeURIComponent('Forensika — spätná väzba') +
          '&body=' + encodeURIComponent(body);
      }
      if (thanks) thanks.hidden = false;
      value = 0; paint(); if (msg) msg.value = '';
      setTimeout(function () { if (thanks) thanks.hidden = true; }, 4000);
    });
  }

  function init() { initList(); initExperts(); initFeedback(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
