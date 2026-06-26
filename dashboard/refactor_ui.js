const fs = require('fs');
const path = require('path');

const files = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/layout.tsx'
];

const replacements = [
  { search: /bg-\[#0f172a\]/g, replace: 'bg-[#0D1224]' },
  { search: /text-\[#94a3b8\]/g, replace: 'text-[#8892A6]' },
  { search: /text-\[#64748b\]/g, replace: 'text-[#8892A6]' },
  { search: /border-\[#1e293b\]/g, replace: 'border-white/10' },
  { search: /border-\[#334155\]/g, replace: 'border-white/10' },
  { search: /text-\[#e2e8f0\]/g, replace: 'text-[#E6EDF7]' },
  { search: /text-\[#cbd5e1\]/g, replace: 'text-[#E6EDF7]' },
  { search: /rounded-xl/g, replace: 'rounded-2xl shadow-sm' },
  { search: /rounded-lg/g, replace: 'rounded-xl' }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(r => {
      content = content.replace(r.search, r.replace);
    });
    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
  }
});
