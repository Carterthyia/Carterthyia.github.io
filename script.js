// 全局变量 - 增加window.siteConfig兜底，避免未定义报错
let siteConfig = window.siteConfig || { defaultTheme: 'purple', defaultMode: 'light' };
let currentTheme = siteConfig.defaultTheme;
let isDarkMode = siteConfig.defaultMode === 'dark';
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
    // 初始化图库显示（解决图片默认不显示问题）
    initGalleryImgs();
});

// 初始化主题和深色模式 - 全量容错+样式变量兜底
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i');
    // 强制初始化所有CSS变量，避免读取不到报错
    root.style.setProperty('--primary-color-purple', '#8a5cf7');
    root.style.setProperty('--secondary-color-purple', '#a78bfa');
    root.style.setProperty('--bg-color-purple', '#f5f3ff');
    root.style.setProperty('--primary-color-blue', '#3b82f6');
    root.style.setProperty('--secondary-color-blue', '#60a5fa');
    root.style.setProperty('--bg-color-blue', '#eff6ff');
    root.style.setProperty('--rain-color-purple', 'rgba(156, 126, 230, 0.6)');
    root.style.setProperty('--rain-color-blue', 'rgba(110, 198, 255, 0.6)');
    
    switchTheme(currentTheme);
    // 深色模式容错处理
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (modeBtn) modeBtn.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('dark-mode');
        if (modeBtn) modeBtn.classList.replace('fa-sun', 'fa-moon');
    }
    document.title = "卡提希娅的星光小站";
}

// 初始化自定义调色器
function initCustomColorPicker() {
    const colorPicker = document.getElementById('customColorPicker');
    if (!colorPicker) return;
    const root = document.documentElement;
    const currentPrimary = root.style.getPropertyValue('--primary-color') || '#8a5cf7';
    colorPicker.value = currentPrimary;
    colorPicker.addEventListener('input', applyCustomTheme);
}

// 初始化雨滴效果 - 增加样式兼容
function initRainEffect() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    const root = document.documentElement;
    const rainColor = isDarkMode 
        ? (currentTheme === 'purple' 
            ? root.style.getPropertyValue('--rain-color-purple') 
            : root.style.getPropertyValue('--rain-color-blue'))
        : 'rgba(255, 255, 255, 0.7)';
    createRaindrops(rainColor);
    // 定时器增加容错，避免重复创建
    setInterval(() => {
        if (rainEnabled && document.getElementById('rainContainer')) {
            createRaindrops(rainColor);
        }
    }, 5000);
}

// 生成雨滴 - 修复元素定位和样式报错
function createRaindrops(rainColor) {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    const rainCount = window.innerWidth < 768 ? 30 : 100; // 减少数量，提升性能
    // 清空前先判断子元素，避免空操作
    if (rainContainer.children.length > 200) rainContainer.innerHTML = '';
    const targetElements = document.querySelectorAll('.navbar, .banner-bg, .card-animate');
    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        const left = Math.random() * 100;
        const height = Math.random() * 15 + 8;
        const duration = Math.random() * 0.8 + 0.3;
        const delay = Math.random() * 3;
        // 统一样式设置，避免零散赋值报错
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
            top: '-20px' // 初始位置上移，避免初始闪烁
        });
        drop.addEventListener('animationend', function() {
            if (targetElements.length > 0 && Math.random() > 0.4 && rainEnabled) {
                try {
                    const randomTarget = targetElements[Math.floor(Math.random() * targetElements.length)];
                    const rect = randomTarget.getBoundingClientRect();
                    // 避免目标元素超出视口
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
                } catch (e) {
                    // 静默捕获异常，不影响主流程
                }
            }
            // 延迟删除，避免动画卡顿
            setTimeout(() => drop.remove(), 100);
        });
        rainContainer.appendChild(drop);
    }
}

