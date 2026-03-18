// 机械迷城 - 首页游戏逻辑

// 引入核心脚本
const Game = require('../../assets/scripts/Game');
const Player = require('../../assets/scripts/Player');
const Inventory = require('../../assets/scripts/Inventory');
const Hint = require('../../assets/scripts/Hint');
const Feedback = require('../../assets/scripts/Feedback');

Page({
  data: {
    gameStarted: false,
    showSaveSelect: false,
    showSettings: false,
    saves: [],
    settings: {
      bgmVolume: 0.7,
      sfxVolume: 0.8,
      vibration: true
    },
    inventory: [],
    selectedItem: null,
    showHintModal: false,
    currentHint: '',
    // 转场动画状态
    transition: {
      active: false,
      state: 'fadeOut', // fadeOut | fadeIn
      animFrame: 0,
      nextScene: ''
    }
  },

  onLoad() {
    console.log('页面加载');
    // 加载存档列表
    this.loadSaves();
  },

  // 加载存档列表
  loadSaves() {
    const saves = Game.getAllSaves();
    this.setData({ saves });
  },

  // 显示存档选择界面
  showSaveSelect() {
    this.loadSaves();
    this.setData({ showSaveSelect: true });
  },

  // 隐藏存档选择
  hideSaveSelect() {
    this.setData({ showSaveSelect: false });
  },

  // 选择存档开始游戏
  selectSave(e) {
    const slot = e.currentTarget.dataset.slot;
    const hasSave = Game.loadProgress(slot);
    Player.init();
    // 如果没有存档，初始化新游戏
    if (!hasSave) {
      Game.init();
      Game.currentSlot = slot;
    }
    this.setData({
      gameStarted: true,
      showSaveSelect: false
    });
    this.initCanvas();
    this.render();
  },

  // 手动存档
  manualSave() {
    Game.saveProgress();
    Feedback.success('游戏已保存');
  },

  // 显示设置
  showSettings() {
    // 加载本地保存的设置
    const savedSettings = wx.getStorageSync('mechanical-maze-settings');
    if (savedSettings) {
      this.setData({ settings: savedSettings });
    }
    this.setData({ showSettings: true });
  },

  // 隐藏设置
  hideSettings() {
    // 保存设置到本地
    wx.setStorageSync('mechanical-maze-settings', this.data.settings);
    this.setData({ showSettings: false });
  },

  // 切换震动开关
  toggleVibration() {
    const settings = this.data.settings;
    settings.vibration = !settings.vibration;
    this.setData({ settings });
    if (settings.vibration) {
      wx.vibrateShort();
      Feedback.success('震动已开启');
    } else {
      Feedback.success('震动已关闭');
    }
  },

  // 初始化画布
  initCanvas() {
    this.ctx = wx.createCanvasContext('gameCanvas');
    this.canvasWidth = wx.getSystemInfoSync().windowWidth;
    this.canvasHeight = wx.getSystemInfoSync().windowHeight - 120;
    console.log('画布尺寸', this.canvasWidth, this.canvasHeight);
  },

  // 渲染帧
  render() {
    const transition = this.data.transition;
    
    // 清屏
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // 非转场状态下更新游戏逻辑
    if (!transition.active) {
      Player.update();
    }
    
    // 更新反馈系统
    Feedback.update();
    
    // 绘制当前场景
    this.drawCurrentScene();
    // 绘制主角
    this.drawPlayer();
    
    // 绘制反馈提示
    Feedback.draw(this.ctx, this.canvasWidth, this.canvasHeight);
    
    // 处理转场动画
    if (transition.active) {
      transition.animFrame++;
      let opacity = 0;
      
      if (transition.state === 'fadeOut') {
        // 旧场景淡出：从透明到黑色
        opacity = transition.animFrame / 15; // 15帧完成淡出
        if (transition.animFrame >= 15) {
          // 淡出完成，切换场景
          Game.changeScene(transition.nextScene);
          // 切换到淡入状态
          transition.state = 'fadeIn';
          transition.animFrame = 0;
          this.updateInventory();
        }
      } else if (transition.state === 'fadeIn') {
        // 新场景淡入：从黑色到透明
        opacity = 1 - transition.animFrame / 15;
        if (transition.animFrame >= 15) {
          // 淡入完成，结束转场
          transition.active = false;
          transition.animFrame = 0;
        }
      }
      
      // 绘制转场遮罩
      this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(opacity, 1)})`;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 更新转场状态
      this.setData({ transition });
    }
    
    this.ctx.draw();
    // 继续下一帧
    if (this.data.gameStarted) {
      requestAnimationFrame(() => this.render());
    }
  },

  // 绘制当前场景
  drawCurrentScene() {
    // 根据当前场景绘制
    const scene = this.getCurrentScene();
    if (scene && scene.draw) {
      scene.draw(this.ctx, this.canvasWidth, this.canvasHeight);
    }
  },

  // 绘制主角
  drawPlayer() {
    // 绘制Josef，根据位置和表情
    const centerX = Player.x + 50;
    let centerY = Player.y + 50;
    
    // 行走的时候轻微上下跳动，模拟走路颠簸
    if (Player.state === 'walking') {
      centerY += Math.sin(Player.animFrame * 0.3) * 3;
    }

    // 主体圆形
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#cccccc';
    this.ctx.fill();
    this.ctx.strokeStyle = '#2d261e';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // 眼睛
    this.ctx.fillStyle = '#2d261e';
    this.ctx.beginPath();
    this.ctx.arc(centerX - 15, centerY - 10, 5, 0, 2 * Math.PI);
    this.ctx.arc(centerX + 15, centerY - 10, 5, 0, 2 * Math.PI);
    this.ctx.fill();

    // 嘴巴，根据表情变化
    this.ctx.beginPath();
    if (Player.expression === 'happy') {
      this.ctx.arc(centerX, centerY + 10, 10, 0, Math.PI);
    } else if (Player.expression === 'sad') {
      this.ctx.arc(centerX, centerY + 20, 10, Math.PI, 0);
    } else {
      this.ctx.rect(centerX - 10, centerY + 10, 20, 3);
    }
    this.ctx.fill();

    // 腿，走路的时候摆动
    const legOffset = Player.state === 'walking' ? Math.sin(Player.animFrame * 0.4) * 5 : 0;
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    // 左腿
    this.ctx.moveTo(centerX - 15, centerY + 40);
    this.ctx.lineTo(centerX - 15 + legOffset, centerY + 65);
    // 右腿
    this.ctx.moveTo(centerX + 15, centerY + 40);
    this.ctx.lineTo(centerX + 15 - legOffset, centerY + 65);
    this.ctx.stroke();
  },

  // 获取当前场景模块
  getCurrentScene() {
    const sceneName = Game.currentScene;
    // 动态引入场景脚本
    try {
      const scene = require(`../../assets/scripts/scenes/${sceneName}.js`);
      // 把当前页面对象暴露给场景使用
      getCurrentPage = () => this;
      return scene;
    } catch (e) {
      console.error('场景加载失败', sceneName, e);
      return null;
    }
  },

  // 触摸开始
  onTouchStart(e) {
    const { x, y } = e.touches[0];
    this.touchStartX = x;
    this.touchStartY = y;
    
    // 如果选中了物品，尝试使用
    if (this.data.selectedItem) {
      // 检查点击位置是否是互动元素
      const scene = this.getCurrentScene();
      if (scene && scene.onTouch) {
        const used = scene.onTouch(x, y, this.data.selectedItem);
        if (used) {
          Inventory.useItem(this.data.selectedItem);
          this.setData({
            selectedItem: null,
            inventory: Inventory.getItems()
          });
          Game.saveProgress();
        }
      }
    } else {
      // 普通点击移动
      Player.moveTo(x - 50, y - 50);
      // 检查交互
      const scene = this.getCurrentScene();
      if (scene && scene.checkInteraction) {
        scene.checkInteraction(x, y);
      }
    }
  },

  // 触摸移动（用于拖拽）
  onTouchMove(e) {
    const { x, y } = e.touches[0];
    // 如果是开场拼接头，处理拖拽
    if (Game.currentScene === 'opening' && !Game.progress.josefAssembled) {
      const scene = this.getCurrentScene();
      if (scene && scene.onDrag) {
        scene.onDrag(x - this.touchStartX, y - this.touchStartY);
        this.touchStartX = x;
        this.touchStartY = y;
      }
    }
  },

  // 触摸结束
  onTouchEnd(e) {
    // 开场拼接头检查是否完成
    if (Game.currentScene === 'opening' && !Game.progress.josefAssembled) {
      const scene = this.getCurrentScene();
      if (scene) {
        // 检查所有拖拽零件是否到位
        for (const name in scene.parts) {
          if (scene.parts[name].dragging) {
            scene.checkPosition(name);
          }
        }
        // 检查是否全部组装完成
        const complete = scene.checkAssemblyComplete();
        if (complete) {
          Player.assembleComplete();
          this.updateInventory();
        }
      }
    }
  },

  // 选择物品栏物品
  selectItem(e) {
    const itemName = e.currentTarget.dataset.item;
    if (this.data.selectedItem === itemName) {
      this.setData({ selectedItem: null });
    } else {
      this.setData({ selectedItem: itemName });
    }
  },

  // 更新物品栏显示
  updateInventory() {
    this.setData({
      inventory: Inventory.getItems().map(name => ({
        name,
        icon: `../../assets/images/items/${name}.png`
      }))
    });
  },

  // 显示提示
  showHint(e) {
    e.stopPropagation();
    const hint = Hint.showHint();
    this.setData({
      showHintModal: true,
      currentHint: hint
    });
  },

  // 关闭提示
  closeHint() {
    this.setData({
      showHintModal: false
    });
  },

  // 切换场景回调
  onSceneChange(sceneName) {
    // 触发转场动画
    const transition = this.data.transition;
    transition.active = true;
    transition.state = 'fadeOut';
    transition.animFrame = 0;
    transition.nextScene = sceneName;
    this.setData({ transition });
    Feedback.success(`进入${Game.getSceneName(sceneName)}`);
  }
});
