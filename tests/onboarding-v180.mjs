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
  if(!version.startsWith('v1.9.4'))throw new Error(`${name}: expected visible v1.9.4, got ${version}`);

  const intro=page.locator('#intro');
  await intro.waitFor({state:'visible'});
  const introText=(await intro.innerText()).toUpperCase();
  for(const expected of ['INSEL-NOTRUF','60 SEK','WÖRTER SIND DEINE STÄRKSTE WAFFE','HELFER PLATZIEREN','WORTKORALLE','BLITZKORALLE','MINZQUALLE','STEINMUSCHEL','GEZEITENSTERN','ANKERKRABBE']){
    if(!introText.includes(expected))throw new Error(`${name}: start guide missing ${expected}`);
  }
  for(const removed of ['AB MINUTE 2','AB MINUTE 3','3:00 = 3 %','+100 % DAS MAXIMUM']){
    if(introText.includes(removed))throw new Error(`${name}: progression rule should not be on start screen: ${removed}`);
  }
  if(await page.locator('#intro .wgEmergencyDemo').count()!==1)throw new Error(`${name}: emergency button preview missing on start screen`);

  if(viewport.width<=600){
    const sizes=await page.evaluate(()=>({
      rule:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideRule span')).fontSize),
      helper:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideHelper small')).fontSize),
      emergency:parseFloat(getComputedStyle(document.querySelector('#intro .wgGuideEmergency p')).fontSize)
    }));
    if(sizes.rule<7.5||sizes.helper<6||sizes.emergency<8.5)throw new Error(`${name}: onboarding text still too small: ${JSON.stringify(sizes)}`);
  }

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
  for(const expected of ['INSEL-NOTRUF','60 SEKUNDEN','2:00','100 %','3:00','30 %','WORTKORALLE','BLITZKORALLE','MINZQUALLE','STEINMUSCHEL','GEZEITENSTERN','ANKERKRABBE']){
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
  console.log(`PASS ${name} · v1.9.4 streamlined onboarding + readable guide + 60s Notruf`);
}

await waitHttp(new URL('assets/patches/onboarding-v180.js',live));
await waitHttp(new URL('assets/patches/onboarding-v180.css',live));
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('ONBOARDING_V194_PASS');
