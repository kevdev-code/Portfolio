import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#101815"/>
  <rect x="80" y="150" width="330" height="90" rx="18" fill="#79c8a2" transform="rotate(-2 245 195)"/>
  <text x="100" y="212" font-family="Arial Black, sans-serif" font-size="52" font-weight="900" fill="#101815">web apps</text>
  <rect x="440" y="150" width="300" height="90" rx="18" fill="#c75b39" transform="rotate(2 590 195)"/>
  <text x="462" y="212" font-family="Arial Black, sans-serif" font-size="52" font-weight="900" fill="#fff">mobile</text>
  <text x="80" y="360" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="#e8ecea">Kevin López</text>
  <text x="80" y="430" font-family="Arial, sans-serif" font-size="34" fill="#949e99">full-stack developer · the dev nest</text>
</svg>`;
// KEVIN-TODO: oklch() colors caused sharp/librsvg to render solid black; converted to hex equivalents (see task-11 brief) for this build-time script only. public/favicon.svg keeps oklch() since browsers render it fine.
// KEVIN-TODO: nombre real en el texto de arriba

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png generado');
