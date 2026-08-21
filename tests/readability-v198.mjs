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

async function run(name,browserType,viewport){
  const browser=await browserType.launch({headless:true});
  const page=await browser.newPage({viewport});
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});

  const version=(await page.locator('.version').textContent()||'').trim();
  if(!version.startsWith('v1.9.8'))throw new Error(`${name}: expected v1.9.8, got ${version}`);

  const start=await page.evaluate(()=>({
    title:parseFloat(getComputedStyle(document.querySelector('#intro .wgStartModal h2')).fontSize),
    emergency:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideEmergency p')).fontSize),
    rule:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideRule span')).fontSize),
    helperName:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideHelper b')).fontSize),
    helperCopy:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideHelper small')).fontSize),
    sprite:document.querySelector('#intro .wgGuideHelperSprite')?.getBoundingClientRect().width||0,
    spriteCount:document.querySelectorAll('#intro .wgGuideHelperSprite').length
  }));
  if(start.title<27||start.emergency<12.5||start.rule<11||start.helperName<11||start.helperCopy<9.2||start.sprite<49||start.spriteCount!==6){
    throw new Error(`${name}: start-screen readability regressed ${JSON.stringify(start)}`);
  }

  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});
  const toolFont=await page.locator('#infoBtn').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  if(toolFont<10.8)throw new Error(`${name}: action-button font too small (${toolFont}px)`);

  await page.evaluate(()=>{S.time=119.96;S.pause=false;S.last=performance.now();});
  await page.locator('.wgDamageMilestone').waitFor({state:'visible',timeout:3000});
  const damageText=(await page.locator('.wgDamageMilestone').innerText()).toUpperCase();
  if(damageText.includes('1.000')||damageText.includes('2.000'))throw new Error(`${name}: old 1.000/2.000 damage example still visible`);
  if(!damageText.includes('+100 % SCHADEN'))throw new Error(`${name}: maximum damage explanation missing`);
  await page.locator('#wgDamageContinue').click();

  await browser.close();
  console.log(`PASS ${name} · v1.9.8 readable actions + premium start screen + simplified damage copy`);
}

await waitHttp(live);
await waitHttp(new URL('assets/patches/readability-v198.css',live));
await run('desktop-like-chromium',chromium,{width:568,height:770});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('READABILITY_V198_PASS');
