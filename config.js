const siteConfig = {
  adminAccount: "admin",
  adminPassword: "carterthyia",
  siteName: "卡提希娅的星光小站",
  siteDomain: "www.carterthyia.com",
  siteDescription: "于光影中守护的温柔使者 · 双形态战斗达人卡提希娅专属站点",
  defaultTheme: "purple",
  defaultMode: "light",
  videoConfig: {
    smallCardVideo: "videos/111.mp4", // 小卡视频
    bigCardVideo: "videos/12.mp4",    // 大卡视频（强制区分）
    videoPoster1: "1.jpg",
    videoPoster2: "2.jpg"
  },
  galleryCount: 8,
  galleryTypes: ["all", "art", "battle", "daily"],
  // 新增：特效配置（可选）
  effectsConfig: {
    enableAdvancedEffects: true,
    maxParticles: 150,
    enableAudioVisualizer: true,
    enableParallax: true,
    performanceMode: false,
    defaultParticleDensity: 50
  }
};
window.siteConfig = siteConfig;