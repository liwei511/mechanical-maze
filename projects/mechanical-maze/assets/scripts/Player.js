// 机械迷城 - 主角 Josef 控制脚本

const Player = {
  // 当前位置
  x: 0,
  y: 0,
  // 目标位置
  targetX: 0,
  targetY: 0,
  // 移动速度（每帧像素）
  speed: 3,
  // 当前状态
  state: 'idle', // idle | walking | climbing | interacting
  // 表情
  expression: 'normal',
  // 动画帧计数器
  animFrame: 0,

  // 初始化主角
  init() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.state = 'idle';
    this.expression = 'normal';
    this.animFrame = 0;
    console.log('Josef 初始化完成');
  },

  // 移动到位置
  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.state = 'walking';
    console.log('Josef 移动到:', x, y);
  },

  // 每帧更新位置
  update() {
    this.animFrame++;
    if (this.state !== 'walking') return;

    // 计算和目标位置的距离
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 已经到达目标位置
    if (distance < this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.state = 'idle';
      return;
    }

    // 缓动移动
    const moveX = (dx / distance) * this.speed;
    const moveY = (dy / distance) * this.speed;
    this.x += moveX;
    this.y += moveY;
  },

  // 改变表情
  setExpression(expr) {
    this.expression = expr;
    console.log('表情变化:', expr);
  },

  // 交互
  interact(target) {
    this.state = 'interacting';
    console.log('交互:', target);
  },

  // 组装完成（开场解谜结束）
  assembleComplete() {
    Game.progress.josefAssembled = true;
    Game.saveProgress();
    console.log('Josef 组装完成，可以开始冒险了');
  }
};

module.exports = Player;
