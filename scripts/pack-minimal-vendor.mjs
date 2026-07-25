import fs from 'fs';
import path from 'path';

// List of essential runtime packages required by OpenClaw gateway
const essentialDeps = new Set([
  'tslog', 'json5', 'ws', 'zod', 'dotenv', 'telegraf', 'undici', 'kysely',
  'express', 'grammy', 'chokidar', 'chalk', 'commander', 'croner', 'entities',
  'execa', 'file-type', 'iconv-lite', 'jszip', 'minimatch', 'ms', 'pino', 'qs',
  'semver', 'yaml', '@grammyjs', '@noble', '@sinclair', '@openclaw'
]);

const nodeModulesDir = path.join(process.cwd(), 'node_modules');

if (fs.existsSync(nodeModulesDir)) {
  const entries = fs.readdirSync(nodeModulesDir);
  for (const entry of entries) {
    if (entry.startsWith('.')) {
      // Remove .bin, .pnpm, etc.
      fs.rmSync(path.join(nodeModulesDir, entry), { recursive: true, force: true });
      console.log('Removed hidden dir:', entry);
      continue;
    }
    if (entry.startsWith('@')) {
      const scopeDir = path.join(nodeModulesDir, entry);
      const subEntries = fs.readdirSync(scopeDir);
      for (const sub of subEntries) {
        const fullPkgName = `${entry}/${sub}`;
        if (!essentialDeps.has(entry) && !essentialDeps.has(fullPkgName)) {
          fs.rmSync(path.join(scopeDir, sub), { recursive: true, force: true });
          console.log('Removed scope package:', fullPkgName);
        }
      }
    } else {
      if (!essentialDeps.has(entry)) {
        fs.rmSync(path.join(nodeModulesDir, entry), { recursive: true, force: true });
        console.log('Removed package:', entry);
      }
    }
  }
}

console.log("Minimal vendor cleanup complete!");
