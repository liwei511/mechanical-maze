// 关卡5：锅炉房

const BoilerScene = {
  // 锅炉状态
  boiler: {
    isLit: false,
    fuelCount: 0,
  },

  // 阀门状态
  valves: {
    left: false, // false=关 true=开
    right: false,
  },

  // 场景元素位置
  elements: {
    boiler: { x: 150, y: 150, width: 200, height: 250 },
    coalPile: { x: 40, y: 350, width: 80, height: 80 },
    coal: { collected: false },
    feed: { x: 180, y: 320, width: 50, height: 30 }, // 加煤口
    leftValve: { x: 80, y: 200, radius: 30 },
    rightValve: { x: 400, y: 200, radius: 30 },
    chimney: { x: 250, y: 50, width: 40, height: 100 },
  },

  // 初始化
  init() {
    console.log('锅炉房初始化');
    this.boiler.isLit = false;
    this.boiler.fuelCount = 0;
    this.valves.left = false;
    this.valves.right = false;
    this.elements.coal.collected = false;
    Player.x = 50;
    Player.y = 250;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景
    ctx.fillStyle = '#3a3228';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 烟囱
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(this.elements.chimney.x, this.elements.chimney.y, this.elements.chimney.width, this.elements.chimney.height);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.elements.chimney.x, this.elements.chimney.y, this.elements.chimney.width, this.elements.chimney.height);

    // 烟（如果点着了）
    if (this.boiler.isLit) {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(this.elements.chimney.x + 20, this.elements.chimney.y - i * 15);
        ctx.quadraticCurveTo(this.elements.chimney.x + 40, this.elements.chimney.y - i * 15 - 10, this.elements.chimney.x + 20, this.elements.chimney.y - i * 15 - 20);
        ctx.strokeStyle = 'rgba(120, 120, 120, 0.5)';
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    }

    // 锅炉主体
    ctx.beginPath();
    const b = this.elements.boiler;
    ctx.arc(b.x + b.width/2, b.y + b.height/2, b.width/2, 0, 2 * Math.PI);
    ctx.fillStyle = '#5a4a3a';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 6;
    ctx.stroke();

    // 加煤口
    ctx.fillRect(this.elements.feed.x, this.elements.feed.y, this.elements.feed.width, this.elements.feed.height);
    ctx.fillStyle = '#2d261e';
    ctx.fill();
    ctx.strokeStyle = '#8b6e4b';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.elements.feed.x, this.elements.feed.y, this.elements.feed.width, this.elements.feed.height);

    // 煤堆
    if (!this.elements.coal.collected) {
      ctx.beginPath();
      ctx.moveTo(this.elements.coalPile.x, this.elements.coalPile.y + this.elements.coalPile.height);
      ctx.lineTo(this.elements.coalPile.x + this.elements.coalPile.width/2, this.elements.coalPile.y);
      ctx.lineTo(this.elements.coalPile.x + this.elements.coalPile.width, this.elements.coalPile.y + this.elements.coalPile.height);
      ctx.closePath();
      ctx.fillStyle = '#2d261e';
      ctx.fill();
      ctx.strokeStyle = '#5a5a5a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 阀门
    this.drawValve(ctx, this.elements.leftValve.x, this.elements.leftValve.y, this.elements.leftValve.radius, this.valves.left);
    this.drawValve(ctx, this.elements.rightValve.x, this.elements.rightValve.y, this.elements.rightValve.radius, this.valves.right);

    // 管道
    ctx.fillStyle = '#6a5a44';
    ctx.fillRect(30, 200, 40, 80);
    ctx.fillRect(420, 200, 40, 80);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 200, 40, 80);
    ctx.strokeRect(420, 200, 40, 80);
  },

  // 画阀门
  drawValve(ctx, x, y, r, open) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = open ? '#8b6e4b' : '#5a4a3a';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.stroke();
    // 阀柄
    ctx.beginPath();
    if (open) {
      ctx.moveTo(x - r/2, y);
      ctx.lineTo(x + r/2, y);
    } else {
      ctx.moveTo(x, y - r/2);
      ctx.lineTo(x, y + r/2);
    }
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 4;
    ctx.stroke();
  },

  // 交互检查
  checkInteraction(x, y) {
    // 点煤堆捡煤
    if (!this.elements.coal.collected &&
        x >= this.elements.coalPile.x && x <= this.elements.coalPile.x + this.elements.coalPile.width &&
        y >= this.elements.coalPile.y && y <= this.elements.coalPile.y + this.elements.coalPile.height) {
      this.elements.coal.collected = true;
      Inventory.addItem('coal');
      getCurrentPage().updateInventory();
      console.log('捡到煤');
      return true;
    }

    // 点阀门切换开关
    const checkValve = (name, el) => {
      const dist = Math.sqrt((x - el.x)**2 + (y - el.y)**2);
      if (dist < el.radius) {
        this.valves[name] = !this.valves[name];
        this.checkIfLit();
        console.log('切换阀门', name, this.valves[name]);
        return true;
      }
      return false;
    };
    if (checkValve('left', this.elements.leftValve)) return true;
    if (checkValve('right', this.elements.rightValve)) return true;

    return false;
  },

  // 使用物品加煤
  onUse(itemName) {
    if (itemName === 'coal') {
      // 检查是不是点在加煤口
      this.boiler.fuelCount++;
      this.checkIfLit();
      console.log('加煤成功，现在有', this.boiler.fuelCount, '块煤');
      return true;
    }
    return false;
  },

  // 检查是否点燃成功
  checkIfLit() {
    // 需要两个阀门都开，并且至少一块煤
    if (this.valves.left && this.valves.right && this.boiler.fuelCount >= 1 && !this.boiler.isLit) {
      this.boiler.isLit = true;
      console.log('锅炉点燃成功！蒸汽来了，开门了');
      Game.progress.boilerLit = true;
      Game.saveProgress();
      setTimeout(() => {
        getCurrentPage().onSceneChange('lab');
      }, 1500);
    }
  },

  onDrag() {
    return false;
  },

  checkAssemblyComplete() {
    return false;
  }
};

module.exports = BoilerScene;
