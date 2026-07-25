import fs from 'fs';
import path from 'path';

const srcOpenclawDir = 'C:\\OpenClaw\\node_modules\\@openclaw';
const destOpenclawDir = path.join(process.cwd(), 'node_modules', '@openclaw');

if (fs.existsSync(srcOpenclawDir)) {
  fs.mkdirSync(destOpenclawDir, { recursive: true });
  const pkgs = fs.readdirSync(srcOpenclawDir);
  for (const pkg of pkgs) {
    const pkgSrc = path.join(srcOpenclawDir, pkg);
    let realSrc = pkgSrc;
    try {
      if (fs.lstatSync(pkgSrc).isSymbolicLink()) {
        realSrc = fs.realpathSync(pkgSrc);
      }
    } catch {}
    const pkgDest = path.join(destOpenclawDir, pkg);
    if (fs.existsSync(realSrc)) {
      fs.rmSync(pkgDest, { recursive: true, force: true });
      fs.cpSync(realSrc, pkgDest, { recursive: true, dereference: true });
      console.log(`Copied @openclaw/${pkg}`);
    }
  }
}

console.log("All @openclaw packages copied cleanly!");
