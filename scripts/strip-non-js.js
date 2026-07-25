import fs from 'fs';
import path from 'path';

function removeNonJS(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'control-ui' || entry.name === 'qa-lab') {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log('Removed directory:', entry.name);
      } else {
        removeNonJS(fullPath);
      }
    } else {
      if (entry.name.endsWith('.d.ts') || entry.name.endsWith('.map') || entry.name.endsWith('.ts')) {
        try { fs.unlinkSync(fullPath); } catch {}
      }
    }
  }
}

console.log("Stripping non-runtime .d.ts, .map, and web assets...");
removeNonJS(path.join(process.cwd(), 'dist'));
console.log("Cleanup complete!");
