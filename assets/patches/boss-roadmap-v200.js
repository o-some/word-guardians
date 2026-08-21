(()=>{
  'use strict';

  const $=id=>document.getElementById(id);
  let lastKey='';

  function getBosses(){
    try{return typeof BOSSES!=='undefined'&&Array.isArray(BOSSES)?BOSSES:[];}catch{return[];}
  }

  function getState(){
    try{return typeof S!=='undefined'&&S?S:null;}catch{return null;}
  }

  function getActiveBoss(state){
    if(!state||!Array.isArray(state.e))return null;
    return state.e.find(enemy=>enemy&&enemy.hp>0&&typeof enemy.cl==='string'&&enemy.cl.includes('boss'))||null;
  }

  function ensureRoadmap(){
    let roadmap=document.querySelector('.wgBossRoadmap');
    if(roadmap)return roadmap;
    const dock=$('dock');
    if(!dock||!dock.parentElement)return null;
    roadmap=document.createElement('section');
    roadmap.className='wgBossRoadmap';
    roadmap.setAttribute('aria-label','Nächste Bosse');
    roadmap.innerHTML='<div class="wgBossRoadmapHead"><span class="wgBossRoadmapTitle">☠ NÄCHSTE BOSSE</span><span class="wgBossRoadmapProgress"></span></div><div class="wgBossRoadmapTrack"></div>';
    dock.insertAdjacentElement('afterend',roadmap);
    return roadmap;
  }

  function nextIndex(state,bosses,active){
    if(!bosses.length)return 0;
    if(active&&Number.isFinite(active.rank))return Math.max(0,(active.rank-1)%bosses.length);
    const answered=Math.max(0,Number(state?.qc)||0);
    return Math.floor(answered/8)%bosses.length;
  }

  function progressText(state,active){
    if(active)return 'Bosskampf läuft';
    const answered=Math.max(0,Number(state?.qc)||0);
    const remainder=answered%8;
    const left=remainder===0&&answered>0?8:8-remainder;
    return `Nächster Boss in ${left} richtigen ${left===1?'Wort':'Wörtern'}`;
  }

  function render(){
    const bosses=getBosses();
    const state=getState();
    const roadmap=ensureRoadmap();
    if(!roadmap||!state||!bosses.length)return;

    const active=getActiveBoss(state);
    const start=nextIndex(state,bosses,active);
    const key=[start,active?.id||'',state.qc||0,bosses.length].join(':');
    if(key===lastKey)return;
    lastKey=key;

    const progress=roadmap.querySelector('.wgBossRoadmapProgress');
    if(progress)progress.textContent=progressText(state,active);

    const track=roadmap.querySelector('.wgBossRoadmapTrack');
    if(!track)return;
    track.innerHTML='';

    for(let offset=0;offset<4;offset++){
      const index=(start+offset)%bosses.length;
      const boss=bosses[index];
      const card=document.createElement('div');
      const current=!!active&&offset===0;
      card.className='wgBossRoadmapCard'+(current?' current':'');
      card.innerHTML=`<b>${index+1}</b>${current?'<em>AKTUELL</em>':''}<img src="${boss.asset}" alt="${boss.n}"><small>${boss.n}</small>`;
      track.appendChild(card);
    }
  }

  function loop(){
    render();
    window.setTimeout(loop,220);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loop,{once:true});
  else loop();
})();
