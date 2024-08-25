import { API_BASE_URL } from '../../utils/constants.js';

Page({
  // 页面的初始数据
  data: {
    open_id: null,
    session_key: null,
    level: null,
    showLoginButton: false
  },

  onLoad: function(){
    // 获取本地存储数据
    const open_id = wx.getStorageSync('open_id');
    const session_key = wx.getStorageSync('session_key');
    const level = wx.getStorageSync('level');
  
    // 设置状态
    this.setData({
      open_id: open_id,
      session_key: session_key,
      level: level,
      showLoginButton: !open_id // 如果没有 open_id，则显示登录按钮
    });

    if (open_id) {
      console.log('用户已登录，open_id:', open_id);
      // 请求用户关卡数据
      wx.request({
        url: `${API_BASE_URL}/user/level?open_id=${open_id}`,
        method: 'GET',
        success: response => {
          console.log('获取用户关卡数据成功:', response);
          if (response.data && response.data.level) {
            const userLevel = response.data.level;
            // 将 level 存储到本地
            wx.setStorageSync('level', userLevel);
            // 更新页面状态
            this.setData({
              level: userLevel
            });
            console.log('当前关卡已更新为:', userLevel);
          }else{
            console.error('服务器返回的关卡数据格式不正确', response);
          }
        },
        fail: err => {
          console.error('请求获取关卡数据失败', err);
        }
      })

      console.log('当前关卡:', level ? level+1 : '没有存储关卡');
      // 这里可以进行后续处理，比如加载用户的游戏数据
    } else {
      console.log('用户未登录，请点击登录');
    }
  },

  
  login: function() {
    wx.login({
      success: (res) => {
        console.log('code:', res.code)
        if (res.code) {
          wx.request({
            url: API_BASE_URL + '/user/wx/login',
            method: 'POST',
            data:{
              code: res.code
            },
            success: response =>{
              console.log('登陆成功：', response);
              if (response.data && response.data.open_id && response.data.session_key){
                const {open_id, session_key} = response.data;
                // 将 open_id 和 session_key 存储到本地
                wx.setStorageSync('open_id', open_id);
                wx.setStorageSync('session_key', session_key);
                console.log('open_id 和 session_key 已保存到本地存储');
                // 登录成功后刷新页面，使用 wx.reLaunch
                wx.reLaunch({
                  url: '/pages/home/home' // 替换为你的主页路径
                });
              }else{
                console.error('服务器返回数据格式不正确');
              }
            },
            fail: err=>{
              console.error('请求失败', err);
            }
          }
          )
        }else{
          console.err('登陆失败！' + res.errMsg)
        }
      },
    })
    // 这里可以添加开始游戏的逻辑
    // 例如跳转到游戏界面
    // wx.navigateTo({
    // url: '../index/index'
    // });
  },

  // 开始游戏按钮的点击事件处理函数
  startGame: function() {
    // 这里可以添加开始游戏的逻辑
    // 例如跳转到游戏界面
    let level = this.data.level
    if (level == undefined || level == null || level == 0) {
      level = 0; // 跳转到第一关
    }
    console.log('跳转关卡', level)
    wx.navigateTo({
    url: '../game/game?level='+(level+1),
    });
  }
});