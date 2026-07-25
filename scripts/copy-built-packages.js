import fs from 'fs';
import path from 'path';

const srcPackagesDir = 'C:\\OpenClaw\\packages';
const destPackagesDir = path.join(process.cwd(), 'packages');

if (fs.existsSync(srcPackagesDir)) {
  const pkgs = fs.readdirSync(srcPackagesDir);
  for (const pkg of pkgs) {
    const pkgSrc = path.join(srcPackagesDir, pkg);
    const pkgDest = path.join(destPackagesDir, pkg);
    if (fs.lstatSync(pkgSrc).isDirectory()) {
      fs.mkdirSync(pkgDest, { recursive: true });
      // Copy dist if exists
      const distSrc = path.join(pkgSrc, 'dist');
      if (fs.existsSync(distSrc)) {
        fs.cpSync(distSrc, path.join(pkgDest, 'dist'), { recursive: true });
      }
      // Copy package.json if exists
      const pkgJsonSrc = path.join(pkgSrc, 'package.json');
      if (fs.existsSync(pkgJsonSrc)) {
        fs.copyFileSync(pkgJsonSrc, path.join(pkgDest, 'package.json'));
      }
      console.log(`Copied built package: ${pkg}`);
    }
  }
}

console.log("All built monorepo packages copied!");
