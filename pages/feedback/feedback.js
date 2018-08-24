// pages/feedback/feedback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment : "",
    contact : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  subfeed: function(){
    if (this.data.comment){
      app.https('/contactme/usercomment', {
        openid: app.globalData.openid,
        comment: this.data.comment,
        qq: this.data.contact
      }, res => {
        if (res.status == 2000) {
          this.setData({
            contact: "",
            comment: ""
          })
          wx.showToast({
            title: res.data,
            icon: "none",
            duration: 2000,
          });
        }
      })
    }else{
      wx.showToast({
        title: "内容不能为空",
        icon: "none",
        duration: 2000,
      });
    }
  },
  contactinput:function(e){
    this.data.contact = e.detail.value
    // this.setData({
    //   contact : e.detail.value
    // })
  },
  commentinput: function (e) {
    this.data.comment = e.detail.value
    // this.setData({
    //   comment: e.detail.value
    // })
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
  
  }
})