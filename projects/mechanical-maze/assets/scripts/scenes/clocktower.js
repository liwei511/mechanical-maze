// 关卡4：时钟塔

const ClockTowerScene = {
  // 时钟指针角度（初始都指向0
  angles: {
    hour: 0,
    minute: 0,
    second: 0
  },

  // 正确密码：原作是 4:45:00 也就是 120度/270度/0度
  correctAngles: {
    hour: 120,
    minute: 270,
    second: 0
  },

  // 当前选中指针
  selected: null,

  // 门状态
  doorOpen: false,

  // 初始化
  init() {
    console.log('时钟塔初始化');
    this.angles.hour = 0;
    this.angles.minute = 0;
    this.angles.second = 0;
    this.doorOpen = false;
    this.selected = null;
    Player.x = 200;
    Player.y = 350;
  },

  // 绘制场景
  draw(ctx, canvasWidth, canvasHeight) {
    // 背景塔身
    ctx.fillStyle = '#4a3f33';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 时钟外圈
    const centerX = canvasWidth / 2;
    const centerY = 200;
    const radius = 150;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#6a5a44';
    ctx.fill();
    ctx.strokeStyle = '#b89a6b';
    ctx.lineWidth = 6;
    ctx.stroke();

    // 刻度
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const r1 = radius - 15;
      const r2 = radius - 5;
      const x1 = centerX + Math.cos(angle) * r1;
      const y1 = centerY + Math.sin(angle) * r1;
      const x2 = centerX + Math.cos(angle) * r2;
      const y2 = centerY + Math.sin(angle) * r2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#2d261e';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 绘制指针
    this.drawPointer(ctx, centerX, centerY, radius * 0.6, this.angles.hour, 8, '#2d261e');
    this.drawPointer(ctx, centerX, centerY, radius * 0.8, this.angles.minute, 5, '#3a3228');
    this.drawPointer(ctx, centerX, centerY, radius * 0.9, this.angles.second, 2, '#8b0000');

    // 中心点
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#2d261e';
    ctx.fill();

    // 底部门
    if (this.doorOpen) {
      // 门开了
      ctx.fillStyle = '#2d261e';
      ctx.fillRect(centerX - 60, centerY + radius + 10, 120, 150);
    } else {
      // 门关着
      ctx.fillStyle = '#3a3228';
      ctx.fillRect(centerX - 60, centerY + radius + 10, 120, 150);
      ctx.strokeStyle = '#b89a6b';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 60, centerY + radius + 10, 120, 150);
    }
  },

  // 画指针
  drawPointer(ctx, cx, cy, length, angleDeg, width, color) {
    const angleRad = (angleDeg - 90) * Math.PI / 180; // 从12点方向开始算
    const endX = cx + Math.cos(angleRad) * length;
    const endY = cy + Math.sin(angleRad) * length;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  },

  // 点击选指针
  checkInteraction(x, y) {
    const centerX = wx.getSystemInfoSync().windowWidth / 2;
    const centerY = 200;
    const radius = 150;

    // 判断点的哪个指针
    const hourDist = this.distanceToPointer(x, y, centerX, centerY, radius * 0.6, this.angles.hour);
    const minuteDist = this.distanceToPointer(x, y, centerX, centerY, radius * 0.8, this.angles.minute);
    const secondDist = this.distanceToPointer(x, y, centerX, centerY, radius * 0.9, this.angles.second);

    // 选最近的指针
    const minDist = Math.min(hourDist, minuteDist, secondDist);
    if (minDist < 20) {
      if (minDist === hourDist) {
        this.selected = 'hour';
      } else if (minDist === minuteDist) {
        this.selected = 'minute';
      } else {
        this.selected = 'second';
      }
      console.log('选中指针', this.selected);
      return true;
    }

    return false;
  },

  // 计算点到指针的距离
  distanceToPointer(x, y, cx, cy, length, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    const endX = cx + Math.cos(angleRad) * length;
    const endY = cy + Math.sin(angleRad) * length;
    // 点到直线距离
    const dist = Math.abs((endY - cy)*x - (endX - cx)*y + endX*cy - endY*cx) /
                Math.sqrt((endY - cy)**2 + (endX - cx)**2);
    return dist;
  },

  // 拖拽旋转选中指针
  onDrag(dx, dy) {
    if (!this.selected) return;
    // 拖拽左右旋转指针
    const delta = dx / 3; // 每像素拖动旋转几度
    this.angles[this.selected] = (this.angles[this.selected] + delta + 360) % 360;
    // 检查是不是对了
    this.checkCode();
  },

  // 检查密码是否正确
  checkCode() {
    const tolerance = 5; // 5度容差
    const hourDiff = Math.abs(this.angles.hour - this.correctAngles.hour);
    const minuteDiff = Math.abs(this.angles.minute - this.correctAngles.minute);
    const secondDiff = Math.abs(this.angles.second - this.correctAngles.second);

    if (hourDiff < tolerance && minuteDiff < tolerance && secondDiff < tolerance && !this.doorOpen) {
      this.doorOpen = true;
      console.log('密码正确！门开了');
      setTimeout(() => {
        getCurrentPage().onSceneChange('boiler');
      }, 1500);
    }
  },

  // 使用物品
  onUse(itemName) {
    return false;
  },

  checkAssemblyComplete() {
    return false;
  }
};

module.exports = ClockTowerScene;
