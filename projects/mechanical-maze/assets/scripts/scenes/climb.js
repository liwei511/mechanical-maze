// 关卡2：机械城入口攀爬

const ClimbScene = {
  // 台阶数据
  steps: [
    { x: 50, y: 400, width: 100, height: 30, reached: true },
    { x: 180, y: 360, width: 100, height: 30, reached: false },
    { x: 80, y: 320, width: 100, height: 30, reached: false },
    { x: 200, y: 280, width: 100, height: 30, reached: false },
    { x: 100, y: 240, width: 100, height: 30, reached: false },
    { x: 220, y: 200, width: 100, height: 30, reached: false },
    { x: 120, y: 160, width: 100, height: 30, reached: false },
    { x: 250, y: 120, width: 120, height: 40, reached: false }, // 入口平台
  ],

  // 管道装饰
  pipes: [
    { x: 0, y: 0, width: 20, height: 480 },
    { x: 350, y: 100, width: 20, height: 380 },
  ],

  // 大门位置
  gate: { x: 250, y: 40, width: 120, height: 80 },

  // 初始化场景
  init() {
    console.log('攀爬场景初始化');
    // 主角放在第一个台阶
    Player.x = this.steps[0].x + 10;
    Player.y = this.steps[0].y - 80;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景天空
    ctx.fillStyle = '#7a8899';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 机械城墙背景
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(0, 0, 380, canvasHeight);

    // 绘制管道
    this.pipes.forEach(pipe => {
      ctx.fillStyle = '#6a5a44';
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // 绘制齿轮装饰
    this.drawGear(ctx, 320, 200, 30);
    this.drawGear(ctx, 330, 350, 20);

    // 绘制台阶
    this.steps.forEach(step => {
      ctx.fillStyle = step.reached ? '#8b6e4b' : '#6a5a44';
      ctx.fillRect(step.x, step.y, step.width, step.height);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 2;
      ctx.strokeRect(step.x, step.y, step.width, step.height);
    });

    // 绘制大门
    ctx.fillStyle = '#3a3228';
    ctx.fillRect(this.gate.x, this.gate.y, this.gate.width, this.gate.height);
    ctx.strokeStyle = '#b89a6b';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.gate.x, this.gate.y, this.gate.width, this.gate.height);
    // 门把手
    ctx.beginPath();
    ctx.arc(this.gate.x + this.gate.width / 2, this.gate.y + this.gate.height / 2, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#b89a6b';
    ctx.fill();
  },

  // 画一个简单齿轮
  drawGear(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const rOuter = i % 2 === 0 ? r : r * 0.7;
      const px = x + Math.cos(angle) * rOuter;
      const py = y + Math.sin(angle) * rOuter;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fillStyle = '#5a4a3a';
    ctx.fill();
    ctx.strokeStyle = '#2d261e';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 中心孔
    ctx.beginPath();
    ctx.arc(x, y, r * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#2d261e';
    ctx.fill();
  },

  // 检查点击，点击台阶主角跳上去
  checkInteraction(x, y) {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      // 只能点已经到达台阶旁边的一个
      // 找到最后一个到达的
      let lastReachedIndex = -1;
      for (let j = 0; j < this.steps.length; j++) {
        if (this.steps[j].reached) {
          lastReachedIndex = j;
        }
      }
      // 只能点下一个
      if (i === lastReachedIndex + 1) {
        if (x >= step.x && x <= step.x + step.width &&
            y >= step.y && y <= step.y + step.height) {
          // 上去
          Player.moveTo(step.x + 10, step.y - 80);
          step.reached = true;
          // 检查是不是到顶了
          if (i === this.steps.length - 1) {
            // 到入口了
            console.log('到达机械城入口');
            setTimeout(() => {
              getCurrentPage().onSceneChange('bandits');
            }, 1000);
          }
          return true;
        }
      }
    }
    return false;
  },

  // 触摸拖拽（这里不需要）
  onDrag(dx, dy) {
    return false;
  },

  // 检查组装完成（这里不需要）
  checkAssemblyComplete() {
    return false;
  },

  // 使用物品
  onUse(itemName) {
    return false;
  }
};

module.exports = ClimbScene;
