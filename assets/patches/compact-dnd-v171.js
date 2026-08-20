(()=>{
  'use strict';

  const VERSION='v1.9.0 · DAMAGE SCALE + READABLE UI · 4×8';
  const state={mode:null,id:null,card:null,startX:0,startY:0,active:false,ghost:null,hot:null,suppressClick:false};
  const qsa=s=>[...document.querySelectorAll(s)];

  function setVersion(){
    const version=document.querySelector('.version');
    if(version&&version.textContent!==VERSION)version.textContent=VERSION;
  }

  function decorate(){
    qsa('.dock .card').forEach(card=>{
      card.setAttribute('draggable','false');
      card.dataset.wgDndReady='1';
      if(!card.title?.includes('Ziehen'))card.title=(card.title?card.title+' · ':'')+'Ziehen und auf einem freien Feld loslassen';
    });
  }

  function ghostFor(card){
    const ghost=document.createElement('div');
    ghost.className='wgGuardianDragGhost';
    const art=card.querySelector('.guardianArt,.premiumGuardian,img,.ico');
    if(art){const clone=art.cloneNode(true);clone.removeAttribute?.('id');ghost.appendChild(clone);}
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveGhost(x,y){if(state.ghost){state.ghost.style.left=x+'px';state.ghost.style.top=y+'px';}}
  function targetCellAt(x,y){return document.elementFromPoint(x,y)?.closest?.('.cell:not(.home)')||null;}

  function setHot(cell){
    if(state.hot===cell)return;
    state.hot?.classList.remove('wgDropHot');
    state.hot=cell;
    state.hot?.classList.add('wgDropHot');
  }

  function start(card,x,y,mode,id){
    if(!card||card.disabled||state.card)return false;
    if(typeof S!=='undefined'&&S&&(S.pause||S.end))return false;
    state.mode=mode;state.id=id;state.card=card;state.startX=x;state.startY=y;state.active=false;
    return true;
  }

  function begin(x,y){
    if(state.active||!state.card)return;
    state.active=true;
    state.card.classList.add('wgDragSource');
    document.body.classList.add('wgDraggingGuardian');
    qsa('.cell:not(.home)').forEach(cell=>cell.classList.add('wgDropReady'));
    state.ghost=ghostFor(state.card);
    moveGhost(x,y);
  }

  function move(x,y,event){
    if(!state.card)return;
    const dx=x-state.startX,dy=y-state.startY;
    if(!state.active&&Math.hypot(dx,dy)>=6)begin(x,y);
    if(!state.active)return;
    event?.preventDefault?.();
    moveGhost(x,y);
    setHot(targetCellAt(x,y));
  }

  function cleanup(){
    state.card?.classList.remove('wgDragSource');
    qsa('.cell.wgDropReady,.cell.wgDropHot').forEach(cell=>cell.classList.remove('wgDropReady','wgDropHot'));
    document.body.classList.remove('wgDraggingGuardian');
    state.ghost?.remove();
    state.mode=null;state.id=null;state.card=null;state.active=false;state.ghost=null;state.hot=null;
  }

  function placeFromDrag(card,target){
    if(!target||!document.contains(target)||card.disabled)return false;
    if(typeof S==='undefined'||!S||S.pause||S.end)return false;
    const r=Number(target.dataset.r),c=Number(target.dataset.c),type=card.dataset.g;
    if(!Number.isInteger(r)||!Number.isInteger(c)||!type)return false;
    if(S.g?.some(g=>g.r===r&&g.c===c))return false;
    const cfg=typeof G!=='undefined'?G[type]:null;
    if(!cfg||S.en<cfg.cost)return false;
    const before=Array.isArray(S.g)?S.g.length:0;
    S.sel=type;S.move=false;S.src=null;
    if(typeof tapCell!=='function')return false;
    tapCell(r,c);
    return Array.isArray(S.g)&&S.g.length===before+1&&S.g.some(g=>g.r===r&&g.c===c&&g.type===type);
  }

  function finish(x,y,event){
    if(!state.card)return;
    const card=state.card,wasActive=state.active,target=wasActive?targetCellAt(x,y):null;
    if(wasActive){
      event?.preventDefault?.();
      state.suppressClick=true;
      const placed=placeFromDrag(card,target);
      const fb=document.getElementById('fb');
      cleanup();
      if(fb){
        if(placed)fb.textContent='✨ Helfer platziert – Drag & Drop funktioniert mit Maus und Finger.';
        else if(target)fb.textContent='Dieses Feld ist belegt oder du hast nicht genug Energie.';
      }
      setTimeout(()=>{state.suppressClick=false},120);
    }else cleanup();
  }

  document.addEventListener('pointerdown',event=>{
    const card=event.target.closest?.('.dock .card');
    if(!card||event.button!==0)return;
    if(start(card,event.clientX,event.clientY,'pointer',event.pointerId))event.preventDefault();
  },{passive:false});
  document.addEventListener('pointermove',event=>{
    if(state.mode!=='pointer'||event.pointerId!==state.id)return;
    move(event.clientX,event.clientY,event);
  },{passive:false});
  document.addEventListener('pointerup',event=>{
    if(state.mode!=='pointer'||event.pointerId!==state.id)return;
    finish(event.clientX,event.clientY,event);
  },{passive:false});
  document.addEventListener('pointercancel',event=>{if(state.mode==='pointer'&&event.pointerId===state.id)cleanup();},{passive:true});

  document.addEventListener('touchstart',event=>{
    if(state.card)return;
    const card=event.target.closest?.('.dock .card');
    const touch=event.changedTouches?.[0];
    if(!card||!touch)return;
    if(start(card,touch.clientX,touch.clientY,'touch',touch.identifier))event.preventDefault();
  },{passive:false});
  document.addEventListener('touchmove',event=>{
    if(state.mode!=='touch')return;
    const changed=Array.from(event.changedTouches||[]),all=Array.from(event.touches||[]);
    const touch=changed.find(t=>t.identifier===state.id)||all.find(t=>t.identifier===state.id);
    if(!touch)return;
    move(touch.clientX,touch.clientY,event);
  },{passive:false});
  document.addEventListener('touchend',event=>{
    if(state.mode!=='touch')return;
    const touch=Array.from(event.changedTouches||[]).find(t=>t.identifier===state.id);
    if(!touch)return;
    finish(touch.clientX,touch.clientY,event);
  },{passive:false});
  document.addEventListener('touchcancel',()=>{if(state.mode==='touch')cleanup();},{passive:true});

  document.addEventListener('click',event=>{
    if(state.suppressClick&&event.target.closest?.('.dock .card')){event.preventDefault();event.stopImmediatePropagation();}
  },true);

  function mount(){setVersion();decorate();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  setInterval(mount,1000);
})();
