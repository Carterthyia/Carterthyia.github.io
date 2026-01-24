// 全局变量
let currentTheme = window.siteConfig ? window.siteConfig.defaultTheme : 'purple';
let isDarkMode = window.siteConfig ? (window.siteConfig.defaultMode === 'dark') : false;
let isStoryVisible = true;
let rainEnabled = true; // 新增：雨滴效果开关变量

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
    initRainEffect(); // 新增：初始化雨滴效果
    // 移除 initVideoTabs 函数，避免动态修改视频路径
});

// 初始化主题和深色模式
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i'); // 调整索引：因新增调色器，深色模式按钮变为第4个
    // 初始化CSS变量（确保主题色变量存在）
    if (!root.style.getPropertyValue('--primary-color-purple')) {
        // 预设主题色变量
        root.style.setProperty('--primary-color-purple', '#8a5cf7');
        root.style.setProperty('--secondary-color-purple', '#a78bfa');
        root.style.setProperty('--bg-color-purple', '#f5f3ff');
        root.style.setProperty('--primary-color-blue', '#3b82f6');
        root.style.setProperty('--secondary-color-blue', '#60a5fa');
        root.style.setProperty('--bg-color-blue', '#eff6ff');
        // 新增：雨滴颜色变量（适配主题）
        root.style.setProperty('--rain-color-purple', 'rgba(156, 126, 230, 0.6)');
        root.style.setProperty('--rain-color-blue', 'rgba(110, 198, 255, 0.6)');
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
        const currentPrimary = root.style.getPropertyValue('--primary-color') || 
                              (currentTheme === 'purple' ? '#8a5cf7' : '#3b82f6');
        colorPicker.value = currentPrimary;
        
        // 绑定调色器变更事件（修复可能的未绑定问题）
        colorPicker.addEventListener('input', applyCustomTheme);
    }
}

// 新增：初始化雨滴效果
function initRainEffect() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return; // 避免容器不存在时报错
    
    // 适配主题的雨滴颜色
    const root = document.documentElement;
    const rainColor = isDarkMode 
        ? (currentTheme === 'purple' 
            ? root.style.getPropertyValue('--rain-color-purple') 
            : root.style.getPropertyValue('--rain-color-blue'))
        : 'rgba(255, 255, 255, 0.7)';
    
    // 生成雨滴
    createRaindrops(rainColor);
    // 每隔5秒重新生成雨滴，避免重复感
    setInterval(() => {
        if (rainEnabled) createRaindrops(rainColor);
    }, 5000);
}

// 新增：生成雨滴核心函数（修复DOM操作报错）
function createRaindrops(rainColor) {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    
    const rainCount = window.innerWidth < 768 ? 50 : 150; // 移动端减少数量
    rainContainer.innerHTML = ''; // 清空原有雨滴
    
    // 目标元素（雨滴落到这些元素上产生水花）
    const targetElements = document.querySelectorAll('.navbar, .banner-bg, .card-animate');

    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');

        // 随机属性
        const left = Math.random() * 100;
        const height = Math.random() * 20 + 10;
        const duration = Math.random() * 1 + 0.5;
        const delay = Math.random() * 5;

        // 应用样式（避免样式未加载报错）
        drop.style.left = `${left}%`;
        drop.style.height = `${height}px`;
        drop.style.animationDuration = `${duration}s`;
        drop.style.animationDelay = `${delay}s`;
        drop.style.background = `linear-gradient(transparent, ${rainColor})`;
        drop.style.borderRadius = '0 0 50% 50%';
        drop.style.position = 'absolute';
        drop.style.opacity = '0';

        // 监听动画结束（兼容低版本浏览器）
        drop.addEventListener('animationend', function() {
            // 生成水花（概率70%）
            if (targetElements.length > 0 && Math.random() > 0.3 && rainEnabled) {
                try {
                    const randomTarget = targetElements[Math.floor(Math.random() * targetElements.length)];
                    const rect = randomTarget.getBoundingClientRect();
                    const splash = document.createElement('div');
                    splash.classList.add('rain-splash');
                    
                    // 水花样式（内联避免CSS加载问题）
                    splash.style.position = 'absolute';
                    splash.style.width = '8px';
                    splash.style.height = '4px';
                    splash.style.background = `${rainColor}`;
                    splash.style.borderRadius = '50%';
                    splash.style.transform = 'scale(0)';
                    splash.style.animation = 'splash 0.5s ease-out forwards';
                    splash.style.pointerEvents = 'none';
                    
                    // 水花位置（边界检测，避免超出屏幕）
                    const splashLeft = Math.max(0, Math.min(rect.left + Math.random() * rect.width, window.innerWidth - 8));
                    const splashTop = Math.max(0, Math.min(rect.top + Math.random() * rect.height, window.innerHeight - 4));
                    splash.style.left = `${splashLeft}px`;
                    splash.style.top = `${splashTop}px`;
                    
                    rainContainer.appendChild(splash);
                    // 自动移除水花
                    setTimeout(() => splash.remove(), 500);
                } catch (e) {
                    console.warn('生成水花失败:', e); // 容错，不影响整体
                }
            }
            drop.remove(); // 移除雨滴
        });

        rainContainer.appendChild(drop);
    }
}

