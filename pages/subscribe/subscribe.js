// pages/subscribe/subscribe.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasdata:true,
    sub:[""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.https('/subscribe',{
      open_id: app.globalData.openid
    },res => {
      if(res.status == 2000){
        let sub = res.data;
        for (let i = 0; i < sub.length; i++) {``
          if(sub[i].pic == 'local'){
            sub[i].pic = `../../img/${sub[i].pro_id}.jpg`
          }else{
            sub[i].pic = app.urlimg(sub[i].pic);
          }
        }
        this.setData({
          sub : sub
        })
      }
    })
  },
  totype:function(e){
    wx.navigateTo({
      url: '../type/type?id=' + e.target.dataset.id + '&name=' + e.target.dataset.name,
    })
  }
})