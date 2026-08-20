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
    WGAnswerHeal.healPercentForTime(179.9),
    WGAnswerHeal.healPercentForTime(180),
    WGAnswerHeal.healPercentForTime(210),
    WGAnswerHeal.healPercentForTime(240),
    WGAnswerHeal.healPercentForTime(270),
    WGAnswerHeal.healPercentForTime(450),
    WGAnswerHeal.healPercentForTime(900)
  ]);
  if(schedule.join(',')!=='0,3,6,10,13,30,30')throw new Error(`${name}: healing schedule wrong: ${schedule.join(',')}`);

  await page.evaluate(()=>{S.time=179.96;S.pause=false;S.last=performance.now();});
  await page.locator('.wgHealMilestone').waitFor({state:'visible',timeout:3000});
  const pausedAt=await page.evaluate(()=>({pause:S.pause,time:S.time}));
  if(!pausedAt.pause)throw new Error(`${name}: game not paused by 3:00 healing popup`);
  await page.waitForTimeout(300);
  const frozen=await page.evaluate(()=>S.time);
  if(Math.abs(frozen-pausedAt.time)>.03)throw new Error(`${name}: game time continued behind healing popup (${pausedAt.time} -> ${frozen})`);
  const popupText=(await page.locator('.wgHealMilestone').innerText()).toUpperCase();
  for(const expected of ['DEINE WÖRTER HEILEN JETZT','3:00','3 %','3:30','6 %','4:00','10 %','30 %']){
    if(!popupText.includes(expected))throw new Error(`${name}: popup missing ${expected}`);
  }
  if(viewport.width<=600){
    const sizes=await page.evaluate(()=>({
      title:parseFloat(getComputedStyle(document.querySelector('.wgHealCopy h2')).fontSize),
      copy:parseFloat(getComputedStyle(document.querySelector('.wgHealCopy p')).fontSize),
      scale:parseFloat(getComputedStyle(document.querySelector('.wgHealScale span')).fontSize)
    }));
    if(sizes.title<17||sizes.copy<10.5||sizes.scale<9.5)throw new Error(`${name}: healing popup text still too small: ${JSON.stringify(sizes)}`);
  }
  await page.locator('#wgHealContinue').click();
  await page.locator('.wgHealMilestone').waitFor({state:'detached'});
  if(await page.evaluate(()=>S.pause))throw new Error(`${name}: game did not resume after healing popup`);

  await page.evaluate(()=>{
    S.e=[];
    S.g=[
      {id:7001,type:'coral',r:0,c:1,hp:45,max:90,last:0,hitUntil:0},
      {id:7002,type:'shell',r:1,c:1,hp:140,max:280,last:0,hitUntil:0}
    ];
    S.time=180;S.last=performance.now();render();
  });
  await answerCorrect(page);
  let hp=await page.evaluate(()=>S.g.map(g=>g.hp));
  if(Math.abs(hp[0]-47.7)>.02||Math.abs(hp[1]-148.4)>.02)throw new Error(`${name}: 3% healing wrong: ${hp.join(',')}`);

  await page.evaluate(()=>{S.g[0].hp=45;S.g[1].hp=140;S.time=210;S.last=performance.now();});
  await answerCorrect(page);
  hp=await page.evaluate(()=>S.g.map(g=>g.hp));
  if(Math.abs(hp[0]-50.4)>.02||Math.abs(hp[1]-156.8)>.02)throw new Error(`${name}: 6% healing wrong: ${hp.join(',')}`);

  await page.evaluate(()=>{S.g[0].hp=45;S.g[1].hp=140;S.time=240;S.last=performance.now();});
  await answerCorrect(page);
  hp=await page.evaluate(()=>S.g.map(g=>g.hp));
  if(Math.abs(hp[0]-54)>.02||Math.abs(hp[1]-168)>.02)throw new Error(`${name}: 10% healing wrong: ${hp.join(',')}`);

  await page.evaluate(()=>{S.g[0].hp=80;S.g[1].hp=250;S.time=450;S.last=performance.now();});
  await answerCorrect(page);
  hp=await page.evaluate(()=>S.g.map(g=>g.hp));
  if(Math.abs(hp[0]-90)>.02||Math.abs(hp[1]-280)>.02)throw new Error(`${name}: 30% healing/cap wrong: ${hp.join(',')}`);

  if(errors.length)throw new Error(`${name}: JS errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name} · larger 3:00 healing popup + scaled healing`);
}

await waitHttp(new URL('assets/patches/answer-heal-v178.js',live));
await waitHttp(new URL('assets/patches/answer-heal-v178.css',live));
await run('desktop-chromium',chromium,{width:1440,height:900});
await run('iphone-like-webkit',webkit,{width:390,height:844});
console.log('HEALING_V190_PASS');
