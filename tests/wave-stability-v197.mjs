import { chromium, webkit } from 'playwright';

const live='https://o-some.github.io/word-guardians/';

async function waitHttp(url,attempts=36){
  let last=0;
  for(let i=0;i<attempts;i++){
    try{const r=await fetch(url,{cache:'no-store',redirect:'follow'});last=r.status;if(r.ok)return r}catch{}
    await new Promise(r=>setTimeout(r,5000));
  }
  throw new Error(`HTTP check failed for ${url}; last status ${last}`);
}

async function metrics(page){
  return page.evaluate(()=>({
    scrollWidth:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
    wrapWidth:document.querySelector('.wrap')?.getBoundingClientRect().width||0,
    boardWidth:document.querySelector('#boardBox')?.getBoundingClientRect().width||0,
    boardOverflow:getComputedStyle(document.querySelector('#boardBox')).overflow,
    bodyOverflowX:getComputedStyle(document.body).overflowX
  }));
}

async function run(name,browserType,viewport){
  const browser=await browserType.launch({headless:true});
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});
  const version=(await page.locator('.version').textContent()||'').trim();
  if(!version.startsWith('v1.9.7'))throw new Error(`${name}: expected visible v1.9.7, got ${version}`);
  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});

  const before=await metrics(page);
  if(before.boardOverflow!=='visible')throw new Error(`${name}: boss/enemy overflow behavior changed (${before.boardOverflow})`);
  if(before.scrollWidth>before.clientWidth+1)throw new Error(`${name}: horizontal overflow already exists before word-wave (${before.scrollWidth}/${before.clientWidth})`);

  const expected=await page.evaluate(()=>S.q.en);
  await page.locator('#answers').getByRole('button',{name:expected,exact:true}).click();
  await page.locator('.wordWave').waitFor({state:'attached',timeout:1200});

  const samples=[];
  for(let i=0;i<10;i++){
    samples.push(await metrics(page));
    await page.waitForTimeout(70);
  }
  await page.locator('.wordWave').waitFor({state:'detached',timeout:1800});
  const after=await metrics(page);
  samples.push(after);

  const spread=key=>Math.max(...samples.map(s=>s[key]))-Math.min(...samples.map(s=>s[key]));
  if(spread('scrollWidth')>1)throw new Error(`${name}: document width changes during word-wave (${samples.map(s=>s.scrollWidth).join(',')})`);
  if(spread('wrapWidth')>1)throw new Error(`${name}: game wrapper width shifts during word-wave (${samples.map(s=>s.wrapWidth.toFixed(2)).join(',')})`);
  if(spread('boardWidth')>1)throw new Error(`${name}: board width shifts during word-wave (${samples.map(s=>s.boardWidth.toFixed(2)).join(',')})`);
  if(samples.some(s=>s.scrollWidth>s.clientWidth+1))throw new Error(`${name}: word-wave creates horizontal page overflow`);
  if(errors.length)throw new Error(`${name}: JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · correct-answer word-wave keeps game geometry stable`);
}

await waitHttp(new URL('assets/patches/wave-stability-v197.css',live));
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('WAVE_STABILITY_V197_PASS');
