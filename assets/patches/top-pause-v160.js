(()=>{
  const pauseState={uses:3,mounted:false};
  const $=id=>document.getElementById(id);

  function updateUi(){
    const version=document.querySelector('.version');
    if(version)version.textContent='v1.6.2 · HEADER NOTRUF · 4×8';

    const lower=$('pauseBtn');
    const paused=typeof S!=='undefined'&&S&&S.pause;
    const ended=typeof S!=='undefined'&&S&&S.end;
    document.body.classList.toggle('wgFullPause',!!paused&&!ended);

    const obsoleteTop=$('topPauseBtn');
    if(obsoleteTop)obsoleteTop.remove();

    if(lower){
      lower.disabled=pauseState.uses<=0||!!paused||!!ended;
      lower.textContent=pauseState.uses>0?'Ⅱ Pause · '+pauseState.uses+'×':'Ⅱ Pause verbraucht';
      lower.classList.toggle('exhausted',pauseState.uses<=0);
      lower.title=pauseState.uses>0?'Spiel vollständig pausieren · noch '+pauseState.uses+' Nutzung'+(pauseState.uses===1?'':'en'):'Pause für diesen Run verbraucht';
    }
  }

  function mount(){
    if(pauseState.mounted)return;
    const lower=$('pauseBtn');
    if(!lower)return;

    lower.addEventListener('click',event=>{
      if(typeof S==='undefined'||!S||S.end||S.pause)return;
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
