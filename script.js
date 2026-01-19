// 滚动淡入
document.addEventListener('DOMContentLoaded',()=>{
  const sections=document.querySelectorAll('.section-animate,.card-animate');
  const reveal=()=>{ sections.forEach(el=>{ const top=el.getBoundingClientRect().top; if(top<window.innerHeight*0.85) el.classList.add('visible');}); };
  window.addEventListener('scroll',reveal); reveal();
});

// 视频标签切换
document.querySelectorAll('.video-tab').forEach(tab=>{
  tab.addEventListener('click',function(){
    document.querySelectorAll('.video-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.video-container').forEach(v=>v.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.target).classList.add('active');
  });
});

// 视频播放
function playVideo(playerId,cover){
  const v=document.getElementById(playerId);
  if(!v||!cover)return;
  const p=v.play();
  if(p){p.then(()=>{cover.style.display='none';}).catch(()=>{alert('请手动播放视频');cover.style.display='none';});}
  v.addEventListener('ended',()=>{v.currentTime=0; cover.style.display='flex';});
}

// 攻略标签切换
function switchGuideTab(tab){
  document.querySelectorAll('.guide-content').forEach(c=>c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(tab+'Content').classList.remove('hidden');
  document.querySelector('.tab-btn[data-tab="'+tab+'"]').classList.add('active');
}

// 图片预览
function previewImage(src){
  let modal=document.getElementById('imagePreviewModal');
  if(!modal){
    modal=document.createElement('div'); modal.id='imagePreviewModal'; modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;';
    const img=document.createElement('img'); img.src=src; img.style.maxWidth='90%'; img.style.maxHeight='90%'; img.style.borderRadius='12px';
    modal.appendChild(img); document.body.appendChild(modal);
    modal.addEventListener('click',()=>{ modal.remove(); });
  }else modal.querySelector('img').src=src; modal.style.display='flex';
}
