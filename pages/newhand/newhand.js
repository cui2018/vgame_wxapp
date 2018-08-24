// pages/newhand/newhand.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  toplay:function(){
    app.https('/gamevideoinfo/newhandending', {
      openid: app.globalData.openid,
    }, res => {
      if (res.status == 2000) {
        app.globalData.newhand = 1;
        wx.showTabBar({

        })
      }
    })
    wx.navigateTo({
      url: '../video/video?id=' + "ckhnZVJUbkZlRDJ4SC9TZXNpeFFvUT09" + '&name=' + "美丽的邂逅",
    })
  }
})