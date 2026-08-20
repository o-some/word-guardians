(()=>{
  'use strict';

  const VERSION='v1.7.1 · COMPACT + DRAG & DROP · 4×8';
  const state={pointerId:null,card:null,startX:0,startY:0,active:false,ghost:null,hot:null,suppressClick:false};
  const qsa=s=>[...document.querySelectorAll(s)];

  function setVersion(){
    const version=document.querySelector('.version');
    if(version)version.textContent=VERSION;
  }

  function decorate(){
    qsa('.dock .card').forEach(card=>{
      if(card.dataset.wgDndReady==='1')return;
      card.dataset.wgDndReady='1';
      card.setAttribute('draggable','false');
      card.title=(card.title?card.title+' · ':'')+'Ziehen und auf einem freien Feld loslassen';
      card.addEventListener('pointerdown',onPointerDown);
      card.addEventListener('click',event=>{
        if(state.suppressClick){event.preventDefault();event.stopImmediatePropagation();state.suppressClick=false;}
      },true);
    });
  }

  function ghostFor(card){
    const ghost=document.createElement('div');
    ghost.className='wgGuardianDragGhost';
    const art=card.querySelector('.guardianArt,.premiumGuardian,img,.ico');
    if(art){
      const clone=art.cloneNode(true);
      clone.removeAttribute?.('id');
      ghost.appendChild(clone);
    }
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveGhost(x,y){
    if(!state.ghost)return;
    state.ghost.style.left=x+'px';
    state.ghost.style.top=y+'px';
  }

  function targetCellAt(x,y){
    const el=document.elementFromPoint(x,y);
    return el?.closest?.('.cell')||null;
  }

  function setHot(cell){
    if(state.hot===cell)return;
    if(state.hot)state.hot.classList.remove('wgDropHot');
    state.hot=cell;
    if(cell)cell.classList.add('wgDropHot');
  }

  function beginDrag(event){
    state.active=true;
    state.card.classList.add('wgDragSource');
    document.body.classList.add('wgDraggingGuardian');
    qsa('.cell').forEach(cell=>cell.classList.add('wgDropReady'));
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
    const card=event.currentTarget;
    if(event.button!==undefined&&event.button!==0)return;
    if(card.disabled)return;
    if(typeof S!=='undefined'&&S&&(S.pause||S.end))return;
    state.pointerId=event.pointerId;
    state.card=card;
    state.startX=event.clientX;state.startY=event.clientY;
    state.active=false;
    try{card.setPointerCapture?.(event.pointerId)}catch{}
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

  function onPointerUp(event){
    if(state.pointerId===null||event.pointerId!==state.pointerId||!state.card)return;
    const card=state.card;
    const wasActive=state.active;
    const target=wasActive?targetCellAt(event.clientX,event.clientY):null;

    if(wasActive){
      event.preventDefault();
      state.suppressClick=true;
      cleanup();
      if(target&&document.contains(target)&&!card.disabled){
        // Reuse the existing, already-tested placement logic instead of duplicating game state mutations.
        state.suppressClick=false;
        card.click();
        target.click();
        const fb=document.getElementById('fb');
        if(fb&&target.querySelector('.guardianWrap'))fb.textContent='✨ Helfer platziert – Drag & Drop klappt auch mit dem Finger.';
      }
      setTimeout(()=>{state.suppressClick=false},0);
    }else{
      cleanup();
    }
  }

  function onPointerCancel(event){
    if(state.pointerId!==null&&event.pointerId===state.pointerId)cleanup();
  }

  document.addEventListener('pointermove',onPointerMove,{passive:false});
  document.addEventListener('pointerup',onPointerUp,{passive:false});
  document.addEventListener('pointercancel',onPointerCancel,{passive:true});

  function mount(){setVersion();decorate();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
  setInterval(mount,700);
})();
