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

async function run(name,browserType){
  const browser=await browserType.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});
  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});
  const m=await page.evaluate(()=>{
    const q=document.querySelector('.question');
    const strong=q?.querySelector('strong');
    const answer=document.querySelector('.answer');
    const card=document.querySelector('.dock .card');
    const art=card?.querySelector('.premiumGuardian');
    const name=card?.querySelector('b');
    const meta=card?.querySelector('small');
    const rect=el=>el?.getBoundingClientRect();
    return {
      version:document.querySelector('.version')?.textContent||'',
      questionHeight:rect(q)?.height||0,
      questionFont:parseFloat(getComputedStyle(strong).fontSize),
      answerHeight:rect(answer)?.height||0,
      answerFont:parseFloat(getComputedStyle(answer).fontSize),
      cardHeight:rect(card)?.height||0,
      artWidth:rect(art)?.width||0,
      nameFont:parseFloat(getComputedStyle(name).fontSize),
      metaFont:parseFloat(getComputedStyle(meta).fontSize)
    };
  });
  if(!m.version.startsWith('v1.9.6'))throw new Error(`${name}: visible version is ${m.version}`);
  if(m.questionHeight<120||m.questionFont<17)throw new Error(`${name}: question area too small ${JSON.stringify(m)}`);
  if(m.answerHeight<47||m.answerFont<13.5)throw new Error(`${name}: answer buttons too small ${JSON.stringify(m)}`);
  if(m.cardHeight<68||m.artWidth<46)throw new Error(`${name}: guardian cards/sprites too small ${JSON.stringify(m)}`);
  if(m.nameFont<7||m.metaFont<4.8)throw new Error(`${name}: guardian card text too small ${JSON.stringify(m)}`);
  await browser.close();
  console.log(`PASS ${name} · larger mobile question + answers + guardian dock`);
}

await waitHttp(live);
await run('android-like-chromium',chromium);
await run('iphone-like-webkit',webkit);
console.log('MOBILE_SCALE_V196_PASS');
