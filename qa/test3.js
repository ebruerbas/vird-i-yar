const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('vird-i-yar-fixed.html', 'utf8');
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
    window.onerror = (msg,src,line,col,err)=>{ errors.push(`${msg} @${line}:${col}`); };
  }
});
setTimeout(()=>{
  const w = dom.window, d = w.document;
  console.log('Runtime errors:', errors.length ? errors : 'none');

  function search(q){
    const inputEvent = new w.Event('input', {bubbles:true});
    const el = d.getElementById('globalSearch');
    el.value = q;
    el.dispatchEvent(inputEvent);
    return d.getElementById('searchCount').textContent;
  }
  console.log('\n--- Search fixes ---');
  console.log('istiğfar (plain typed):', search('istiğfar'), '(expect 4, same as İstiğfar)');
  console.log('İstiğfar (capital İ):', search('İstiğfar'), '(expect 4)');
  console.log('rahman (no circumflex):', search('rahman'), '(expect 4, same as rahmân)');
  console.log('rahmân (with circumflex):', search('rahmân'), '(expect 4)');
  console.log('IZZET (all caps, dotless I):', search('IZZET'));
  console.log('izzet:', search('izzet'));

  console.log('\n--- Target fixes for previously-undefined items ---');
  function checkTarget(id, expected){
    w.startCounter(id);
    const html2 = d.getElementById('sheetContent').innerHTML;
    const m = html2.match(/Hedef:\s*(\d+)/);
    console.log(id, '-> displayed hedef:', m ? m[1] : 'N/A', '(expect '+expected+')');
  }
  checkTarget('ayet-1', 1);
  checkTarget('ayet-2', 1);
  checkTarget('ayet-3', 3);
  checkTarget('dua-1', 1);
  checkTarget('dua-8', 1);

  console.log('\n--- target:1 completion toast now fires ---');
  w.startCounter('ayet-1'); // target 1
  w.incrementCounter();
  console.log('toast text after 1 click on target:1 item:', d.getElementById('toast').textContent);

  console.log('\n--- regression: staged tesbihat still works ---');
  w.startCounter('tesbih-1');
  for (let i=0;i<33;i++) w.incrementCounter();
  const sc = d.getElementById('sheetContent').innerHTML;
  console.log('after 33 clicks shows Elhamdülillah stage:', sc.includes('Elhamdülillah'));

  console.log('\n--- regression: normal esma counter (ebced target) ---');
  w.startCounter('esma-17'); // Vehhab ebced 14
  for (let i=0;i<14;i++) w.incrementCounter();
  console.log('countNumber after 14 clicks on ebced-14 item (expect 0):', d.getElementById('countNumber').textContent);

}, 500);
