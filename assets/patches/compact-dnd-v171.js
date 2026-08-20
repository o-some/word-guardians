(()=>{
  'use strict';

  const VERSION='v1.7.2 · STABLE DND · 4×8';
  const state={pointerId:null,card:null,startX:0,startY:0,active:false,ghost:null,hot:null,suppressClick:false};
  const qsa=s=>[...document.querySelectorAll(s)];
  const dock=()=>document.getElementById('dock')||document.querySelector('.dock');

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

  function beginDrag(event){
    state.active=true;
    state.card.classList.add('wgDragSource');
    document.body.classList.add('wgDraggingGuardian');
    qsa('.cell:not(.home)').forEach(cell=>cell.classList.add('wgDropReady'));
    state.ghost=ghostFor(state.card);
    moveGhost(event.clientX,event.clientY);
  }

  function cleanup(){
    state.card?.classList.remove('wgDragSource');
    qsa('.cell.wgDropReady,.cell.wgDropHot').forEach(cell=>cell.classList.remove('wgDropReady','wgDropHot'));
    document.body.classList.remove('wgDraggingGuardian');
    state.ghost?.remove();
    state.pointerId=null;state.card=null;state.active=false;state.ghost=null;state.hot=null;
  }

  function onPointerDown(event){
    const card=event.target.closest?.('.dock .card');
    if(!card)return;
    if(event.button!==undefined&&event.button!==0)return;
    if(card.disabled)return;
    if(typeof S!=='undefined'&&S&&(S.pause||S.end))return;
    state.pointerId=event.pointerId;
    state.card=card;
    state.startX=event.clientX;state.startY=event.clientY;
    state.active=false;
  }

  function onPointerMove(event){
    if(state.pointerId===null||event.pointerId!==state.pointerId||!state.card)return;
    const dx=event.clientX-state.startX,dy=event.clientY-state.startY;
    if(!state.active&&Math.hypot(dx,dy)>=8)beginDrag(event);
    if(!state.active)return;
    event.preventDefault();
    moveGhost(event.clientX,event.clientY);
    setHot(targetCellAt(event.clientX,event.clientY));
  }

  function placeFromDrag(card,target){
    if(!target||!document.contains(target)||card.disabled)return false;
    if(typeof S==='undefined'||!S||S.pause||S.end)return false;
    const r=Number(target.dataset.r),c=Number(target.dataset.c),type=card.dataset.g;
    if(!Number.isInteger(r)||!Number.isInteger(c)||!type)return false;
    if(S.g?.some(g=>g.r===r&&g.c===c))return false;
    const cfg=typeof G!=='undefined'?G[type]:null;
    if(!cfg||S.en<cfg.cost)return false;

    // Use the game's own placement function directly so energy, HP and render logic stay authoritative.
    S.sel=type;S.move=false;S.src=null;
    if(typeof tapCell==='function')tapCell(r,c);else return false;
    return !!target.querySelector('.guardianWrap');
  }

  function onPointerUp(event){
    if(state.pointerId===null||event.pointerId!==state.pointerId||!state.card)return;
    const card=state.card,wasActive=state.active,target=wasActive?targetCellAt(event.clientX,event.clientY):null;
    if(wasActive){
      event.preventDefault();
      state.suppressClick=true;
      const placed=placeFromDrag(card,target);
      cleanup();
      const fb=document.getElementById('fb');
      if(placed&&fb)fb.textContent='✨ Helfer platziert – Drag & Drop funktioniert mit Maus und Finger.';
      setTimeout(()=>{state.suppressClick=false},50);
    }else cleanup();
  }

  function onPointerCancel(event){if(state.pointerId!==null&&event.pointerId===state.pointerId)cleanup();}
  function onClickCapture(event){if(state.suppressClick&&event.target.closest?.('.dock .card')){event.preventDefault();event.stopImmediatePropagation();}}

  document.addEventListener('pointerdown',onPointerDown,{passive:true});
  document.addEventListener('pointermove',onPointerMove,{passive:false});
  document.addEventListener('pointerup',onPointerUp,{passive:false});
  document.addEventListener('pointercancel',onPointerCancel,{passive:true});
  document.addEventListener('click',onClickCapture,true);

  function mount(){setVersion();decorate();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  setInterval(mount,1000);
})();
