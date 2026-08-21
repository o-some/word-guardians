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
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});

  const version=(await page.locator('.version').textContent()||'').trim();
  if(!version.startsWith('v1.9.9'))throw new Error(`${name}: expected visible v1.9.9, got ${version}`);

  // The premium six-helper overview stays on the start screen.
  if(await page.locator('#intro .wgGuideHelpers').count()!==1)throw new Error(`${name}: start-screen helper overview missing`);
  if(await page.locator('#intro .wgGuideHelperSprite').count()!==6)throw new Error(`${name}: start-screen helper sprites != 6`);

  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});
  await page.locator('#infoBtn').click();
  await page.locator('#infoOv').waitFor({state:'visible'});

  // The duplicated compact six-helper summary must not appear inside Helfer-Info.
  if(await page.locator('#infoOv [data-wg-full-guide] .wgGuideHelpers').count()!==0){
    throw new Error(`${name}: duplicate compact helper summary still visible in Helfer-Info`);
  }

  // Keep the existing detailed helper information below untouched.
  const detailed=await page.locator('#infoOv .gitem').count();
  if(detailed<6)throw new Error(`${name}: detailed helper information was removed (${detailed})`);

  const infoText=(await page.locator('#infoOv').innerText()).toUpperCase();
  for(const expected of ['WORTKORALLE','BLITZKORALLE','MINZQUALLE','STEINMUSCHEL','GEZEITENSTERN','ANKERKRABBE']){
    if(!infoText.includes(expected))throw new Error(`${name}: detailed helper info missing ${expected}`);
  }

  if(errors.length)throw new Error(`${name}: JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · v1.9.9 duplicate helper summary removed, detailed info preserved`);
}

await waitHttp(live);
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('INFO_CLEANUP_V199_PASS');
