// 机械迷城 - 物品栏控制脚本

const Inventory = {
  // UI 显示状态
  visible: false,

  // 显示/隐藏物品栏
  toggle() {
    this.visible = !this.visible;
    console.log('物品栏', this.visible ? '显示' : '隐藏');
  },

  // 获取当前物品列表
  getItems() {
    return Game.inventory;
  },

  // 检查是否有某个物品
  hasItem(itemName) {
    return Game.inventory.includes(itemName);
  },

  // 使用物品
  useItem(itemName, target) {
    if (this.hasItem(itemName)) {
      console.log('使用物品', itemName, '在', target);
      // 这里处理物品使用逻辑，由具体场景回调
      if (target && typeof target.onUse === 'function') {
        target.onUse(itemName);
      }
      Game.removeItem(itemName);
      return true;
    }
    return false;
  },

  // 清空物品栏
  clear() {
    Game.inventory = [];
    console.log('物品栏清空');
  }
};

module.exports = Inventory;
