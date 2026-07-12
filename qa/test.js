const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('vird-i-yar.html', 'utf8');

// simple in-memory localStorage polyfill (jsdom's localStorage requires "url" resource loader / storageQuota)
class MemoryStorage {
  constructor(){ this.store = {}; }
  getItem(k){ return Object.prototype.hasOwnProperty.call(this.store,k) ? this.store[k] : null; }
  setItem(k,v){ this.store[k]=String(v); }
  removeItem(k){ delete this.store[k]; }
  clear(){ this.store={}; }
}

const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'https://example.com/vird-i-yar.html',
  pretendToBeVisual: true,
  beforeParse(window){
    window.localStorage = new MemoryStorage();
    window.navigator.vibrate = () => {};
    window.onerror = (msg, src, line, col, err) => {
      errors.push(`${msg} @${line}:${col}`);
    };
  }
});

// wait for scripts (module is synchronous, no async needed, but fonts fetch might error - ignore)
setTimeout(()=>{
  const w = dom.window;
  const d = w.document;
  console.log('--- JS runtime errors during load ---');
  console.log(errors.length ? errors : 'none');

  console.log('\n--- Basic render checks ---');
  console.log('esmaList children:', d.getElementById('esmaList').children.length, '(expect 99)');
  console.log('ayetList children:', d.getElementById('ayetList').children.length, '(expect 20)');
  console.log('duaList children:', d.getElementById('duaList').children.length, '(expect 8)');
  console.log('tesbihList children:', d.getElementById('tesbihList').children.length, '(expect 13)');
  console.log('heroTitle text:', d.getElementById('heroTitle').textContent);

  console.log('\n--- View switching ---');
  w.switchView('esma');
  console.log('esma view active:', d.getElementById('esma').classList.contains('active'));
  console.log('home view active (should be false):', d.getElementById('home').classList.contains('active'));

  console.log('\n--- Favorites toggle ---');
  const fakeEvent = { stopPropagation: ()=>{} };
  w.toggleFavorite(fakeEvent, 'esma-1');
  console.log('favorites after add:', w.favorites);
  console.log('localStorage saved:', w.localStorage.getItem('virdiyarFavorites'));
  w.switchView('favori');
  console.log('favList children after 1 fav:', d.getElementById('favList').children.length);
  w.toggleFavorite(fakeEvent, 'esma-1');
  console.log('favorites after remove:', w.favorites);

  console.log('\n--- Simple counter (esma, target=ebced) test with esma-17 (Vehhab, ebced 14) ---');
  w.startCounter('esma-17');
  for (let i=0;i<14;i++) w.incrementCounter();
  console.log('countNumber after 14 clicks (should show 0, i.e. wrapped):', d.getElementById('countNumber').textContent);
  console.log('turBadge (should show 1 tur):', d.getElementById('turBadge').textContent);
  w.incrementCounter();
  console.log('countNumber after 15th click (should be 1):', d.getElementById('countNumber').textContent);

  console.log('\n--- decrementCounter floor at 0 ---');
  w.resetCounter();
  w.decrementCounter();
  console.log('count after decrement below 0 (should be 0):', w.count);

  console.log('\n--- Staged counter test (tesbih-1: 33+33+33+1 tehlil) ---');
  w.startCounter('tesbih-1');
  for (let i=0;i<33;i++) w.incrementCounter(); // finish Sübhanallah stage
  console.log('after 33 clicks, stageIndex (expect 1):', w.stageIndex, 'count (expect 0):', w.count);
  for (let i=0;i<33;i++) w.incrementCounter(); // Elhamdulillah
  for (let i=0;i<33;i++) w.incrementCounter(); // Allahu ekber
  console.log('after 99 clicks total, stageIndex (expect 3):', w.stageIndex);
  w.incrementCounter(); // tehlil (target 1)
  console.log('after tehlil click, stageIndex (expect 4 = done):', w.stageIndex);
  console.log('sheetContent shows done message:', d.getElementById('sheetContent').innerHTML.includes('tamamlandı'));

  console.log('\n--- localStorage persistence across a fresh loadCounter call ---');
  w.resetCounter();
  w.incrementCounter();
  w.incrementCounter();
  const saved = w.localStorage.getItem('counter-tesbih-1');
  console.log('saved counter state:', saved);

  console.log('\n--- Search functionality ---');
  const inputEvent = new w.Event('input', {bubbles:true});
  const searchInput = d.getElementById('globalSearch');
  searchInput.value = 'rahman';
  searchInput.dispatchEvent(inputEvent);
  console.log('search results count text:', d.getElementById('searchCount').textContent);
  console.log('search view active:', d.getElementById('search').classList.contains('active'));

  console.log('\n--- Theme toggle ---');
  console.log('initial theme attr:', d.body.dataset.theme);
  d.getElementById('themeBtn').click();
  console.log('after toggle theme attr:', d.body.dataset.theme);
  console.log('localStorage theme:', w.localStorage.getItem('virdiyarTheme'));

  console.log('\n--- Errors collected overall ---');
  console.log(errors);

}, 500);
