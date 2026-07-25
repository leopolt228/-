import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const srcNodeModules = 'C:\\OpenClaw\\node_modules';
const destNodeModules = path.join(process.cwd(), 'node_modules');

let count = 0;
while (count < 50) {
  count++;
  try {
    const output = execSync('node openclaw.mjs --version', {
      env: { ...process.env, OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH: '1' },
      encoding: 'utf8',
      stderrToStdout: true,
    });
    console.log("Success! Version output:", output.trim());
    break;
  } catch (err) {
    const out = err.stdout || err.message || '';
    console.log("Iteration", count, out.trim().split('\n')[0]);
    const match = out.match(/Cannot find package '([^']+)'/) || out.match(/Cannot find module '([^']+)'/);
    if (match) {
      const pkg = match[1];
      const src = path.join(srcNodeModules, pkg);
      const dest = path.join(destNodeModules, pkg);
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(src, dest, { recursive: true, force: true });
        console.log(`Auto-copied missing dependency: ${pkg}`);
      } else {
        console.error(`Could not find ${pkg} in ${srcNodeModules}`);
        break;
      }
    } else {
      console.log("Full error output:", out);
      break;
    }
  }
}
