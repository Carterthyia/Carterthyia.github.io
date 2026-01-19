// 全局变量（结合config.js配置，避免冲突）
let currentTheme = window.siteConfig ? window.siteConfig.defaultTheme : 'purple';
let isDarkMode = window.siteConfig ? (window.siteConfig.defaultMode === 'dark') : false;
let isStoryVisible = true;

// 页面加载完成后执行（确保config.js已加载，所有元素初始化完毕）
window.addEventListener('DOMContentLoaded', function() {
    // 验证config.js是否加载成功
    if (!window.siteConfig) {
        console.warn("config.js 未加载成功，使用默认配置");
    }

    // 初始化所有功能
    initAnimations();
    initNavbar();
    initBackToTop();
    initVideoTabs();
    initGalleryFilter();
    initGuideTab();
    initDefaultThemeAndMode(); // 新增：从config.js初始化默认主题和模式
});

// 1. 从config.js初始化默认主题和深色模式
function initDefaultThemeAndMode() {
    const root = document.documentElement;
    const modeBtn = document.querySelector('.control-btn:nth-child(3) i');

    // 初始化主题
    switchTheme(currentTheme);

    // 初始化深色模式
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (modeBtn) {
            modeBtn.classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (modeBtn) {
            modeBtn.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // 初始化网站标题（从config.js读取）
    const siteTitle = window.siteConfig?.siteName;
    if (siteTitle && document.title) {
        document.title = siteTitle;
    }
}

// 2. 初始化滚动动效（保证高级淡入效果，无卡顿）
function initAnimations() {
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 板块淡入
        const sectionElements = document.querySelectorAll('.section-animate');
        sectionElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });

        // 卡片淡入
        const cardElements = document.querySelectorAll('.card-animate');
        cardElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    });

    // 手动触发一次滚动，初始化首屏元素
    window.dispatchEvent(new Event('scroll'));
}

// 3. 初始化导航栏（保证移动端交互正常）
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // 滚动导航栏样式变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 移动端菜单切换
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// 4. 初始化回到顶部按钮（保证交互正常）
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 5. 初始化视频标签切换（读取config.js视频配置，保证视频切换无冲突）
function initVideoTabs() {
    const videoTabs = document.querySelectorAll('.video-tab');
    if (!videoTabs.length) return;

    // 从config.js读取视频配置
    const videoConfig = window.siteConfig?.videoConfig;
    if (videoConfig) {
        // 更新视频元素的src和poster
        const video1 = document.getElementById('videoPlayer1');
        const video2 = document.getElementById('videoPlayer2');
        if (video1) {
            video1.src = videoConfig.smallCardVideo;
            video1.poster = videoConfig.videoPoster1;
        }
        if (video2) {
            video2.src = videoConfig.bigCardVideo;
            video2.poster = videoConfig.videoPoster2;
        }
    }

    videoTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有激活状态
            document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.video-container').forEach(v => v.classList.remove('active'));

            // 激活当前标签和视频
            this.classList.add('active');
            const targetVideo = this.dataset.target;
            if (targetVideo) {
                document.getElementById(targetVideo).classList.add('active');
            }
        });
    });
}

// 6. 初始化图库筛选（读取config.js图库配置，保证交互正常）
function initGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    if (!galleryTabs.length) return;

    // 从config.js读取图库配置
    const galleryConfig = {
        count: window.siteConfig?.galleryCount || 8,
        types: window.siteConfig?.galleryTypes || ["all", "art", "battle", "daily"]
    };

    // 更新图库筛选标签（若需动态生成）
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            galleryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const filterType = this.dataset.type;
            document.querySelectorAll('.gallery-img').forEach(img => {
                if (filterType === 'all' || img.dataset.type === filterType) {
                    img.style.display = 'block';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                } else {
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 7. 初始化攻略标签（保证内容切换正常，文字显示完整）
function initGuideTab() {
    const guideTabs = document.querySelectorAll('.tab-btn');
    if (!guideTabs.length) return;

    // 默认激活第一个标签
    guideTabs[0].classList.add('active');
    document.querySelectorAll('.guide-content')[0].classList.remove('hidden');

    guideTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            switchGuideTab(tabType);
        });
    });
}

// 8. 主题切换（保留高级效果，读取config.js默认配置）
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

    // 主题切换动效
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
}

// 9. 深色模式切换（保留高级效果，无冲突）
function toggleDarkMode() {
    const body = document.body;
    const modeBtn = document.querySelector('.control-btn:nth-child(3) i');
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (modeBtn) {
            modeBtn.classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        body.classList.remove('dark-mode');
        if (modeBtn) {
            modeBtn.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// 10. 故事展开/收起（保证文字内容完整显示，无异常）
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const storyToggle = document.getElementById('storyToggle');
    if (!storyContent || !storyToggle) return;

    isStoryVisible = !isStoryVisible;

    if (isStoryVisible) {
        storyContent.style.display = 'block';
        storyToggle.innerHTML = '<i class="fa fa-chevron-up"></i> 收起故事';
        storyContent.classList.add('visible');
    } else {
        storyContent.style.display = 'none';
        storyToggle.innerHTML = '<i class="fa fa-chevron-down"></i> 展开故事';
        storyContent.classList.remove('visible');
    }
}

// 11. 攻略标签切换（保证攻略内容完整显示，无异常）
function switchGuideTab(tabType) {
    // 隐藏所有攻略内容
    document.querySelectorAll('.guide-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 移除所有标签激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示当前内容
    const targetContent = document.getElementById(`${tabType}Content`);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabType}"]`);
    if (targetContent && targetBtn) {
        targetContent.classList.remove('hidden');
        targetBtn.classList.add('active');
        targetContent.classList.add('visible');
    }
}

// 12. 图片预览（保留高级效果，交互正常）
function previewImage(src) {
    const modal = document.getElementById('imagePreviewModal');
    const previewImg = document.getElementById('previewImage');
    if (!modal || !previewImg) return;

    previewImg.src = src;
    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
}

// 13. 关闭图片预览（交互正常）
function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (!modal) return;

    modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}

// 14. 视频播放核心修复（保证高级交互+稳定播放，无报错，兼容WebM/MP4）
function playVideo(playerId, coverElement) {
    const videoElement = document.getElementById(playerId);
    if (!videoElement || !coverElement) {
        alert('视频元素初始化失败，请刷新页面重试');
        return;
    }

    // 尝试播放视频，处理浏览器兼容
    try {
        const playPromise = videoElement.play();
        if (playPromise) {
            playPromise.then(() => {
                coverElement.style.display = 'none'; // 播放成功隐藏封面
            }).catch(error => {
                coverElement.style.display = 'none'; // 即使被阻止，也隐藏封面
                alert('视频自动播放被浏览器限制，请手动点击视频控件播放');
                console.log('视频播放错误：', error);
            });
        } else {
            coverElement.style.display = 'none'; // 低版本浏览器兼容
        }

        // 视频结束后重置，显示封面
        videoElement.addEventListener('ended', function() {
            this.currentTime = 0;
            coverElement.style.display = 'flex';
        });
    } catch (error) {
        alert('视频播放失败，请检查视频文件格式（推荐WebM或H.264+AAC编码的MP4）');
        console.log('视频播放异常：', error);
    }
}