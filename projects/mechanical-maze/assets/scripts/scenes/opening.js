// 关卡1：开场垃圾场 - 拼接头场景

const Feedback = require('../Feedback');

const OpeningScene = {
  // 零件位置
  parts: {
    head: { x: 100, y: 100, targetX: 300, targetY: 200, assembled: false, dragging: false, size: 80, anim: 0 },
    body: { x: 400, y: 300, targetX: 300, targetY: 300, assembled: false, dragging: false, size: { width: 80, height: 120 }, anim: 0 },
    leftArm: { x: 100, y: 400, targetX: 260, targetY: 260, assembled: false, dragging: false, size: { width: 30, height: 80 }, anim: 0 },
    rightArm: { x: 500, y: 400, targetX: 340, targetY: 260, assembled: false, dragging: false, size: { width: 30, height: 80 }, anim: 0 },
    leftLeg: { x: 200, y: 500, targetX: 280, targetY: 390, assembled: false, dragging: false, size: { width: 40, height: 100 }, anim: 0 },
    rightLeg: { x: 400, y: 500, targetX: 320, targetY: 390, assembled: false, dragging: false, size: { width: 40, height: 100 }, anim: 0 }
  },

  // 容差：距离多少像素算放对位置，调小增加难度
  tolerance: 25,
  
  // 环境动态元素
  env: {
    // 闪烁灯光
    lights: [
      { x: 200, y: 50, frame: 0, speed: 0.2 },
      { x: 500, y: 70, frame: 3, speed: 0.15 }
    ],
    // 飘飞的小垃圾
    debris: [
      { x: 100, y: 200, speedX: 0.5, speedY: 0.2, size: 5 },
      { x: 600, y: 150, speedX: -0.3, speedY: 0.3, size: 6 },
      { x: 300, y: 100, speedX: 0.2, speedY: 0.4, size: 4 }
    ],
    // 地面蒸汽
    steam: [
      { x: 150, y: 550, frame: 0, speed: 0.08, size: 20 },
      { x: 450, y: 560, frame: 2, speed: 0.1, size: 25 }
    ]
  },
  
  // 获取零件中文名称
  getPartName(name) {
    const map = {
      head: '头部',
      body: '身体',
      leftArm: '左臂',
      rightArm: '右臂',
      leftLeg: '左腿',
      rightLeg: '右腿'
    };
    return map[name] || '零件';
  },
  
  // 更新环境动画
  updateEnv() {
    // 更新灯光闪烁
    this.env.lights.forEach(light => {
      light.frame += light.speed;
    });
    
    // 更新垃圾飘飞
    this.env.debris.forEach(debris => {
      debris.x += debris.speedX;
      debris.y += debris.speedY;
      // 超出边界后重置位置
      if (debris.x < 0 || debris.x > 750) debris.x = Math.random() * 750;
      if (debris.y < 0 || debris.y > 550) debris.y = Math.random() * 400;
    });
    
    // 更新蒸汽动画
    this.env.steam.forEach(steam => {
      steam.frame += steam.speed;
    });
  },

  // 初始化场景
  init() {
    console.log('开场垃圾场场景初始化');
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 更新环境动画
    this.updateEnv();
    
    // 背景天空
    ctx.fillStyle = '#7a8899';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制闪烁灯光
    this.env.lights.forEach(light => {
      const opacity = 0.5 + Math.sin(light.frame) * 0.5;
      ctx.fillStyle = `rgba(255, 230, 150, ${opacity})`;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      // 灯光光晕
      ctx.fillStyle = `rgba(255, 230, 150, ${opacity * 0.3})`;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 16, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // 绘制飘飞的垃圾
    this.env.debris.forEach(debris => {
      ctx.fillStyle = '#4a3a2a';
      ctx.beginPath();
      ctx.rect(debris.x, debris.y, debris.size, debris.size);
      ctx.fill();
    });
    
    // 垃圾场地面
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);
    
    // 绘制地面蒸汽
    this.env.steam.forEach(steam => {
      const opacity = 0.3 + Math.sin(steam.frame) * 0.2;
      const scale = 0.8 + Math.sin(steam.frame) * 0.3;
      ctx.fillStyle = `rgba(180, 180, 180, ${opacity})`;
      ctx.beginPath();
      ctx.arc(steam.x, steam.y - Math.sin(steam.frame) * 15, steam.size * scale, 0, 2 * Math.PI);
      ctx.fill();
    });
    
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
    
    // 透明度：拖拽的时候半透明，组装成功后不透明
    let opacity = 1;
    let scale = 1;
    
    if (part.dragging) {
      opacity = 0.8;
      scale = 1.1; // 拖拽的时候放大一点
    }
    
    // 组装成功的弹跳动画
    if (part.anim > 0) {
      part.anim--;
      scale += Math.sin(part.anim * 0.5) * 0.1;
    }
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#8b6e4b';
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 3;
    
    if (name === 'head') {
      const centerX = part.x + part.size/2;
      const centerY = part.y + part.size/2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.arc(0, 0, part.size/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      const size = part.size;
      const centerX = part.x + size.width/2;
      const centerY = part.y + size.height/2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.fillRect(-size.width/2, -size.height/2, size.width, size.height);
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.globalAlpha = 1; // 恢复透明度
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
    if (part.assembled) return;
    
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
      part.anim = 10; // 触发10帧弹跳动画
      // 震动反馈（微信小游戏API）
      wx.vibrateShort({ type: 'light' });
      // 成功反馈
      Feedback.success(`${this.getPartName(name)} 组装正确！`);
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
