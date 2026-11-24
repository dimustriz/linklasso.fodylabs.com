// Vendored from rent.fodylabs.com/shared/ui/menu.ts — keep in sync with the original; don't edit here.
// shared/ui/menu.ts — header hamburger menu (vanilla, no deps), shared by the
// *.rent.wf services. A worker interpolates MENU_CSS into its <style> and
// MENU_JS into its <script>, then calls initMenu('<root id>').
// Depends on the host page's CSS variables (--ink, --muted, --line, --bg, --card).
//
// Markup:
//   <div class="menu" id="menuRoot">
//     <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false">☰</button>
//     <div class="menu-panel">
//       <div class="m-item"><span class="m-ico">🌐</span><select class="m-select">…</select></div>
//       <button class="m-item" type="button"><span class="m-ico">🌙</span>Dark theme</button>
//       <div class="m-sep"></div>
//       <a class="m-item" href="…"><span class="m-ico">✅</span>Link</a>
//       <div id="menuServices"></div>   ← filled by menuServicesHtml('<current id>')
//     </div>
//   </div>

export const MENU_CSS = `
.menu{position:relative}
.menu-btn{width:40px;height:40px;border:1px solid var(--line);background:var(--card,#fff);border-radius:11px;font-size:18px;cursor:pointer;color:var(--ink);display:inline-flex;align-items:center;justify-content:center}
.menu-panel{position:absolute;right:0;top:calc(100% + 8px);background:var(--card,#fff);border:1px solid var(--line);border-radius:14px;box-shadow:0 16px 40px rgba(16,24,40,.18);min-width:min(236px, calc(100vw - 48px));max-width:calc(100vw - 48px);max-height:calc(100vh - 90px);max-height:calc(100dvh - 90px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding:8px;z-index:40;display:none}
.menu.open .menu-panel{display:block}
.m-user{padding:10px 12px;font-size:14px;font-weight:700;color:var(--ink)}
.m-user .sub{font-weight:500;color:var(--muted);font-size:12px;margin-top:2px}
.m-label{padding:8px 12px 2px;font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
.m-sep{height:1px;background:var(--line);margin:6px 4px}
.m-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;border:0;background:transparent;border-radius:9px;cursor:pointer;font-size:14px;font-weight:600;color:var(--ink);text-align:left;font-family:inherit;text-decoration:none;box-sizing:border-box}
.m-item:hover{background:var(--bg)}
.m-ico{font-size:16px;width:20px;text-align:center;flex:0 0 auto}
.m-select{flex:1;padding:7px 8px;border:1px solid var(--line);border-radius:9px;font-size:14px;background:var(--card,#fff);color:var(--ink);font-family:inherit}`;

export const MENU_JS = `
function initMenu(id){
  var root = document.getElementById(id); if(!root) return;
  var btn = root.querySelector('.menu-btn');
  btn.addEventListener('click', function(e){ e.stopPropagation(); var open = root.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  document.addEventListener('click', function(e){ if(!root.contains(e.target)) closeMenu(id); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(id); });
  root.querySelector('.menu-panel').addEventListener('click', function(e){ if(e.target.closest && e.target.closest('a.m-item,[data-menu-close]')) closeMenu(id); });
}
function closeMenu(id){
  var root = document.getElementById(id); if(!root) return;
  root.classList.remove('open');
  var btn = root.querySelector('.menu-btn'); if(btn) btn.setAttribute('aria-expanded', 'false');
}
var RENTWF_SERVICES = [
  { id: 'rentwf', href: 'https://rent.wf/', ico: '\\u{1F3DD}\\uFE0F', label: 'rent.wf' },
  { id: 'ask', href: 'https://ask.rent.wf/', ico: '\\u{1F4AC}', label: 'Ask Rent' },
  { id: 'taxi', href: 'https://taxi.rent.wf/', ico: '\\u{1F695}', label: 'Rent Taxi' },
  { id: 'share', href: 'https://share.rent.wf/', ico: '\\u26F5', label: 'Rent Share' },
  { id: 'check', href: 'https://check.rent.wf/', ico: '\\u2705', label: 'Rent Check' }
];
function menuServicesHtml(current){
  return RENTWF_SERVICES.filter(function(s){ return s.id !== current; }).map(function(s){
    return '<a class="m-item" href="' + s.href + '"><span class="m-ico">' + s.ico + '</span>' + s.label + '</a>';
  }).join('');
}
// Theme shared across *.rent.wf: the same domain cookie Ask Rent writes ('system' | 'dark' | 'light').
function readSharedTheme(){
  var t = '';
  try { var m = document.cookie.match(/(?:^|;\\s*)ask_theme=([^;]*)/); if(m) t = m[1]; } catch(e){}
  if(t !== 'dark' && t !== 'light') t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  return t;
}
function writeSharedTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  var host = location.hostname, d = /(^|\\.)rent\\.wf$/.test(host) ? 'rent.wf' : '';
  try { document.cookie = 'ask_theme=' + t + '; max-age=31536000; path=/; SameSite=Lax' + (d ? '; domain=.' + d : ''); } catch(e){}
}`;
