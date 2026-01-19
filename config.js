const siteConfig = {
  adminAccount: "admin",
  adminPassword: "carterthyia@2026",
  siteName: "卡提希娅的星光小站",
  siteDomain: "www.carterthyia.com",
  siteDescription: "于光影中守护的温柔使者 · 双形态战斗达人卡提希娅专属站点",
  defaultTheme: "purple",
  defaultMode: "light",
  // 适配：根目录/videos文件夹 + 111.mp4/12.mp4
  videoConfig: {
    smallCardVideo: "videos/111.mp4", // 小卡视频路径
    bigCardVideo: "videos/12.mp4",    // 大卡视频路径
    videoPoster1: "1.jpg",
    videoPoster2: "2.jpg"
  },
  galleryCount: 8,
  galleryTypes: ["all", "art", "battle", "daily"]
};
window.siteConfig = siteConfig;