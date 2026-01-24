// 全局变量 - 彻底移除config.js依赖，避免未定义报错
let currentTheme = 'purple';
let isDarkMode = false;
let isStoryVisible = true;
let rainEnabled = true;

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initNavbar();
    initBackToTop();
    initGalleryFilter();
    initGuideTab();
    initDefaultThemeAndMode();
    initCustomColorPicker();
    initRainEffect();
    initGalleryImgs(); // 初始化图库默认显示
});

// 初始化主题和深色模式 - 移除冗余CSS变量定义（样式表已配置，避免重复）
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i');
    
    // 直接初始化主题，复用样式表预设变量
    switchTheme(currentTheme);
    // 深色模式初始化
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        modeBtn && modeBtn.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('dark-mode');
        modeBtn && modeBtn.classList.replace('fa-sun', 'fa-moon');
    }
    document.title = "卡提希娅的星光小站";
}

// 初始化自定义调色器
function initCustomColorPicker() {
    const colorPicker = document.getElementById('customColorPicker');
    if (!colorPicker) return;
    colorPicker.value = '#8a5cf7';
    colorPicker.addEventListener('input', applyCustomTheme);
}

// 初始化雨滴效果
function initRainEffect() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    const rainColor = getCurrentRainColor();
    createRaindrops(rainColor);
    setInterval(() => {
        rainEnabled && createRaindrops(getCurrentRainColor());
    }, 5000);
}

