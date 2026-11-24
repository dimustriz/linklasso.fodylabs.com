// Vendored from rent.fodylabs.com/shared/ui/prionav.ts — keep in sync with the original; don't edit here.
// shared/ui/prionav.ts — priority navigation (vanilla, no deps), shared by the
// *.rent.wf services. Top-bar links that don't fit move into the ☰ menu, the
// least important first; they come back when there is room again. Spec and
// usage: docs/shared-ui.md.
//
// Markup:
//   <nav class="pnav" id="nav">
//     <a href="#how" data-priority="1">How it works</a>     ← dropped first
//     <a href="/v" data-priority="5">Verify a report</a>    ← kept longest
//   </nav>
//   …inside the menu panel (see menu.ts):
//   <div class="pnav-overflow" id="navOverflow"></div>
//
// Call initPriorityNav(navEl, overflowEl, opts?) once. Text changes (i18n) and
// size changes are picked up automatically; priorityNavUpdate() forces a pass.
// opts.extra: other bar items outside the nav (e.g. a CTA button) that may also
// move into the menu — they carry data-priority too and usually rank highest.
// opts.bar: the whole top-bar row; it must never overflow, so the ☰ button
// stays reachable at any width.

export const PRIONAV_CSS = `
.pnav{display:flex;align-items:center;gap:var(--pnav-gap,22px);flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap}
.pnav>*{flex:0 0 auto}
.pnav-off{display:none!important}
.pnav-overflow[hidden],.pnav-overflow>[hidden]{display:none}
`;

export const PRIONAV_JS = `
var __pnavUpdaters = [];
function priorityNavUpdate(){ __pnavUpdaters.forEach(function(f){ f(); }); }
function initPriorityNav(nav, overflow, opts){
  if (!nav || !overflow || nav.dataset.pnav) return;
  nav.dataset.pnav = '1';
  opts = opts || {};
  var bar = opts.bar || null;
  var extra = (opts.extra || []).filter(Boolean);
  var items = extra.concat([].slice.call(nav.children));
  var sep = document.createElement('div'); sep.className = 'm-sep';
  var clones = items.map(function(it){
    var c = it.cloneNode(true);
    c.removeAttribute('onclick'); c.removeAttribute('id');
    c.className = 'm-item';
    c.addEventListener('click', function(e){
      e.preventDefault();
      if (typeof closeMenu === 'function') { var m = overflow.closest('.menu'); if (m && m.id) closeMenu(m.id); }
      it.click();
    });
    overflow.appendChild(c);
    return c;
  });
  overflow.appendChild(sep);
  // Drop order: lowest data-priority first; ties drop from the end of the bar.
  var order = items.map(function(it, i){ return { i: i, p: Number(it.getAttribute('data-priority') || 0) }; })
    .sort(function(a, b){ return a.p - b.p || b.i - a.i; }).map(function(x){ return x.i; });
  var busy = false, queued = false;
  function layout(){
    queued = false; busy = true;
    items.forEach(function(it, i){ it.classList.remove('pnav-off'); clones[i].textContent = it.textContent; clones[i].hidden = true; });
    var k = 0;
    while ((nav.scrollWidth > nav.clientWidth + 1 || (bar && bar.scrollWidth > bar.clientWidth + 1)) && k < order.length) {
      var i = order[k++]; items[i].classList.add('pnav-off'); clones[i].hidden = false;
    }
    overflow.hidden = k === 0;
    busy = false;
  }
  function schedule(){ if (busy || queued) return; queued = true; window.requestAnimationFrame(layout); }
  __pnavUpdaters.push(layout);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(nav.parentElement || nav);
  else window.addEventListener('resize', schedule);
  var mo = new MutationObserver(schedule);
  [nav].concat(extra).forEach(function(el){ mo.observe(el, { subtree: true, childList: true, characterData: true }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  layout();
}
`;
