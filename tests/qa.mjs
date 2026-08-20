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
  'assets/patches/boss-overlay-v131.css','assets/patches/boss-overlay-v131.js','assets/patches/lane-rescue-v140.css','assets/patches/lane-rescue-v140.js','assets/patches/emergency-v150.css','assets/patches/emergency-v150.js','assets/patches/top-pause-v160.css','assets/patches/top-pause-v160.js'
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
  await page.locator('.answer', { hasText: en }).click();
  await page.waitForTimeout(380);
}

async function runProfile(name, browserType, viewport, fullGameplay=false) {
  const browser = await browserType.launch({ headless:true });
  const page = await browser.newPage({ viewport });
  const pageErrors=[]; const failed=[];
  page.on('pageerror', e=>pageErrors.push(String(e)));
  page.on('response', r=>{ if(r.status()>=400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(live, { waitUntil:'networkidle', timeout:60000 });
  if (!(await page.locator('body').innerText()).includes('v1.7.0 · MOBILE FLOW + ENDGAME')) throw new Error(`${name}: v1.7.0 version not visible`);
  if (await page.locator('#bossOverlayV131').count() !== 1) throw new Error(`${name}: boss overlay layer missing`);
  if (await page.locator('#bossStage .bossVisual').evaluateAll(nodes=>nodes.some(n=>getComputedStyle(n).display!=='none'))) throw new Error(`${name}: duplicate boss portrait still visible in boss info strip`);
  if (await page.locator('#emergencyBtn').count() !== 1) throw new Error(`${name}: Insel-Notruf button missing`);
  if (await page.locator('.top #emergencyHeaderSlot #emergencyBtn').count() !== 1) throw new Error(`${name}: Insel-Notruf not mounted in header between brand and HUD`);
  if (await page.locator('#topPauseBtn').count() !== 0) throw new Error(`${name}: obsolete header pause button visible`);
  if ((await page.locator('#emergencyTimer').textContent())?.trim() !== 'READY') throw new Error(`${name}: Insel-Notruf must start READY`);

  if (viewport.width <= 600) {
    const perf = await page.evaluate(() => ({
      attachment:getComputedStyle(document.querySelector('.app')).backgroundAttachment,
      blur:getComputedStyle(document.querySelector('.glass')).backdropFilter || getComputedStyle(document.querySelector('.glass')).webkitBackdropFilter
    }));
    if (perf.attachment === 'fixed') throw new Error(`${name}: mobile background still fixed`);
  }

  await page.locator('#startBtn').click();
  await page.locator('#intro').waitFor({ state:'hidden' });
  if (await page.locator('.lane').count() !== 4) throw new Error(`${name}: lane count != 4`);
  if (await page.locator('.cell').count() !== 32) throw new Error(`${name}: cell count != 32`);
  if (await page.locator('.answer').count() !== 3) throw new Error(`${name}: answers != 3`);
  if (await page.locator('.card .guardianArt').count() !== 6) throw new Error(`${name}: helper sprites != 6`);

  await answerCorrect(page);
  if (fullGameplay) {
    await page.evaluate(()=>{ const p=ENEMIES[0]; S.e.push({id:S.id++,r:1,x:62,hp:999,max:999,sp:0,n:'QA Emergency Target',cl:'',asset:p.asset,rank:1,born:S.time,stun:0,hitUntil:0}); });
    await page.waitForTimeout(80);
    await page.locator('#emergencyBtn').click();
    await page.waitForTimeout(120);
    if ((await page.locator('#emergencyTimer').textContent())?.trim() === 'READY') throw new Error(`${name}: Insel-Notruf cooldown did not start`);
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