// 生成雨滴
function createRaindrops(rainColor) {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    const rainCount = window.innerWidth < 768 ? 30 : 100;
    rainContainer.innerHTML = '';
    const targetElements = document.querySelectorAll('.navbar, .banner-bg, .card-animate');
    
    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        const left = Math.random() * 100;
        const height = Math.random() * 15 + 8;
        const duration = Math.random() * 0.8 + 0.3;
        const delay = Math.random() * 3;
        
        Object.assign(drop.style, {
            left: `${left}%`,
            height: `${height}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            background: `linear-gradient(transparent, ${rainColor})`,
            borderRadius: '0 0 50% 50%',
            position: 'absolute',
            opacity: '0',
            width: '2px',
            top: '-20px'
        });
        
        drop.addEventListener('animationend', function() {
            if (targetElements.length > 0 && Math.random() > 0.4 && rainEnabled) {
                try {
                    const randomTarget = targetElements[Math.floor(Math.random() * targetElements.length)];
                    const rect = randomTarget.getBoundingClientRect();
                    if (rect.top < 0 || rect.bottom > window.innerHeight) return;
                    
                    const splash = document.createElement('div');
                    splash.classList.add('rain-splash');
                    Object.assign(splash.style, {
                        position: 'absolute',
                        width: '8px',
                        height: '4px',
                        background: rainColor,
                        borderRadius: '50%',
                        transform: 'scale(0)',
                        animation: 'splash 0.5s ease-out forwards',
                        pointerEvents: 'none'
                    });
                    
                    const splashLeft = Math.max(0, Math.min(rect.left + Math.random() * rect.width, window.innerWidth - 8));
                    const splashTop = Math.max(0, Math.min(rect.top + Math.random() * rect.height, window.innerHeight - 4));
                    splash.style.left = `${splashLeft}px`;
                    splash.style.top = `${splashTop}px`;
                    rainContainer.appendChild(splash);
                    setTimeout(() => splash.remove(), 500);
                } catch (e) {}
            }
            setTimeout(() => drop.remove(), 100);
        });
        rainContainer.appendChild(drop);
    }
}

// 雨滴开关
function toggleRain() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    rainEnabled = !rainEnabled;
    rainContainer.style.display = rainEnabled ? 'block' : 'none';
    if (rainEnabled) {
        createRaindrops(getCurrentRainColor());
    }
}

// 滚动动效 - 节流优化
function initAnimations() {
    const scrollHandler = function() {
        try {
            if (scrollHandler.timer) clearTimeout(scrollHandler.timer);
            scrollHandler.timer = setTimeout(() => {
                document.querySelectorAll('.section-animate').forEach(element => {
                    if (element && element.getBoundingClientRect) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                            element.classList.add('visible');
                        }
                    }
                });
                document.querySelectorAll('.card-animate').forEach(element => {
                    if (element && element.getBoundingClientRect) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
                            element.classList.add('visible');
                        }
                    }
                });
            }, 50);
        } catch (e) {}
    };
    window.addEventListener('scroll', scrollHandler);
    setTimeout(() => scrollHandler(), 200); // 初始执行
}

// 导航栏
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
        });
    }
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon && (navMenu.classList.contains('active') 
                ? icon.classList.replace('fa-bars', 'fa-times') 
                : icon.classList.replace('fa-times', 'fa-bars'));
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
}

// 回到顶部
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // 初始化样式
    Object.assign(backToTopBtn.style, {
        zIndex: '999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    
    window.addEventListener('scroll', () => {
        window.scrollY > 300 ? backToTopBtn.classList.remove('hidden') : backToTopBtn.classList.add('hidden');
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 图库筛选
function initGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    if (!galleryTabs.length) return;
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            galleryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.dataset.type || 'all';
            
            document.querySelectorAll('.gallery-img').forEach(img => {
                if (!img) return;
                if (filterType === 'all' || img.dataset.type === filterType) {
                    img.style.display = 'block';
                    img.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => img.style.opacity = '1', 100);
                } else {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '0';
                    setTimeout(() => img.style.display = 'none', 300);
                }
            });
        });
    });
}

// 初始化图库图片 - 解决默认不显示
function initGalleryImgs() {
    const activeTab = document.querySelector('.gallery-tab.active');
    const filterType = activeTab ? activeTab.dataset.type : 'all';
    
    document.querySelectorAll('.gallery-img').forEach(img => {
        if (!img) return;
        if (filterType === 'all' || img.dataset.type === filterType) {
            img.style.display = 'block';
            setTimeout(() => img.style.opacity = '1', 200);
        }
    });
}

// 攻略标签初始化
function initGuideTab() {
    const guideTabs = document.querySelectorAll('.tab-btn');
    const guideContents = document.querySelectorAll('.guide-content');
    if (guideTabs.length === 0 || guideContents.length === 0) return;
    
    // 初始激活第一个
    guideTabs[0].classList.add('active');
    guideContents[0].classList.remove('hidden');
    
    guideTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            tabType && switchGuideTab(tabType);
        });
    });
}

// 主题切换 - 彻底移除getProperty方法，直接赋值预设色值，避免报错
function switchTheme(theme) {
    const root = document.documentElement;
    currentTheme = theme || 'purple';
    
    // 直接赋值固定色值，无任何读取/嵌套操作，彻底避免方法报错
    if (currentTheme === 'purple') {
        root.style.setProperty('--primary-color', '#8a5cf7');
        root.style.setProperty('--secondary-color', '#a78bfa');
        root.style.setProperty('--bg-color', '#f5f3ff');
    } else if (currentTheme === 'blue') {
        root.style.setProperty('--primary-color', '#3b82f6');
        root.style.setProperty('--secondary-color', '#60a5fa');
        root.style.setProperty('--bg-color', '#eff6ff');
    }
    
    // 同步雨滴颜色（优化：调用统一方法，避免代码冗余）
    rainEnabled && createRaindrops(getCurrentRainColor());
    
    // 同步调色器
    const colorPicker = document.getElementById('customColorPicker');
    colorPicker && (colorPicker.value = currentTheme === 'purple' ? '#8a5cf7' : '#3b82f6');
}

// 自定义调色
function applyCustomTheme() {
    const colorPicker = document.getElementById('customColorPicker');
    if (!colorPicker) return;
    
    try {
        const customColor = colorPicker.value.trim();
        if (!customColor.startsWith('#') || (customColor.length !== 4 && customColor.length !== 7)) {
            alert('请选择有效的十六进制颜色值（如#8a5cf7）');
            return;
        }
        
        const root = document.documentElement;
        const lightColor = lightenColor(customColor, 20);
        root.style.setProperty('--primary-color', customColor);
        root.style.setProperty('--secondary-color', lightColor);
        root.style.setProperty('--bg-color', lightenColor(customColor, 85));
        currentTheme = 'custom';
        
        // 同步雨滴
        rainEnabled && createRaindrops(getCurrentRainColor());
    } catch (e) {
        alert('调色失败，请选择其他颜色重试');
    }
}

// 颜色变浅 - 兼容3/6位十六进制
function lightenColor(color, percent) {
    try {
        color = color.replace(/^#/, '');
        const is3Char = color.length === 3;
        const r = is3Char ? parseInt(color[0] + color[0], 16) : parseInt(color.slice(0, 2), 16);
        const g = is3Char ? parseInt(color[1] + color[1], 16) : parseInt(color.slice(2, 4), 16);
        const b = is3Char ? parseInt(color[2] + color[2], 16) : parseInt(color.slice(4, 6), 16);
        
        const amt = Math.round(2.55 * percent);
        const newR = Math.min(255, Math.max(0, r + amt));
        const newG = Math.min(255, Math.max(0, g + amt));
        const newB = Math.min(255, Math.max(0, b + amt));
        
        return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    } catch (e) {
        return color;
    }
}

// 颜色变深
function darkenColor(color, percent) {
    try {
        color = color.replace(/^#/, '');
        const is3Char = color.length === 3;
        const r = is3Char ? parseInt(color[0] + color[0], 16) : parseInt(color.slice(0, 2), 16);
        const g = is3Char ? parseInt(color[1] + color[1], 16) : parseInt(color.slice(2, 4), 16);
        const b = is3Char ? parseInt(color[2] + color[2], 16) : parseInt(color.slice(4, 6), 16);
        
        const amt = Math.round(2.55 * percent);
        const newR = Math.max(0, Math.min(255, r - amt));
        const newG = Math.max(0, Math.min(255, g - amt));
        const newB = Math.max(0, Math.min(255, b - amt));
        
        return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    } catch (e) {
        return color;
    }
}

// 十六进制转RGB
function hexToRgb(hex) {
    try {
        hex = hex.replace(/^#/, '');
        const is3Char = hex.length === 3;
        const r = is3Char ? parseInt(hex[0] + hex[0], 16) : parseInt(hex.slice(0, 2), 16);
        const g = is3Char ? parseInt(hex[1] + hex[1], 16) : parseInt(hex.slice(2, 4), 16);
        const b = is3Char ? parseInt(hex[2] + hex[2], 16) : parseInt(hex.slice(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    } catch (e) {
        return '255, 255, 255';
    }
}

// 深色模式切换
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i');
    modeBtn && modeBtn.classList.toggle('fa-moon');
    modeBtn && modeBtn.classList.toggle('fa-sun');
    switchTheme(currentTheme); // 同步主题颜色
}

// 故事展开/收起
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const storyToggle = document.getElementById('storyToggle');
    if (!storyContent || !storyToggle) return;
    
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
    if (!tabType) return;
    const targetContent = document.getElementById(`${tabType}Content`);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabType}"]`);
    if (!targetContent || !targetBtn) return;
    
    // 隐藏所有，激活目标
    document.querySelectorAll('.guide-content').forEach(content => content.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    targetContent.classList.remove('hidden');
    targetBtn.classList.add('active');
}

// 图片预览 - 修复关闭事件
function previewImage(src) {
    if (!src) return;
    const modal = document.getElementById('imagePreviewModal');
    const previewImg = document.getElementById('previewImage');
    if (!modal || !previewImg) return;
    
    // 图片加载失败处理
    previewImg.onerror = function() {
        alert('图片加载失败，请检查images文件夹是否存在对应图片');
        modal.classList.add('modal-hidden');
        document.body.style.overflow = 'auto';
    };
    
    previewImg.src = src;
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
    modal.style.zIndex = '99999';
}

// 关闭图片预览 - 区分点击图片/遮罩层
function closeImagePreview(e) {
    if (e && e.target.id === 'previewImage') return; // 点击图片不关闭
    const modal = document.getElementById('imagePreviewModal');
    modal && modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}

// 视频播放
function playVideo(playerId, coverElement) {
    if (!playerId || !coverElement) return;
    const videoElement = document.getElementById(playerId);
    if (!videoElement) {
        alert('视频元素未找到');
        return;
    }
    
    try {
        const playPromise = videoElement.play();
        if (playPromise) {
            playPromise.then(() => coverElement.style.display = 'none')
            .catch(() => {
                coverElement.style.display = 'none';
                videoElement.controls = true; // 自动播放失败则显示控件
            });
        }
    } catch (error) {
        coverElement.style.display = 'none';
        videoElement.controls = true;
    }
    
    // 播放完成显示封面
    videoElement.addEventListener('ended', function() {
        this.currentTime = 0;
        coverElement.style.display = 'flex';
    });
}

// 视频切换
function switchVideo(type) {
    if (!type) return;
    const smallVideo = document.getElementById('smallVideo');
    const bigVideo = document.getElementById('bigVideo');
    const targetTab = document.querySelector(`.gallery-tab[data-type="${type}"]`);
    if (!smallVideo || !bigVideo || !targetTab) return;
    
    // 移除所有激活
    document.querySelectorAll('.gallery-tab[data-type]').forEach(tab => tab.classList.remove('active'));
    targetTab.classList.add('active');
    
    // 切换显示并重置视频
    if (type === 'small') {
        smallVideo.classList.remove('hidden');
        bigVideo.classList.add('hidden');
        bigVideo.querySelector('video') && bigVideo.querySelector('video').pause();
        bigVideo.querySelector('.video-cover') && (bigVideo.querySelector('.video-cover').style.display = 'flex');
    } else if (type === 'big') {
        smallVideo.classList.add('hidden');
        bigVideo.classList.remove('hidden');
        smallVideo.querySelector('video') && smallVideo.querySelector('video').pause();
        smallVideo.querySelector('.video-cover') && (smallVideo.querySelector('.video-cover').style.display = 'flex');
    }
}

// 【新增工具方法】获取当前雨滴颜色 - 统一逻辑，避免代码冗余，同步主题/深色模式
function getCurrentRainColor() {
    if (!isDarkMode) {
        return 'rgba(255, 255, 255, 0.7)';
    }
    // 深色模式下按主题匹配雨滴颜色
    switch (currentTheme) {
        case 'purple':
            return 'rgba(136, 106, 210, 0.6)';
        case 'blue':
            return 'rgba(90, 178, 235, 0.6)';
        default: // 自定义主题
            const root = document.documentElement;
            const primaryColor = root.style.getPropertyValue('--primary-color') || '#8a5cf7';
            const rgb = hexToRgb(primaryColor);
            return `rgba(${rgb}, 0.5)`;
    }
}