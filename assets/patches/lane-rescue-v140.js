(()=>{
  const rescue={used:[false,false,false,false],rocks:[],last:performance.now(),guideAdded:false,introAdded:false,lastFrame:0};
  const stats=window.WGRunStats=window.WGRunStats||{bossesDefeated:0,laneRescues:0,emergencyUses:0};
  const mobile=matchMedia('(max-width: 600px), (pointer: coarse)').matches;
  const frameBudget=mobile?33:16;
  const qsa=s=>[...document.querySelectorAll(s)];
  const byId=id=>document.getElementById(id);

  function ensureUi(){
    qsa('.lane').forEach((lane,r)=>{
      const home=lane.querySelector('.home');
      if(!home)return;
      home.classList.toggle('rescueUsed',rescue.used[r]);
      home.title=rescue.used[r]?'Linien-Retter bereits verbraucht':'1× kostenloser Linien-Retter bereit';
    });
    const guide=byId('guide');
    if(guide&&!rescue.guideAdded&&!guide.querySelector('[data-lane-rescue-info]')){
      const item=document.createElement('div');item.className='gitem';item.dataset.laneRescueInfo='1';
      item.innerHTML='🪨 <b>Linien-Retter</b> – jede Spur besitzt genau 1 kostenlosen Reset. Beim ersten Durchbruch rollt ein riesiger Felsen über die komplette Reihe und besiegt dort alle Gegner – auch einen Boss. Danach kostet ein weiterer Durchbruch auf dieser Spur wieder ein Leben.';
      guide.appendChild(item);rescue.guideAdded=true;
    }
    const intro=document.querySelector('#intro .modal p');
    if(intro&&!rescue.introAdded&&!intro.textContent.includes('Linien-Retter')){intro.textContent+=' Jede der vier Spuren hat außerdem genau einen kostenlosen Linien-Retter.';rescue.introAdded=true;}
  }

  function activeRockForLane(r){return rescue.rocks.find(k=>k.active&&k.r===r)}
  function trigger(r,escapedEnemy){
    if(rescue.used[r])return false;
    const lane=qsa('.lane')[r];if(!lane)return false;
    rescue.used[r]=true;stats.laneRescues+=1;
    if(escapedEnemy)escapedEnemy.hp=0;
    const home=lane.querySelector('.home');if(home){home.classList.add('rescueUsed');home.title='Linien-Retter bereits verbraucht'}
    lane.classList.add('rescueActive');
    const el=document.createElement('div');el.className='rescueRock';el.innerHTML='<span class="rescueImpactText">GRATIS-RESET!</span><span class="rescueRockCore"></span>';lane.appendChild(el);
    rescue.rocks.push({r,x:3,rot:0,active:true,el});
    const fb=byId('fb');if(fb)fb.textContent='🪨 Linien-Retter! Spur '+(r+1)+' wird einmal kostenlos komplett geräumt.';
    return true;
  }

  function stepRock(rock,dt){
    rock.x+=dt*72;rock.rot+=dt*760;
    if(rock.el&&rock.el.isConnected){rock.el.style.transform=`translate3d(${rock.x}%,0,0)`;const core=rock.el.querySelector('.rescueRockCore');if(core)core.style.transform='rotate('+rock.rot+'deg)';}
    if(typeof S!=='undefined'&&S&&Array.isArray(S.e))for(const e of S.e){if(e&&e.hp>0&&e.r===rock.r&&e.x<=rock.x+5){e.hp=0;e.hitUntil=performance.now()+250;}}
    if(rock.x>=108){rock.active=false;const lane=qsa('.lane')[rock.r];if(lane)lane.classList.remove('rescueActive');if(rock.el){rock.el.classList.add('fadeOut');setTimeout(()=>rock.el&&rock.el.remove(),190);}}
  }

  function monitor(ts){
    if(ts-rescue.lastFrame<frameBudget){requestAnimationFrame(monitor);return;}rescue.lastFrame=ts;
    const dt=Math.min(.05,Math.max(0,(ts-rescue.last)/1000));rescue.last=ts;ensureUi();
    try{
      if(typeof S!=='undefined'&&S&&!S.pause&&!S.end&&Array.isArray(S.e)){
        for(const e of S.e){if(!e||e.hp<=0||e.r<0||e.r>3)continue;const rock=activeRockForLane(e.r);if(rock){if(e.x<=rock.x+6)e.hp=0;continue;}if(!rescue.used[e.r]&&e.x<=6)trigger(e.r,e);}
        for(const rock of rescue.rocks)if(rock.active)stepRock(rock,dt);
        rescue.rocks=rescue.rocks.filter(k=>k.active||k.x<109);
      }
    }catch(err){console.warn('Word Guardians lane-rescue monitor:',err)}
    requestAnimationFrame(monitor);
  }

  ensureUi();requestAnimationFrame(monitor);
})();
