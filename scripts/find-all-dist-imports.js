import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const imports = new Set();

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.matchAll(/(?:import|require)\s*\(?['"]([^'"]+)['"]/g);
      for (const m of matches) {
        const imp = m[1];
        if (!imp.startsWith('.') && !imp.startsWith('/') && !imp.startsWith('node:')) {
          // Extract top-level module name or scoped module name
          const parts = imp.split('/');
          const pkgName = imp.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
          imports.add(pkgName);
        }
      }
    }
  }
}

scan(distDir);
console.log("Found", imports.size, "external runtime imports in dist/:");
console.log(Array.from(imports).sort());
