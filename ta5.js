// Data
const MOVIES = [
  { id:1, title:'Neon Sky', year:2024, genre:['Sci-Fi','Action'], rating:8.6, pop:982, minutes:124, img:'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?q=80&w=1400&auto=format&fit=crop', desc:'A rogue pilot hunts an AI across a neon-lit megacity.' },
  { id:2, title:'Echoes of Home', year:2022, genre:['Drama'], rating:8.2, pop:610, minutes:109, img:'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop', desc:'A daughter returns to unravel her family\'s past.' },
  { id:3, title:'Laugh Track', year:2023, genre:['Comedy'], rating:7.5, pop:540, minutes:101, img:'https://images.unsplash.com/photo-1523246191575-74f03988a5cd?q=80&w=1400&auto=format&fit=crop', desc:'An improv comic accidentally becomes an overnight star.' },
  { id:4, title:'Crimson Tide', year:2021, genre:['Action','Thriller'], rating:7.9, pop:720, minutes:117, img:'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1400&auto=format&fit=crop', desc:'An agent races to stop a coastal conspiracy.' },
  { id:5, title:'Stargarden', year:2025, genre:['Fantasy','Adventure'], rating:8.9, pop:1100, minutes:131, img:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400&auto=format&fit=crop', desc:'A botanist discovers gateways grown from starlight.' },
  { id:6, title:'Quantum Cafe', year:2024, genre:['Romance','Sci-Fi'], rating:8.1, pop:690, minutes:112, img:'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1400&auto=format&fit=crop', desc:'Two baristas fall in love across parallel timelines.' },
  { id:7, title:'Rift Valley', year:2020, genre:['Documentary'], rating:8.7, pop:430, minutes:95, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop', desc:'Nature\'s grand design filmed over five years.' },
  { id:8, title:'Last Stand-Up', year:2023, genre:['Comedy','Drama'], rating:7.8, pop:580, minutes:106, img:'https://images.unsplash.com/photo-1520033284171-55e91f1114e1?q=80&w=1400&auto=format&fit=crop', desc:'A comic rebuilds life after a viral failure.' },
  { id:9, title:'Night Runner', year:2021, genre:['Action'], rating:7.2, pop:500, minutes:103, img:'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=1400&auto=format&fit=crop', desc:'Courier by day, vigilante by night.' },
  { id:10, title:'Moonlit Letters', year:2022, genre:['Romance'], rating:8.0, pop:560, minutes:108, img:'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1400&auto=format&fit=crop', desc:'Strangers connect via notes left at a pier.' },
  { id:11, title:'Pixel Wars', year:2025, genre:['Animation','Adventure'], rating:8.4, pop:870, minutes:99, img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop', desc:'Game sprites unite to save their world.' },
  { id:12, title:'Deep Signal', year:2024, genre:['Thriller'], rating:7.9, pop:740, minutes:116, img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1400&auto=format&fit=crop', desc:'Divers discover a cold-war secret under ice.' }
];

// State
const state = {
  genre: 'All',
  search: '',
  sort: '',
  view: 'grid',
  watchlist: new Set(JSON.parse(localStorage.getItem('cineflix_wl')||'[]')),
  heroIndex: 0
};

// Elements
const grid = document.getElementById('grid');
const resultCount = document.getElementById('resultCount');
const chipsWrap = document.getElementById('genreChips');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const viewToggle = document.getElementById('viewToggle');
const trendRow = document.getElementById('trendRow');
const wlBtn = document.getElementById('watchlistBtn');
const wlCount = document.getElementById('wlCount');
const wlModal = document.getElementById('wlModal');
const wlItems = document.getElementById('wlItems');
const qvModal = document.getElementById('qvModal');
const qvContent = document.getElementById('qvContent');
const toast = document.getElementById('toast');
const heroBg = document.getElementById('heroBg');
const heroTitle = document.getElementById('heroTitle');
const playFeatured = document.getElementById('playFeatured');

// Utility
const genres = ['All', ...Array.from(new Set(MOVIES.flatMap(m=>m.genre)))];
const fmt = n => new Intl.NumberFormat().format(n);
const saveWL = () => localStorage.setItem('cineflix_wl', JSON.stringify([...state.watchlist]));
const showToast = (msg) => { toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 1600); };

function applyFilters(){
  let list = [...MOVIES];
  if(state.genre !== 'All') list = list.filter(m=>m.genre.includes(state.genre));
  if(state.search){
    const q = state.search.toLowerCase();
    list = list.filter(m => [m.title, m.desc, m.genre.join(' '), String(m.year)].join(' ').toLowerCase().includes(q));
  }
  switch(state.sort){
    case 'pop': list.sort((a,b)=>b.pop-a.pop); break;
    case 'rate': list.sort((a,b)=>b.rating-a.rating); break;
    case 'new': list.sort((a,b)=>b.year-a.year); break;
    case 'az': list.sort((a,b)=>a.title.localeCompare(b.title)); break;
  }
  resultCount.textContent = `${list.length} result${list.length!==1?'s':''}`;
  renderGrid(list);
}

function renderChips(){
  chipsWrap.innerHTML = genres.map(g=>`<button class="chip ${g===state.genre?'active':''}" data-genre="${g}">${g}</button>`).join('');
}

function renderGrid(list){
  grid.innerHTML = list.map(m=>cardHTML(m)).join('');
  document.getElementById('catalog').classList.toggle('list', state.view==='list');
  attachCardEvents();
}

function cardHTML(m){
  const inWL = state.watchlist.has(m.id);
  return `
  <article class="card">
    <div class="poster">
      <img src="${m.img}" alt="${m.title}">
      <div class="badge-corner"><span class="pill">${m.genre[0]}</span><span class="pill">${m.minutes}m</span></div>
    </div>
    <div class="card-body">
      <div class="meta">
        <h4 class="title">${m.title} <span class="small" style="color:var(--muted)">(${m.year})</span></h4>
        <p class="desc">${m.desc}</p>
        <div class="rating">⭐ ${m.rating} · 👁️ ${fmt(m.pop)}</div>
        <div class="actions-row">
          <button class="btn btn-primary small" data-qv="${m.id}">▶ Quick View</button>
          <button class="btn btn-ghost small" data-wl="${m.id}">${inWL?'✓ In Watchlist':'＋ Add Watchlist'}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function attachCardEvents(){
  document.querySelectorAll('[data-wl]').forEach(btn=>btn.onclick = () => {
    const id = +btn.getAttribute('data-wl');
    if(state.watchlist.has(id)) { state.watchlist.delete(id); showToast('Removed from watchlist'); }
    else { state.watchlist.add(id); showToast('Added to watchlist'); }
    wlCount.textContent = state.watchlist.size; saveWL(); applyFilters(); renderWatchlist();
  });
  document.querySelectorAll('[data-qv]').forEach(btn=>btn.onclick = () => openQuickView(+btn.getAttribute('data-qv')));
}

function renderTrending(){
  const top = [...MOVIES].sort((a,b)=>b.pop-a.pop).slice(0,8);
  trendRow.innerHTML = top.map(m=>`<span class="pill pill-trend">🔥 ${m.title}</span>`).join('');
}

function renderWatchlist(){
  const items = [...state.watchlist].map(id=>MOVIES.find(m=>m.id===id)).filter(Boolean);
  wlItems.innerHTML = items.length? items.map(m=>`
    <article class="card">
      <div class="poster"><img src="${m.img}" alt="${m.title}"></div>
      <div class="card-body">
        <div class="meta">
          <h4 class="title">${m.title}</h4>
          <div class="rating">⭐ ${m.rating} · 👁️ ${fmt(m.pop)}</div>
          <div class="actions-row">
            <button class="btn btn-primary small" data-qv="${m.id}">▶ Play</button>
            <button class="btn btn-ghost small" data-wl="${m.id}">✕ Remove</button>
          </div>
        </div>
      </div>
    </article>`).join('') : '<div class="small" style="color:var(--muted)">No items yet. Add from the catalog.</div>';
  attachCardEvents();
}

function openQuickView(id){
  const m = MOVIES.find(x=>x.id===id); if(!m) return;
  qvContent.innerHTML = `
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;align-items:start">
      <div class="poster" style="border-radius:14px;overflow:hidden"><img src="${m.img}" alt="${m.title}"></div>
      <div>
        <h3 style="margin-top:0">${m.title} <span class="small" style="color:var(--muted)">(${m.year})</span></h3>
        <p class="small" style="color:var(--muted)">${m.desc}</p>
        <p class="small">⏱ ${m.minutes} minutes</p>
        <p class="small">Genres: ${m.genre.join(', ')}</p>
        <div class="rating">⭐ ${m.rating} · 👁️ ${fmt(m.pop)}</div>
        <div class="actions-row">
          <button class="btn btn-primary" onclick="alert('Playing trailer…')">▶ Play Trailer</button>
          <button class="btn btn-ghost" data-wl="${m.id}">${state.watchlist.has(m.id)?'✓ In Watchlist':'＋ Add Watchlist'}</button>
        </div>
      </div>
    </div>`;
  qvModal.classList.add('open');
  attachCardEvents();
}

// Hero carousel
function updateHero(){
  const picks = [...MOVIES].sort((a,b)=>{
    return (b.year*3 + b.pop/10 + b.rating*20) - (a.year*3 + a.pop/10 + a.rating*20);
  }).slice(0,5);
  const m = picks[state.heroIndex % picks.length];
  heroBg.style.backgroundImage = `url(${m.img})`;
  heroTitle.textContent = m.title;
  document.getElementById('heroSubtitle').textContent = `${m.genre.join(' · ')} • ${m.year} • ⭐ ${m.rating}`;
  playFeatured.onclick = () => openQuickView(m.id);
  state.heroIndex++;
}

// Events
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('themeBtn').onclick = ()=>{
  const dark = document.documentElement.dataset.theme !== 'light';
  if(dark){ document.documentElement.dataset.theme='light'; document.body.style.background='#f6f8ff'; document.body.style.color='#0b0f19'; }
  else{ document.documentElement.dataset.theme='dark'; document.body.style.background=''; document.body.style.color=''; }
};
document.getElementById('hamburger').onclick = ()=> document.getElementById('nav').classList.toggle('open');

chipsWrap.addEventListener('click', e=>{
  const g = e.target.closest('[data-genre]')?.dataset.genre; if(!g) return; state.genre=g; renderChips(); applyFilters();
});
searchInput.addEventListener('input', e=>{ state.search = e.target.value.trim(); applyFilters(); });
sortSelect.addEventListener('change', e=>{ state.sort = e.target.value; applyFilters(); });
viewToggle.querySelectorAll('button').forEach(b=> b.onclick = ()=>{
  viewToggle.querySelectorAll('button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.view = b.dataset.view; applyFilters();
});

wlBtn.onclick = ()=>{ renderWatchlist(); wlModal.classList.add('open'); };
document.body.addEventListener('click', e=>{
  const closeSel = e.target.getAttribute('data-close');
  if(closeSel){ document.querySelector(closeSel).classList.remove('open'); }
});

// Init
(function init(){
  updateHero(); setInterval(updateHero, 4000);
  renderChips();
  renderTrending();
  applyFilters();
  wlCount.textContent = state.watchlist.size;
})();
