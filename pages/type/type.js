// pages/type/type.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab:true,
    videos:[],
    videodata:{}
  },
  switchtab: function(){
    this.setData({
      switchtab:!this.data.switchtab
    })
  },
  todetail:function(){
    let detail = this.data.videodata;
    wx.navigateTo({
      url: '../detail/detail?id=' + detail.id + '&name=' + detail.name + '&state=' + detail.state,
    })
  },
  sendform: function (e) {
    this.data.videodata = e.target.dataset
    app.https('/qrcode/userformid', {
      openid: app.globalData.openid,
      formid: e.detail.formId
    }, res => {
      if (res.status == 2000) {
        this.todetail();
      }
    })
  },
  tomore:function(){
    wx.navigateTo({
      url: '../typemore/typemore',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    app.https('/project/projectgame', {
      openid: app.globalData.openid,
      pro_id: options.id
    }, res => {
      if(res.status == 2000){
        let videos = res.data.games;
        for (let i = 0; i < videos.length; i++) {
          videos[i].pic = app.urlimg(videos[i].pic);
        }
        this.setData({
          videos: videos,
          switchtab: res.data.subscribe_state
        })
      } 
    })
    // console.log(options.id)
  },
})