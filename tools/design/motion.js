/* Pilares del Bienestar — motion design (vanilla, sin dependencias).
   Fuente única: tools/design/motion.js (se inyecta con tools/apply-design.mjs).
   Respeta prefers-reduced-motion y nunca deja contenido oculto si algo falla. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  function init() {
    groupProse();
    progressBar();
    slamTitles();
    injectTicker();
    setupReveal();
    setupNavSpy();
    countUps();
    tilt();
    quizFeel();
  }

  /* ---------- Texto en dos columnas ----------
     Agrupa los párrafos y listas consecutivos de cada .block en un .prose; si el grupo es largo
     se parte en dos columnas (menos hueco a la derecha, medida de lectura intacta). */
  function groupProse() {
    $$('.block').forEach(function (b) {
      var kids = Array.prototype.slice.call(b.children), run = [];
      function flush() {
        if (!run.length) return;
        var w = doc.createElement('div'); w.className = 'prose';
        b.insertBefore(w, run[0]);
        var chars = 0;
        run.forEach(function (e) { chars += e.textContent.length; w.appendChild(e); });
        if (chars > 560) w.classList.add('cols');
        run = [];
      }
      kids.forEach(function (k) { if (/^(P|UL|OL)$/.test(k.tagName)) run.push(k); else flush(); });
      flush();
    });
  }

  /* ---------- Barra de progreso de lectura ---------- */
  function progressBar() {
    if (reduce) return;
    var bar = doc.createElement('div'); bar.className = 'progress';
    var i = doc.createElement('i'); bar.appendChild(i); doc.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = root.scrollHeight - window.innerHeight;
      i.style.setProperty('--p', h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)).toFixed(4) : 0);
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Títulos: palabra por palabra ---------- */
  function slamTitles() {
    if (reduce) return;
    $$('header.top > h1, .hero h1, [data-slam]').forEach(function (h) {
      var n = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var parts = c.textContent.split(/(\s+)/), frag = doc.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(' ')); return; }
              var w = doc.createElement('span'); w.className = 'w';
              var s = doc.createElement('span'); s.textContent = p; s.style.setProperty('--i', n++);
              w.appendChild(s); frag.appendChild(w);
            });
            c.parentNode.replaceChild(frag, c);
          } else if (c.nodeType === 1 && c.tagName !== 'BR') { walk(c); }
        });
      })(h);
    });
  }

  /* ---------- Cinta en movimiento bajo la cabecera ---------- */
  function injectTicker() {
    var head = $('header.top');
    if (!head || $('.ticker') || reduce) return;
    var h1 = $('h1', head);
    var label = h1 ? h1.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'Pilares del Bienestar';
    var words = [label, 'Estudio personal', 'Autoría 100% propia', 'ESEN · Ciclo III / 2026', 'La clave está en el balance'];
    var t = doc.createElement('div'); t.className = 'ticker'; t.setAttribute('aria-hidden', 'true');
    var track = doc.createElement('div'); track.className = 'ticker-track';
    for (var r = 0; r < 4; r++) words.forEach(function (w) {
      var s = doc.createElement('span'); s.textContent = w; track.appendChild(s);
      var d = doc.createElement('span'); d.className = 'dot'; d.textContent = '✱'; track.appendChild(d);
    });
    t.appendChild(track);
    head.parentNode.insertBefore(t, head.nextSibling);
  }

  /* ---------- Láminas: las formas saltan en cascada al entrar en pantalla ----------
     El contenido ya es visible por defecto; la clase .in solo dispara la animación.
     (El revelado del resto de tiles lo hace CSS con animation-timeline: view().) */
  function setupReveal() {
    $$('figure.diag svg').forEach(function (svg) {
      var k = 0;
      Array.prototype.slice.call(svg.children).forEach(function (c) {
        if (c.tagName.toLowerCase() === 'defs') return;
        c.style.setProperty('--i', Math.min(k++, 40));
      });
    });
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target); en.target.classList.add('in');
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    $$('figure.diag').forEach(function (f) { io.observe(f); });
  }

  /* ---------- Resaltado de la sección activa en el TOC ---------- */
  function setupNavSpy() {
    var links = $$('nav.toc a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) map[t.id] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('on'); });
          map[en.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { io.observe($('#' + id)); });
  }

  /* ---------- Contadores ---------- */
  function countUps() {
    var els = $$('[data-count]');
    if (!els.length) return;
    function run(el) {
      var to = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = to + suf; return; }
      var t0 = performance.now(), dur = 1300;
      (function step(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); run(x.target); } });
    }, { threshold: .4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Inclinación 3D y parallax con el puntero ---------- */
  function tilt() {
    if (reduce || !window.matchMedia('(hover:hover)').matches) return;
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
        el.style.setProperty('--gx', ((x + .5) * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', ((y + .5) * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
    var layers = $$('[data-depth]');
    if (layers.length) {
      window.addEventListener('pointermove', function (e) {
        var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute('data-depth')) || 10;
          l.style.setProperty('--px', (x * d).toFixed(1) + 'px'); l.style.setProperty('--py', (y * d).toFixed(1) + 'px');
        });
      }, { passive: true });
    }
  }

  /* ---------- Sensación de la autoevaluación ---------- */
  function burst(btn) {
    if (reduce || !btn.animate) return;
    var r = btn.getBoundingClientRect(), cx = r.left + 24, cy = r.top + r.height / 2;
    var cols = ['#FFD60A', '#FF5C3D', '#6C8BFF', '#2FD68F', '#B79DFF'];
    for (var i = 0; i < 16; i++) {
      var c = doc.createElement('i'); c.className = 'confetti';
      c.style.background = cols[i % cols.length]; c.style.left = cx + 'px'; c.style.top = cy + 'px';
      doc.body.appendChild(c);
      var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
      var an = c.animate([
        { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d - 30) + 'px) rotate(' + (Math.random() * 540 - 270) + 'deg) scale(1)', opacity: 1, offset: .65 },
        { transform: 'translate(' + Math.cos(a) * d * 1.1 + 'px,' + (Math.sin(a) * d + 70) + 'px) rotate(' + (Math.random() * 720 - 360) + 'deg) scale(.4)', opacity: 0 }
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' });
      an.onfinish = (function (n) { return function () { n.remove(); }; })(c);
    }
  }
  function quizFeel() {
    doc.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.opt');
      if (!b) return;
      setTimeout(function () { if (b.classList.contains('good')) burst(b); }, 40);
    });
    if (reduce || !window.MutationObserver) return;
    var mo = new MutationObserver(function (list) {
      var seen = [];
      list.forEach(function (m) {
        var el = m.target.nodeType === 3 ? m.target.parentNode : m.target;
        var s = el && el.closest && el.closest('.score');
        if (s && seen.indexOf(s) < 0) {
          seen.push(s); s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
        }
      });
    });
    $$('.score').forEach(function (s) { mo.observe(s, { childList: true, characterData: true, subtree: true }); });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
