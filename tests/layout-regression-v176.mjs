import { chromium, webkit } from 'playwright';

const live='https://o-some.github.io/word-guardians/';

async function waitHttp(url,attempts=30){
  for(let i=0;i<attempts;i++){
    try{const r=await fetch(url,{cache:'no-store',redirect:'follow'});if(r.ok)return r}catch{}
    await new Promise(r=>setTimeout(r,4000));
  }
  throw new Error(`HTTP check failed: ${url}`);
}

async function run(name,browserType,viewport){
  const browser=await browserType.launch({headless:true});
  const page=await browser.newPage({viewport});
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});
  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden'});
  await page.waitForTimeout(250);

  const layout=await page.evaluate(()=>{
    const energy=document.querySelector('.energy');
    const boss=document.getElementById('bossStage');
    const lane=document.querySelector('.lane');
    const dock=[...document.querySelectorAll('#dock .card[data-g]')].map(x=>x.dataset.g);
    return {
      energyBeforeBoss:!!energy&&!!boss&&energy.nextElementSibling===boss,
      laneOverflow:lane?getComputedStyle(lane).overflow:null,
      dock
    };
  });
  if(!layout.energyBeforeBoss)throw new Error(`${name}: energy bar is not directly above boss slot`);
  if(layout.laneOverflow!=='visible')throw new Error(`${name}: lane overflow must be visible, got ${layout.laneOverflow}`);
  if(layout.dock.join(',')!=='coral,bolt,jelly,shell,star,crab')throw new Error(`${name}: helper dock order regressed: ${layout.dock.join(',')}`);

  await page.evaluate(()=>{
    const p=ENEMIES[1];
    S.e.push({id:S.id++,r:0,x:58,hp:100,max:100,sp:0,n:'QA Visible Pirate',cl:p.cl||'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0});
    render();
  });
  await page.waitForTimeout(120);
  if(await page.locator('.lane').nth(0).locator('.enemy').count()<1)throw new Error(`${name}: regular enemy did not render in its lane`);
  const enemyStyle=await page.locator('.lane').nth(0).locator('.enemy').first().evaluate(el=>({top:getComputedStyle(el).top,z:getComputedStyle(el).zIndex}));
  if(!enemyStyle.top)throw new Error(`${name}: regular enemy positioning missing`);

  if(pageErrors.length)throw new Error(`${name}: JS errors: ${pageErrors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · energy above boss · visible lane sprites`);
}

await waitHttp(live);
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('LAYOUT_REGRESSION_V176_PASS');
