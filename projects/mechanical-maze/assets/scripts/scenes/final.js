// 关卡7：塔顶最终战 + 结局

const FinalScene = {
  // Boss状态
  boss: {
    alive: true,
    x: 300,
    y: 200,
    size: 150,
  },

  // 女朋友
  girl: {
    x: 350,
    y: 150,
  },

  // 高台拿枪位置
  platform: {
    x: 50,
    y: 100,
    width: 100,
    height: 40,
  },

  // 枪已经拿到
  gunTaken: false,

  // 游戏结束
  gameFinished: false,

  // 初始化
  init() {
    console.log('最终关初始化');
    this.gunTaken = false;
    this.gameFinished = false;
    this.boss.alive = true;
    Player.x = 100;
    Player.y = 300;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景天空
    ctx.fillStyle = '#7a8899';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 远景城市剪影
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(0, 80, canvasWidth, 80);
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(i * 60 + 20, 30, 40, 60);
      ctx.fillStyle = '#4a3f33';
      ctx.fill();
    }

    // 塔顶平台
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, canvasHeight - 80, canvasWidth, 80);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, canvasHeight - 80, canvasWidth, 80);

    // 高台
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);

    // 枪在高台上
    if (!this.gunTaken && !this.gameFinished) {
      ctx.fillStyle = '#b89a6b';
      ctx.fillRect(this.platform.x + 20, this.platform.y + 10, 50, 15);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.platform.x + 15, this.platform.y + 18, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (this.boss.alive) {
      // Boss大机器人
      ctx.fillStyle = '#3a3a44';
      // 身体方块
      ctx.fillRect(this.boss.x - 60, this.boss.y - 40, 120, 150);
      ctx.strokeStyle = '#1a1a22';
      ctx.lineWidth = 4;
      ctx.strokeRect(this.boss.x - 60, this.boss.y - 40, 120, 150);

      // 大钳子左臂
      ctx.fillRect(this.boss.x - 80, this.boss.y, 30, 10);
      ctx.fill();
      ctx.stroke();

      // 大钳子右臂
      ctx.fillRect(this.boss.x + 50, this.boss.y, 30, 10);
      ctx.fill();
      ctx.stroke();

      // 头灯
      ctx.beginPath();
      ctx.arc(this.boss.x, this.boss.y - 60, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffcc66';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 女朋友被抓着
    if (this.boss.alive) {
      ctx.beginPath();
      ctx.arc(this.girl.x, this.girl.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#9a8a77';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillRect(this.girl.x - 15, this.girl.y + 25, 30, 50);
      ctx.fill();
      ctx.stroke();
    }

    // 游戏结束画面
    if (this.gameFinished) {
      // Boss没了，两人在一起
      ctx.beginPath();
      // Josefa
      ctx.arc(200, 200, 40, 0, 2 * Math.PI);
      ctx.fillStyle = '#cccccc';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillRect(180, 240, 40, 80);
      ctx.fillStyle = '#8b6e4b';
      ctx.fill();
      ctx.stroke();

      // 女孩
      ctx.beginPath();
      ctx.arc(280, 200, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#b8a899';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillRect(265, 230, 30, 70);
      ctx.fillStyle = '#9a8a77';
      ctx.fill();
      ctx.stroke();

      // 胜利文字画出来
      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('The End', canvasWidth / 2, 80);
      ctx.font = '16px sans-serif';
      ctx.fillText('机械迷城 简版', canvasWidth / 2, 110);
    }
  },

  // 交互检查
  checkInteraction(x, y) {
    // 拿枪
    if (!this.gunTaken &&
        x >= this.platform.x && x <= this.platform.x + this.platform.width &&
        y >= this.platform.y && y <= this.platform.y + this.platform.height) {
      if (Inventory.hasItem('gun')) {
        this.gunTaken = true;
        console.log('枪装备好了，可以打Boss了');
      }
      return true;
    }

    return false;
  },

  // 使用枪打Boss
  onUse(itemName) {
    if (itemName === 'gun' && this.boss.alive && this.gunTaken) {
      // 打死Boss
      this.boss.alive = false;
      Inventory.removeItem('gun');
      getCurrentPage().updateInventory();
      this.gameFinished = true;
      Game.progress.gameFinished = true;
      Game.saveProgress();
      console.log('恭喜！游戏通关了！');
      return true;
    }
    return false;
  },

  onDrag() {
    return false;
  },

  checkAssemblyComplete() {
    return false;
  }
};

module.exports = FinalScene;
