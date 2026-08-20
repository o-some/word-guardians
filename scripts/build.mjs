import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const source = await readFile('index.html', 'utf8');
const cssTag = '<link rel="stylesheet" href="./assets/patches/boss-overlay-v131.css">';
const jsTag = '<script src="./assets/patches/boss-overlay-v131.js"></script>';
let built = source;
if (!built.includes('boss-overlay-v131.css')) built = built.replace('</head>', `${cssTag}</head>`);
if (!built.includes('boss-overlay-v131.js')) built = built.replace('</body>', `${jsTag}</body>`);

await writeFile('dist/index.html', built);
await writeFile('dist/404.html', built);
await cp('assets', 'dist/assets', { recursive: true });
console.log('Word Guardians build complete · boss overlay glow v1.3.1 injected');
