import fs from 'fs';
import path from 'path';

const vendorPath = path.join(process.cwd(), 'vendor.tgz');
const CHUNK_SIZE = 45 * 1024 * 1024; // 45 MB

// Clean old parts
const dirFiles = fs.readdirSync(process.cwd());
for (const f of dirFiles) {
  if (f.startsWith('vendor.tgz.part')) {
    fs.unlinkSync(path.join(process.cwd(), f));
  }
}

if (!fs.existsSync(vendorPath)) {
  console.error("vendor.tgz not found!");
  process.exit(1);
}

const buffer = fs.readFileSync(vendorPath);
const totalParts = Math.ceil(buffer.length / CHUNK_SIZE);
console.log(`Splitting ${buffer.length} bytes into ${totalParts} parts...`);

for (let i = 0; i < totalParts; i++) {
  const start = i * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, buffer.length);
  const partBuf = buffer.subarray(start, end);
  const partNum = String(i + 1).padStart(3, '0');
  const partName = `vendor.tgz.part${partNum}`;
  fs.writeFileSync(path.join(process.cwd(), partName), partBuf);
  console.log(`Created ${partName} (${partBuf.length} bytes)`);
}

// Remove raw vendor.tgz so Git only tracks parts
fs.unlinkSync(vendorPath);
console.log("Splitting complete!");
