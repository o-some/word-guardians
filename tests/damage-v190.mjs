import { chromium, webkit } from 'playwright';

const live='https://o-some.github.io/word-guardians/';
const words=new Map([
  ['Apfel','apple'],['Wasser','water'],['Haus','house'],['Fenster','window'],['Schule','school'],['Buch','book'],['Flughafen','airport'],['Zug','train'],['Strand','beach'],['Wald','forest'],['Sonne','sun'],['Freund','friend'],['laufen','run'],['essen','eat'],['trinken','drink'],['Familie','family'],['Straße','street'],['Stadt','city'],['Arzt','doctor'],['Meer','sea'],['Insel','island'],['Schiff','ship'],['Hotel','hotel'],['Brücke','bridge'],['Telefon','phone'],['Koffer','suitcase'],['Markt','market'],['schnell','fast'],['langsam','slow'],['Küche','kitchen'],['Garten','garden'],['Regen','rain'],['Wolke','cloud'],['glücklich','happy'],['müde','tired'],['arbeiten','work'],['spielen','play'],['fragen','ask'],['antworten','answer'],['lernen','learn']
]);

async function waitHttp(url,attempts=36){
  let last=0;
  for(let i=0;i<attempts;i++){
    try{const r=await fetch(url,{cache:'no-store',redirect:'follow'});last=r.status;if(r.ok)return r}catch{}
    await new Promise(r=>setTimeout(r,5000));
  }
  throw new Error(`HTTP check failed for ${url}; last status ${last}`);
}

async function answerCorrect(page){
  const de=(await page.locator('#word').textContent()||'').trim();
  const en=words.get(de);
  if(!en)throw new Error(`Unknown word: ${de}`);
  await page.locator('#answers').getByRole('button',{name:en,exact:true}).click();
  await page.waitForTimeout(380);
}

async function run(name,browserType,viewport){
  const browser=await browserType.launch({headless:true});
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(live,{waitUntil:'networkidle',timeout:60000});
  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({state:'hidden',timeout:2500});

  const schedule=await page.evaluate(()=>[
    WGAnswerDamage.bonusPercentForTime(119.9),
    WGAnswerDamage.bonusPercentForTime(120),
    WGAnswerDamage.bonusPercentForTime(121),
    WGAnswerDamage.bonusPercentForTime(150),
    WGAnswerDamage.bonusPercentForTime(180),
    WGAnswerDamage.bonusPercentForTime(220),
    WGAnswerDamage.damageMultiplierForTime(220),
    WGAnswerDamage.bonusPercentForTime(500)
  ]);
  if(schedule.join(',')!=='0,0,1,30,60,100,2,100')throw new Error(`${name}: damage schedule wrong: ${schedule.join(',')}`);

  await page.evaluate(()=>{S.time=119.96;S.pause=false;S.last=performance.now();});
  await page.locator('.wgDamageMilestone').waitFor({state:'visible',timeout:3000});
  const pausedAt=await page.evaluate(()=>({pause:S.pause,time:S.time}));
  if(!pausedAt.pause)throw new Error(`${name}: game not paused by 2:00 damage popup`);
  await page.waitForTimeout(300);
  const frozen=await page.evaluate(()=>S.time);
  if(Math.abs(frozen-pausedAt.time)>.03)throw new Error(`${name}: game time continued behind damage popup (${pausedAt.time} -> ${frozen})`);
  const popupText=(await page.locator('.wgDamageMilestone').innerText()).toUpperCase();
  for(const expected of ['RICHTIGEN ANTWORTEN','2:00','2:30','+30 %','3:00','+60 %','3:40','+100 %','2.000']){
    if(!popupText.includes(expected))throw new Error(`${name}: damage popup missing ${expected}`);
  }
  if(viewport.width<=600){
    const sizes=await page.evaluate(()=>({
      title:parseFloat(getComputedStyle(document.querySelector('.wgDamageCopy h2')).fontSize),
      copy:parseFloat(getComputedStyle(document.querySelector('.wgDamageCopy p')).fontSize),
      scale:parseFloat(getComputedStyle(document.querySelector('.wgDamageScale span')).fontSize),
      button:parseFloat(getComputedStyle(document.querySelector('#wgDamageContinue')).fontSize)
    }));
    if(sizes.title<21||sizes.copy<13||sizes.scale<11.5||sizes.button<14)throw new Error(`${name}: damage popup text too small: ${JSON.stringify(sizes)}`);
  }
  await page.locator('#wgDamageContinue').click();
  await page.locator('.wgDamageMilestone').waitFor({state:'detached'});
  if(await page.evaluate(()=>S.pause))throw new Error(`${name}: game did not resume after damage popup`);

  await page.evaluate(()=>{
    const p=ENEMIES[0];
    S.e=[{id:8001,r:0,x:75,hp:1000,max:1000,sp:0,n:'QA Damage Target',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0}];
    S.g=[];S.co=0;S.time=150;S.last=performance.now();render();
  });
  await answerCorrect(page);
  let hp=await page.evaluate(()=>S.e[0]?.hp);
  if(Math.abs(hp-974)>.05)throw new Error(`${name}: +30% answer damage wrong, target HP ${hp}`);

  await page.evaluate(()=>{S.time=179.96;S.pause=false;S.last=performance.now();});
  await page.locator('.wgHealMilestone').waitFor({state:'visible',timeout:3000});
  await page.locator('#wgHealContinue').click();
  await page.locator('.wgHealMilestone').waitFor({state:'detached'});

  await page.evaluate(()=>{
    const p=ENEMIES[0];
    S.e=[{id:8002,r:0,x:75,hp:1000,max:1000,sp:0,n:'QA Double Damage Target',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0}];
    S.g=[];S.co=0;S.time=220;S.last=performance.now();render();
  });
  await answerCorrect(page);
  hp=await page.evaluate(()=>S.e[0]?.hp);
  if(Math.abs(hp-960)>.05)throw new Error(`${name}: +100% double answer damage wrong, target HP ${hp}`);

  if(errors.length)throw new Error(`${name}: JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · v1.9.5 larger 2:00 damage popup + 1%/sec scaling + 2x cap`);
}

await waitHttp(new URL('assets/patches/answer-damage-v190.js',live));
await waitHttp(new URL('assets/patches/answer-damage-v190.css',live));
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('DAMAGE_V195_PASS');
