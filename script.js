// 全局变量
let currentTheme = window.siteConfig ? window.siteConfig.defaultTheme : 'purple';
let isDarkMode = window.siteConfig ? (window.siteConfig.defaultMode === 'dark') : false;
let isStoryVisible = true;

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    if (!window.siteConfig) console.warn("config.js 未加载成功，使用默认配置");
    initAnimations();
    initNavbar();
    initBackToTop();
    initGalleryFilter();
    initGuideTab();
    initDefaultThemeAndMode();
    initCustomColorPicker(); // 新增：初始化自定义调色器
    // 移除 initVideoTabs 函数，避免动态修改视频路径
});

// 初始化主题和深色模式
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i'); // 调整索引：因新增调色器，深色模式按钮变为第4个
    // 初始化CSS变量（确保主题色变量存在）
    if (!root.style.getProperty('--primary-color-purple')) {
        // 预设主题色变量
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
        const currentPrimary = root.style.getProperty('--primary-color') || 
                              (currentTheme === 'purple' ? '#8a5cf7' : '#3b82f6');
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
        colorPicker.value = root.style.getProperty('--primary-color').replace('var(', '').replace(')', '').split('-color-')[1] 
                            ? (theme === 'purple' ? '#8a5cf7' : '#3b82f6') 
                            : root.style.getProperty('--primary-color');
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
    try {
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
    } catch (error) {
        alert('视频播放失败，请检查视频文件格式');
    }
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