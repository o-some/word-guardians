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
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});
  await page.waitForTimeout(250);

  const layout=await page.evaluate(()=>{
    const question=document.querySelector('.question');
    const answers=document.getElementById('answers');
    const energy=document.querySelector('.energy');
    const tools=question?.querySelector('.tools');
    const lane=document.querySelector('.lane');
    const dock=[...document.querySelectorAll('#dock .card[data-g]')].map(x=>x.dataset.g);
    return {
      energyInsideQuestion:!!question&&energy?.parentElement===question,
      energyBetweenAnswersAndTools:!!answers&&!!energy&&!!tools&&answers.compareDocumentPosition(energy)&Node.DOCUMENT_POSITION_FOLLOWING&&energy.nextElementSibling===tools,
      laneOverflow:lane?getComputedStyle(lane).overflow:null,
      dock
    };
  });
  if(!layout.energyInsideQuestion||!layout.energyBetweenAnswersAndTools)throw new Error(`${name}: energy bar is not between answer buttons and action buttons`);
  if(layout.laneOverflow!=='visible')throw new Error(`${name}: lane overflow must be visible, got ${layout.laneOverflow}`);
  if(layout.dock.join(',')!=='coral,bolt,jelly,shell,star,crab')throw new Error(`${name}: helper dock order regressed: ${layout.dock.join(',')}`);

  await page.evaluate(()=>{
    const p=ENEMIES[1];
    S.e.push({id:S.id++,r:0,x:58,hp:100,max:100,sp:0,n:'QA Visible Pirate',cl:p.cl||'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0});
    const b=BOSSES[0];
    S.e.push({id:S.id++,r:1,x:76,hp:320,max:420,sp:0,n:'QA Boss',cl:'boss',asset:b.asset,rank:1,born:S.time,stun:0,hitUntil:0});
    render();
  });
  await page.waitForTimeout(160);
  if(await page.locator('.lane').nth(0).locator('.enemy').count()<1)throw new Error(`${name}: regular enemy did not render in its lane`);
  const art=page.locator('.lane').nth(0).locator('.enemy .pirateArt').first();
  if(await art.count()!==1)throw new Error(`${name}: regular enemy sprite image missing`);
  const enemyMetrics=await art.evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,display:getComputedStyle(el).display,visibility:getComputedStyle(el).visibility};});
  if(enemyMetrics.width<=0||enemyMetrics.height<=0||enemyMetrics.display==='none'||enemyMetrics.visibility==='hidden')throw new Error(`${name}: regular enemy sprite is not visibly painted: ${JSON.stringify(enemyMetrics)}`);

  if(await page.locator('#bossStage .wgBossActiveHead:not(.hidden) img').count()!==1)throw new Error(`${name}: active boss portrait missing`);
  if(await page.locator('#bossStage .wgBossIdleContent:not(.hidden)').count()!==0)throw new Error(`${name}: idle skull must disappear during boss fight`);
  const bossMetrics=await page.evaluate(()=>{
    const stage=document.getElementById('bossStage');
    const bar=stage?.querySelector('.bossHpTrack');
    const name=stage?.querySelector('.bossName');
    const hp=stage?.querySelector('.bossHpText');
    if(!stage||!bar)return null;
    const s=stage.getBoundingClientRect(),b=bar.getBoundingClientRect();
    return {ratio:b.width/s.width,nameVisible:!!name&&getComputedStyle(name).display!=='none',hpVisible:!!hp&&getComputedStyle(hp).display!=='none'};
  });
  if(!bossMetrics||bossMetrics.ratio<0.72)throw new Error(`${name}: boss HP bar does not use enough horizontal space (${bossMetrics?.ratio})`);
  if(!bossMetrics.nameVisible||!bossMetrics.hpVisible)throw new Error(`${name}: boss name or HP numbers are not visible`);

  if(pageErrors.length)throw new Error(`${name}: JS errors: ${pageErrors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · embedded energy · readable boss HP · visible lane sprites`);
}

await waitHttp(live);
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('LAYOUT_REGRESSION_V191_PASS');
