// 机械迷城 - 首页游戏逻辑

// 引入核心脚本
const Game = require('../../assets/scripts/Game');
const Player = require('../../assets/scripts/Player');
const Inventory = require('../../assets/scripts/Inventory');
const Hint = require('../../assets/scripts/Hint');

Page({
  data: {
    gameStarted: false,
    hasSave: false,
    inventory: [],
    selectedItem: null,
    showHintModal: false,
    currentHint: ''
  },

  onLoad() {
    console.log('页面加载');
    // 检查是否有存档
    Game.loadProgress();
    if (Game.progress.josefAssembled) {
      this.setData({ hasSave: true });
    }
  },

  // 开始游戏
  startGame() {
    Game.init();
    Player.init();
    this.setData({
      gameStarted: true
    });
    this.initCanvas();
    this.render();
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
    // 清屏
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // 绘制当前场景
    this.drawCurrentScene();
    // 绘制主角
    this.drawPlayer();
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
    // 占位，后续美术资源到位后实现
    this.ctx.beginPath();
    this.ctx.arc(Player.x + 50, Player.y + 50, 40, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#cccccc';
    this.ctx.fill();
    this.ctx.strokeStyle = '#2d261e';
    this.ctx.lineWidth = 3;
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
      if (scene && scene.checkAssemblyComplete) {
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
    Game.changeScene(sceneName);
    this.updateInventory();
  }
});
