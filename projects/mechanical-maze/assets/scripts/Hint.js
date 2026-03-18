// 机械迷城 - 提示系统脚本

const Feedback = require('./Feedback');

const Hint = {
  // 提示列表，按场景存储，每关多个等级的提示：线索→详细提示→答案
  hints: {
    opening: [
      '💡 线索：地上散落的零件是Josef的身体部位，找到对应位置放上去',
      '📝 详细提示：黄色虚线框是目标位置，每个零件对应一个框',
      '✅ 答案：头在最上面，然后是身体，左右手臂在身体两边，腿在最下面'
    ],
    climb: [
      '💡 线索：入口的台阶可以一步步往上跳',
      '📝 详细提示：点击台阶的位置，Josef会走过去爬上去',
      '✅ 答案：从最下面的台阶开始，依次点击往上走就能到城门口'
    ],
    bandits: [
      '💡 线索：三个土匪挡住了路，得一个个把他们引开',
      '📝 详细提示：最胖的那个土匪喜欢吃罐头，你可以找东西吸引他',
      '✅ 答案：捡地上的罐头扔到水里，胖土匪会去捞，剩下两个依次处理'
    ],
    clocktower: [
      '💡 线索：时钟的三个指针需要转到正确的位置才能开门',
      '📝 详细提示：原作的密码是4点45分，对应时针、分针、秒针的角度',
      '✅ 答案：时针转到120度（4点），分针转到270度（45分），秒针对准12点'
    ],
    boiler: [
      '💡 线索：锅炉需要生火才能继续前进',
      '📝 详细提示：先找到煤块放进去，再打开阀门，最后点火',
      '✅ 答案：煤在角落的箱子里，阀门在锅炉左边，用打火机点火就好'
    ],
    lab: [
      '💡 线索：科学家被关在里面，需要拿到钥匙开门',
      '📝 详细提示：钥匙在机器人守卫的身上，想办法引开他',
      '✅ 答案：用旁边的扳手砸开关，守卫会过去看，趁机拿钥匙'
    ],
    final: [
      '💡 线索：最终BOSS在塔顶，需要用拿到的枪打败他',
      '📝 详细提示：BOSS会扔东西攻击你，躲在障碍物后面',
      '✅ 答案：等BOSS攻击间隙开枪打他，打三次就能打败他'
    ]
  },

  // 每个场景的提示查看次数记录
  hintCounts: {},

  // 获取当前场景提示
  getHint(scene) {
    // 初始化计数
    if (!this.hintCounts[scene]) {
      this.hintCounts[scene] = 0;
    }

    const hints = this.hints[scene] || [];
    const count = this.hintCounts[scene];

    if (count >= hints.length) {
      Feedback.info('没有更多提示啦，再仔细想想吧~');
      return hints[hints.length - 1];
    }

    this.hintCounts[scene]++;
    return hints[count];
  },

  // 重置某个场景的提示计数（重新玩的时候用）
  resetHintCount(scene) {
    if (scene) {
      delete this.hintCounts[scene];
    } else {
      this.hintCounts = {};
    }
  },

  // 显示提示弹窗
  showHint() {
    const current = Game.currentScene;
    const hint = this.getHint(current);
    console.log('提示:', hint);
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
    return hint;
  }
};

module.exports = Hint;