// 新增：雨滴效果开关（供页面按钮调用）
function toggleRain() {
    const rainContainer = document.getElementById('rainContainer');
    if (!rainContainer) return;
    
    rainEnabled = !rainEnabled;
    rainContainer.style.display = rainEnabled ? 'block' : 'none';
    
    // 重新生成雨滴（如果开启）
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

// 滚动动效（修复边界检测报错）
function initAnimations() {
    const scrollHandler = function() {
        try {
            document.querySelectorAll('.section-animate').forEach(element => {
                if (element && element.getBoundingClientRect) {
                    if (element.getBoundingClientRect().top < window.innerHeight * 0.8) {
                        element.classList.add('visible');
                    }
                }
            });
            document.querySelectorAll('.card-animate').forEach(element => {
                if (element && element.getBoundingClientRect) {
                    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
                        element.classList.add('visible');
                    }
                }
            });
        } catch (e) {
            console.warn('滚动动画检测失败:', e);
        }
    };
    
    window.addEventListener('scroll', scrollHandler);
    // 初始触发一次（兼容异步加载的元素）
    setTimeout(() => scrollHandler(), 100);
}

// 导航栏（修复DOM不存在报错）
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
            if (icon) {
                navMenu.classList.contains('active') 
                    ? icon.classList.replace('fa-bars', 'fa-times') 
                    : icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// 回到顶部（修复按钮不存在报错）
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        window.scrollY > 300 ? backToTopBtn.classList.remove('hidden') : backToTopBtn.classList.add('hidden');
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 图库筛选（修复筛选逻辑报错）
function initGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    if (!galleryTabs.length) return;
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            galleryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.dataset.type;
            
            document.querySelectorAll('.gallery-img').forEach(img => {
                if (img) {
                    if (filterType === 'all' || img.dataset.type === filterType) {
                        img.style.display = 'block';
                        setTimeout(() => {
                            if (img) img.style.opacity = '1';
                        }, 100);
                    } else {
                        if (img) img.style.opacity = '0';
                        setTimeout(() => {
                            if (img) img.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// 攻略标签（修复初始激活报错）
function initGuideTab() {
    const guideTabs = document.querySelectorAll('.tab-btn');
    if (guideTabs.length > 0) {
        guideTabs[0].classList.add('active');
        const firstContent = document.querySelectorAll('.guide-content')[0];
        if (firstContent) firstContent.classList.remove('hidden');
    }
    
    guideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab) switchGuideTab(tab.dataset.tab);
        });
    });
}

// 主题切换（兼容原有固定主题 + 自定义调色，修复变量获取报错）
function switchTheme(theme) {
    const root = document.documentElement;
    currentTheme = theme;
    
    if (theme === 'purple') {
        root.style.setProperty('--primary-color', 'var(--primary-color-purple)');
        root.style.setProperty('--secondary-color', 'var(--secondary-color-purple)');
        root.style.setProperty('--bg-color', 'var(--bg-color-purple)');
        // 同步雨滴颜色
        if (rainEnabled) {
            const rainColor = isDarkMode 
                ? root.style.getPropertyValue('--rain-color-purple') 
                : 'rgba(255, 255, 255, 0.7)';
            createRaindrops(rainColor);
        }
    } else if (theme === 'blue') {
        root.style.setProperty('--primary-color', 'var(--primary-color-blue)');
        root.style.setProperty('--secondary-color', 'var(--secondary-color-blue)');
        root.style.setProperty('--bg-color', 'var(--bg-color-blue)');
        // 同步雨滴颜色
        if (rainEnabled) {
            const rainColor = isDarkMode 
                ? root.style.getPropertyValue('--rain-color-blue') 
                : 'rgba(255, 255, 255, 0.7)';
            createRaindrops(rainColor);
        }
    }
    
    // 同步更新自定义调色器的值
    const colorPicker = document.getElementById('customColorPicker');
    if (colorPicker) {
        let pickerValue = '#8a5cf7'; // 默认值
        try {
            const primaryColor = root.style.getPropertyValue('--primary-color');
            if (primaryColor.includes('purple')) pickerValue = '#8a5cf7';
            else if (primaryColor.includes('blue')) pickerValue = '#3b82f6';
            else pickerValue = primaryColor;
        } catch (e) {
            pickerValue = theme === 'purple' ? '#8a5cf7' : '#3b82f6';
        }
        colorPicker.value = pickerValue;
    }
}

// 新增：自定义调色应用（修复颜色处理报错）
function applyCustomTheme() {
    const colorPicker = document.getElementById('customColorPicker');
    if (!colorPicker) return;
    
    try {
        const customColor = colorPicker.value.trim();
        // 验证颜色格式
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(customColor)) {
            alert('请选择有效的十六进制颜色值');
            return;
        }
        
        const root = document.documentElement;
        // 生成浅/深色调（保证视觉协调）
        const lightColor = lightenColor(customColor, 20);
        const darkColor = darkenColor(customColor, 20);
        
        // 覆盖主题色变量
        root.style.setProperty('--primary-color', customColor);
        root.style.setProperty('--secondary-color', lightColor);
        root.style.setProperty('--bg-color', lightenColor(customColor, 85)); // 背景色超浅
        currentTheme = 'custom'; // 标记为自定义主题
        
        // 同步更新雨滴颜色
        if (rainEnabled) {
            const rainColor = isDarkMode ? darkenColor(customColor, 10) : lightenColor(customColor, 30);
            createRaindrops(`rgba(${hexToRgb(rainColor)}, 0.6)`);
        }
    } catch (e) {
        console.warn('自定义调色失败:', e);
        alert('调色失败，请重试');
    }
}

// 新增：颜色变浅辅助函数（修复边界值报错）
function lightenColor(color, percent) {
    try {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
    } catch (e) {
        return color; // 容错，返回原颜色
    }
}

// 新增：颜色变深辅助函数（修复边界值报错）
function darkenColor(color, percent) {
    try {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, Math.min(255, (num >> 16) - amt));
        const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) - amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
        return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
    } catch (e) {
        return color; // 容错，返回原颜色
    }
}