// 雨滴开关 - 增加状态校验
function toggleRain() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    rainEnabled = !rainEnabled;
    rainContainer.style.display = rainEnabled ? 'block' : 'none';
    if (rainEnabled) {
        const root = document.documentElement;
        const rainColor = isDarkMode 
            ? (currentTheme === 'purple' 
                ? root.style.getPropertyValue('--rain-color-purple') 
                : root.style.getPropertyValue('--rain-color-blue'))
            : 'rgba(255, 255, 255, 0.7)';
        createRaindrops(rainColor);
    }
}

// 滚动动效 - 优化性能+全量容错
function initAnimations() {
    const scrollHandler = function() {
        try {
            // 节流处理，避免滚动频繁执行
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
    // 初始执行，避免首屏元素不显示
    setTimeout(() => scrollHandler(), 200);
}

// 导航栏 - 修复移动端样式+容错
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navbar) {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 
                ? navbar.classList.add('scrolled') 
                : navbar.classList.remove('scrolled');
        });
        // 初始化导航栏样式
        navbar.style.zIndex = '9999';
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.width = '100%';
    }
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                navMenu.classList.contains('active') 
                    ? icon.classList.replace('fa-bars', 'fa-times') 
                    : icon.classList.replace('fa-times', 'fa-bars');
            }
            // 移动端菜单显示时禁止滚动
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
}

