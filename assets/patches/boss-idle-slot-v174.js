(()=>{
  'use strict';

  const $=id=>document.getElementById(id);

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

  function sync(){
    const stage=$('bossStage');
    if(!stage)return;
    ensureIdleContent(stage);
    stage.classList.toggle('wgBossIdle',!hasActiveBoss());
  }

  function loop(){
    sync();
    requestAnimationFrame(loop);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(loop),{once:true});
  else requestAnimationFrame(loop);
})();
