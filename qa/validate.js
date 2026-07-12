const data = require('./data.json.js');
console.log('Total records:', data.length);

const byType = {};
for (const item of data) {
  byType[item.type] = (byType[item.type]||0)+1;
}
console.log('By type:', byType);

// unique ids
const ids = data.map(x=>x.id);
const idSet = new Set(ids);
console.log('Unique ids:', idSet.size, '/', ids.length);
if (idSet.size !== ids.length) {
  const seen = new Set();
  const dupes = [];
  for (const id of ids) {
    if (seen.has(id)) dupes.push(id);
    seen.add(id);
  }
  console.log('DUPLICATE IDS:', dupes);
}

// required fields check
const requiredCommon = ['id','type','title','subtitle','meaning','tag'];
const missing = [];
for (const item of data) {
  for (const f of requiredCommon) {
    if (item[f] === undefined || item[f] === null || item[f] === '') {
      missing.push({id: item.id, field: f});
    }
  }
}
console.log('Missing common fields:', missing.length);
if (missing.length) console.log(missing.slice(0,50));

// esma-specific checks
const esmas = data.filter(x=>x.type==='esma');
console.log('Esma count:', esmas.length);
const esmaMissing = [];
for (const e of esmas) {
  if (!e.arabic) esmaMissing.push({id:e.id, field:'arabic'});
  if (e.ebced === undefined) esmaMissing.push({id:e.id, field:'ebced'});
  if (!e.virtues || e.virtues.length < 2) esmaMissing.push({id:e.id, field:'virtues(<2)'});
  if (!e.verses) esmaMissing.push({id:e.id, field:'verses(undefined)'});
}
console.log('Esma missing/short fields:', esmaMissing.length);
console.log(esmaMissing.slice(0,50));

// esma numbering check (id esma-1..99, sequential)
const esmaIdNums = esmas.map(e=>parseInt(e.id.split('-')[1],10)).sort((a,b)=>a-b);
let seqOk = true;
for (let k=0;k<esmaIdNums.length;k++){ if (esmaIdNums[k] !== k+1) { seqOk=false; console.log('Sequence break at', k, esmaIdNums[k]); } }
console.log('Esma sequential 1..99 ok:', seqOk, 'count', esmaIdNums.length);

// ayet/dua/tesbih counts
console.log('Ayet:', data.filter(x=>x.type==='ayet').length);
console.log('Dua:', data.filter(x=>x.type==='dua').length);
console.log('Tesbih:', data.filter(x=>x.type==='tesbih').length);

// check for ayet/dua items missing target (falls back to default 33 in UI)
const noTarget = data.filter(x=>(x.type==='ayet'||x.type==='dua') && x.target===undefined);
console.log('Ayet/Dua items with NO explicit target (will default to 33x in counter):', noTarget.length);
console.log(noTarget.map(x=>x.id+':'+x.title));

// duplicate titles
const titleCount = {};
for (const item of data) titleCount[item.title] = (titleCount[item.title]||0)+1;
const dupTitles = Object.entries(titleCount).filter(([t,c])=>c>1);
console.log('Duplicate titles:', dupTitles);
