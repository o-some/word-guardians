(()=>{
  const pauseState={uses:3,mounted:false};
  const stats=window.WGRunStats=window.WGRunStats||{bossesDefeated:0,laneRescues:0,emergencyUses:0};
  const $=id=>document.getElementById(id);

  function updateUi(){
    const lower=$('pauseBtn');const paused=typeof S!=='undefined'&&S&&S.pause;const ended=typeof S!=='undefined'&&S&&S.end;
    document.body.classList.toggle('wgFullPause',!!paused&&!ended);
    const obsoleteTop=$('topPauseBtn');if(obsoleteTop)obsoleteTop.remove();
    if(lower){lower.disabled=pauseState.uses<=0||!!paused||!!ended;lower.textContent=pauseState.uses>0?'Ⅱ Pause · '+pauseState.uses+'×':'Ⅱ Pause verbraucht';lower.classList.toggle('exhausted',pauseState.uses<=0);}
    if(ended)enhanceEndscreen();
  }

  function enhanceEndscreen(){
    if(document.querySelector('[data-wg-premium-end]'))return;
    const visible=[...document.querySelectorAll('.overlay:not(.hidden) .modal')].pop();if(!visible)return;
    const hero=document.createElement('section');hero.className='wgPremiumEnd';hero.dataset.wgPremiumEnd='1';
    const bossCount=Number(stats.bossesDefeated||0),rescues=Number(stats.laneRescues||0),calls=Number(stats.emergencyUses||0);
    const title=bossCount>=3?'Legendärer Run!':bossCount>0?'Starker Wächter-Run!':'Starke Leistung!';
    const sub=bossCount>0?`Du hast ${bossCount} Boss${bossCount===1?'':'e'} bezwungen und deine Insel verteidigt.`:'Jedes gelöste Wort hat deine Verteidigung stärker gemacht.';
    hero.innerHTML=`<div class="wgEndCrown">✦ WORD GUARDIAN ✦</div><h2>${title}</h2><p>${sub}</p><div class="wgEndHighlights"><div><strong>☠️ ${bossCount}</strong><span>Bosse besiegt</span></div><div><strong>🪨 ${rescues}</strong><span>Linien gerettet</span></div><div><strong>🚨 ${calls}</strong><span>Notrufe</span></div></div>`;
    const h2=visible.querySelector('h2');if(h2)h2.style.display='none';
    const wow=visible.querySelector('.wow');if(wow)wow.style.display='none';
    const resultTula=visible.querySelector('.resultTula');if(resultTula)resultTula.insertAdjacentElement('afterend',hero);else visible.prepend(hero);
    visible.classList.add('wgPremiumResultModal');
  }

  function mount(){
    if(pauseState.mounted)return;const lower=$('pauseBtn');if(!lower)return;
    lower.addEventListener('click',event=>{if(typeof S==='undefined'||!S||S.end||S.pause)return;if(pauseState.uses<=0){event.preventDefault();event.stopImmediatePropagation();updateUi();return;}pauseState.uses--;setTimeout(updateUi,0);},true);
    const resume=$('resumeBtn');if(resume)resume.addEventListener('click',()=>setTimeout(updateUi,0));
    const guide=$('guide');if(guide&&!guide.querySelector('[data-top-pause-info]')){const item=document.createElement('div');item.className='gitem';item.dataset.topPauseInfo='1';item.innerHTML='⏸ <b>3× Vollpause</b> – pro Run kannst du das gesamte Spiel dreimal komplett anhalten. Gegner, Spawns, Kampf und der Notruf-Cooldown warten mit dir.';guide.appendChild(item);}
    pauseState.mounted=true;updateUi();
  }

  function tick(){mount();updateUi();setTimeout(tick,220)}
  mount();setTimeout(tick,220);
})();
