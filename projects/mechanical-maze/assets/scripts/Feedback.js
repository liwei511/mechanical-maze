// 机械迷城 - 解谜反馈系统

const Feedback = {
  // 当前显示的反馈
  active: null,
  // 反馈类型
  type: null, // 'success' | 'error' | 'info'
  // 反馈文字
  text: '',
  // 显示时长（毫秒）
  duration: 2000,
  // 动画帧
  animFrame: 0,
  // 状态：hidden | showing | shown | hiding
  state: 'hidden',

  // 显示成功反馈
  success(text, duration = 2000) {
    this.show('success', text, duration);
    // 震动反馈
    wx.vibrateShort({ type: 'medium' });
  },

  // 显示错误反馈
  error(text, duration = 2000) {
    this.show('error', text, duration);
  },

  // 显示普通信息
  info(text, duration = 2000) {
    this.show('info', text, duration);
  },

  // 通用显示方法
  show(type, text, duration) {
    this.type = type;
    this.text = text;
    this.duration = duration;
    this.state = 'showing';
    this.animFrame = 0;
    console.log(`[反馈] ${type}: ${text}`);
  },

  // 每帧更新
  update() {
    if (this.state === 'hidden') return;

    this.animFrame++;

    if (this.state === 'showing') {
      // 显示动画：10帧从下往上滑入
      if (this.animFrame >= 10) {
        this.state = 'shown';
        this.animFrame = 0;
      }
    } else if (this.state === 'shown') {
      // 停留状态，到时间后开始隐藏
      if (this.animFrame >= this.duration / 16) { // 16ms每帧
        this.state = 'hiding';
        this.animFrame = 0;
      }
    } else if (this.state === 'hiding') {
      // 隐藏动画：10帧淡出
      if (this.animFrame >= 10) {
        this.state = 'hidden';
        this.animFrame = 0;
      }
    }
  },

  // 绘制反馈
  draw(ctx, canvasWidth, canvasHeight) {
    if (this.state === 'hidden') return;

    // 计算位置和透明度
    let y = canvasHeight / 2;
    let opacity = 1;
    let scale = 1;

    if (this.state === 'showing') {
      const progress = this.animFrame / 10;
      y = canvasHeight / 2 + 50 * (1 - progress);
      opacity = progress;
      scale = 0.8 + 0.2 * progress;
    } else if (this.state === 'hiding') {
      const progress = this.animFrame / 10;
      opacity = 1 - progress;
      scale = 1 - 0.2 * progress;
    }

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(canvasWidth / 2, y);
    ctx.scale(scale, scale);

    // 背景
    let bgColor = '#6a8876'; // 默认info绿色
    if (this.type === 'success') bgColor = '#6a8876';
    if (this.type === 'error') bgColor = '#a84a4a';

    // 圆角矩形背景
    const textWidth = this.text.length * 16 + 40;
    const textHeight = 40;
    const radius = 20;

    ctx.beginPath();
    ctx.moveTo(-textWidth/2 + radius, -textHeight/2);
    ctx.lineTo(textWidth/2 - radius, -textHeight/2);
    ctx.quadraticCurveTo(textWidth/2, -textHeight/2, textWidth/2, -textHeight/2 + radius);
    ctx.lineTo(textWidth/2, textHeight/2 - radius);
    ctx.quadraticCurveTo(textWidth/2, textHeight/2, textWidth/2 - radius, textHeight/2);
    ctx.lineTo(-textWidth/2 + radius, textHeight/2);
    ctx.quadraticCurveTo(-textWidth/2, textHeight/2, -textWidth/2, textHeight/2 - radius);
    ctx.lineTo(-textWidth/2, -textHeight/2 + radius);
    ctx.quadraticCurveTo(-textWidth/2, -textHeight/2, -textWidth/2 + radius, -textHeight/2);
    ctx.closePath();

    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, 0, 0);

    ctx.restore();
  }
};

module.exports = Feedback;
