// ================= 全局变量 =================
const siteConfig = {
  adminAccount: "admin",
  adminPassword: "carterthyia",
  siteName: "卡提希娅的星光小站",
  siteDomain: "www.carterthyia.com",
  siteDescription: "于光影中守护的温柔使者 · 双形态战斗达人卡提希娅专属站点",
  defaultTheme: "purple",
  defaultMode: "light",
  videoConfig: {
    smallCardVideo: "videos/111.mp4",
    bigCardVideo: "videos/12.mp4",
    videoPoster1: "1.jpg",
    videoPoster2: "2.jpg"
  },
  galleryCount: 8,
  galleryTypes: ["all", "art", "battle", "daily", "beauty"]
};
window.siteConfig = siteConfig;

let currentTheme = window.siteConfig.defaultTheme;
let isDarkMode = window.siteConfig.defaultMode === 'dark';
let isStoryVisible = true;

// ================= 初始化 =================
window.addEventListener('DOMContentLoaded', () => {
  if (!window.siteConfig) console.warn("config.js 未加载成功，使用默认配置");
  initAnimations();
  initNavbar();
  initBackToTop();
  initGalleryFilter();
  initGuideTab();
  initDefaultThemeAndMode();
  initCustomColorPicker();
  // 移除 initVideoTabs 函数，避免动态修改视频路径
});

// ================= 主题 & 深色模式 =================
function initDefaultThemeAndMode() {
  const root = document.documentElement;
  const modeBtn = document.querySelector('.control-btn:nth-child(4) i'); // 调整索引：因新增调色器，深色模式按钮变为第4个
  // 初始化CSS变量（确保主题色变量存在）
  if (!root.style.getPropertyValue('--primary-color-purple')) {
    root.style.setProperty('--primary-color-purple', '#8a5cf7');
    root.style.setProperty('--secondary-color-purple', '#a78bfa');
    root.style.setProperty('--bg-color-purple', '#f5f3ff');
    root.style.setProperty('--primary-color-blue', '#3b82f6');
    root.style.setProperty('--secondary-color-blue', '#60a5fa');
    root.style.setProperty('--bg-color-blue', '#eff6ff');
  }
  switchTheme(currentTheme);
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    modeBtn?.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.remove('dark-mode');
    modeBtn?.classList.replace('fa-sun', 'fa-moon');
  }
  document.title = window.siteConfig?.siteName || "卡提希娅的星光小站";
}

// 新增：初始化自定义调色器
function initCustomColorPicker() {
  const colorPicker = document.getElementById('customColorPicker');
  if (colorPicker) {
    // 同步调色器初始值为当前主题色
    const root = document.documentElement;
    const currentPrimary = root.style.getPropertyValue('--primary-color').replace('var(', '').replace(')', '').split('-color-')[1]
      ? (currentTheme === 'purple' ? '#8a5cf7' : '#3b82f6')
      : root.style.getPropertyValue('--primary-color');
    colorPicker.value = currentPrimary;
  }
}

// 滚动动效
function initAnimations() {
  window.addEventListener('scroll', function() {
    document.querySelectorAll('.section-animate').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.8) element.classList.add('visible');
    });
    document.querySelectorAll('.card-animate').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) element.classList.add('visible');
    });
  });
  window.dispatchEvent(new Event('scroll'));
}

// 导航栏
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  window.addEventListener('scroll', () => window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'));
  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    navMenu?.classList.contains('active') ? icon.classList.replace('fa-bars', 'fa-times') : icon.classList.replace('fa-times', 'fa-bars');
  });
}

// 回到顶部
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => window.scrollY > 300 ? backToTopBtn?.classList.remove('hidden') : backToTopBtn?.classList.add('hidden'));
  backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 图库筛选
function initGalleryFilter() {
  document.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const filterType = this.dataset.type;
      document.querySelectorAll('.gallery-img').forEach(img => {
        if (filterType === 'all' || img.dataset.type === filterType) {
          img.style.display = 'block';
          setTimeout(() => img.style.opacity = '1', 100);
        } else {
          img.style.opacity = '0';
          setTimeout(() => img.style.display = 'none', 300);
        }
      });
    });
  });
}

// 攻略标签
function initGuideTab() {
  const guideTabs = document.querySelectorAll('.tab-btn');
  guideTabs[0]?.classList.add('active');
  document.querySelectorAll('.guide-content')[0]?.classList.remove('hidden');
  guideTabs.forEach(tab => {
    tab.addEventListener('click', () => switchGuideTab(tab.dataset.tab));
  });
}

// 主题切换（兼容原有固定主题 + 自定义调色）
function switchTheme(theme) {
  const root = document.documentElement;
  currentTheme = theme;
  if (theme === 'purple') {
    root.style.setProperty('--primary-color', 'var(--primary-color-purple)');
    root.style.setProperty('--secondary-color', 'var(--secondary-color-purple)');
    root.style.setProperty('--bg-color', 'var(--bg-color-purple)');
  } else if (theme === 'blue') {
    root.style.setProperty('--primary-color', 'var(--primary-color-blue)');
    root.style.setProperty('--secondary-color', 'var(--secondary-color-blue)');
    root.style.setProperty('--bg-color', 'var(--bg-color-blue)');
  }
  // 同步更新自定义调色器的值
  const colorPicker = document.getElementById('customColorPicker');
  if (colorPicker) {
    colorPicker.value = root.style.getPropertyValue('--primary-color').replace('var(', '').replace(')', '').split('-color-')[1]
      ? (theme === 'purple' ? '#8a5cf7' : '#3b82f6')
      : root.style.getPropertyValue('--primary-color');
  }
}

