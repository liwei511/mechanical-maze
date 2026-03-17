// 机械迷城 - 主角 Josef 控制脚本

const Player = {
  // 位置
  x: 0,
  y: 0,
  // 当前状态
  state: 'idle', // idle | walking | climbing | interacting
  // 表情
  expression: 'normal',

  // 初始化主角
  init() {
    this.x = 0;
    this.y = 0;
    this.state = 'idle';
    this.expression = 'normal';
    console.log('Josef 初始化完成');
  },

  // 移动到位置
  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.state = 'walking';
    console.log('Josef 移动到:', x, y);
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
