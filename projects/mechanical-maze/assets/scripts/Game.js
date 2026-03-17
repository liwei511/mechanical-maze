// 机械迷城 - 游戏主控制脚本

const Game = {
  // 当前场景
  currentScene: null,
  // 玩家物品栏
  inventory: [],
  // 游戏进度
  progress: {
    josefAssembled: false,
    enteredCity: false,
    banditsDefeated: false,
    boilerLit: false,
    clockTowerOpened: false,
    scientistRescued: false,
    gameFinished: false
  },
  // 初始化游戏
  init() {
    this.currentScene = 'opening';
    this.inventory = [];
    console.log('机械迷城 初始化完成');
  },
  // 切换场景
  changeScene(sceneName) {
    this.currentScene = sceneName;
    console.log('切换场景到:', sceneName);
  },
  // 添加物品到背包
  addItem(item) {
    if (!this.inventory.includes(item)) {
      this.inventory.push(item);
      console.log('获得物品:', item);
    }
  },
  // 移除物品
  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
      console.log('使用物品:', item);
    }
  },
  // 保存进度
  saveProgress() {
    wx.setStorageSync('mechanical-maze-progress', this.progress);
    console.log('进度已保存');
  },
  // 加载进度
  loadProgress() {
    const saved = wx.getStorageSync('mechanical-maze-progress');
    if (saved) {
      this.progress = saved;
      console.log('进度已加载');
    }
  }
};

module.exports = Game;
