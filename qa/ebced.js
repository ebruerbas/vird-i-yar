const data = require('./data.json.js');

const VALUES = {
  '0627':1,  // ا alif
  '0628':2,  // ب
  '062a':400,// ت
  '062b':500,// ث
  '062c':3,  // ج
  '062d':8,  // ح
  '062e':600,// خ
  '062f':4,  // د
  '0630':700,// ذ
  '0631':200,// ر
  '0632':7,  // ز
  '0633':60, // س
  '0634':300,// ش
  '0635':90, // ص
  '0636':800,// ض
  '0637':9,  // ط
  '0638':900,// ظ
  '0639':70, // ع
  '063a':1000,// غ
  '0641':80, // ف
  '0642':100,// ق
  '0643':20, // ك
  '0644':30, // ل
  '0645':40, // م
  '0646':50, // ن
  '0647':5,  // ه
  '0648':6,  // و
  '064a':10, // ي
  '0629':5,  // ة teh marbuta -> ه
  '0649':10, // ى alif maksura -> ي
  '0621':1,  // ء hamza
  '0623':1,  // أ
  '0625':1,  // إ
  '0624':6,  // ؤ (hamza-on-waw counted as waw)
  '0626':10, // ئ (hamza-on-ya counted as ya)
  '0622':1,  // آ (alif madda) -> treat as 1 alif
};

function ebcedOf(str){
  let sum = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0).toString(16).padStart(4,'0');
    if (VALUES[code] !== undefined) sum += VALUES[code];
  }
  return sum;
}

const esmas = data.filter(x=>x.type==='esma');
const mismatches = [];
for (const e of esmas) {
  let text = e.arabic;
  // strip leading definite article (ال) except for Allah itself
  if (e.id !== 'esma-1' && text.startsWith('ال')) {
    text = text.slice(2);
  }
  const computed = ebcedOf(text);
  if (computed !== e.ebced) {
    mismatches.push({id:e.id, title:e.title, arabic:e.arabic, declared:e.ebced, computed});
  }
}
console.log('Total esma checked:', esmas.length);
console.log('Mismatches:', mismatches.length);
console.log(JSON.stringify(mismatches, null, 2));
