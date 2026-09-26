/* Espai Llibertat — interaccions de la pàgina (sense dependències) */
(function () {
  'use strict';
  var GA_ID = 'G-D74F1426F3';
  var dataEl = document.getElementById('page-data');
  var D = dataEl ? JSON.parse(dataEl.textContent) : null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Consentiment de cookies + Google Analytics ---------- */
  var KEY = 'el-cookie-consent';
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return; gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGACookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^_ga/.test(n)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }
  var bar = $('#cookie-bar');
  var consent = getConsent();
  if (consent === 'granted') loadGA();
  else if (!consent && bar) bar.hidden = false;
  $$('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-consent');
      setConsent(v);
      if (bar) bar.hidden = true;
      if (v === 'granted') loadGA();
      else { clearGACookies(); if (gaLoaded) location.reload(); }
    });
  });

  /* ---------- Delegació d'esdeveniments ---------- */
  function openOverlay(el) { el.hidden = false; document.body.style.overflow = 'hidden'; var c = $('[data-action^="close"]', el); if (c) c.focus(); }
  function closeOverlay(el) { el.hidden = true; document.body.style.overflow = ''; }
  var lastFocus = null;

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var stop = e.target.closest('[data-stop]');
    if (stop && t.contains(stop)) return; // clic dins del contingut d'un modal
    var a = t.getAttribute('data-action');
    handle(a, t, e);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      ['#testi-modal', '#lightbox'].forEach(function (s) { var m = $(s); if (m && !m.hidden) { closeOverlay(m); if (lastFocus) lastFocus.focus(); } });
      var mm = $('#mobile-menu'); if (mm && !mm.hidden) setMenu(false);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-action]')) {
      e.preventDefault(); handle(e.target.getAttribute('data-action'), e.target, e);
    }
  });

  function setMenu(open) {
    var mm = $('#mobile-menu'), btn = $('[data-action="menu"]');
    if (!mm || !btn) return;
    mm.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var use = $('use', btn); if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
  }

  function handle(a, t, e) {
    switch (a) {
      case 'menu': setMenu($('#mobile-menu').hidden); break;
      case 'close-menu': setMenu(false); break;
      case 'room': setRoom(t.getAttribute('data-room')); break;
      case 'step': {
        var i = +t.getAttribute('data-index');
        $$('[data-action="step"]').forEach(function (s) {
          var j = +s.getAttribute('data-index');
          var open = j === i ? s.getAttribute('aria-expanded') !== 'true' : false;
          s.setAttribute('aria-expanded', open ? 'true' : 'false');
          $('#step-' + j).hidden = !open;
        });
        break;
      }
      case 'faq': {
        var k = +t.getAttribute('data-index');
        $$('[data-action="faq"]').forEach(function (b) {
          var j = +b.getAttribute('data-index');
          var open = j === k ? b.getAttribute('aria-expanded') !== 'true' : false;
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
          var sym = b.lastElementChild; if (sym) sym.textContent = open ? '−' : '+';
          $('#faq-a-' + j).hidden = !open;
        });
        break;
      }
      case 'gallery-prev': case 'gallery-next': {
        var tr = $('#gallery-track'); if (tr) tr.scrollBy({ left: a === 'gallery-prev' ? -320 : 320, behavior: 'smooth' });
        break;
      }
      case 'lightbox': {
        var n = +t.getAttribute('data-index'); var lb = $('#lightbox'); if (!lb || !D) break;
        var box = $('[role="img"]', lb);
        box.setAttribute('aria-label', D.gallery[n]);
        box.style.cssText = 'width:100%; height:100%; border-radius:12px; background-image:url(' + D.gallerySrc[n] + '); background-size:contain; background-repeat:no-repeat; background-position:center;';
        lastFocus = t; openOverlay(lb);
        break;
      }
      case 'close-lightbox': closeOverlay($('#lightbox')); if (lastFocus) lastFocus.focus(); break;
      case 'testi': {
        var m = $('#testi-modal'); if (!m || !D) break;
        var tm = D.testimonials[+t.getAttribute('data-index')];
        var av = $('[role="img"]', m);
        av.setAttribute('aria-label', tm.name);
        av.style.cssText = 'width:52px; height:52px; flex-shrink:0; border-radius:50%; background-image:url(' + tm.avatar + '); background-size:cover; background-position:center;';
        var txt = $$('[data-modal]', m);
        txt[0].textContent = tm.name; txt[1].textContent = tm.role; txt[2].textContent = tm.quote;
        lastFocus = t; openOverlay(m);
        break;
      }
      case 'close-modal': closeOverlay($('#testi-modal')); if (lastFocus) lastFocus.focus(); break;
      case 'cookie-settings': if (bar) { bar.hidden = false; var btn = $('button', bar); if (btn) btn.focus(); } break;
    }
  }

  /* ---------- Tarifes: sala individual / grupal + calculadora ---------- */
  var room = 'individual';
  function setRoom(r) {
    room = r;
    $$('[data-room-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-room-panel') !== r; });
    $$('[data-room-tabs] button').forEach(function (b) {
      var on = b.getAttribute('data-room') === r;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.color = on ? 'var(--color-primary)' : 'var(--color-ink-muted)';
      b.style.borderBottomColor = on ? 'var(--color-primary)' : 'transparent';
    });
    var sum = $('[data-room-summary]'); if (sum && D) sum.textContent = D.summary[r];
    var inp = $('#calc-hours');
    if (inp) {
      var max = r === 'grupal' ? 16 : 40;
      inp.max = max;
      if (+inp.value > max) inp.value = max;
      setText('maxlabel', max + ' h');
    }
    calc();
  }
  function setText(k, v) { $$('[data-calc="' + k + '"]').forEach(function (el) { el.textContent = v; }); }
  function fmt(v) { return (Math.round(v * 10) / 10).toString().replace('.', ',') + '€'; }
  function calc() {
    var inp = $('#calc-hours'); if (!inp || !D) return;
    var h = +inp.value, n = D.plan, best;
    if (room === 'individual') {
      var opts = [{ id: 'payg', cost: 15 * h, ok: true }, { id: 'bo10', cost: 12 * h, ok: h >= 4 },
        { id: 'bo25', cost: 10 * h, ok: h >= 8 }, { id: 'sub', cost: 280, ok: h >= 20 }].filter(function (o) { return o.ok; });
      best = opts.reduce(function (a, b) { return b.cost < a.cost ? b : a; });
    } else {
      best = h <= 4 ? { id: 'payg', cost: 25 * h } : h <= 8 ? { id: 'pack', cost: 120 } : { id: 'full', cost: null };
    }
    var base = (room === 'individual' ? 15 : 25) * h;
    var saving = best.cost != null ? base - best.cost : 0;
    setText('hours', h);
    setText('plan', n[best.id]);
    setText('monthly', best.cost != null ? fmt(best.cost) : D.consult);
    setText('perhour', best.cost != null ? fmt(best.cost / h) + '/h' : '—');
    setText('savingtext', D.savePre + fmt(saving) + D.savePost);
    var sv = $('[data-calc="saving"]'); if (sv) sv.hidden = !(saving > 0);
    var cu = $('[data-calc="custom"]'); if (cu) cu.hidden = best.cost != null;
    var sala = room === 'individual' ? 'sala individual' : 'sala grupal';
    var subj = D.lang === 'ca' ? 'Interès en el pla ' + n[best.id] + ' (' + sala + ', ~' + h + ' h/mes)'
      : 'Interés en el plan ' + n[best.id] + ' (' + sala + ', ~' + h + ' h/mes)';
    var cta = $('[data-calc-cta]'); if (cta) cta.href = 'mailto:libertad.cg@hotmail.com?subject=' + encodeURIComponent(subj);
  }
  var inp = $('#calc-hours');
  if (inp) inp.addEventListener('input', calc);
})();
