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

    // 头像悬浮动效（确保头像交互正常）
    const avatar = document.getElementById('avatar');
    if (avatar) { // 判空，避免头像不存在时报错
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(5deg)';
        });
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // 标题文字渐变动效
    const title = document.getElementById('characterTitle');
    if (title) { // 判空，避免报错
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

// 4. 主题切换功能（保留原有功能，优化动效）
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

// 5. 故事隐藏/显示功能（优化折叠动画）
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const storyToggle = document.getElementById('storyToggle');
    if (!storyContent || !storyToggle) return; // 判空避免报错

    isStoryVisible = !isStoryVisible;

    if (isStoryVisible) {
        storyContent.style.display = 'block';
        storyToggle.innerHTML = '<i class="fas fa-chevron-up"></i> 收起故事';
        // 淡入动画
        storyContent.style.opacity = '0';
        storyContent.style.transform = 'translateY(20px)';
        setTimeout(function() {
            storyContent.style.opacity = '1';
            storyContent.style.transform = 'translateY(0)';
        }, 10);
    } else {
        // 淡出动画
        storyContent.style.opacity = '0';
        storyContent.style.transform = 'translateY(20px)';
        setTimeout(function() {
            storyContent.style.display = 'none';
            storyToggle.innerHTML = '<i class="fas fa-chevron-down"></i> 展开故事';
        }, 300);
    }
}

// 6. 深色模式切换功能（新增）
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

// 7. 攻略标签切换功能（新增）
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

// 8. 图片预览功能（新增）
function previewImage(src) {
    const previewModal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    if (!previewModal || !previewImage) return; // 判空避免报错

    previewImage.src = src;
    previewModal.classList.remove('modal-hidden');

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

// 9. 关闭图片预览（新增）
function closeImagePreview() {
    const previewModal = document.getElementById('imagePreviewModal');
    if (!previewModal) return; // 判空避免报错

    previewModal.classList.add('modal-hidden');

    // 恢复页面滚动
    document.body.style.overflow = 'auto';
}

// 10. 回到顶部功能（新增）
function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 11. 管理员后台相关功能（保留原有功能，优化动效）
function showAdminLogin() {
    const adminModal = document.getElementById('adminLoginModal');
    if (!adminModal) return; // 判空避免报错

    adminModal.classList.remove('modal-hidden');

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

function closeAdminLogin() {
    const adminModal = document.getElementById('adminLoginModal');
    if (!adminModal) return; // 判空避免报错

    adminModal.classList.add('modal-hidden');

    // 恢复页面滚动
    document.body.style.overflow = 'auto';
}

function adminLogin() {
    const adminName = document.getElementById('adminName');
    const adminPwd = document.getElementById('adminPwd');
    if (!adminName || !adminPwd) return; // 判空避免报错

    if (adminName.value === 'admin' && adminPwd.value === 'carterthyia') {
        closeAdminLogin();
        const adminPage = document.getElementById('adminPage');
        if (adminPage) adminPage.classList.remove('hidden');

        // 管理员登录成功动效
        const adminContainer = document.querySelector('.admin-container');
        if (adminContainer) {
            adminContainer.style.opacity = '0';
            adminContainer.style.transform = 'scale(0.9)';
            setTimeout(function() {
                adminContainer.style.opacity = '1';
                adminContainer.style.transform = 'scale(1)';
            }, 100);
        }
    } else {
        alert('账号或密码错误，请重新输入！');
    }
}

function closeAdminPage() {
    const adminPage = document.getElementById('adminPage');
    if (adminPage) adminPage.classList.add('hidden');
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const adminModal = document.getElementById('adminLoginModal');
    const previewModal = document.getElementById('imagePreviewModal');
    const adminPage = document.getElementById('adminPage');

    if (event.target === adminModal) {
        closeAdminLogin();
    }

    if (event.target === previewModal) {
        closeImagePreview();
    }

    if (event.target === adminPage) {
        closeAdminPage();
    }
}