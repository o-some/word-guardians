(()=>{
  'use strict';

  const START_SECONDS=180;
  let milestoneShown=false;
  let popup=null;

  function healPercentForTime(seconds){
    const sec=Number(seconds)||0;
    if(sec<START_SECONDS)return 0;
    if(sec<210)return 3;
    if(sec<240)return 6;
    return Math.min(30,10+Math.floor((sec-240)/30)*3);
  }

  function applyHealing(percent){
    if(typeof S==='undefined'||!S||!Array.isArray(S.g)||percent<=0)return 0;
    let healedUnits=0;
    for(const guardian of S.g){
      if(!guardian||guardian.hp<=0||guardian.max<=0)continue;
      const before=guardian.hp;
      guardian.hp=Math.min(guardian.max,guardian.hp+guardian.max*(percent/100));
      if(guardian.hp>before)healedUnits++;
    }
    if(healedUnits&&typeof render==='function')render();
    return healedUnits;
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
    popup.className='wgHealMilestone';
    popup.setAttribute('role','dialog');
    popup.setAttribute('aria-modal','true');
    popup.setAttribute('aria-labelledby','wgHealTitle');
    popup.innerHTML=`
      <section class="wgHealCard">
        <div class="wgHealBadge">✚</div>
        <div class="wgHealCopy">
          <small>3:00 MINUTEN · NEUE KRAFT</small>
          <h2 id="wgHealTitle">Deine Wörter heilen jetzt!</h2>
          <p>Ab jetzt heilt jede <b>richtige Antwort</b> alle deine Helfer, die gerade auf dem Feld stehen.</p>
          <div class="wgHealScale"><span><b>3:00</b> 3 %</span><span><b>3:30</b> 6 %</span><span><b>4:00</b> 10 %</span><span><b>MAX</b> 30 %</span></div>
          <p class="wgHealFine">Danach steigt die Heilung alle 30 Sekunden um 3 % bis maximal 30 % der maximalen HP pro richtiger Antwort.</p>
          <button type="button" id="wgHealContinue">Weiterkämpfen</button>
        </div>
      </section>`;
    document.body.appendChild(popup);
    popup.querySelector('#wgHealContinue')?.addEventListener('click',closeMilestone,{once:true});
    setTimeout(()=>popup?.querySelector('#wgHealContinue')?.focus(),0);
  }

  function watchMilestone(){
    if(!milestoneShown&&typeof S!=='undefined'&&S&&!S.end&&!S.pause&&S.time>=START_SECONDS)showMilestone();
    requestAnimationFrame(watchMilestone);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.answer');
    if(!button||typeof S==='undefined'||!S||S.end||S.pause||S.lock||!S.q)return;
    const beforeQc=S.qc;
    const expected=S.q.en;
    const chosen=button.textContent;
    const answerTime=S.time;
    setTimeout(()=>{
      if(typeof S==='undefined'||!S||S.end)return;
      if(chosen!==expected||S.qc<=beforeQc)return;
      const percent=healPercentForTime(answerTime);
      if(percent>0)applyHealing(percent);
    },0);
  },true);

  window.WGAnswerHeal={healPercentForTime,applyHealing};
  requestAnimationFrame(watchMilestone);
})();
