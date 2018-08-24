// pages/gameover/gameover.js

const app = getApp();
Page({
  
  
  /**
   * 
   * 页面的初始数据
   */
  data: {
    gameurl:"",
    gameid:"",
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.setting.wx_share);
    console.log(options);
  this.setData({
    gameurl: options.gameurl,
    gameid: options.gameid,
    name: options.name
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  swicondition:function(){
    wx.navigateTo({
      url: '../video/video?id=' + this.data.gameid + '&name=' + this.data.name,
    })
  },
  // 分享配图
  onShareAppMessage: function () {
    
    return {
      title: app.globalData.setting.wx_share,
      path: '/pages/gameover/gameover?user=' + app.globalData.openid + '&id=' + this.data.gameid + '&name=' + this.data.name,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
              wx.navigateTo({
                url: '/pages/video/video?user=' + app.globalData.openid + '&id=' + this.data.gameid + '&name=' + this.data.name
              })
            }
          })
        }
      }
    }
  }
  
})