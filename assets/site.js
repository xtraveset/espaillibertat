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
  function barState(open) { if (bar) { bar.hidden = !open; document.body.classList.toggle('has-cookie', open); if (open) requestAnimationFrame(function () { document.body.style.setProperty('--cb-h', bar.offsetHeight + 'px'); }); } }
  if (consent === 'granted') loadGA();
  else if (!consent && bar) {
    // El banner apareix a la primera interacció (o als 6 s) perquè no tapi la crida principal en arribar
    var shown = false, evs = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
    var showBar = function () {
      if (shown) return; shown = true; barState(true);
      evs.forEach(function (ev) { window.removeEventListener(ev, showBar); });
    };
    evs.forEach(function (ev) { window.addEventListener(ev, showBar, { passive: true }); });
    setTimeout(showBar, 6000);
  }
  $$('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-consent');
      setConsent(v);
      barState(false);
      if (v === 'granted') loadGA();
      else { clearGACookies(); if (gaLoaded) location.reload(); }
    });
  });

  /* ---------- Delegació d'esdeveniments ---------- */
  function openOverlay(el) { el.hidden = false; document.body.style.overflow = 'hidden'; var c = $('[data-action^="close"]', el); if (c) c.focus(); }
  function closeOverlay(el) { el.hidden = true; document.body.style.overflow = ''; }
  var lastFocus = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    var lbx = $('#lightbox');
    if (lbx && !lbx.hidden && e.key === 'Tab') {
      var f = $$('button', lbx), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !lbx.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !lbx.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      return;
    }
    if (lbx && !lbx.hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { lbShow(lbIdx + (e.key === 'ArrowRight' ? 1 : -1)); return; }
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

  /* ---------- Galeria (lightbox amb navegació) ---------- */
  var lbIdx = 0, lbPre = {};
  function lbSrc(n) { return D && D.gallerySrc[n]; }
  function lbAlt(n) { var im = $$('#gallery-track img')[n]; return (im && im.getAttribute('alt')) || (D && D.gallery[n]) || ''; }
  function lbShow(n) {
    if (!D) return; var len = D.gallerySrc.length; lbIdx = (n + len) % len;
    var img = $('#lb-img'); if (!img) return;
    img.classList.add('ld'); img.onload = function () { img.classList.remove('ld'); };
    img.src = lbSrc(lbIdx); img.alt = lbAlt(lbIdx);
    var cap = $('#lb-cap'); if (cap) cap.textContent = lbAlt(lbIdx);
    var c = $('#lb-count'); if (c) c.textContent = (lbIdx + 1) + ' / ' + len;
    [lbIdx + 1, lbIdx - 1].forEach(function (k) { var j = (k + len) % len; if (!lbPre[j]) { lbPre[j] = new Image(); lbPre[j].src = lbSrc(j); } });
  }
  (function () {
    var lb = $('#lightbox'); if (!lb) return; var x0 = null, y0 = 0;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();

  /* ---------- Testimonis (carrusel en mòbil) ---------- */
  function testiTrack() { return $('#testi-track'); }
  function testiItems() { return $$('.testi-item:not(.testi-dup)'); }
  function testiIdx() { var tr = testiTrack(), it = testiItems(); if (!tr || !it.length) return 0; var w = it[0].offsetWidth + 14; return Math.max(0, Math.min(it.length - 1, Math.round(tr.scrollLeft / w))); }
  var tgt = null, tgtT = 0;
  function testiCur() { return tgt !== null && Date.now() - tgtT < 800 ? tgt : testiIdx(); }
  function testiGo(i) { var tr = testiTrack(), it = testiItems(); if (!tr || !it.length) return; i = (i + it.length) % it.length; tgt = i; tgtT = Date.now(); tr.scrollTo({ left: it[i].offsetLeft - tr.offsetLeft - 2, behavior: reduce ? 'auto' : 'smooth' }); }
  (function () {
    var tr = testiTrack(); if (!tr) return; var ticking = false;
    tr.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false; var i = testiIdx();
        $$('.testi-dots button').forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      });
    }, { passive: true });
  })();

  /* ---------- Enllaços d'ancoratge sense "#" a l'URL + secció activa ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"], a[data-top]'); if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var id = a.hasAttribute('data-top') ? '' : a.getAttribute('href').slice(1);
    if (!id) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
    var el = document.getElementById(id); if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (er) {}
  });
  if ('IntersectionObserver' in window) {
    var links = $$('.nav-desktop a[href^="#"], .mobile-menu a[href^="#"]');
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return; var id = en.target.id ? '#' + en.target.id : '';
        links.forEach(function (l) { if (id && l.getAttribute('href') === id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    $$('main > section').forEach(function (sec) { io.observe(sec); });
  }
  if (window.matchMedia) { var mq = matchMedia('(min-width: 1181px)'); var mqf = function (q) { if (q.matches) setMenu(false); }; if (mq.addEventListener) mq.addEventListener('change', mqf); }
  var hd = $('header');
  if (hd && window.ResizeObserver) new ResizeObserver(function (en) { var h = Math.round(en[0].borderBoxSize && en[0].borderBoxSize[0] ? en[0].borderBoxSize[0].blockSize : en[0].contentRect.height); if (h) document.documentElement.style.setProperty('--hh', h + 'px'); }).observe(hd);

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
      case 'lightbox': { lastFocus = t; lbShow(+t.getAttribute('data-index')); openOverlay($('#lightbox')); break; }
      case 'lb-prev': lbShow(lbIdx - 1); break;
      case 'lb-next': lbShow(lbIdx + 1); break;
      case 'testi-prev': testiGo(testiCur() - 1); break;
      case 'testi-next': testiGo(testiCur() + 1); break;
      case 'testi-go': testiGo(+t.getAttribute('data-index')); break;
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
      case 'cookie-settings': if (bar) { barState(true); var btn = $('button', bar); if (btn) btn.focus(); } break;
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
    inp.style.setProperty('--p', ((h - (+inp.min)) / ((+inp.max) - (+inp.min)) * 100) + '%');
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
    var msg = D.lang === 'ca' ? "Hola! M'interessa el pla " + n[best.id] + ' (' + sala + ', ~' + h + ' h/mes).'
      : '¡Hola! Me interesa el plan ' + n[best.id] + ' (' + sala + ', ~' + h + ' h/mes).';
    var cta = $('[data-calc-cta]');
    if (cta) {
      cta.href = 'https://wa.me/34660913103?text=' + encodeURIComponent(msg).replace(/%21/g, '!').replace(/%27/g, "'");
      cta.target = '_blank'; cta.rel = 'noopener'; cta.setAttribute('data-wa', 'calculadora');
    }
  }
  var inp = $('#calc-hours');
  if (inp) inp.addEventListener('input', calc);
  /* ---------- Pastilla de WhatsApp: apareix ja col·locada (sense salts de layout) ---------- */
  requestAnimationFrame(function () { requestAnimationFrame(function () { var f = $('.wa-float'); if (f) f.classList.add('on'); }); });

  /* ---------- Mòbil: la pastilla s'amaga mentre la crida principal del hero és visible ---------- */
  (function holdPill() {
    var pill = $('.wa-float');
    if (!pill || !('IntersectionObserver' in window)) return;
    requestAnimationFrame(function () {
      var cta = $$('a[data-wa="hero"]').filter(function (a) { return a.offsetParent !== null; })[0];
      if (!cta) return;
      new IntersectionObserver(function (en) { pill.classList.toggle('hold', en[0].isIntersecting); }, { threshold: 0.6 }).observe(cta);
    });
  })();

  /* ---------- Mesura de leads: clics a WhatsApp / correu / telèfon -> GA4 ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-wa], a[href^="mailto:"], a[href^="tel:"], a[data-ig]');
    if (!a || typeof window.gtag !== 'function') return;
    var wa = a.hasAttribute('data-wa'), ig = a.hasAttribute('data-ig');
    var method = wa ? 'whatsapp' : ig ? 'instagram' : a.href.indexOf('mailto:') === 0 ? 'email' : 'phone';
    window.gtag('event', ig ? 'click_instagram' : 'generate_lead', {
      method: method,
      link_location: a.getAttribute('data-wa') || a.getAttribute('data-ig') || 'page',
      page_language: D ? D.lang : document.documentElement.lang
    });
  });

  /* ---------- Entrada suau de seccions (respecta prefers-reduced-motion) ---------- */
  (function reveal() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var run = function () {
      var vh = window.innerHeight || 800;
      var targets = $$('body section').filter(function (s) { return s.getBoundingClientRect().top > vh * 0.9; });
      if (!targets.length) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      targets.forEach(function (s) { s.classList.add('rv'); io.observe(s); });
      // xarxa de seguretat: si per qualsevol motiu l'observador no dispara, mostra-ho tot
      setTimeout(function () { targets.forEach(function (s) { s.classList.add('in'); }); }, 6000);
    };
    // després del primer pintat, per no forçar un reflow durant la càrrega
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 800 }); else setTimeout(run, 200);
  })();

  /* ---------- Obertura directa dels HTML (file://): enllaços de carpeta -> index.html ---------- */
  if (location.protocol === 'file:') {
    $$('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(\.\.?\/|es\/)$/.test(h) || /\/$/.test(h) && !/^[a-z]+:/i.test(h)) a.setAttribute('href', h + 'index.html');
    });
  }
})();