// 回到顶部 - 增加样式兜底
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    // 初始化样式，避免不显示
    Object.assign(backToTopBtn.style, {
        zIndex: '999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    window.addEventListener('scroll', () => {
        window.scrollY > 300 
            ? backToTopBtn.classList.remove('hidden') 
            : backToTopBtn.classList.add('hidden');
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 图库筛选 - 修复图片默认不显示+动画优化
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
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                } else {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 初始化图库图片 - 解决默认不显示核心问题
function initGalleryImgs() {
    const activeTab = document.querySelector('.gallery-tab.active');
    const filterType = activeTab ? activeTab.dataset.type : 'all';
    document.querySelectorAll('.gallery-img').forEach(img => {
        if (!img) return;
        if (filterType === 'all' || img.dataset.type === filterType) {
            img.style.display = 'block';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 200);
        }
    });
}

// 攻略标签 - 修复初始激活+容错
function initGuideTab() {
    const guideTabs = document.querySelectorAll('.tab-btn');
    const guideContents = document.querySelectorAll('.guide-content');
    if (guideTabs.length === 0 || guideContents.length === 0) return;
    // 初始激活第一个标签
    guideTabs[0].classList.add('active');
    guideContents[0].classList.remove('hidden');
    // 移除所有标签的点击事件，避免重复绑定
    guideTabs.forEach(tab => {
        tab.removeEventListener('click', guideTabClick);
        tab.addEventListener('click', guideTabClick);
    });
    // 单独抽离点击事件，方便维护
    function guideTabClick() {
        const tabType = this.dataset.tab;
        if (!tabType) return;
        switchGuideTab(tabType);
    }
}

// 主题切换 - 全量修复CSS变量读取+调色器同步
function switchTheme(theme) {
    const root = document.documentElement;
    currentTheme = theme || 'purple';
    // 主题样式设置，直接赋值颜色值，避免var()嵌套报错
    if (currentTheme === 'purple') {
        root.style.setProperty('--primary-color', '#8a5cf7');
        root.style.setProperty('--secondary-color', '#a78bfa');
        root.style.setProperty('--bg-color', '#f5f3ff');
    } else if (currentTheme === 'blue') {
        root.style.setProperty('--primary-color', '#3b82f6');
        root.style.setProperty('--secondary-color', '#60a5fa');
        root.style.setProperty('--bg-color', '#eff6ff');
    }
    // 同步雨滴颜色
    if (rainEnabled) {
        const rainColor = isDarkMode 
            ? (currentTheme === 'purple' 
                ? 'rgba(136, 106, 210, 0.6)' 
                : 'rgba(90, 178, 235, 0.6)')
            : 'rgba(255, 255, 255, 0.7)';
        createRaindrops(rainColor);
    }
    // 同步调色器值
    const colorPicker = document.getElementById('customColorPicker');
    if (colorPicker) {
        colorPicker.value = currentTheme === 'purple' ? '#8a5cf7' : '#3b82f6';
    }
}

// 自定义调色 - 修复RGB转换+雨滴颜色适配
function applyCustomTheme() {
    const colorPicker = document.getElementById('customColorPicker');
    if (!colorPicker) return;
    try {
        const customColor = colorPicker.value.trim();
        // 简化颜色验证，兼容更多浏览器
        if (!customColor.startsWith('#') || (customColor.length !== 4 && customColor.length !== 7)) {
            alert('请选择有效的十六进制颜色值（如#8a5cf7）');
            return;
        }
        const root = document.documentElement;
        const lightColor = lightenColor(customColor, 20);
        // 设置自定义主题颜色
        root.style.setProperty('--primary-color', customColor);
        root.style.setProperty('--secondary-color', lightColor);
        root.style.setProperty('--bg-color', lightenColor(customColor, 85));
        currentTheme = 'custom';
        // 同步雨滴颜色
        if (rainEnabled) {
            const rainRgb = hexToRgb(customColor);
            const rainColor = isDarkMode 
                ? `rgba(${rainRgb}, 0.5)` 
                : `rgba(${rainRgb}, 0.7)`;
            createRaindrops(rainColor);
        }
    } catch (e) {
        alert('调色失败，请选择其他颜色重试');
    }
}

// 颜色变浅 - 修复十六进制解析bug
function lightenColor(color, percent) {
    try {
        // 处理3位和6位十六进制颜色
        color = color.replace(/^#/, '');
        const is3Char = color.length === 3;
        const r = is3Char ? parseInt(color[0] + color[0], 16) : parseInt(color.slice(0, 2), 16);
        const g = is3Char ? parseInt(color[1] + color[1], 16) : parseInt(color.slice(2, 4), 16);
        const b = is3Char ? parseInt(color[2] + color[2], 16) : parseInt(color.slice(4, 6), 16);
        // 计算变浅值，避免超出0-255范围
        const amt = Math.round(2.55 * percent);
        const newR = Math.min(255, Math.max(0, r + amt));
        const newG = Math.min(255, Math.max(0, g + amt));
        const newB = Math.min(255, Math.max(0, b + amt));
        // 转换回十六进制
        return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    } catch (e) {
        return color;
    }
}

// 颜色变深 - 同lightenColor修复
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

// 十六进制转RGB - 修复3位颜色解析
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

// 深色模式 - 修复样式同步+雨滴颜色适配
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i');
    if (modeBtn) {
        modeBtn.classList.toggle('fa-moon');
        modeBtn.classList.toggle('fa-sun');
    }
    // 同步主题颜色和雨滴颜色
    switchTheme(currentTheme);
}

// 故事展开 - 修复HTML标签语法错误（核心！）
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const storyToggle = document.getElementById('storyToggle');
    if (!storyContent || !storyToggle) return;
    isStoryVisible = !isStoryVisible;
    // 修复原代码中<i>标签的语法错误：<<i → <i，</</i → </i
    if (isStoryVisible) {
        storyContent.style.display = 'block';
        storyToggle.innerHTML = '<i class="fa fa-chevron-up"></i> 收起故事';
    } else {
        storyContent.style.display = 'none';
        storyToggle.innerHTML = '<i class="fa fa-chevron-down"></i> 展开故事';
    }
}

// 攻略切换 - 增加容错+样式同步
function switchGuideTab(tabType) {
    if (!tabType) return;
    const targetContent = document.getElementById(`${tabType}Content`);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabType}"]`);
    if (!targetContent || !targetBtn) return;
    // 隐藏所有内容，移除所有激活状态
    document.querySelectorAll('.guide-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // 显示目标内容，激活目标按钮
    targetContent.classList.remove('hidden');
    targetBtn.classList.add('active');
}

