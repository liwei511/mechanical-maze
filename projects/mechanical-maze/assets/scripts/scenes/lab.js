// 关卡6：研究所 - 救科学家

const LabScene = {
  // 科学家关在笼子里
  scientist: {
    inCage: true,
    x: 250,
    y: 200,
  },

  // 笼子
  cage: {
    x: 200,
    y: 150,
    width: 100,
    height: 150,
    locked: true,
  },

  // 实验台
  table: {
    x: 50,
    y: 300,
    width: 150,
    height: 150,
  },

  // 钥匙在实验台抽屉里
  drawer: {
    open: false,
    keyTaken: false,
    x: 80,
    y: 350,
    width: 80,
    height: 40,
  },

  // 门出去到塔顶
  exitDoor: {
    x: 400,
    y: 150,
    width: 80,
    height: 200,
    locked: true,
  },

  // 初始化
  init() {
    console.log('研究所初始化');
    Player.x = 50;
    Player.y = 400;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 后墙实验台
    ctx.fillStyle = '#6a5a44';
    ctx.fillRect(this.table.x, this.table.y, this.table.width, this.table.height);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.table.x, this.table.y, this.table.width, this.table.height);

    // 瓶子装饰，简化成几个圆柱
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(120, 160, 180, 0.8)`;
      ctx.fillRect(this.table.x + 20 + i * 30, this.table.y + 20, 15, 50);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.table.x + 20 + i * 30, this.table.y + 20, 15, 50);
    }

    // 笼子
    if (this.cage.locked) {
      ctx.strokeStyle = '#8b6e4b';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.cage.x, this.cage.y, this.cage.width, this.cage.height);
      // 竖条
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(this.cage.x + i * 20, this.cage.y);
        ctx.lineTo(this.cage.x + i * 20, this.cage.y + this.cage.height);
        ctx.stroke();
      }
    }

    // 科学家
    ctx.beginPath();
    ctx.arc(this.scientist.x, this.scientist.y - 20, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#7a6b55';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 身体
    ctx.fillRect(this.scientist.x - 15, this.scientist.y, 30, 50);
    ctx.fillStyle = '#7a6b55';
    ctx.fill();
    ctx.stroke();

    // 抽屉
    ctx.fillStyle = this.drawer.open ? '#7a6b55' : '#5a4a3a';
    ctx.fillRect(this.drawer.x, this.drawer.y, this.drawer.width, this.drawer.height);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.drawer.x, this.drawer.y, this.drawer.width, this.drawer.height);
    // 把手
    if (!this.drawer.open) {
      ctx.beginPath();
      ctx.arc(this.drawer.x + this.drawer.width / 2, this.drawer.y + this.drawer.height / 2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#2d261e';
      ctx.fill();
    }

    // 钥匙在抽屉里
    if (this.drawer.open && !this.drawer.keyTaken) {
      ctx.beginPath();
      ctx.moveTo(this.drawer.x + 10, this.drawer.y + 20);
      ctx.lineTo(this.drawer.x + 30, this.drawer.y + 10);
      ctx.lineTo(this.drawer.x + 35, this.drawer.y + 15);
      ctx.lineTo(this.drawer.x + 15, this.drawer.y + 25);
      ctx.closePath();
      ctx.fillStyle = '#b89a6b';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 出口门
    ctx.fillStyle = this.exitDoor.locked ? '#3a3228' : '#2d261e';
    ctx.fillRect(this.exitDoor.x, this.exitDoor.y, this.exitDoor.width, this.exitDoor.height);
    ctx.strokeStyle = '#b89a6b';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.exitDoor.x, this.exitDoor.y, this.exitDoor.width, this.exitDoor.height);
  },

  // 交互检查
  checkInteraction(x, y) {
    // 点抽屉开门
    if (!this.drawer.open &&
        x >= this.drawer.x && x <= this.drawer.x + this.drawer.width &&
        y >= this.drawer.y && y <= this.drawer.y + this.drawer.height) {
      this.drawer.open = true;
      console.log('抽屉打开');
      return true;
    }

    // 点抽屉里钥匙拿钥匙
    if (this.drawer.open && !this.drawer.keyTaken &&
        x >= this.drawer.x + 5 && x <= this.drawer.x + 40 &&
        y >= this.drawer.y + 5 && y <= this.drawer.y + 35) {
      this.drawer.keyTaken = true;
      Inventory.addItem('cageKey');
      getCurrentPage().updateInventory();
      console.log('拿到笼子钥匙');
      return true;
    }

    return false;
  },

  // 使用钥匙开笼子
  onUse(itemName) {
    if (itemName === 'cageKey' && this.cage.locked) {
      // 检查是不是点在笼子
      this.cage.locked = false;
      Game.progress.scientistRescued = true;
      Game.saveProgress();
      Inventory.removeItem('cageKey');
      getCurrentPage().updateInventory();
      // 科学家给你枪
      Inventory.addItem('gun');
      getCurrentPage().updateInventory();
      // 打开出口门
      this.exitDoor.locked = false;
      console.log('笼子打开，科学家给了枪，开门了');
      return true;
    }

    return false;
  },

  // 如果走到出口，去下一关
  onSceneTouch(x, y) {
    if (!this.exitDoor.locked &&
        x >= this.exitDoor.x && x <= this.exitDoor.x + this.exitDoor.width &&
        y >= this.exitDoor.y && y <= this.exitDoor.y + this.exitDoor.height) {
      setTimeout(() => {
        getCurrentPage().onSceneChange('final');
      }, 1000);
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

module.exports = LabScene;
