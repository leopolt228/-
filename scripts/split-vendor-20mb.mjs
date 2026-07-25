import fs from 'fs';

const buf = fs.readFileSync('vendor.tgz');
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB
const chunks = Math.ceil(buf.length / CHUNK_SIZE);
console.log('Splitting vendor.tgz into', chunks, 'chunks of 20MB...');
for (let i = 0; i < chunks; i++) {
  const slice = buf.subarray(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, buf.length));
  const name = `vendor.tgz.part${String(i + 1).padStart(3, '0')}`;
  fs.writeFileSync(name, slice);
  console.log('Wrote', name, (slice.length / 1024 / 1024).toFixed(2), 'MB');
}
