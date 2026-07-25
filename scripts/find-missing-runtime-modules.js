import fs from 'fs';
import path from 'path';

const openclawModulesDir = 'C:\\OpenClaw\\node_modules';
const deployModulesDir = path.join(process.cwd(), 'node_modules');

async function testImport() {
  const missing = new Set();
  let hasErrors = true;

  while (hasErrors) {
    hasErrors = false;
    try {
      // Clear cache and try importing dist/entry.js
      await import(`../dist/entry.js?update=${Date.now()}`);
    } catch (err) {
      const msg = err.message || String(err);
      console.log("Error caught:", msg);
      const match = msg.match(/Cannot find package '([^']+)'/) || msg.match(/Cannot find module '([^']+)'/);
      if (match) {
        const pkgName = match[1];
        if (!missing.has(pkgName)) {
          missing.add(pkgName);
          console.log(`Copying missing package: ${pkgName}`);
          copyPkg(pkgName);
          hasErrors = true;
        }
      }
    }
  }

  console.log("All missing modules resolved!");
}

function copyPkg(pkgName) {
  const src = path.join(openclawModulesDir, pkgName);
  const dest = path.join(deployModulesDir, pkgName);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${pkgName}`);
  } else {
    console.warn(`Warning: source package ${pkgName} not found in ${openclawModulesDir}`);
  }
}

testImport();
