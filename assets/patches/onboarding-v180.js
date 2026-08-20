(()=>{
  'use strict';

  const VERSION='v1.8.0 · ONBOARDING + NOTRUF 60 · 4×8';
  const $=id=>document.getElementById(id);
  let passthrough=false;
  let morphing=false;

  const helperRows=[
    ['🌊','Wortkoralle','Fernangriff mit Wasserperlen.'],
    ['⚡','Blitzkoralle','Schnellfeuer mit vielen kleinen Treffern.'],
    ['🪼','Minzqualle','Verlangsamt Piraten auf ihrer Spur.'],
    ['🪨','Steinmuschel','Defensiver Tank mit sehr vielen HP.'],
    ['⭐','Gezeitenstern','Stößt Piraten ein Stück zurück.'],
    ['🦀','Ankerkrabbe','Blockiert und betäubt Piraten kurz.']
  ];

  function guideMarkup(compact=false){
    const helpers=helperRows.map(([icon,name,text])=>`<div class="wgGuideHelper"><span>${icon}</span><b>${name}</b><small>${text}</small></div>`).join('');
    return `
      <section class="wgGuideCore${compact?' wgGuideCoreCompact':''}">
        <div class="wgGuideEmergency">
          <div class="wgEmergencyDemo" aria-label="Insel-Notruf Vorschau"><span class="wgEmergencyDemoIcon">🚨</span><span><b>INSEL-NOTRUF</b><small>READY · 60 SEK.</small></span></div>
          <p><b>Notfallknopf oben:</b> Ist er READY, beseitigt er alle aktuell sichtbaren Gegner. Danach lädt er <b>60 Sekunden</b> nach. Wenn er bereit ist, pulsiert er leicht rot.</p>
        </div>
        <div class="wgGuideRule"><b>🧠 Wörter sind deine stärkste Waffe</b><span>Richtige Antworten geben Energie und beschädigen Piraten. Falsche Antworten kosten jeden Helfer 10 % seiner maximalen HP.</span></div>
        <div class="wgGuideRule"><b>✚ Ab Minute 3 heilen richtige Antworten</b><span>3:00 = 3 %, 3:30 = 6 %, 4:00 = 10 %. Danach steigt die Heilung alle 30 Sekunden um 3 % bis maximal 30 % der maximalen HP.</span></div>
        <div class="wgGuideRule"><b>👆 Helfer platzieren</b><span>Helfer antippen oder per Drag & Drop auf ein freies Feld ziehen. „Umsetzen“ verschiebt bereits platzierte Helfer.</span></div>
        <div class="wgGuideHelpers">${helpers}</div>
      </section>`;
  }

  function prepareIntro(){
    const intro=$('intro');
    const modal=intro?.querySelector('.modal');
    const title=modal?.querySelector('h2');
    const button=$('startBtn');
    if(!modal||!title||!button||modal.dataset.wgOnboarding==='1')return;
    modal.dataset.wgOnboarding='1';
    modal.classList.add('wgStartModal');
    const oldP=modal.querySelector('p');
    if(oldP)oldP.remove();
    const guide=document.createElement('div');
    guide.className='wgStartGuide';
    guide.innerHTML=guideMarkup(true);
    title.insertAdjacentElement('afterend',guide);
    button.textContent='⚔️ Run starten';
    button.classList.add('wgStartRunBtn');
  }

  function prepareInfo(){
    const guide=$('guide');
    if(!guide)return;
    let overview=guide.querySelector('[data-wg-full-guide]');
    if(!overview){
      overview=document.createElement('div');
      overview.dataset.wgFullGuide='1';
      overview.className='wgFullGuide';
      overview.innerHTML=guideMarkup(false);
      guide.prepend(overview);
    }
  }

  function setVersion(){
    const el=document.querySelector('.version');
    if(el&&el.textContent!==VERSION)el.textContent=VERSION;
  }

  function animateToInfo(done){
    const modal=$('intro')?.querySelector('.modal');
    const info=$('infoBtn');
    if(!modal||!info||matchMedia('(prefers-reduced-motion: reduce)').matches){done();return;}
    const from=modal.getBoundingClientRect();
    const to=info.getBoundingClientRect();
    const ghost=modal.cloneNode(true);
    ghost.removeAttribute('id');
    ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    ghost.querySelectorAll('button').forEach(el=>el.disabled=true);
    ghost.classList.add('wgIntroMorphGhost');
    Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});
    document.body.appendChild(ghost);
    modal.classList.add('wgMorphSource');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const sx=Math.max(.05,to.width/from.width),sy=Math.max(.05,to.height/from.height);
      const tx=to.left-from.left,ty=to.top-from.top;
      ghost.style.transform=`translate(${tx}px,${ty}px) scale(${sx},${sy})`;
      ghost.style.opacity='.12';
      ghost.style.borderRadius='10px';
    }));
    setTimeout(()=>{
      ghost.remove();
      modal.classList.remove('wgMorphSource');
      info.classList.add('wgInfoArrival');
      setTimeout(()=>info.classList.remove('wgInfoArrival'),520);
      done();
    },430);
  }

  function bindStartMorph(){
    const button=$('startBtn');
    if(!button||button.dataset.wgMorphBound==='1')return;
    button.dataset.wgMorphBound='1';
    button.addEventListener('click',event=>{
      if(passthrough)return;
      if(morphing){event.preventDefault();event.stopImmediatePropagation();return;}
      event.preventDefault();
      event.stopImmediatePropagation();
      morphing=true;
      animateToInfo(()=>{
        passthrough=true;
        button.click();
        passthrough=false;
        morphing=false;
      });
    },true);
  }

  function mount(){
    setVersion();
    prepareIntro();
    prepareInfo();
    bindStartMorph();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  setInterval(()=>{setVersion();prepareInfo();},1200);
})();
