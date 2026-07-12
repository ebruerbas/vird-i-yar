const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('vird-i-yar.html', 'utf8');
class MemoryStorage {
  constructor(){ this.store = {}; }
  getItem(k){ return Object.prototype.hasOwnProperty.call(this.store,k) ? this.store[k] : null; }
  setItem(k,v){ this.store[k]=String(v); }
  removeItem(k){ delete this.store[k]; }
}
const dom = new JSDOM(html, {
  runScripts: 'dangerously', resources: 'usable', url: 'https://example.com/x.html', pretendToBeVisual:true,
  beforeParse(window){ window.localStorage = new MemoryStorage(); window.navigator.vibrate=()=>{}; }
});
setTimeout(()=>{
  const w = dom.window, d = w.document;
  function search(q){
    const inputEvent = new w.Event('input', {bubbles:true});
    const el = d.getElementById('globalSearch');
    el.value = q;
    el.dispatchEvent(inputEvent);
    return d.getElementById('searchCount').textContent;
  }
  console.log('search \"istiğfar\" (plain dotless i, as typed on keyboard):', search('istiğfar'));
  console.log('search \"İstiğfar\" (capital dotted I, copy-pasted):', search('İstiğfar'));
  console.log('search \"rahman\" (no circumflex):', search('rahman'));
  console.log('search \"rahmân\" (with circumflex, exact):', search('rahmân'));
  console.log('search \"rızık\":', search('rızık'));
  console.log('search \"Rızık\" (capital R):', search('Rızık'));
  console.log('search \"koruma\":', search('koruma'));
}, 400);
