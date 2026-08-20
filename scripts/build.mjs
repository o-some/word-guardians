import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const source = await readFile('index.html', 'utf8');
const cssTags = [
  '<link rel="stylesheet" href="./assets/patches/boss-overlay-v131.css">',
  '<link rel="stylesheet" href="./assets/patches/lane-rescue-v140.css">',
  '<link rel="stylesheet" href="./assets/patches/emergency-v150.css">',
  '<link rel="stylesheet" href="./assets/patches/top-pause-v160.css">',
  '<link rel="stylesheet" href="./assets/patches/compact-dnd-v171.css">',
  '<link rel="stylesheet" href="./assets/patches/boss-idle-slot-v174.css">',
  '<link rel="stylesheet" href="./assets/patches/answer-heal-v178.css">',
  '<link rel="stylesheet" href="./assets/patches/answer-damage-v190.css">',
  '<link rel="stylesheet" href="./assets/patches/onboarding-v180.css">'
];
const jsTags = [
  '<script src="./assets/patches/boss-overlay-v131.js"></script>',
  '<script src="./assets/patches/lane-rescue-v140.js"></script>',
  '<script src="./assets/patches/emergency-v150.js"></script>',
  '<script src="./assets/patches/top-pause-v160.js"></script>',
  '<script src="./assets/patches/compact-dnd-v171.js"></script>',
  '<script src="./assets/patches/boss-idle-slot-v174.js"></script>',
  '<script src="./assets/patches/answer-heal-v178.js"></script>',
  '<script src="./assets/patches/answer-damage-v190.js"></script>',
  '<script src="./assets/patches/onboarding-v180.js"></script>'
];

let built = source;
for (const tag of cssTags) {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (href && !built.includes(href)) built = built.replace('</head>', `${tag}</head>`);
}
for (const tag of jsTags) {
  const src = tag.match(/src="([^"]+)"/)?.[1];
  if (src && !built.includes(src)) built = built.replace('</body>', `${tag}</body>`);
}

await writeFile('dist/index.html', built);
await writeFile('dist/404.html', built);
await cp('assets', 'dist/assets', { recursive: true });
console.log('Word Guardians build complete · v1.9.2 readable milestones + answer damage scaling');
