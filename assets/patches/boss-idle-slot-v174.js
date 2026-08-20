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

  function hasActiveBoss(){
    return typeof S!=='undefined'&&S&&Array.isArray(S.e)&&S.e.some(e=>e&&e.hp>0&&typeof e.cl==='string'&&e.cl.includes('boss'));
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
    const stage=$('bossStage');
    if(stage){
      const idle=ensureIdleContent(stage);
      const active=hasActiveBoss();
      stage.classList.toggle('wgBossIdle',!active);
      idle.classList.toggle('hidden',active);
    }
    reorderDock();
  }

  function loop(){sync();requestAnimationFrame(loop);}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(loop),{once:true});
  else requestAnimationFrame(loop);
})();
