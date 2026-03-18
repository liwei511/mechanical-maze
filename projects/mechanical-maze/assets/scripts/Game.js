// 机械迷城 - 游戏主控制脚本

const Game = {
  // 当前使用的存档位
  currentSlot: 1,
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
    gameFinished: false,
    saveTime: null
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
  // 保存进度到指定存档位
  saveProgress(slot = this.currentSlot) {
    this.progress.saveTime = new Date().toLocaleString('zh-CN');
    wx.setStorageSync(`mechanical-maze-slot-${slot}`, {
      progress: this.progress,
      inventory: [...this.inventory],
      currentScene: this.currentScene,
      saveTime: this.progress.saveTime
    });
    console.log(`存档${slot}已保存`);
    return true;
  },
  // 加载指定存档位的进度
  loadProgress(slot = this.currentSlot) {
    const saved = wx.getStorageSync(`mechanical-maze-slot-${slot}`);
    if (saved) {
      this.currentSlot = slot;
      this.progress = saved.progress;
      this.inventory = saved.inventory || [];
      this.currentScene = saved.currentScene || 'opening';
      console.log(`存档${slot}已加载，最后保存时间：${saved.saveTime}`);
      return true;
    }
    return false;
  },
  // 获取所有存档列表
  getAllSaves() {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      const saved = wx.getStorageSync(`mechanical-maze-slot-${i}`);
      saves.push({
        slot: i,
        exists: !!saved,
        saveTime: saved?.saveTime || '空存档',
        progress: saved?.progress || null
      });
    }
    return saves;
  },
  // 删除指定存档
  deleteSave(slot) {
    wx.removeStorageSync(`mechanical-maze-slot-${slot}`);
    console.log(`存档${slot}已删除`);
  },
  
  // 获取场景中文名称
  getSceneName(sceneName) {
    const nameMap = {
      'opening': '垃圾场',
      'climb': '机械城入口',
      'square': '三土匪广场',
      'clock': '时钟塔',
      'boiler': '锅炉房',
      'lab': '研究所',
      'final': '塔顶决战'
    };
    return nameMap[sceneName] || '新场景';
  }
};

module.exports = Game;
