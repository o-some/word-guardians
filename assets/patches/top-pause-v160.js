(()=>{
  const pauseState={uses:3,mounted:false};
  const $=id=>document.getElementById(id);

  function updateUi(){
    const version=document.querySelector('.version');
    if(version)version.textContent='v1.6.0 · TOP PAUSE + NOTRUF · 4×8';

    const top=$('topPauseBtn');
    const lower=$('pauseBtn');
    const paused=typeof S!=='undefined'&&S&&S.pause;
    const ended=typeof S!=='undefined'&&S&&S.end;
    document.body.classList.toggle('wgFullPause',!!paused&&!ended);

    if(top){
      const count=top.querySelector('[data-pause-count]');
      if(count)count.textContent=String(pauseState.uses)+'×';
      top.disabled=pauseState.uses<=0||!!paused||!!ended;
      top.classList.toggle('exhausted',pauseState.uses<=0);
      top.title=pauseState.uses>0?'Spiel vollständig pausieren · noch '+pauseState.uses+' Nutzung'+(pauseState.uses===1?'':'en'):'Pause für diesen Run verbraucht';
    }
    if(lower){
      lower.disabled=pauseState.uses<=0||!!paused||!!ended;
      lower.textContent=pauseState.uses>0?'Ⅱ Pause · '+pauseState.uses+'×':'Ⅱ Pause verbraucht';
      lower.classList.toggle('exhausted',pauseState.uses<=0);
    }
  }

  function pauseNow(){
    if(typeof S==='undefined'||!S||S.pause||S.end||pauseState.uses<=0)return;
    pauseState.uses--;
    S.pause=true;
    const overlay=$('pauseOv');
    if(overlay)overlay.classList.remove('hidden');
    const title=overlay?.querySelector('h2');
    if(title)title.textContent='Pause · noch '+pauseState.uses+'× verfügbar';
    updateUi();
  }

  function mount(){
    if(pauseState.mounted)return;
    const hud=document.querySelector('.hud');
    const lower=$('pauseBtn');
    if(!hud||!lower)return;

    const btn=document.createElement('button');
    btn.id='topPauseBtn';
    btn.className='topPauseBtn glass';
    btn.type='button';
    btn.innerHTML='<span class="pauseIcon">Ⅱ</span><small>PAUSE</small><b data-pause-count>3×</b>';
    btn.addEventListener('click',pauseNow);
    hud.appendChild(btn);

    lower.addEventListener('click',event=>{
      if(typeof S==='undefined'||!S||S.end||S.pause){return;}
      if(pauseState.uses<=0){
        event.preventDefault();
        event.stopImmediatePropagation();
        updateUi();
        return;
      }
      pauseState.uses--;
      setTimeout(updateUi,0);
    },true);

    const resume=$('resumeBtn');
    if(resume)resume.addEventListener('click',()=>setTimeout(updateUi,0));

    const guide=$('guide');
    if(guide&&!guide.querySelector('[data-top-pause-info]')){
      const item=document.createElement('div');
      item.className='gitem';
      item.dataset.topPauseInfo='1';
      item.innerHTML='⏸ <b>3× Vollpause</b> – pro Run kannst du das gesamte Spiel dreimal komplett anhalten. Gegner, Spawns, Kampf und der 3-Minuten-Notruf-Cooldown warten mit dir. „Weiter“ verbraucht keine zusätzliche Pause.';
      guide.appendChild(item);
    }

    pauseState.mounted=true;
    updateUi();
  }

  function loop(){
    mount();
    updateUi();
    requestAnimationFrame(loop);
  }

  mount();
  requestAnimationFrame(loop);
})();
