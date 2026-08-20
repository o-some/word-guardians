import { chromium, webkit } from 'playwright';

const live = 'https://o-some.github.io/word-guardians/';
const words = new Map([
  ['Apfel','apple'],['Wasser','water'],['Haus','house'],['Fenster','window'],['Schule','school'],['Buch','book'],['Flughafen','airport'],['Zug','train'],['Strand','beach'],['Wald','forest'],['Sonne','sun'],['Freund','friend'],['laufen','run'],['essen','eat'],['trinken','drink'],['Familie','family'],['Straße','street'],['Stadt','city'],['Arzt','doctor'],['Meer','sea'],['Insel','island'],['Schiff','ship'],['Hotel','hotel'],['Brücke','bridge'],['Telefon','phone'],['Koffer','suitcase'],['Markt','market'],['schnell','fast'],['langsam','slow'],['Küche','kitchen'],['Garten','garden'],['Regen','rain'],['Wolke','cloud'],['glücklich','happy'],['müde','tired'],['arbeiten','work'],['spielen','play'],['fragen','ask'],['antworten','answer'],['lernen','learn']
]);
const assetUrls = [
  'assets/creative/world_harbor.webp','assets/creative/mode_words_discover.webp','assets/creative/tula_profile.webp','assets/creative/tula_neutral_front.webp','assets/creative/tula_happy.webp',
  'assets/enemies/enemy-01-deckhand-niko.png','assets/enemies/enemy-02-hook-scout-lio.png','assets/enemies/enemy-03-barrel-raider-mako.png','assets/enemies/enemy-04-shield-buccaneer-taro.png','assets/enemies/enemy-05-wave-skater-piko.png','assets/enemies/enemy-06-anchor-brute-koda.png','assets/enemies/enemy-07-tidecaller-yara.png','assets/enemies/enemy-08-cannon-corsair-riven.png',
  'assets/bosses/boss-01-pirat-kai.png','assets/bosses/boss-02-kapitaen-brax.png','assets/bosses/boss-03-blackfinn.png','assets/bosses/boss-04-alt-kapitaen-roderick.png','assets/bosses/boss-05-piratenbaron-vargas.png','assets/bosses/boss-06-kapitaen-ironhook.png','assets/bosses/boss-07-admiral-thorne.png','assets/bosses/boss-08-kartenmeister-corvin.png','assets/bosses/boss-09-schattenfuerst-azrak.png','assets/bosses/boss-10-piratenkoenig-varkos.png',
  'assets/guardians/guardian-01-wortkoralle.png','assets/guardians/guardian-02-steinmuschel.png','assets/guardians/guardian-03-minzqualle.png','assets/guardians/guardian-04-gezeitenstern.png','assets/guardians/guardian-05-blitzkoralle.png','assets/guardians/guardian-06-ankerkrabbe.png',
  'assets/ui/ui-01-muschel-schatztruhe.png','assets/ui/ui-02-boss-rahmen.png',
  'assets/patches/boss-overlay-v131.css','assets/patches/boss-overlay-v131.js','assets/patches/lane-rescue-v140.css','assets/patches/lane-rescue-v140.js','assets/patches/emergency-v150.css','assets/patches/emergency-v150.js','assets/patches/top-pause-v160.css','assets/patches/top-pause-v160.js','assets/patches/compact-dnd-v171.css','assets/patches/compact-dnd-v171.js','assets/patches/boss-idle-slot-v174.css','assets/patches/boss-idle-slot-v174.js','assets/patches/answer-heal-v178.css','assets/patches/answer-heal-v178.js','assets/patches/answer-damage-v190.css','assets/patches/answer-damage-v190.js','assets/patches/onboarding-v180.css','assets/patches/onboarding-v180.js'
];

async function waitHttp(url, attempts=36) {
  let last = 0;
  for (let i=0;i<attempts;i++) {
    try { const r = await fetch(url, { redirect:'follow', cache:'no-store' }); last=r.status; if (r.ok) return r; } catch {}
    await new Promise(r=>setTimeout(r,5000));
  }
  throw new Error(`HTTP check failed for ${url}; last status ${last}`);
}

await waitHttp(live);
for (const asset of assetUrls) await waitHttp(new URL(asset, live).href, 12);

async function answerCorrect(page) {
  const de = await page.locator('#word').textContent();
  const en = words.get((de||'').trim());
  if (!en) throw new Error(`Unknown word in QA: ${de}`);
  await page.locator('#answers').getByRole('button', { name: en, exact: true }).click();
  await page.waitForTimeout(380);
}

async function dragGuardian(page, cardSelector, cellSelector, pointerType='mouse') {
  await page.evaluate(({cardSelector,cellSelector,pointerType})=>{
    const card=document.querySelector(cardSelector),cell=document.querySelector(cellSelector);
    if(!card||!cell)throw new Error('drag target missing');
    const a=card.getBoundingClientRect(),b=cell.getBoundingClientRect();
    const start={x:a.left+a.width/2,y:a.top+a.height/2};
    const end={x:b.left+b.width/2,y:b.top+b.height/2};
    const init=(type,x,y)=>new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:77,pointerType,button:0,buttons:type==='pointerup'?0:1,clientX:x,clientY:y});
    card.dispatchEvent(init('pointerdown',start.x,start.y));
    document.dispatchEvent(init('pointermove',(start.x+end.x)/2,(start.y+end.y)/2));
    document.dispatchEvent(init('pointermove',end.x,end.y));
    document.dispatchEvent(init('pointerup',end.x,end.y));
  },{cardSelector,cellSelector,pointerType});
  await page.waitForTimeout(160);
}

