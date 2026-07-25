import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const srcNodeModules = 'C:\\OpenClaw\\node_modules';
const destNodeModules = path.join(process.cwd(), 'node_modules');

async function testRun() {
  for (let i = 0; i < 30; i++) {
    const res = await new Promise((resolve) => {
      const child = spawn('node', ['openclaw.mjs', 'gateway', 'run', '--help'], {
        env: {
          ...process.env,
          OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH: '1',
          TELEGRAM_BOT_TOKEN: '8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw',
          GEMINI_API_KEY: 'AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI',
          GOOGLE_API_KEY: 'AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI',
          ALLOW_FROM: '8146735349'
        }
      });

      let out = '';
      child.stdout.on('data', (d) => out += d);
      child.stderr.on('data', (d) => out += d);
      child.on('close', (code) => resolve({ code, out }));
    });

    if (res.out.includes("Cannot find package") || res.out.includes("Cannot find module")) {
      const match = res.out.match(/Cannot find package '([^']+)'/) || res.out.match(/Cannot find module '([^']+)'/);
      if (match) {
        const pkg = match[1];
        const src = path.join(srcNodeModules, pkg);
        const dest = path.join(destNodeModules, pkg);
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.cpSync(src, dest, { recursive: true, force: true });
          console.log(`Auto-copied missing dependency: ${pkg}`);
          continue;
        }
      }
    }

    console.log("Result output:", res.out.slice(0, 300));
    break;
  }
}

testRun();
