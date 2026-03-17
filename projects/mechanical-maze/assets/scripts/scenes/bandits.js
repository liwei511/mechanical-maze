// 关卡3：三土匪广场

const BanditsScene = {
  // 三个土匪状态
  bandits: {
    fat: { x: 400, y: 300, width: 120, height: 150, stillHere: true },
    tall: { x: 200, y: 150, width: 60, height: 250, stillHere: true },
    small: { x: 100, y: 350, width: 80, height: 80, stillHere: true },
  },

  // 场景元素
  elements: {
    well: { x: 100, y: 380, width: 60, height: 80, fished: false },
    bucket: { x: 0, y: 0, inWell: true },
    light: { x: 300, y: 50, width: 80, height: 150, fallen: false },
    flowerPot: { x: 150, y: 80, width: 50, height: 50, fallen: false },
    trashCan: { x: 500, y: 350, width: 70, height: 100 },
  },

  // 初始化
  init() {
    console.log('三土匪广场初始化');
    Player.x = 50;
    Player.y = 300;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景墙面
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight - 100);

    // 地面
    ctx.fillStyle = '#6a5a44';
    ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);

    // 阳台
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(100, 100, 250, 20);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, 250, 20);

    // 井
    if (this.bandits.small.stillHere) {
      ctx.fillStyle = '#3a3228';
      ctx.fillRect(this.elements.well.x, this.elements.well.y, this.elements.well.width, this.elements.well.height);
      ctx.strokeStyle = '#8b6e4b';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.elements.well.x, this.elements.well.y, this.elements.well.width, this.elements.well.height);
    }

    // 吊灯
    if (!this.elements.light.fallen) {
      ctx.fillStyle = '#3a3228';
      ctx.fillRect(this.elements.light.x, this.elements.light.y, 10, this.elements.light.height);
      ctx.beginPath();
      ctx.arc(this.elements.light.x + 5, 200, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffcc66';
      ctx.fill();
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 花盆
    if (!this.elements.flowerPot.fallen) {
      ctx.fillStyle = '#6a8876';
      ctx.fillRect(this.elements.flowerPot.x, this.elements.flowerPot.y, this.elements.flowerPot.width, this.elements.flowerPot.height);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.elements.flowerPot.x, this.elements.flowerPot.y, this.elements.flowerPot.width, this.elements.flowerPot.height);
    }

    // 垃圾桶
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(this.elements.trashCan.x, this.elements.trashCan.y, this.elements.trashCan.width, this.elements.trashCan.height);
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.elements.trashCan.x, this.elements.trashCan.y, this.elements.trashCan.width, this.elements.trashCan.height);

    // 画还在的土匪
    if (this.bandits.fat.stillHere) {
      this.drawBanditFat(ctx, this.bandits.fat.x, this.bandits.fat.y);
    }
    if (this.bandits.tall.stillHere) {
      this.drawBanditTall(ctx, this.bandits.tall.x, this.bandits.tall.y);
    }
    if (this.bandits.small.stillHere) {
      this.drawBanditSmall(ctx, this.bandits.small.x, this.bandits.small.y);
    }
  },

  // 画胖土匪
  drawBanditFat(ctx, x, y) {
    // 身体
    ctx.beginPath();
    ctx.arc(x + 60, y + 60, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#5a5a66';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.stroke();
    // 头
    ctx.beginPath();
    ctx.arc(x + 60, y + 30, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#6a6a77';
    ctx.fill();
    ctx.stroke();
  },

  // 画高土匪
  drawBanditTall(ctx, x, y) {
    // 身体
    ctx.fillRect(x, y, 60, 250);
    ctx.fillStyle = '#5a5a66';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 60, 250);
    // 头
    ctx.beginPath();
    ctx.arc(x + 30, y + 20, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#6a6a77';
    ctx.fill();
    ctx.stroke();
  },

  // 画小土匪
  drawBanditSmall(ctx, x, y) {
    // 身体圆
    ctx.beginPath();
    ctx.arc(x + 40, y + 40, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#5a5a66';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    ctx.stroke();
    // 礼帽
    ctx.fillRect(x + 10, y + 10, 60, 15);
    ctx.fillStyle = '#2a2a33';
    ctx.fill();
    ctx.stroke();
  },

  // 检查交互
  checkInteraction(x, y) {
    // 点井 - 钓出桶
    if (this.isPointInRect(x, y, this.elements.well) && this.bandits.small.stillHere && !this.elements.well.fished) {
      // 钓上来一个空桶，放进背包
      this.elements.well.fished = true;
      Inventory.addItem('bucket');
      getCurrentPage().updateInventory();
      console.log('获得空桶');
      return true;
    }

    // 点吊灯绳子，把桶挂上去（需要有桶）
    if (this.isPointInRect(x, y, {x: this.elements.light.x, y: this.elements.light.y, width: 15, height: 100}) &&
        Inventory.hasItem('bucket') && !this.elements.light.fallen && this.bandits.fat.stillHere) {
      // 挂桶，吊灯掉下来砸走胖土匪
      this.elements.light.fallen = true;
      Inventory.removeItem('bucket');
      getCurrentPage().updateInventory();
      this.bandits.fat.stillHere = false;
      console.log('胖土匪被砸走');
      return true;
    }

    // 点花盆推下去砸高土匪
    if (this.isPointInRect(x, y, this.elements.flowerPot) && !this.elements.flowerPot.fallen && this.bandits.tall.stillHere) {
      this.elements.flowerPot.fallen = true;
      this.bandits.tall.stillHere = false;
      console.log('高土匪被砸走');
      return true;
    }

    // 点垃圾桶，小土匪进去吃，把盖子关上闷走
    if (this.isPointInRect(x, y, this.elements.trashCan) && this.bandits.small.stillHere && !this.bandits.fat.stillHere && !this.bandits.tall.stillHere) {
      // 骗小土匪进去然后关盖子
      this.bandits.small.stillHere = false;
      console.log('小土匪被闷走');
      // 检查是不是全部走了
      if (this.checkAllBanditsGone()) {
        setTimeout(() => {
          getCurrentPage().onSceneChange('clocktower');
        }, 1000);
      }
      return true;
    }

    return false;
  },

  // 点矩形判断
  isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  },

  // 检查所有土匪都走了
  checkAllBanditsGone() {
    for (const name in this.bandits) {
      if (this.bandits[name].stillHere) {
        return false;
      }
    }
    return true;
  },

  // 使用物品
  onUse(itemName) {
    return false;
  },

  // 拖拽不需要
  onDrag() {
    return false;
  },

  checkAssemblyComplete() {
    return false;
  }
};

module.exports = BanditsScene;