// 图片预览 - 修复遮罩层+滚动禁止
function previewImage(src) {
    if (!src || src === '') return;
    const modal = document.getElementById('imagePreviewModal');
    const previewImg = document.getElementById('previewImage');
    if (!modal || !previewImg) return;
    // 修复图片加载失败
    previewImg.onerror = function() {
        alert('图片加载失败，请检查文件路径');
        modal.classList.add('modal-hidden');
        document.body.style.overflow = 'auto';
    };
    previewImg.src = src;
    modal.classList.remove('modal-hidden');
    // 禁止页面滚动，增加遮罩层层级
    modal.style.zIndex = '99999';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.overflowX = 'hidden';
}

// 关闭图片预览 - 修复滚动恢复
function closeImagePreview(e) {
    // 点击图片内部不关闭
    if (e && e.target.id === 'previewImage') return;
    const modal = document.getElementById('imagePreviewModal');
    if (!modal) return;
    modal.classList.add('modal-hidden');
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.overflowX = 'auto';
}

// 视频播放 - 修复自动播放+封面显示
function playVideo(playerId, coverElement) {
    if (!playerId || !coverElement) return;
    const videoElement = document.getElementById(playerId);
    if (!videoElement) {
        alert('视频元素未找到，请检查ID');
        return;
    }
    // 移除原有事件，避免重复绑定
    videoElement.removeEventListener('play', videoPlayHandler);
    videoElement.removeEventListener('error', videoErrorHandler);
    videoElement.addEventListener('play', videoPlayHandler);
    videoElement.addEventListener('error', videoErrorHandler);
    // 尝试播放，兼容浏览器自动播放策略
    try {
        const playPromise = videoElement.play();
        if (playPromise) {
            playPromise.then(() => {
                coverElement.style.display = 'none';
            }).catch((err) => {
                // 自动播放失败时，显示视频控件让用户手动播放
                coverElement.style.display = 'none';
                videoElement.controls = true;
            });
        }
    } catch (error) {
        coverElement.style.display = 'none';
        videoElement.controls = true;
    }
    // 视频播放完成后显示封面
    videoElement.addEventListener('ended', function() {
        this.currentTime = 0;
        coverElement.style.display = 'flex';
    });
    // 播放成功回调
    function videoPlayHandler() {
        coverElement.style.display = 'none';
    }
    // 播放错误回调
    function videoErrorHandler() {
        alert('视频播放失败，请检查文件路径和格式（推荐MP4）');
        coverElement.style.display = 'flex';
    }
}

// 视频切换 - 增加容错+封面重置
function switchVideo(type) {
    if (!type) return;
    const smallVideo = document.getElementById('smallVideo');
    const bigVideo = document.getElementById('bigVideo');
    const targetTab = document.querySelector(`.gallery-tab[data-type="${type}"]`);
    if (!smallVideo || !bigVideo || !targetTab) return;
    // 移除所有标签激活状态
    document.querySelectorAll('.gallery-tab[data-type]').forEach(tab => {
        tab.classList.remove('active');
    });
    targetTab.classList.add('active');
    // 切换视频显示，重置视频状态
    if (type === 'small') {
        smallVideo.classList.remove('hidden');
        bigVideo.classList.add('hidden');
        // 重置大视频
        const bigVideoPlayer = bigVideo.querySelector('video');
        const bigVideoCover = bigVideo.querySelector('.video-cover');
        if (bigVideoPlayer) bigVideoPlayer.pause();
        if (bigVideoCover) bigVideoCover.style.display = 'flex';
    } else if (type === 'big') {
        smallVideo.classList.add('hidden');
        bigVideo.classList.remove('hidden');
        // 重置小视频
        const smallVideoPlayer = smallVideo.querySelector('video');
        const smallVideoCover = smallVideo.querySelector('.video-cover');
        if (smallVideoPlayer) smallVideoPlayer.pause();
        if (smallVideoCover) smallVideoCover.style.display = 'flex';
    }
}