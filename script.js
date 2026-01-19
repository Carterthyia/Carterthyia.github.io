// 全局变量
let currentTheme = 'purple';
let isDarkMode = false;
let isStoryVisible = true;

// 页面加载完成后执行
window.onload = function() {
    // 初始化动效
    initAnimations();
    // 初始化导航栏
    initNavbar();
    // 初始化回到顶部按钮
    initBackToTop();
    // 初始化视频标签切换
    initVideoTabs();
    // 初始化图库筛选
    initGalleryFilter();
};

// 1. 初始化页面动效（滚动淡入、卡片动效）
function initAnimations() {
    // 监听滚动事件，触发元素淡入
    window.addEventListener('scroll', function() {
        const animateElements = document.querySelectorAll('.section-animate');
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });

        // 卡片动效
        const cardElements = document.querySelectorAll('.card-animate');
        cardElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    });

    // 手动触发一次滚动事件，初始化可见元素
    window.dispatchEvent(new Event('scroll'));

    // 头像悬浮动效
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(5deg)';
        });
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // 标题文字渐变动效
    const title = document.getElementById('characterTitle');
    if (title) {
        let titleIndex = 0;
        const titleText = title.textContent;
        title.textContent = '';
        const typeWriter = setInterval(function() {
            if (titleIndex < titleText.length) {
                title.textContent += titleText.charAt(titleIndex);
                titleIndex++;
            } else {
                clearInterval(typeWriter);
            }
        }, 100);
    }
}

// 2. 初始化导航栏（移动端菜单、滚动样式变化）
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link[data-scroll]');

    // 滚动时导航栏样式变化
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

    // 导航链接点击后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// 3. 初始化回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        }
    });
}

// 4. 初始化视频标签切换（修复视频切换逻辑）
function initVideoTabs() {
    const videoTabs = document.querySelectorAll('.video-tab');
    videoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签激活状态
            document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
            // 隐藏所有视频容器
            document.querySelectorAll('.video-container').forEach(v => v.classList.remove('active'));
            // 激活当前标签和对应视频
            tab.classList.add('active');
            const targetVideo = tab.dataset.target;
            if (targetVideo) {
                document.getElementById(targetVideo).classList.add('active');
            }
        });
    });
}

// 5. 初始化图库筛选功能
function initGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filterType = tab.dataset.type;
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

// 6. 主题切换功能
function switchTheme(theme) {
    const root = document.documentElement;
    const avatar = document.getElementById('avatar');
    currentTheme = theme;

    if (theme === 'purple') {
        root.style.setProperty('--primary-color', 'var(--primary-color-purple)');
        root.style.setProperty('--secondary-color', 'var(--secondary-color-purple)');
        root.style.setProperty('--bg-color', 'var(--bg-color-purple)');
        if (avatar) avatar.style.boxShadow = '0 0 30px rgba(156, 126, 230, 0.3)';
    } else if (theme === 'blue') {
        root.style.setProperty('--primary-color', 'var(--primary-color-blue)');
        root.style.setProperty('--secondary-color', 'var(--secondary-color-blue)');
        root.style.setProperty('--bg-color', 'var(--bg-color-blue)');
        if (avatar) avatar.style.boxShadow = '0 0 30px rgba(110, 198, 255, 0.3)';
    }

    // 主题切换动效
    const body = document.body;
    body.classList.add('theme-transition');
    setTimeout(function() {
        body.classList.remove('theme-transition');
    }, 500);

    alert(`已切换为${theme === 'purple' ? '银紫色' : '冰蓝色'}主题！`);
}

// 7. 故事隐藏/显示功能
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const storyToggle = document.getElementById('storyToggle');
    if (!storyContent || !storyToggle) return;

    isStoryVisible = !isStoryVisible;

    if (isStoryVisible) {
        storyContent.style.display = 'block';
        storyToggle.innerHTML = '<i class="fas fa-chevron-up"></i> 收起故事';
        storyContent.style.opacity = '0';
        storyContent.style.transform = 'translateY(20px)';
        setTimeout(function() {
            storyContent.style.opacity = '1';
            storyContent.style.transform = 'translateY(0)';
        }, 10);
    } else {
        storyContent.style.opacity = '0';
        storyContent.style.transform = 'translateY(20px)';
        setTimeout(function() {
            storyContent.style.display = 'none';
            storyToggle.innerHTML = '<i class="fas fa-chevron-down"></i> 展开故事';
        }, 300);
    }
}

// 8. 深色模式切换功能
function toggleDarkMode() {
    const body = document.body;
    const backToTopBtn = document.getElementById('backToTop');
    const icon = document.querySelector('.control-btn:nth-child(4) i');
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        body.classList.remove('dark-mode');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    alert(`已切换为${isDarkMode ? '深色' : '浅色'}模式！`);
}

// 9. 攻略标签切换功能
function switchGuideTab(tab) {
    // 隐藏所有攻略内容
    const guideContents = document.querySelectorAll('.guide-content');
    guideContents.forEach(content => {
        content.classList.add('hidden');
    });

    // 移除所有标签激活状态
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示当前标签内容
    const currentContent = document.getElementById(`${tab}Content`);
    if (currentContent) currentContent.classList.remove('hidden');
    // 添加当前标签激活状态
    const currentBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (currentBtn) currentBtn.classList.add('active');

    // 触发卡片动效
    window.dispatchEvent(new Event('scroll'));
}

// 10. 图片预览功能
function previewImage(src) {
    const previewModal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    if (!previewModal || !previewImage) return;

    previewImage.src = src;
    previewModal.classList.remove('modal-hidden');
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

// 11. 关闭图片预览
function closeImagePreview() {
    const previewModal = document.getElementById('imagePreviewModal');
    if (!previewModal) return;
    previewModal.classList.add('modal-hidden');
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
}

// 12. 回到顶部功能
function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 13. 视频播放核心修复函数（健壮兼容，解决播放失败问题）
function playVideo(playerId, coverElement) {
    // 获取视频元素
    const videoElement = document.getElementById(playerId);
    if (!videoElement) {
        console.error("未找到视频播放器：", playerId);
        alert("视频播放器初始化失败，请刷新页面重试");
        return;
    }
    if (!coverElement) {
        console.error("未找到视频封面元素");
        return;
    }

    // 尝试播放视频
    try {
        // 先显示视频（避免封面遮挡）
        videoElement.style.display = "block";
        // 播放视频（处理 Promise 兼容）
        const playPromise = videoElement.play();
        if (playPromise) {
            playPromise.then(() => {
                // 播放成功，隐藏封面
                coverElement.style.display = "none";
            }).catch((error) => {
                console.error("视频播放被浏览器阻止：", error);
                coverElement.style.display = "none";
                alert("视频自动播放被阻止，请手动点击视频控件播放（已隐藏封面）");
            });
        } else {
            // 低版本浏览器，直接隐藏封面
            coverElement.style.display = "none";
        }

        // 视频播放结束，重置并显示封面
        videoElement.addEventListener('ended', () => {
            coverElement.style.display = "flex";
            videoElement.currentTime = 0; // 重置到视频开头
        });

        // 视频暂停时也显示封面（可选优化）
        videoElement.addEventListener('pause', () => {
            if (videoElement.currentTime > 0 && !videoElement.ended) {
                coverElement.style.display = "flex";
            }
        });
    } catch (error) {
        console.error("播放视频时发生异常：", error);
        alert("视频播放失败，请检查视频文件是否完好且编码为 H.264/AAC");
    }
}