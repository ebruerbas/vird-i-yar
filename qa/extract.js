const fs = require('fs');
const html = fs.readFileSync('vird-i-yar-fixed.html', 'utf8');
const startMarker = 'const data = [';
const start = html.indexOf(startMarker);
if (start === -1) { console.error('data array not found'); process.exit(1); }
// find matching closing bracket by tracking bracket depth from the '[' after startMarker
let i = start + startMarker.length - 1; // position of '['
let depth = 0;
let end = -1;
for (; i < html.length; i++) {
  const ch = html[i];
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end === -1) { console.error('no matching bracket'); process.exit(1); }
const arrText = html.slice(start + startMarker.length - 1, end + 1);
fs.writeFileSync('data.json.js', 'module.exports = ' + arrText + ';');
console.log('extracted length', arrText.length);