// 新增：自定义调色应用
function applyCustomTheme() {
  const colorPicker = document.getElementById('customColorPicker');
  if (!colorPicker) return;

  const customColor = colorPicker.value;
  const root = document.documentElement;
  // 生成浅/深色调（保证视觉协调）
  const lightColor = lightenColor(customColor, 20);
  const darkColor = darkenColor(customColor, 20);

  // 覆盖主题色变量
  root.style.setProperty('--primary-color', customColor);
  root.style.setProperty('--secondary-color', lightColor);
  root.style.setProperty('--bg-color', lightenColor(customColor, 85)); // 背景色超浅
  currentTheme = 'custom'; // 标记为自定义主题
}

// 新增：颜色变浅辅助函数
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
}

// 新增：颜色变深辅助函数
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
}

// 深色模式切换
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  const modeBtn = document.querySelector('.control-btn:nth-child(4) i'); // 调整索引：深色模式按钮变为第4个
  modeBtn?.classList.toggle('fa-moon');
  modeBtn?.classList.toggle('fa-sun');
}

// 故事展开收起
function toggleStory() {
  const storyContent = document.getElementById('storyContent');
  const storyToggle = document.getElementById('storyToggle');
  isStoryVisible = !isStoryVisible;
  if (isStoryVisible) {
    storyContent.style.display = 'block';
    storyToggle.innerHTML = '<i class="fa fa-chevron-up"></i> 收起故事';
  } else {
    storyContent.style.display = 'none';
    storyToggle.innerHTML = '<i class="fa fa-chevron-down"></i> 展开故事';
  }
}

// 攻略标签切换
function switchGuideTab(tabType) {
  document.querySelectorAll('.guide-content').forEach(content => content.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${tabType}Content`)?.classList.remove('hidden');
  document.querySelector(`.tab-btn[data-tab="${tabType}"]`)?.classList.add('active');
}

// 图片预览
function previewImage(src) {
  const modal = document.getElementById('imagePreviewModal');
  const previewImg = document.getElementById('previewImage');
  previewImg.src = src;
  modal.classList.remove('modal-hidden');
  document.body.style.overflow = 'hidden';
}
function closeImagePreview() {
  const modal = document.getElementById('imagePreviewModal');
  modal.classList.add('modal-hidden');
  document.body.style.overflow = 'auto';
}

// 视频播放
function playVideo(playerId, coverElement) {
  const videoElement = document.getElementById(playerId);
  if (!videoElement || !coverElement) {
    alert('视频元素初始化失败，请刷新页面重试');
    return;
  }
  const playPromise = videoElement.play();
  if (playPromise) {
    playPromise.then(() => coverElement.style.display = 'none')
      .catch(() => {
        coverElement.style.display = 'none';
        alert('视频自动播放被浏览器限制，请手动点击视频控件播放');
      });
  } else coverElement.style.display = 'none';
  videoElement.addEventListener('ended', () => {
    videoElement.currentTime = 0;
    coverElement.style.display = 'flex';
  });
}

// 视频切换
function switchVideo(type) {
  document.querySelectorAll('.gallery-tab[data-type]').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.gallery-tab[data-type="${type}"]`)?.classList.add('active');
  if (type === 'small') {
    document.getElementById('smallVideo').classList.remove('hidden');
    document.getElementById('bigVideo').classList.add('hidden');
  } else if (type === 'big') {
    document.getElementById('smallVideo').classList.add('hidden');
    document.getElementById('bigVideo').classList.remove('hidden');
  }
}

/* ===== 二次元玻璃水滴 追加区 ===== */
(function(){
  // 1. 星空粒子
  const canvas=document.createElement('canvas');
  canvas.id='starCanvas';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let w,h,mx,my,particles=[];
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
  window.addEventListener('resize',resize);resize();
  mx=w/2;my=h/2;window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  class P{constructor(){this.x=Math.random()*w;this.y=h+20;this.vy=-(1+Math.random()*2);this.vx=(Math.random()-0.5)*0.6;this.r=Math.random()*1.5+0.5;}update(){this.y+=this.vy;this.x+=this.vx;const dx=this.x-mx,dy=this.y-my,d=Math.hypot(dx,dy);if(d<120){this.x+=dx/d*1.2;this.y+=dy/d*1.2;}if(this.y<-20)this.y=h+20;}draw(){ctx.beginPath();const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(180,160,255,0)');ctx.fillStyle=g;ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();}}
  function animate(){ctx.clearRect(0,0,w,h);if(particles.length<(window.innerWidth<768?60:120))particles.push(new P());particles=particles.filter(p=>{p.update();p.draw();return p.y>-30;});requestAnimationFrame(animate);}
  animate();

  // 2. 水滴涟漪
  document.body.addEventListener('click',function(e){
    const card=e.target.closest('.card-animate,.video-container,.gallery-img,.btn');
    if(!card)return;
    const rect=card.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
    const ripple=document.createElement('span');
    ripple.className='ripple';
    ripple.style.width=ripple.style.height='20px';
    ripple.style.left=x-10+'px';ripple.style.top=y-10+'px';
    card.style.position='relative';card.style.overflow='hidden';
    card.appendChild(ripple);
    setTimeout(()=>ripple.remove(),600);
  });

  // 3. 导航水滴
  const drop=document.createElement('svg');
  drop.id='navDrop';
  drop.setAttribute('viewBox','0 0 40 40');
  drop.setAttribute('width','38');
  drop.setAttribute('height','38');
  drop.innerHTML=`
    <defs>
      <linearGradient id="dropGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
    <path d="M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2zm0 30c-6.6 0-12-5.4-12-12 0-3.4 1.4-6.5 3.7-8.7l8.3 8.7 8.3-8.7C30.6 15.5 32 18.6 32 22c0 6.6-5.4 12-12 12z" fill="url(#dropGrad)"/>
  `;
  document.body.appendChild(drop);
})();