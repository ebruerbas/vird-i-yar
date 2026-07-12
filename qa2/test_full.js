const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('vird-i-yar.html', 'utf8');
class MemoryStorage {
  constructor(){ this.store = {}; }
  getItem(k){ return Object.prototype.hasOwnProperty.call(this.store,k) ? this.store[k] : null; }
  setItem(k,v){ this.store[k]=String(v); }
  removeItem(k){ delete this.store[k]; }
}
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously', resources: 'usable', url: 'https://example.com/x.html', pretendToBeVisual:true,
  beforeParse(window){
    window.localStorage = new MemoryStorage(); window.navigator.vibrate=()=>{};
    window.onerror = (msg,src,line,col,err)=>{ errors.push(`${msg} @${line}:${col} ${err&&err.stack}`); };
  }
});
setTimeout(()=>{
  const w = dom.window, d = w.document;
  console.log('Runtime errors:', errors.length ? errors : 'none');

  console.log('\n--- Basic render (regression) ---');
  console.log('esmaList:', d.getElementById('esmaList').children.length, '(99)');
  console.log('ayetList:', d.getElementById('ayetList').children.length, '(20)');
  console.log('duaList:', d.getElementById('duaList').children.length, '(8)');
  console.log('tesbihList:', d.getElementById('tesbihList').children.length, '(13)');

  console.log('\n--- Sheet close button present ---');
  console.log('sheet-close exists:', !!d.querySelector('.sheet-close'));

  console.log('\n--- Counter language toggle: simple item (ayet-4 Felak, target 3) ---');
  w.startCounter('ayet-4');
  let sc = d.getElementById('sheetContent').innerHTML;
  console.log('default shows reading (TR), no arabic-big:', sc.includes('class="reading"') && !sc.includes('class="arabic-big"'));
  console.log('lang-toggle present:', sc.includes('lang-toggle'));
  w.setCounterLang('ar');
  sc = d.getElementById('sheetContent').innerHTML;
  console.log('after AR toggle shows arabic-big, no reading:', sc.includes('class="arabic-big"') && !sc.includes('class="reading"'));
  w.setCounterLang('tr');
  sc = d.getElementById('sheetContent').innerHTML;
  console.log('back to TR shows reading again:', sc.includes('class="reading"'));

  console.log('\n--- Counter language toggle: esma without reading field (esma-1 Allah) ---');
  w.startCounter('esma-1');
  sc = d.getElementById('sheetContent').innerHTML;
  console.log('esma TR fallback shows title text "Allah" in reading p:', sc.includes('<p class="reading"') && sc.includes('>Allah<'));

  console.log('\n--- Staged counter (tesbih-1) language toggle ---');
  w.startCounter('tesbih-1');
  sc = d.getElementById('sheetContent').innerHTML;
  console.log('default TR shows stage label text, no arabic-big:', sc.includes('Sübhanallah') && !sc.includes('class="arabic-big"'));
  w.setCounterLang('ar');
  sc = d.getElementById('sheetContent').innerHTML;
  console.log('AR shows arabic-big for stage:', sc.includes('class="arabic-big"'));

  console.log('\n--- target:1 completion toast (ayet-1) ---');
  w.startCounter('ayet-1');
  w.incrementCounter();
  console.log('toast:', d.getElementById('toast').textContent);

  console.log('\n--- New target fields for previously-undefined dua/ayet ---');
  function hedef(id){
    w.startCounter(id);
    const m = d.getElementById('sheetContent').innerHTML.match(/Hedef:\s*(\d+)/);
    return m ? m[1] : 'N/A';
  }
  console.log('ayet-1 hedef (1):', hedef('ayet-1'));
  console.log('ayet-3 hedef (3):', hedef('ayet-3'));
  console.log('dua-1 hedef (1):', hedef('dua-1'));
  console.log('dua-8 hedef (1):', hedef('dua-8'));

  console.log('\n--- Search: no longer instant on keystroke ---');
  const input = d.getElementById('globalSearch');
  const inputEvent = new w.Event('input', {bubbles:true});
  input.value = 'rahman';
  input.dispatchEvent(inputEvent);
  console.log('view after typing only (should still be home, not search):', d.getElementById('home').classList.contains('active'), '/ search active:', d.getElementById('search').classList.contains('active'));
  const enterEvent = new w.KeyboardEvent('keydown', {key:'Enter', bubbles:true});
  input.dispatchEvent(enterEvent);
  console.log('after Enter, search view active:', d.getElementById('search').classList.contains('active'));
  console.log('search count (normalized rahman->rahmân):', d.getElementById('searchCount').textContent);

  console.log('\n--- Search icon button click also triggers search ---');
  input.value = 'istiğfar';
  d.getElementById('searchIconBtn').click();
  console.log('search count for istiğfar (plain):', d.getElementById('searchCount').textContent, '(expect 4)');

  console.log('\n--- Clearing input still returns home instantly ---');
  input.value = '';
  input.dispatchEvent(inputEvent);
  console.log('home active after clearing:', d.getElementById('home').classList.contains('active'));

  console.log('\n--- Data integrity regression ---');
  console.log('total data records:', w.data.length, '(140)');

  console.log('\n--- All runtime errors so far ---');
  console.log(errors.length ? errors : 'none');
}, 500);
