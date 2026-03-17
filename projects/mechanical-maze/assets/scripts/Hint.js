// 机械迷城 - 提示系统脚本

const Hint = {
  // 提示列表，按场景存储
  hints: {
    opening: [
      '把零件拖到正确的位置，拼好Josef的身体',
      '先拼头，再拼身体，最后拼四肢'
    ],
    climb: [
      '点击台阶往上爬',
      '小心别掉下去'
    ],
    bandits: [
      '想办法一个个把他们弄走',
      '胖土匪喜欢钓鱼...'
    ]
  },

  // 获取当前场景提示
  getHint(scene) {
    const hints = this.hints[scene] || [];
    // 返回下一个未看的提示，简单版就随机返回一个
    if (hints.length > 0) {
      const randomIndex = Math.floor(Math.random() * hints.length);
      return hints[randomIndex];
    }
    return '再仔细找找，互动点就在附近';
  },

  // 显示提示弹窗
  showHint() {
    const current = Game.currentScene;
    const hint = this.getHint(current);
    console.log('提示:', hint);
    // 这里调用UI显示弹窗
    return hint;
  }
};

module.exports = Hint;
