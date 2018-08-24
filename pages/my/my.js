// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oauth: app.globalData.oauth,
    orginsrc:"../../img/logo.jpg",
    userinfo:{},
    orginname:"",
    limit: true,
    tolimit:false
  },
  tocontact:function(){
    wx.navigateTo({
      url: '../contact/contact',
    })
  },
  tobuy: function () {
    wx.navigateTo({
      url: '../buy/buy',
    })
  },
  tosubscribe: function () {
    wx.navigateTo({
      url: '../subscribe/subscribe',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.userinfo = app.globalData.userinfo;
    // if (app.globalData.oauth == 0){
    //   this.setData({
    //     limit: true,
    //     tolimit:false
    //   })
    // } else {
    //   this.setData({
    //     oauth: app.globalData.oauth,
    //     orginsrc: this.data.userinfo.headimg,
    //     orginname: this.data.userinfo.nick,
    //     limit: false,
    //     tolimit: true
    //   })
    // }
    if (app.globalData.oauth){
//    console.log(1)
      this.setData({
        oauth: true,
        userinfo: app.globalData.userinfo
      })
    }else{
      this.setData({
        oauth: false,
      })
    }
  },
  getinfo: function (res) {
    let detail = res.detail;
    if (detail.errMsg == "getUserInfo:fail auth deny") return;
    this.data.userinfo = app.globalData.userinfo;
    app.setUserInfo(detail, res => {
//    console.log(res);
      this.setData({
        oauth: app.globalData.oauth,
        userinfo: res
      })
    })
  },
})