async function assertIdleBossSlot(page,name) {
  if (await page.locator('#bossStage').count() !== 1) throw new Error(`${name}: boss stage missing`);
  if (!(await page.locator('#bossStage').isVisible())) throw new Error(`${name}: boss stage should stay visible while idle`);
  if (!(await page.locator('#bossStage').evaluate(el=>el.classList.contains('wgBossIdle')))) throw new Error(`${name}: boss stage idle class missing`);
  const idleText=(await page.locator('#bossStage').innerText()).toUpperCase();
  if(!idleText.includes('KEIN BOSS IN SICHT')) throw new Error(`${name}: idle boss copy missing`);
  if(await page.locator('#bossStage .wgBossIdleMark').count()!==1) throw new Error(`${name}: idle pirate skull missing`);
}

async function runProfile(name, browserType, viewport, fullGameplay=false) {
  const browser = await browserType.launch({ headless:true });
  const page = await browser.newPage({ viewport });
  const pageErrors=[]; const failed=[];
  page.on('pageerror', e=>pageErrors.push(String(e)));
  page.on('response', r=>{ if(r.status()>=400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(live, { waitUntil:'networkidle', timeout:60000 });
  const expectedVersion='v1.9.5 · LARGE OVERLAYS + PREMIUM GUIDE';
  if (!(await page.locator('body').innerText()).includes(expectedVersion)) throw new Error(`${name}: v1.9.5 version not visible`);
  await page.waitForTimeout(1300);
  if (!(await page.locator('body').innerText()).includes(expectedVersion)) throw new Error(`${name}: version display is still fluctuating`);
  if (await page.locator('#bossOverlayV131').count() !== 1) throw new Error(`${name}: boss overlay layer missing`);
  if (await page.locator('#bossStage .bossVisual').evaluateAll(nodes=>nodes.some(n=>getComputedStyle(n).display!=='none'))) throw new Error(`${name}: duplicate boss portrait still visible in boss info strip`);
  await assertIdleBossSlot(page,name);
  if (await page.locator('#emergencyBtn').count() !== 1) throw new Error(`${name}: Insel-Notruf button missing`);
  if (await page.locator('.top #emergencyHeaderSlot #emergencyBtn').count() !== 1) throw new Error(`${name}: Insel-Notruf not mounted in header between brand and HUD`);
  if (await page.locator('#topPauseBtn').count() !== 0) throw new Error(`${name}: obsolete header pause button visible`);
  if ((await page.locator('#emergencyTimer').textContent())?.trim() !== 'READY') throw new Error(`${name}: Insel-Notruf must start READY`);

  if (viewport.width <= 600) {
    const perf = await page.evaluate(() => ({
      attachment:getComputedStyle(document.querySelector('.app')).backgroundAttachment,
      touchAction:getComputedStyle(document.querySelector('.dock .card')).touchAction
    }));
    if (perf.attachment === 'fixed') throw new Error(`${name}: mobile background still fixed`);
    if (perf.touchAction !== 'none') throw new Error(`${name}: guardian cards not touch-drag ready`);
    if (await page.locator('#bossStage').count()) {
      const bossHeight=await page.locator('#bossStage').evaluate(el=>el.getBoundingClientRect().height);
      if (bossHeight > 48) throw new Error(`${name}: boss strip too tall on mobile (${bossHeight}px)`);
    }
  }

  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({ state:'hidden', timeout:2500 });
  await assertIdleBossSlot(page,name);
  if (await page.locator('.lane').count() !== 4) throw new Error(`${name}: lane count != 4`);
  if (await page.locator('.cell').count() !== 32) throw new Error(`${name}: cell count != 32`);
  if (await page.locator('.answer').count() !== 3) throw new Error(`${name}: answers != 3`);
  if (await page.locator('.card .guardianArt').count() !== 6) throw new Error(`${name}: helper sprites != 6`);

  await answerCorrect(page);
  const dragTarget='.lane:nth-of-type(4) .cell:nth-child(2)';
  await dragGuardian(page,'.card[data-g="coral"]',dragTarget,viewport.width<=600?'touch':'mouse');
  if (await page.locator(dragTarget+' .guardianWrap').count() !== 1) throw new Error(`${name}: guardian drag/drop placement failed`);

  if (fullGameplay) {
    await page.evaluate(()=>{ const p=ENEMIES[0]; S.e.push({id:S.id++,r:1,x:62,hp:999,max:999,sp:0,n:'QA Emergency Target',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0}); });
    await page.waitForTimeout(80);
    await page.locator('#emergencyBtn').click();
    await page.waitForTimeout(120);
    const cooldownText=(await page.locator('#emergencyTimer').textContent())?.trim()||'';
    if (cooldownText === 'READY') throw new Error(`${name}: Insel-Notruf cooldown did not start`);
    if (!/^(01:00|00:59)$/.test(cooldownText)) throw new Error(`${name}: expected about 01:00 cooldown, got ${cooldownText}`);
    if (!(await page.locator('#emergencyBtn').isDisabled())) throw new Error(`${name}: Insel-Notruf should be disabled during cooldown`);
    if (await page.locator('.emergencyWave').count() < 1) throw new Error(`${name}: Insel-Notruf field animation missing`);
    if (!(await page.evaluate(()=>S.e.every(e=>e.hp<=0)))) throw new Error(`${name}: Insel-Notruf did not deal 100 percent damage`);
    if ((await page.evaluate(()=>window.WGRunStats?.emergencyUses||0)) < 1) throw new Error(`${name}: emergency use stat not tracked`);

    await page.locator('.card[data-g="coral"]').click();
    await page.locator('.lane').nth(0).locator('.cell').nth(1).click();
    await page.locator('.lane').nth(0).locator('.cell').nth(1).locator('.guardianWrap').waitFor();
    const before = await page.locator('.lane').nth(0).locator('.cell').nth(1).locator('.gHp i').getAttribute('style');
    const de = (await page.locator('#word').textContent()||'').trim();
    const correct = words.get(de);
    const wrong = page.locator('.answer').filter({ hasNotText: correct }).first();
    await wrong.click();
    await page.waitForTimeout(380);
    const after = await page.locator('.lane').nth(0).locator('.cell').nth(1).locator('.gHp i').getAttribute('style');
    if (before === after || !String(after).includes('90')) throw new Error(`${name}: wrong-answer 10% guardian damage not observed (${before} -> ${after})`);

    await page.locator('#moveBtn').click();
    await page.locator('.lane').nth(0).locator('.cell').nth(1).click();
    await page.locator('.lane').nth(0).locator('.cell').nth(2).click();
    if (await page.locator('.lane').nth(0).locator('.cell').nth(2).locator('.guardianWrap').count() !== 1) throw new Error(`${name}: move tool failed`);

    await page.locator('#infoBtn').click();
    await page.locator('#infoOv').waitFor({ state:'visible' });
    const guideText=(await page.locator('#guide').innerText()).toUpperCase();
    if(!guideText.includes('INSEL-NOTRUF')) throw new Error(`${name}: Insel-Notruf missing from info`);
    await page.locator('#infoClose').click();
    await page.locator('#pauseBtn').click();
    await page.locator('#pauseOv').waitFor({ state:'visible' });
    await page.locator('#resumeBtn').click();

    for (let i=0;i<24;i++) await answerCorrect(page);
    await page.evaluate(()=>{ if(!S.e.some(e=>e.hp>0&&!e.cl.includes('boss'))){const p=ENEMIES[0];S.e.push({id:S.id++,r:2,x:72,hp:120,max:120,sp:0,n:'QA Regular Pirate',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0});} });
    await page.waitForTimeout(120);
    if (await page.locator('.pirateArt').count() < 1) throw new Error(`${name}: regular pirate image sprite not rendered`);
    const bossOverlayCount = await page.locator('#bossOverlayV131 .bossFloatingV131 img').count();
    if (bossOverlayCount < 1) throw new Error(`${name}: glowing boss overlay sprite not rendered after boss milestones`);
    if (await page.locator('#bossStage').evaluate(el=>el.classList.contains('wgBossIdle'))) throw new Error(`${name}: boss stage stayed idle while boss is active`);

    await page.evaluate(()=>{ gameOver(); });
    await page.locator('#endOv').waitFor({ state:'visible' });
    await page.waitForTimeout(350);
    const resultText = await page.locator('#endOv').innerText();
    for (const expected of ['WÖRTER','DURCHGEHALTEN','GEFAHRENSTUFE','BESTE COMBO','XP','MUSCHELN','BOSSE BESIEGT','LINIEN GERETTET','NOTRUFE']) {
      if (!resultText.toUpperCase().includes(expected)) throw new Error(`${name}: result missing ${expected}`);
    }
    if (await page.locator('[data-wg-premium-end]').count() !== 1) throw new Error(`${name}: premium endscreen block missing`);
    await page.locator('#againBtn').click();
  }
  if (pageErrors.length) throw new Error(`${name}: JS errors: ${pageErrors.join(' | ')}`);
  const relevantFailed = failed.filter(x=>!x.includes('favicon'));
  if (relevantFailed.length) throw new Error(`${name}: HTTP failures: ${relevantFailed.join(' | ')}`);
  await browser.close();
  console.log(`PASS ${name}`);
}

await runProfile('desktop-chromium', chromium, {width:1440,height:900}, true);
await runProfile('desktop-webkit', webkit, {width:1440,height:900}, false);
await runProfile('android-like-chromium', chromium, {width:390,height:844}, false);
await runProfile('iphone-like-webkit', webkit, {width:390,height:844}, false);
console.log('ALL_QA_PASS');
