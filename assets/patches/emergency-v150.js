(()=>{
  const ability={duration:60,remaining:0,last:performance.now(),mounted:false,firing:false};
  const stats=window.WGRunStats=window.WGRunStats||{bossesDefeated:0,laneRescues:0,emergencyUses:0};
  const mobile=matchMedia('(max-width: 600px), (pointer: coarse)').matches;
  const tickMs=mobile?180:100;
  const $=id=>document.getElementById(id);
  const qsa=s=>[...document.querySelectorAll(s)];

  function iconSvg(){return `<svg class="emergencyIcon" viewBox="0 0 96 96" aria-hidden="true"><defs><radialGradient id="alarmCore" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#ff9b8f"/><stop offset=".34" stop-color="#e62f36"/><stop offset="1" stop-color="#6f0b12"/></radialGradient><linearGradient id="alarmGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".46" stop-color="#e8bd59"/><stop offset="1" stop-color="#8a5a1d"/></linearGradient></defs><circle cx="48" cy="48" r="43" fill="#061b2b" stroke="url(#alarmGold)" stroke-width="5"/><circle cx="48" cy="48" r="35" fill="url(#alarmCore)" stroke="#ff6c6c" stroke-width="2"/><path d="M48 24 70 65H26Z" fill="#fff1d0" stroke="#6a1116" stroke-width="3"/><path d="M48 36v15" stroke="#9d1118" stroke-width="6" stroke-linecap="round"/><circle cx="48" cy="59" r="3.5" fill="#9d1118"/><path d="M18 48h-8M86 48h-8M48 18V10M48 86v-8" stroke="#ffcf67" stroke-width="4" stroke-linecap="round" opacity=".85"/></svg>`}

  function ensureUi(){
    const top=document.querySelector('.top'),hud=document.querySelector('.hud');if(!top||!hud)return;
    let slot=$('emergencyHeaderSlot');if(!slot){slot=document.createElement('div');slot.id='emergencyHeaderSlot';slot.className='emergencyHeaderSlot';top.insertBefore(slot,hud);}
    if(ability.mounted){const wrap=document.querySelector('.emergencyWrap');if(wrap&&wrap.parentElement!==slot)slot.appendChild(wrap);return;}
    const old=document.querySelector('.emergencyWrap');if(old)old.remove();
    const wrap=document.createElement('div');wrap.className='emergencyWrap emergencyHeader';
    wrap.innerHTML=`<button id="emergencyBtn" class="emergencyBtn emergencyNuke glass ready" type="button" style="--charge:100%">${iconSvg()}<span class="emergencyCopy"><b>INSEL-NOTRUF</b><small id="emergencyTimer" class="emergencyTimer ready">READY</small></span><span class="emergencyCharge"><i></i></span></button>`;
    slot.appendChild(wrap);$('emergencyBtn').addEventListener('click',fire);
    const guide=$('guide');if(guide&&!guide.querySelector('[data-emergency-info]')){const item=document.createElement('div');item.className='gitem';item.dataset.emergencyInfo='1';item.innerHTML='🚨 <b>Insel-Notruf</b> – der rote Alarmknopf startet READY. Er besiegt alle aktuell sichtbaren Gegner unabhängig von ihren HP. Danach lädt er 60 Sekunden nach.';guide.appendChild(item);}
    ability.mounted=true;updateUi();
  }

  function updateUi(){
    if(!ability.mounted)return;const btn=$('emergencyBtn'),timer=$('emergencyTimer');if(!btn||!timer)return;
    const ready=ability.remaining<=0.001,progress=ready?1:Math.max(0,Math.min(1,1-ability.remaining/ability.duration));
    btn.style.setProperty('--charge',(progress*100).toFixed(1)+'%');btn.style.setProperty('--abilityGray',(ready?0:Math.max(0,.94-progress*.94)).toFixed(3));btn.style.setProperty('--abilitySat',(ready?1.12:.18+progress*.94).toFixed(3));
    btn.classList.toggle('ready',ready);btn.classList.toggle('cooling',!ready);btn.disabled=!ready||(typeof S!=='undefined'&&S&&(S.pause||S.end));timer.classList.toggle('ready',ready);
    if(ready)timer.textContent='READY';else{const sec=Math.max(0,Math.ceil(ability.remaining));timer.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');}
  }

  function fieldPulse(){
    const board=$('boardBox');if(!board)return;const wave=document.createElement('div');wave.className='emergencyWave';wave.innerHTML=mobile?'<span></span>':'<span></span><span></span><span></span>';board.appendChild(wave);
    const cells=qsa('.cell');const flashCells=mobile?cells.filter((_,i)=>i%2===0):cells;
    flashCells.forEach((cell,i)=>setTimeout(()=>{cell.classList.add('emergencyCellFlash');setTimeout(()=>cell.classList.remove('emergencyCellFlash'),420)},(i%8)*22));
    setTimeout(()=>wave.remove(),900);
  }

  function fire(){
    if(ability.remaining>0||ability.firing)return;if(typeof S==='undefined'||!S||S.pause||S.end)return;
    const targets=Array.isArray(S.e)?S.e.filter(e=>e&&e.hp>0):[];
    if(!targets.length){const fb=$('fb');if(fb)fb.textContent='🚨 Insel-Notruf ist READY – aber gerade sind keine Piraten auf dem Feld.';const btn=$('emergencyBtn');if(btn){btn.classList.add('noTarget');setTimeout(()=>btn.classList.remove('noTarget'),420)}return;}
    ability.firing=true;stats.emergencyUses+=1;const now=performance.now();for(const e of targets){e.hitUntil=now+420;e.hp=0;}
    fieldPulse();const btn=$('emergencyBtn');if(btn){btn.classList.add('firing');setTimeout(()=>btn.classList.remove('firing'),760)}const fb=$('fb');if(fb)fb.textContent='🚨 INSEL-NOTRUF! '+targets.length+' Gegner wurden ausgeschaltet.';
    ability.remaining=ability.duration;setTimeout(()=>{ability.firing=false;updateUi()},250);updateUi();
  }

  function tick(){
    const now=performance.now(),dt=Math.min(.5,Math.max(0,(now-ability.last)/1000));ability.last=now;ensureUi();
    if(ability.remaining>0&&typeof S!=='undefined'&&S&&!S.pause&&!S.end)ability.remaining=Math.max(0,ability.remaining-dt);
    updateUi();setTimeout(tick,tickMs);
  }

  ensureUi();setTimeout(tick,tickMs);
})();
