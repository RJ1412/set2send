const fs = require('fs');
const path = require('path');

const DIRECTORY = path.join(__dirname, 'src', 'app');

const REPLACEMENTS = [
  { regex: /bg-\[#030303\]/g, replacement: 'bg-[#FAF9F6]' },
  { regex: /bg-\[#0A0E1A\]/g, replacement: 'bg-[#FAF9F6]' },
  { regex: /bg-\[#040406\]/g, replacement: 'bg-[#FAF9F6]' },
  { regex: /bg-\[#09090b\]/g, replacement: 'bg-[#FAF9F6]' },
  { regex: /bg-\[#040404\]/g, replacement: 'bg-[#FAF9F6]' },
  
  { regex: /text-zinc-100/g, replacement: 'text-[#1A1A1A]' },
  { regex: /text-zinc-150/g, replacement: 'text-[#1A1A1A]' },
  { regex: /text-zinc-400/g, replacement: 'text-gray-500' },
  { regex: /text-zinc-300/g, replacement: 'text-gray-600' },
  { regex: /text-zinc-500/g, replacement: 'text-gray-400' },
  
  { regex: /bg-zinc-900/g, replacement: 'bg-white' },
  { regex: /bg-zinc-800/g, replacement: 'bg-gray-100' },
  { regex: /bg-zinc-950/g, replacement: 'bg-gray-50' },
  
  { regex: /border-zinc-900/g, replacement: 'border-[#E8E4D9]' },
  { regex: /border-zinc-800/g, replacement: 'border-gray-200' },
  { regex: /border-zinc-700/g, replacement: 'border-gray-300' },
  
  { regex: /from-\[#120B24\]/g, replacement: 'from-gray-50' },
  { regex: /via-\[#090E26\]/g, replacement: 'via-gray-100' },
  { regex: /to-\[#1C081A\]/g, replacement: 'to-gray-50' },
  { regex: /from-\[#1a1a1a\]/g, replacement: 'from-gray-100' },
  { regex: /to-\[#0a0a0a\]/g, replacement: 'to-gray-50' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.tsx')) {
      // Exclude main layout and dashboard page/layout which have explicit styles
      if (filePath.endsWith('app\\dashboard\\page.tsx') || filePath.endsWith('app\\dashboard\\layout.tsx') || filePath.endsWith('app\\layout.tsx')) {
         continue;
      }
      
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Don't replace `text-white` globally, it destroys specific buttons and text. I'll just change the main backgrounds and text-zincs.
      for (const rule of REPLACEMENTS) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      if (original !== content) {
        console.log('Updated: ' + filePath);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }
}

processDirectory(DIRECTORY);
console.log('Theme swap completed!');
