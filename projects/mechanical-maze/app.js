// 机械迷城 - 微信小程序入口

App({
  onLaunch() {
    console.log('机械迷城 小游戏启动');
    // 初始化游戏
    require('./assets/scripts/Game.js').init();
    require('./assets/scripts/Player.js').init();
  },

  globalData: {
    userInfo: null
  }
});