// 新增：十六进制转RGB（适配雨滴颜色）
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

// 深色模式切换（修复按钮不存在报错）
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const modeBtn = document.querySelector('.control-btn:nth-child(4) i'); // 调整索引：深色模式按钮变为第4个
    if (modeBtn) {
        modeBtn.classList.toggle('fa-moon');
        modeBtn.classList.toggle('fa-sun');
    }
    
    // 同步更新雨滴颜色
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

// 故事展开收起（修复元素不存在报错）
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

// 攻略标签切换（修复元素不存在报错）
function switchGuideTab(tabType) {
    if (!tabType) return;
    
    document.querySelectorAll('.guide-content').forEach(content => {
        if (content) content.classList.add('hidden');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`${tabType}Content`);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabType}"]`);
    
    if (targetContent) targetContent.classList.remove('hidden');
    if (targetBtn) targetBtn.classList.add('active');
}

// 图片预览（修复模态框不存在报错）
function previewImage(src) {
    if (!src) return;
    
    const modal = document.getElementById('imagePreviewModal');
    const previewImg = document.getElementById('previewImage');
    if (!modal || !previewImg) return;
    
    previewImg.src = src;
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (!modal) return;
    
    modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}

// 视频播放（修复播放失败报错）
function playVideo(playerId, coverElement) {
    if (!playerId || !coverElement) {
        alert('视频参数错误，请刷新页面重试');
        return;
    }
    
    const videoElement = document.getElementById(playerId);
    if (!videoElement) {
        alert('视频播放器未找到，请刷新页面重试');
        return;
    }
    
    try {
        const playPromise = videoElement.play();
        if (playPromise) {
            playPromise.then(() => {
                coverElement.style.display = 'none';
            }).catch((err) => {
                coverElement.style.display = 'none';
                console.warn('视频自动播放失败:', err);
                alert('视频自动播放被浏览器限制，请手动点击视频控件播放');
            });
        } else {
            coverElement.style.display = 'none';
        }
        
        // 视频结束回调（避免重复绑定）
        videoElement.removeEventListener('ended', onVideoEnded);
        videoElement.addEventListener('ended', onVideoEnded);
        
        function onVideoEnded() {
            videoElement.currentTime = 0;
            coverElement.style.display = 'flex';
            videoElement.removeEventListener('ended', onVideoEnded);
        }
    } catch (error) {
        console.error('视频播放异常:', error);
        alert('视频播放失败，请检查视频文件格式或网络');
    }
}

// 视频切换（修复切换逻辑报错）
function switchVideo(type) {
    if (!type) return;
    
    document.querySelectorAll('.gallery-tab[data-type]').forEach(tab => {
        if (tab) tab.classList.remove('active');
    });
    
    const targetTab = document.querySelector(`.gallery-tab[data-type="${type}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    const smallVideo = document.getElementById('smallVideo');
    const bigVideo = document.getElementById('bigVideo');
    
    if (type === 'small') {
        if (smallVideo) smallVideo.classList.remove('hidden');
        if (bigVideo) bigVideo.classList.add('hidden');
    } else if (type === 'big') {
        if (smallVideo) smallVideo.classList.add('hidden');
        if (bigVideo) bigVideo.classList.remove('hidden');
    }
}