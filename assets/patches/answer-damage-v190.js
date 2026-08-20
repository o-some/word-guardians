(()=>{
  'use strict';

  const START_SECONDS=120;
  const MAX_BONUS=100;
  let milestoneShown=false;
  let popup=null;

  function bonusPercentForTime(seconds){
    const sec=Number(seconds)||0;
    if(sec<START_SECONDS)return 0;
    return Math.min(MAX_BONUS,Math.max(0,Math.floor(sec-START_SECONDS)));
  }

  function damageMultiplierForTime(seconds){
    return 1+bonusPercentForTime(seconds)/100;
  }

  function closeMilestone(){
    popup?.remove();
    popup=null;
    if(typeof S==='undefined'||!S||S.end)return;
    S.pause=false;
    S.last=performance.now();
  }

  function showMilestone(){
    if(milestoneShown||typeof S==='undefined'||!S||S.end||S.pause||S.time<START_SECONDS)return;
    milestoneShown=true;
    S.pause=true;
    S.last=performance.now();

    popup=document.createElement('div');
    popup.className='wgDamageMilestone';
    popup.setAttribute('role','dialog');
    popup.setAttribute('aria-modal','true');
    popup.setAttribute('aria-labelledby','wgDamageTitle');
    popup.innerHTML=`
      <section class="wgDamageCard">
        <div class="wgDamageBadge">✦</div>
        <div class="wgDamageCopy">
          <small>2:00 MINUTEN · WORTWELLE WIRD STÄRKER</small>
          <h2 id="wgDamageTitle">Deine richtigen Antworten machen jetzt mehr Schaden!</h2>
          <p>Ab jetzt steigt der Schaden deiner <b>Wortwelle</b> jede Sekunde um <b>1 % deines Grundschadens</b>.</p>
          <div class="wgDamageScale"><span><b>2:00</b> START</span><span><b>2:30</b> +30 %</span><span><b>3:00</b> +60 %</span><span><b>3:40</b> +100 %</span></div>
          <p class="wgDamageFine">Nach 100 Sekunden ist das Maximum erreicht: <b>+100 % Schaden</b>. Eine Wortwelle mit 1.000 Grundschaden verursacht dann 2.000 Schaden.</p>
          <button type="button" id="wgDamageContinue">Weiterkämpfen</button>
        </div>
      </section>`;
    document.body.appendChild(popup);
    popup.querySelector('#wgDamageContinue')?.addEventListener('click',closeMilestone,{once:true});
    setTimeout(()=>popup?.querySelector('#wgDamageContinue')?.focus(),0);
  }

  function watchMilestone(){
    if(!milestoneShown&&typeof S!=='undefined'&&S&&!S.end&&!S.pause&&S.time>=START_SECONDS)showMilestone();
    requestAnimationFrame(watchMilestone);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.answer');
    if(!button||typeof S==='undefined'||!S||S.end||S.pause||S.lock||!S.q)return;
    const chosen=button.textContent;
    const expected=S.q.en;
    if(chosen!==expected)return;

    const beforeQc=S.qc;
    const answerTime=S.time;
    const baseDamage=18+(S.co+1)*2;
    const targets=Array.isArray(S.e)?S.e.filter(enemy=>enemy&&enemy.hp>0):[];

    // Run after the game's original answer handler so the base word-wave
    // damage lands first and the bonus is added on top without touching
    // guardian attacks or any other combat logic.
    setTimeout(()=>{
      if(typeof S==='undefined'||!S||S.end||S.qc<=beforeQc)return;
      const bonus=bonusPercentForTime(answerTime);
      if(bonus<=0)return;
      const extraDamage=baseDamage*(bonus/100);
      let touched=false;
      for(const enemy of targets){
        if(!enemy||enemy.hp<=0)continue;
        enemy.hp-=extraDamage;
        touched=true;
      }
      if(touched&&typeof render==='function')render();
    },0);
  },true);

  window.WGAnswerDamage={bonusPercentForTime,damageMultiplierForTime};
  requestAnimationFrame(watchMilestone);
})();
