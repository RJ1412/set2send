const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('d:/project/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('mode="wait"') || content.includes('mode="popLayout"')) {
    const updated = content
      .replace(/<AnimatePresence\s+mode="wait">/g, '<AnimatePresence>')
      .replace(/<AnimatePresence\s+mode="popLayout">/g, '<AnimatePresence>');
    if (updated !== content) {
      fs.writeFileSync(f, updated);
      console.log('Fixed:', f);
    }
  }
});
