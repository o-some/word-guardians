(()=>{
  const ability={duration:180,remaining:0,last:performance.now(),mounted:false,firing:false};
  const $=id=>document.getElementById(id);
  const qsa=s=>[...document.querySelectorAll(s)];

  function iconSvg(){return `<svg class="emergencyIcon" viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4a9"/><stop offset=".42" stop-color="#efc766"/><stop offset="1" stop-color="#b77b27"/></linearGradient><radialGradient id="ea" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#bffcff"/><stop offset=".5" stop-color="#4de3d6"/><stop offset="1" stop-color="#087b88"/></radialGradient></defs><circle cx="48" cy="48" r="42" fill="#052b43" stroke="url(#eg)" stroke-width="5"/><circle cx="48" cy="48" r="33" fill="url(#ea)" opacity=".92"/><path d="M29 58c10-3 14-13 15-26 9 6 17 7 24 3-2 17-11 29-28 34-5-2-9-6-11-11Z" fill="#fff5dc" stroke="#d6a84d" stroke-width="3"/><path d="M38 39c7 7 13 15 14 25M44 35c8 7 14 13 18 20" fill="none" stroke="#e1ba63" stroke-width="2.4" stroke-linecap="round"/><path d="M18 31c8-6 14-8 20-9M78 31c-8-6-14-8-20-9M16 66c9 5 16 7 22 7M80 66c-9 5-16 7-22 7" fill="none" stroke="#7ff5eb" stroke-width="4" stroke-linecap="round" opacity=".9"/></svg>`}

  function ensureUi(){
    const version=document.querySelector('.version');
    if(version)version.textContent='v1.6.0 · TOP PAUSE + NOTRUF · 4×8';
    if(ability.mounted)return;
    const bossStage=$('bossStage');
    const board=$('boardBox');
    const anchor=bossStage||board;
    if(!anchor)return;
    const wrap=document.createElement('div');
    wrap.className='emergencyWrap emergencyPreBoard';
    wrap.innerHTML=`<div id="emergencyTimer" class="emergencyTimer ready">READY</div><button id="emergencyBtn" class="emergencyBtn glass ready" type="button" style="--charge:100%">${iconSvg()}<span class="emergencyCopy"><b>INSEL-NOTRUF</b><small>100 % Schaden an allen aktuellen Gegnern</small></span><span class="emergencyCharge"><i></i></span></button>`;
    anchor.insertAdjacentElement('beforebegin',wrap);
    $('emergencyBtn').addEventListener('click',fire);
    const guide=$('guide');
    if(guide&&!guide.querySelector('[data-emergency-info]')){
      const item=document.createElement('div');item.className='gitem';item.dataset.emergencyInfo='1';item.innerHTML='🚨 <b>Insel-Notruf</b> – startet READY. Ein Einsatz besiegt alle aktuell sichtbaren Gegner, unabhängig von ihren HP. Danach lädt die Fähigkeit 3:00 Minuten nach. Der Cooldown pausiert mit dem Spiel.';guide.appendChild(item);
    }
    ability.mounted=true;
    updateUi();
  }

  function updateUi(){
    if(!ability.mounted)return;
    const btn=$('emergencyBtn'),timer=$('emergencyTimer');
    if(!btn||!timer)return;
    const ready=ability.remaining<=0.001;
    const progress=ready?1:Math.max(0,Math.min(1,1-ability.remaining/ability.duration));
    btn.style.setProperty('--charge',(progress*100).toFixed(1)+'%');
    const gray=ready?0:Math.max(0,0.93-progress*0.93);
    const sat=ready?1.12:0.18+progress*0.94;
    btn.style.setProperty('--abilityGray',gray.toFixed(3));
    btn.style.setProperty('--abilitySat',sat.toFixed(3));
    btn.classList.toggle('ready',ready);
    btn.classList.toggle('cooling',!ready);
    btn.disabled=!ready || (typeof S!=='undefined'&&S&&(S.pause||S.end));
    timer.classList.toggle('ready',ready);
    if(ready){timer.textContent='READY';}
    else{
      const sec=Math.max(0,Math.ceil(ability.remaining));
      timer.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
    }
  }

  function fieldPulse(){
    const board=document.getElementById('boardBox');
    if(!board)return;
    const wave=document.createElement('div');wave.className='emergencyWave';wave.innerHTML='<span></span><span></span><span></span>';board.appendChild(wave);
    qsa('.cell').forEach((cell,i)=>{setTimeout(()=>{cell.classList.add('emergencyCellFlash');setTimeout(()=>cell.classList.remove('emergencyCellFlash'),520)},(i%8)*34+Math.floor(i/8)*18)});
    setTimeout(()=>wave.remove(),1050);
  }

  function fire(){
    if(ability.remaining>0||ability.firing)return;
    if(typeof S==='undefined'||!S||S.pause||S.end)return;
    const targets=Array.isArray(S.e)?S.e.filter(e=>e&&e.hp>0):[];
    if(!targets.length){const fb=$('fb');if(fb)fb.textContent='🚨 Insel-Notruf ist READY – aber gerade sind keine Piraten auf dem Feld.';const btn=$('emergencyBtn');if(btn){btn.classList.add('noTarget');setTimeout(()=>btn.classList.remove('noTarget'),420)}return;}
    ability.firing=true;
    const now=performance.now();
    for(const e of targets){e.hitUntil=now+420;e.hp=0;}
    fieldPulse();
    const btn=$('emergencyBtn');if(btn){btn.classList.add('firing');setTimeout(()=>btn.classList.remove('firing'),900)}
    const fb=$('fb');if(fb)fb.textContent='🚨 INSEL-NOTRUF! '+targets.length+' Gegner wurden mit 100 % Feldschaden ausgeschaltet.';
    ability.remaining=ability.duration;
    setTimeout(()=>{ability.firing=false;updateUi()},250);
    updateUi();
  }

  function loop(ts){
    const dt=Math.min(.1,Math.max(0,(ts-ability.last)/1000));ability.last=ts;
    ensureUi();
    if(ability.remaining>0&&typeof S!=='undefined'&&S&&!S.pause&&!S.end){ability.remaining=Math.max(0,ability.remaining-dt);}
    updateUi();
    requestAnimationFrame(loop);
  }

  ensureUi();requestAnimationFrame(loop);
})();
