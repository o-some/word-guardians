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
  if(!version.startsWith('v1.8.0'))throw new Error(`${name}: expected visible v1.8.0, got ${version}`);

  const intro=page.locator('#intro');
  await intro.waitFor({state:'visible'});
  const introText=(await intro.innerText()).toUpperCase();
  for(const expected of ['INSEL-NOTRUF','60 SEK','AB MINUTE 3','WORTKORALLE','BLITZKORALLE','MINZQUALLE','STEINMUSCHEL','GEZEITENSTERN','ANKERKRABBE']){
    if(!introText.includes(expected))throw new Error(`${name}: start guide missing ${expected}`);
  }
  if(await page.locator('#intro .wgEmergencyDemo').count()!==1)throw new Error(`${name}: emergency button preview missing on start screen`);

  const readyState=await page.locator('#emergencyBtn').evaluate(el=>({ready:el.classList.contains('ready'),animation:getComputedStyle(el).animationName}));
  if(!readyState.ready)throw new Error(`${name}: emergency button should start READY`);
  if(!readyState.animation.includes('alarmReadyPulse'))throw new Error(`${name}: READY emergency button is not pulsing`);

  await page.locator('#startBtn').click();
  await page.waitForTimeout(80);
  if(!(await intro.isVisible()))throw new Error(`${name}: intro disappeared before morph completed`);
  if(await page.locator('.wgIntroMorphGhost').count()!==1)throw new Error(`${name}: start-to-info morph ghost missing`);
  await intro.waitFor({state:'hidden',timeout:2000});
  await page.locator('#infoBtn.wgInfoArrival').waitFor({state:'visible',timeout:1200});

  await page.locator('#infoBtn').click();
  await page.locator('#infoOv').waitFor({state:'visible'});
  const info=(await page.locator('#infoOv').innerText()).toUpperCase();
  for(const expected of ['INSEL-NOTRUF','60 SEKUNDEN','3:00','30 %','WORTKORALLE','BLITZKORALLE','MINZQUALLE','STEINMUSCHEL','GEZEITENSTERN','ANKERKRABBE']){
    if(!info.includes(expected))throw new Error(`${name}: info guide missing ${expected}`);
  }
  await page.locator('#infoClose').click();

  await page.evaluate(()=>{
    const p=ENEMIES[0];
    S.e.push({id:S.id++,r:1,x:65,hp:100,max:100,sp:0,n:'QA Notruf Target',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0});
    render();
  });
  await page.locator('#emergencyBtn').click();
  await page.waitForTimeout(120);
  const timer=(await page.locator('#emergencyTimer').textContent()||'').trim();
  if(!/^(01:00|00:59)$/.test(timer))throw new Error(`${name}: expected about 60s cooldown, got ${timer}`);
  if(!(await page.locator('#emergencyBtn').isDisabled()))throw new Error(`${name}: emergency button should cool down after use`);

  if(errors.length)throw new Error(`${name}: JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · v1.8.0 onboarding + morph + 60s Notruf`);
}

await waitHttp(new URL('assets/patches/onboarding-v180.js',live));
await waitHttp(new URL('assets/patches/onboarding-v180.css',live));
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('ONBOARDING_V180_PASS');
