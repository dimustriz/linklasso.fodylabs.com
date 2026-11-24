// Vendored from rent.fodylabs.com/shared/ui/autohide.ts — keep in sync with the original; don't edit here.
// shared/ui/autohide.ts — hide the sticky header / fixed bottom bar while scrolling
// down and reveal them on scroll up (vanilla, no deps), shared by the *.rent.wf
// services. Small screens only: narrow (≤860px) or short (≤500px, i.e. phones in
// landscape); on desktop the bars stay put. The bottom bar also reappears at the
// end of the page. A worker interpolates AUTOHIDE_CSS / AUTOHIDE_JS and calls
// initAutoHide(headerEl, bottomBarEl); showChrome() reveals both (e.g. after a
// view change). Overlay designs (bar over a hero image, e.g. Car/Yacht): put
// data-ah-overlay on the top bar — it is fully clear at scroll 0.

export const AUTOHIDE_CSS = `
.ah-top,.ah-bottom{transition:transform .28s ease,background-color .28s ease;will-change:transform}
.ah-top.ah-hidden{transform:translateY(-100%)}
.ah-bottom.ah-hidden{transform:translateY(100%)}
/* --ah-solid: the bar's opaque colour (per service / theme); defaults to --card */
@media (max-width:860px),(max-height:500px){
.ah-top,.ah-bottom{background:color-mix(in srgb,var(--ah-solid,var(--card,#fff)) 72%,transparent)!important;-webkit-backdrop-filter:saturate(180%) blur(14px);backdrop-filter:saturate(180%) blur(14px)}
}
@media (prefers-reduced-motion:reduce){.ah-top,.ah-bottom{transition:none}}
/* overlay mode (data-ah-overlay on the top bar): fully clear over the hero at the very top, any screen size */
.ah-top.ah-clear{background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;border-color:transparent!important;box-shadow:none!important}
`;

export const AUTOHIDE_JS = `
var __ah = { top: null, bottom: null };
function showChrome(){
  if (__ah.top) __ah.top.classList.remove('ah-hidden');
  if (__ah.bottom) __ah.bottom.classList.remove('ah-hidden');
}
function initAutoHide(top, bottom){
  __ah.top = top || null; __ah.bottom = bottom || null;
  if (top) top.classList.add('ah-top');
  if (bottom) bottom.classList.add('ah-bottom');
  var small = window.matchMedia('(max-width: 860px), (max-height: 500px)');
  var lastY = window.scrollY, ticking = false;
  var overlay = !!(top && top.hasAttribute('data-ah-overlay'));
  function syncClear(){ if (overlay) top.classList.toggle('ah-clear', window.scrollY <= 8 && !document.querySelector('.menu.open')); }
  function update(){
    ticking = false;
    syncClear();
    var y = window.scrollY, delta = y - lastY;
    if (Math.abs(delta) < 4) return;
    lastY = y;
    // an open menu lives inside the bar — hiding the bar would take the menu with it
    if (document.querySelector('.menu.open')) { showChrome(); return; }
    if (!small.matches || y < (top ? top.offsetHeight : 0) + 8) { showChrome(); return; }
    var down = delta > 0;
    if (top) top.classList.toggle('ah-hidden', down);
    if (bottom) {
      var atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 24;
      bottom.classList.toggle('ah-hidden', down && !atEnd);
    }
  }
  window.addEventListener('scroll', function(){ if (ticking) return; ticking = true; window.requestAnimationFrame(update); }, { passive: true });
  var reset = function(){ lastY = window.scrollY; showChrome(); };
  if (small.addEventListener) small.addEventListener('change', reset); else small.addListener(reset);
  if (overlay) { syncClear(); document.addEventListener('click', function(){ window.requestAnimationFrame(syncClear); }, true); }
}
`;
