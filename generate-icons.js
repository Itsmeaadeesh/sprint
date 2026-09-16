import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Generate regular 192x192 icon
const svg192 = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#121212"/>
  <rect x="8" y="8" width="176" height="176" fill="none" stroke="#ff3d00" stroke-width="6"/>
  <!-- Bolt Symbol -->
  <path d="M110 32 L58 104 L96 104 L82 160 L134 88 L96 88 Z" fill="#ff3d00"/>
</svg>
`;

// 2. Generate regular 512x512 icon
const svg512 = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#121212"/>
  <rect x="20" y="20" width="472" height="472" fill="none" stroke="#ff3d00" stroke-width="16"/>
  <!-- Bolt Symbol -->
  <path d="M294 85 L155 277 L256 277 L218 427 L357 235 L256 235 Z" fill="#ff3d00"/>
</svg>
`;

// 3. Generate maskable 512x512 icon (with safe zone margin, bolt nicely centered in inner 65%)
const svg512Maskable = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#121212"/>
  <rect x="40" y="40" width="432" height="432" fill="none" stroke="#ff3d00" stroke-width="12"/>
  <!-- Bolt Symbol centered inside safe zone (inner 332px area) -->
  <path d="M285 110 L175 265 L250 265 L225 402 L337 235 L260 235 Z" fill="#ff3d00"/>
</svg>
`;

// 4. Apple Touch Icon 180x180
const svgApple = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#121212"/>
  <rect x="8" y="8" width="164" height="164" fill="none" stroke="#ff3d00" stroke-width="6"/>
  <path d="M104 30 L54 98 L90 98 L76 150 L126 82 L90 82 Z" fill="#ff3d00"/>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svg192)).png().toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('Created icon-192x192.png');

  await sharp(Buffer.from(svg512)).png().toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('Created icon-512x512.png');

  await sharp(Buffer.from(svg512Maskable)).png().toFile(path.join(iconsDir, 'icon-512x512-maskable.png'));
  console.log('Created icon-512x512-maskable.png');

  await sharp(Buffer.from(svgApple)).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
}

generate().catch(console.error);
