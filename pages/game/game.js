// pages/game/game.js
var data = require("../../utils/data")

// 地图图层数据
var map = []
for(let i = 0; i < 8;i++){
  map[i] = [0,0,0,0,0,0,0,0]
}

// 箱子图层数据
var box = []
for(let i = 0; i < 8;i++){
  box[i] = [0,0,0,0,0,0,0,0]
}

// 方块的边长
var w = 40

// 游戏主角小鸟所在的行和列
var row = 0
var col = 0



Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
 * 初始化地图数据
 */
  initMap: function (level) {
    let mapData = data.maps[level]
    for (let i=0;i < 8;i++){
      for (let j=0;j <8;j++){
        box[i][j] = 0
        switch (map[i][j]){
          case 0: // 墙的外边，不可达区域
            map[i][j] = 0
            break;
          case 1: // 墙
            map[i][j] = 1
            break;
          case 2: // 路
            map[i][j] = 2
            break;
          case 3: // 终点
            map[i][j] = 3
            break;
          case 4: // 箱子
            map[i][j] = 2
            box[i][j] = 4
          case 5: // 主角
            map[i][j] = 2
            row = i
            col = j
        }
      }
    }
  },
  // 绘制画布
  drawCanvas: function () {
    let ctx = this.ctx
    // 清空画布
    ctx.clearRect(0, 0, 320, 320)
    // 绘制8*8地图
    for (let i=0; i <8;i++){
      for(let j=0;j < 8;j++){
        let img = 'ice'
        if (map[i][j] == 1){
          img = 'stone'
        }
        else if (map[i][j] == 3){
          img = 'pig'
        }

        // 绘制地图
        ctx.drawImage('/images/icons/' + img + '.png', j*w,i*w,w,w)
      }
    }

    // 渲染画布
    ctx.draw()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(map)
    // 获取关卡
    let level = options.level
    // 更新关卡标题
    this.setData({
      level:parseInt(level) + 1
    })

    // 创建画布上下文
    // this.ctx = wx.createCanvasContext('canvasId', component)
    wx.createSelectorQuery()
    .select('#myCanvas') // 在 WXML 中填入的 id
    .node(({ node: canvas }) => {
      const context = canvas.getContext('2d')
    })
    .exec()
    wx.createSelectorQuery()
    .select('#myCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // Canvas 画布的实际绘制宽高
        const renderWidth = res[0].width
        const renderHeight = res[0].height
        // Canvas 绘制上下文
        const ctx = canvas.getContext('2d')

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = renderWidth * dpr
        canvas.height = renderHeight * dpr
        ctx.scale(dpr, dpr)
    })

    // 初始化地图数据
    this.initMap(level)

    // 绘制地图
    // this.drawCanvas()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})