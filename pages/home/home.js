Page({
  // 页面的初始数据
  data: {
    // 这里可以定义一些数据
  },

  // 开始游戏按钮的点击事件处理函数
  startGame: function() {
    // 这里可以添加开始游戏的逻辑
    // 例如跳转到游戏界面
    wx.navigateTo({
    url: '../index/index'
    });
  }
});