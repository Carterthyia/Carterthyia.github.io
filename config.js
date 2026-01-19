// config.js - 网站全局配置文件（单独抽离，方便后续修改）
const siteConfig = {
  // 管理员配置
  adminAccount: "admin",
  adminPassword: "carterthyia",
  // 网站基础信息
  siteName: "卡提希娅的星光小站",
  siteDomain: "www.carterthyia.com",
  siteDescription: "于光影中守护的温柔使者 · 双形态战斗达人卡提希娅专属站点",
  // 主题默认配置
  defaultTheme: "purple", // 可选：purple（银紫色）、blue（冰蓝色）
  defaultMode: "light", // 可选：light（浅色模式）、dark（深色模式）
  // 视频配置（方便后续替换视频地址）
  videoConfig: {
    smallCardVideo: "111.webm", // 小卡（迅刀形态）视频地址
    bigCardVideo: "12.webm", // 大卡（芙露德莉丝）视频地址
    videoPoster1: "1.jpg", // 小卡视频封面
    videoPoster2: "2.jpg"  // 大卡视频封面
  },
  // 图库配置
  galleryCount: 8, // 图库图片总数
  galleryTypes: ["all", "art", "battle", "daily"] // 图库筛选类型
};

// 配置挂载到window对象，确保在其他脚本中可全局访问
window.siteConfig = siteConfig;