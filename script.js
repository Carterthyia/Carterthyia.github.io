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
    // 移除 initVideoTabs 函数，避免动态修改视频路径
});

// 初始化主题和深色模式
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(3) i');
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

// 主题切换
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
}

// 深色模式切换
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const modeBtn = document.querySelector('.control-btn:nth-child(3) i');
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