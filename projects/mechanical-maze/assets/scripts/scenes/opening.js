// 关卡1：开场垃圾场 - 拼接头场景

const OpeningScene = {
  // 零件位置
  parts: {
    head: { x: 100, y: 100, targetX: 300, targetY: 200, assembled: false, dragging: false, size: 80 },
    body: { x: 400, y: 300, targetX: 300, targetY: 300, assembled: false, dragging: false, size: { width: 80, height: 120 } },
    leftArm: { x: 100, y: 400, targetX: 260, targetY: 260, assembled: false, dragging: false, size: { width: 30, height: 80 } },
    rightArm: { x: 500, y: 400, targetX: 340, targetY: 260, assembled: false, dragging: false, size: { width: 30, height: 80 } },
    leftLeg: { x: 200, y: 500, targetX: 280, targetY: 390, assembled: false, dragging: false, size: { width: 40, height: 100 } },
    rightLeg: { x: 400, y: 500, targetX: 320, targetY: 390, assembled: false, dragging: false, size: { width: 40, height: 100 } }
  },

  // 容差：距离多少像素算放对位置
  tolerance: 40,

  // 初始化场景
  init() {
    console.log('开场垃圾场场景初始化');
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景天空
    ctx.fillStyle = '#7a8899';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 垃圾场地面
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);
    
    // 画目标位置框（提示玩家应该放这里）
    ctx.strokeStyle = 'rgba(184, 154, 107, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(300 - 40, 200 - 40, 80, 80); // 头
    ctx.strokeRect(300 - 40, 300 - 60, 80, 120); // 身体
    
    // 绘制所有零件
    this.drawPart(ctx, 'head');
    this.drawPart(ctx, 'body');
    this.drawPart(ctx, 'leftArm');
    this.drawPart(ctx, 'rightArm');
    this.drawPart(ctx, 'leftLeg');
    this.drawPart(ctx, 'rightLeg');
  },

  // 绘制单个零件
  drawPart(ctx, name) {
    const part = this.parts[name];
    ctx.fillStyle = '#8b6e4b';
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    
    if (name === 'head') {
      ctx.beginPath();
      ctx.arc(part.x + part.size/2, part.y + part.size/2, part.size/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      const size = part.size;
      ctx.fillRect(part.x, part.y, size.width, size.height);
      ctx.stroke();
    }
  },

  // 检查点击是否在零件上（开始拖拽）
  isPointInPart(x, y, name) {
    const part = this.parts[name];
    if (name === 'head') {
      const cx = part.x + part.size/2;
      const cy = part.y + part.size/2;
      const dist = Math.sqrt((x - cx)**2 + (y - cy)**2);
      return dist < part.size/2;
    } else {
      const size = part.size;
      return x >= part.x && x <= part.x + size.width &&
             y >= part.y && y <= part.y + size.height;
    }
  },

  // 拖拽处理
  onDrag(dx, dy) {
    // 找正在拖拽的零件
    for (const name in this.parts) {
      if (this.parts[name].dragging) {
        this.parts[name].x += dx;
        this.parts[name].y += dy;
        break;
      }
    }
  },

  // 检查单个零件是否到位
  checkPosition(name) {
    const part = this.parts[name];
    let dist;
    if (name === 'head') {
      dist = Math.sqrt((part.x + 40 - part.targetX)**2 + (part.y + 40 - part.targetY)**2);
    } else {
      const centerX = part.x + part.size.width / 2;
      const centerY = part.y + part.size.height / 2;
      const targetCenterX = part.targetX + part.size.width / 2;
      const targetCenterY = part.targetY + part.size.height / 2;
      dist = Math.sqrt((centerX - targetCenterX)**2 + (centerY - targetCenterY)**2);
    }
    if (dist < this.tolerance) {
      // 对齐到目标位置
      if (name === 'head') {
        part.x = part.targetX - 40;
        part.y = part.targetY - 40;
      } else {
        part.x = part.targetX;
        part.y = part.targetY;
      }
      part.assembled = true;
      part.dragging = false;
    }
  },

  // 触摸开始，检查是否点击了某个零件
  onTouch(x, y) {
    // 重置所有拖拽
    for (const name in this.parts) {
      if (!this.parts[name].assembled && this.isPointInPart(x, y)) {
        this.parts[name].dragging = true;
      } else {
        this.parts[name].dragging = false;
      }
    }
  },

  // 检查是否全部拼好
  checkAssemblyComplete() {
    for (const name in this.parts) {
      if (!this.parts[name].assembled) {
        return false;
      }
    }
    console.log('全部拼装完成！');
    // 拼装完成，触发事件，过1秒后切换到下一个场景
    setTimeout(() => {
      getCurrentPage().onSceneChange('climb');
    }, 1000);
    return true;
  },

  // 点击交互（如果有选中物品）
  checkInteraction(x, y) {
    // 开场还没有物品，暂时不需要
    return false;
  },

  // 使用物品（开场不需要）
  onUse(itemName, target) {
    return false;
  }
};

module.exports = OpeningScene;
