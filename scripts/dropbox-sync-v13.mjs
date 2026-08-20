import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const sets = [
  {name:'Gegner', url:'https://www.dropbox.com/request/1x6l4u9f0k4694z9jxli', files:[
    'assets/enemies/enemy-01-deckhand-niko.png','assets/enemies/enemy-02-hook-scout-lio.png','assets/enemies/enemy-03-barrel-raider-mako.png','assets/enemies/enemy-04-shield-buccaneer-taro.png','assets/enemies/enemy-05-wave-skater-piko.png','assets/enemies/enemy-06-anchor-brute-koda.png','assets/enemies/enemy-07-tidecaller-yara.png','assets/enemies/enemy-08-cannon-corsair-riven.png']},
  {name:'Helfer', url:'https://www.dropbox.com/request/imhekqryxy4exv5ayke9', files:[
    'assets/guardians/guardian-01-wortkoralle.png','assets/guardians/guardian-02-steinmuschel.png','assets/guardians/guardian-03-minzqualle.png','assets/guardians/guardian-04-gezeitenstern.png','assets/guardians/guardian-05-blitzkoralle.png','assets/guardians/guardian-06-ankerkrabbe.png']},
  {name:'UI', url:'https://www.dropbox.com/request/fj5ork2f9n1f28njvqgi', files:[
    'assets/ui/ui-01-muschel-schatztruhe.png','assets/ui/ui-02-boss-rahmen.png']}
];
const abs = files => files.map(f => path.resolve(f));
for (const set of sets) for (const f of set.files) if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);

const browser = await chromium.launch({headless:true});
async function upload(set){
  const page = await browser.newPage();
  console.log('Opening', set.name, set.url);
  await page.goto(set.url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2500);
  const input = page.locator('input[type=file]').first();
  if (await input.count()) {
    await input.setInputFiles(abs(set.files));
  } else {
    const add = page.getByRole('button',{name:/add files|dateien hinzufügen|choose files|dateien auswählen/i}).first();
    if (!await add.count()) throw new Error(`${set.name}: no file input/button found`);
    const chooserPromise = page.waitForEvent('filechooser');
    await add.click();
    const chooser = await chooserPromise;
    await chooser.setFiles(abs(set.files));
  }
  await page.waitForTimeout(1800);
  const texts = page.locator('input[type=text]');
  for(let i=0;i<await texts.count();i++){
    const el=texts.nth(i);
    if(await el.isVisible().catch(()=>false)){
      const ph=(await el.getAttribute('placeholder')||'').toLowerCase();
      if(ph.includes('name')) await el.fill('Word Guardians Build').catch(()=>{});
    }
  }
  const email=page.locator('input[type=email]').first();
  if(await email.count() && await email.isVisible().catch(()=>false)) await email.fill('41898282+github-actions[bot]@users.noreply.github.com').catch(()=>{});
  const button=page.getByRole('button',{name:/^upload$|hochladen|submit|send|fertig/i}).last();
  if(!await button.count()) throw new Error(`${set.name}: upload button not found`);
  await button.click();
  await page.waitForTimeout(9000);
  const body=(await page.locator('body').innerText()).toLowerCase();
  console.log(set.name, body.slice(-1200));
  if(!/uploaded|hochgeladen|thank|danke|success|complete|fertig/.test(body)) throw new Error(`${set.name}: success message not detected`);
  await page.close();
}
try { for (const set of sets) await upload(set); }
finally { await browser.close(); }
