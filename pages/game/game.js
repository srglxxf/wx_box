// pages/game/game.js\
import { API_BASE_URL } from '../../utils/constants.js';

var data = require('../../utils/data.js')

//方块的边长
const WIDTH = 30


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地图图层数据
    map: [],
    rowCount: 0,
    colCount: 0,
    // 箱子图层数据
    box: [],
    //游戏主角小鸟所在的行和列
    row: 0,
    col: 0,
    // 画布大小
    canvasWidth: 240, // 默认宽度
    canvasHeight: 240, // 默认高度
    // 玩家朝向
    playerDirection: 'left'
  },



  /**
   * 自定义函数--初始化地图数据
   */
  initMap: function(level) {
    //读取原始地图数据
    let mapData = data.maps[level-1]
    this.rowCount = mapData.length; // 获取行数
    this.colCount = mapData[0].length; // 获取列数
    
    // 初始化地图长宽
    this.box = Array.from({ length: this.rowCount }, () => Array(this.colCount).fill(0));
    this.map = Array.from({ length: this.rowCount }, () => Array(this.colCount).fill(0));

    //使用双重for循环记录地图数据
    for (var i = 0; i < this.rowCount; i++) {
      for (var j = 0; j < this.colCount; j++) {
        this.box[i][j] = 0;
        this.map[i][j] = mapData[i][j];
        //当前位置是箱子
        if (mapData[i][j] == 4) {
          this.box[i][j] = 4;
          this.map[i][j] = 2;
        }
        //当前位置是游戏主角小鸟
        else if (mapData[i][j] == 5) {
          this.map[i][j] = 2;
          //更新对应行列
          this.row = i;
          this.col = j;
        }
      }
    }
  },


  /**
   * 自定义函数--绘制画布
   */
  drawCanvas: function() {
    let pen=this.pen

    this.setData({
      canvasHeight : WIDTH * this.rowCount,
      canvasWidth : WIDTH * this.colCount
    });

    //先清空画布
    pen.clearRect(0, 0, this.w * this.colCount, this.w * this.rowCount);
    

    //使用双重for循环绘制地图
    for (var i = 0; i < this.rowCount; i++) {
      for (var j = 0; j < this.colCount; j++) {
        //默认都是道路
        let img = 'ice'; 
        //如果当前位置是墙
        if (this.map[i][j] == 1) {
          img = 'stone';
        }
        //如果当前位置是终点
        else if (this.map[i][j] == 3) {
          img = 'pig';
        }

        //从图片文件夹选择图片绘制地图
        pen.drawImage('/images/icons/' + img + '.png', j * WIDTH, i * WIDTH, WIDTH, WIDTH)

        //叠加绘制箱子
        if (this.box[i][j] == 4) {
          pen.drawImage('/images/icons/box.png', j * WIDTH, i * WIDTH, WIDTH, WIDTH)
        }

      }
    }
    //叠加绘制小鸟
    if (this.playerDirection == 'left'){
      pen.drawImage('/images/icons/bird.png', this.col * WIDTH, this.row * WIDTH, WIDTH, WIDTH)
    } else{
      pen.drawImage('/images/icons/bird_right.png', this.col * WIDTH, this.row * WIDTH, WIDTH, WIDTH)
    }


    //渲染画布，重要！！,相当于一个结尾
    pen.draw()

  },


  /**
   * 自定义函数--方向键：上
   */
  up: function() {
    //如果小鸟不在最顶端才考虑上移
    if (this.row != 0) {
      //如果上方不是墙也不是箱子
      if (this.map[this.row - 1][this.col] != 1 && this.box[this.row - 1][this.col] != 4) {
        this.row--;
      }
      //如果上方是箱子
      else if (this.box[this.row - 1][this.col] == 4) {
        //如果箱子不在最顶端才可以考虑推动
        if (this.row - 1 != 0) {
          //如果箱子上边不是墙或另一个箱子
          if (this.map[this.row - 2][this.col] != 1 && this.box[this.row - 2][this.col] != 4) {
            //更新箱子数据
            this.box[this.row - 2][this.col] = 4;
            this.box[this.row - 1][this.col] = 0;

            this.row--;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },

  /**
   * 自定义函数--方向键：左
   */
  left: function() {
    //如果小鸟不在最左端才考虑左移
    if (this.col != 0) {
      //如果左方不是墙也不是箱子
      if (this.map[this.row][this.col - 1] != 1 && this.box[this.row][this.col - 1] != 4) {
        this.col--;
      }
      //如果左方是箱子
      else if (this.box[this.row][this.col - 1] == 4) {
        //如果箱子不在最左端才可以考虑推动
        if (this.col - 1 != 0) {
          //如果箱子左边不是墙或另一个箱子
          if (this.map[this.row][this.col - 2] != 1 && this.box[this.row][this.col - 2] != 4) {
            //更新箱子数据
            this.box[this.row][this.col - 2] = 4;
            this.box[this.row][this.col - 1] = 0;

            this.col--;
          }
        }
      }
      this.playerDirection = 'left'
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },
  /**
   * 自定义函数--方向键：下
   */
  down: function() {
    //如果小鸟不在最底端才考虑下移
    if (this.row != this.rowCount-1) {
      //如果上方不是墙也不是箱子
      if (this.map[this.row + 1][this.col] != 1 && this.box[this.row + 1][this.col] != 4) {
        this.row++;
      }
      //如果下方是箱子
      else if (this.box[this.row + 1][this.col] == 4) {
        //如果箱子不在最底端才可以考虑推动
        if (this.row - 1 != this.rowCount - 1) {
          //如果箱子下边不是墙或另一个箱子
          if (this.map[this.row + 2][this.col] != 1 && this.box[this.row + 2][this.col] != 4) {
            //更新箱子数据
            this.box[this.row + 2][this.col] = 4;
            this.box[this.row + 1][this.col] = 0;

            this.row++;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },


  /**
   * 自定义函数--方向键：右
   */
  right: function() {
    //如果小鸟不在最右端才考虑右移
    if (this.col != this.colCount -1) {
      //如果右方不是墙也不是箱子
      if (this.map[this.row][this.col + 1] != 1 && this.box[this.row][this.col + 1] != 4) {
        this.col++;
      }
      //如果右方是箱子
      else if (this.box[this.row][this.col + 1] == 4) {
        //如果箱子不在最右端才可以考虑推动
        if (this.col + 1 != this.colCount - 1) {
          //如果箱子右边不是墙或另一个箱子
          if (this.map[this.row][this.col + 2] != 1 && this.box[this.row][this.col + 2] != 4) {
            //更新箱子数据
            this.box[this.row][this.col + 2] = 4;
            this.box[this.row][this.col + 1] = 0;

            this.col++;
          }
        }
      }
      this.playerDirection = 'right'
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },

  /**
   * 自定义函数--判断游戏是否结束
   */
  isWin: function() {
    //用双重for循环遍历整个数组
    for (var i = 0; i < this.rowCount-1; i++) {
      for (var j = 0; j < this.colCount-1; j++) {
        //如果有箱子没有放回终点
        if (this.box[i][j] == 4 && this.map[i][j] != 3) {
          //返回假，游戏尚未成功
          return false;
        }
      }
    } 
    //返回真，游戏成功
    return true;

  },

  /**
   * 自定义函数--游戏成功处理
   */
  checkWin: function() {
    if (!this.isWin()) {
      return ;
    }
    let level = this.data.level;
    // 存储新的 level 到本地
    wx.setStorageSync('level', level);
    // 上报新的 level 到服务器
    wx.request({
      url: API_BASE_URL + '/user/level', 
      method: 'POST',
      data: {
        level: level,
        open_id: wx.getStorageSync('open_id'),
        session_key: wx.getStorageSync('session_key')
      },
      success: response => {
        console.log('关卡更新成功:', response);
      },
      fail: err => {
        console.error('关卡更新失败:', err);
      }
    });
    wx.showModal({
      title: '恭喜',
      content: '游戏成功',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          // 用户点击确定，进行跳转
          wx.navigateTo({
            url: '../game/game?level=' + (level + 1),
          });
        }
      }
    })
  },

  /**
     * 自定义函数--重新开始游戏
     */
  restartGame:function(){
    //初始化地图数据
    this.initMap(this.data.level)
    //绘制画布
    this.drawCanvas()
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.level)

    //获取关卡
    let level = options.level

    //更新关卡标题
    this.setData({
      level: parseInt(level)
    })

    //创建画布上下文
    this.pen = wx.createCanvasContext('myCanvas');

    //初始化地图
    this.initMap(level)

    //绘制地图
    this.drawCanvas()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})