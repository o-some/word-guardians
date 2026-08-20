(()=>{
  'use strict';

  const $=id=>document.getElementById(id);
  const DOCK_ORDER=['coral','bolt','jelly','shell','star','crab'];

  function ensureIdleContent(stage){
    let idle=stage.querySelector('.wgBossIdleContent');
    if(idle)return idle;
    idle=document.createElement('div');
    idle.className='wgBossIdleContent';
    idle.setAttribute('aria-hidden','true');
    idle.innerHTML='<div class="wgBossIdleMark">☠</div><div class="wgBossIdleText"><b>Kein Boss in Sicht</b><small>Die Gewässer sind ruhig.</small></div>';
    stage.appendChild(idle);
    return idle;
  }

  function ensureActiveHead(stage){
    let head=stage.querySelector('.wgBossActiveHead');
    if(head)return head;
    head=document.createElement('div');
    head.className='wgBossActiveHead hidden';
    head.setAttribute('aria-hidden','true');
    head.innerHTML='<img alt="">';
    stage.insertBefore(head,stage.firstChild);
    return head;
  }

  function activeBoss(){
    if(typeof S==='undefined'||!S||!Array.isArray(S.e))return null;
    return S.e.find(e=>e&&e.hp>0&&typeof e.cl==='string'&&e.cl.includes('boss'))||null;
  }

  function moveEnergyIntoQuestion(){
    const question=document.querySelector('.question');
    const tools=question?.querySelector('.tools');
    const energy=document.querySelector('.energy');
    if(!question||!tools||!energy)return;
    if(energy.parentElement===question&&energy.nextElementSibling===tools)return;
    question.insertBefore(energy,tools);
  }

  function reorderDock(){
    const dock=$('dock');
    if(!dock)return;
    const cards=[...dock.querySelectorAll('.card[data-g]')];
    if(cards.length!==DOCK_ORDER.length)return;
    const current=cards.map(card=>card.dataset.g);
    if(current.every((key,index)=>key===DOCK_ORDER[index]))return;
    const byType=new Map(cards.map(card=>[card.dataset.g,card]));
    DOCK_ORDER.forEach(type=>{const card=byType.get(type);if(card)dock.appendChild(card);});
  }

  function sync(){
    moveEnergyIntoQuestion();
    const stage=$('bossStage');
    if(stage){
      const idle=ensureIdleContent(stage);
      const head=ensureActiveHead(stage);
      const boss=activeBoss();
      const active=!!boss;
      stage.classList.toggle('wgBossIdle',!active);
      idle.classList.toggle('hidden',active);
      head.classList.toggle('hidden',!active);
      if(active){
        const img=head.querySelector('img');
        if(img&&boss.asset&&img.getAttribute('src')!==boss.asset)img.src=boss.asset;
        if(img)img.alt=boss.n||'Boss';
      }
    }
    reorderDock();
  }

  function loop(){sync();requestAnimationFrame(loop);}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(loop),{once:true});
  else requestAnimationFrame(loop);
})();
