// pages/detail/detail.js
const app = getApp();
Page({
  data: {
    dialog:false,
    alertdialog:false, //分享
    cardstate:false,
    alertbtn:"找朋友",
    free : true,
    discuss:false,
    distext:true,
    clearsharelock:0,
    oauth: 0,
    stars: [
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
    ],
    video:{},
    starnum:3,
    disdata:[],
    concern:false,
    watchresult:0,
    gameid:"",
    imgheight:"",
    width:"",
    height:"",
    videoformid:"",
    gamename:"",

    detailsid:""
  },
  onLoad: function (options) {
    var that = this;
    this.data.videoformid = options.formid
    this.data.gameid = options.id;
    this.data.gamename = options.name;
    // if (app.globalData.oauth){
    //   this.setData({
    //     oauth: true
    //   })
    // }else{
    //   this.setData({
    //     oauth: false
    //   })
    // }
    wx.setNavigationBarTitle({
      title: options.name,
    })
    app.https('/gamevideoinfo/clickgamevideo',{
      game_id : options.id,
      openid: app.globalData.openid,
      // formid: this.data.videoformid
    },res => {
      if(res.status == 2000){
        res.data.pic = app.urlimg(res.data.pic);
        this.setData({
          video: res.data,
          clearsharelock: res.data.clearsharelock,
          starnum: Math.round(res.data.score / 2),
          watchresult: res.data.gameresult_state
        })
        this.selestar();
      }
    })
  },
  selestar: function () {
    let stars = [
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
    ]
    for (let i = 0; i <= this.data.starnum-1; i++) {
      stars[i] = "lstaryellow"
    }
    this.setData({
      stars: stars
    })
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  closeshare:function(){
    this.setData({
      dialog:false
    })
  },
  getinfo: function (res) {
    let detail = res.detail;
    if (detail.errMsg == "getUserInfo:fail auth deny") return;
    app.setUserInfo(detail, res => {
        this.play();
      // this.setData({
      //   oauth: app.globalData.oauth
      // })
    })
   
  },
  play:function(){
    wx.navigateTo({
      url: '../video/video?id=' + this.data.video.game_id + '&name=' + this.data.video.name,
    })
  },
  closealert:function(){
    this.setData({
      alertdialog : false
    })
  },
  unlock:function(){
    this.setData({
      cardstate: false
    })
    wx.navigateTo({
      url: '../video/video?id=' + this.data.video.game_id + '&name=' + this.data.video.name,
    })
  },
  showdiscuss: function () {
    this.setData({
      discuss: true
    })
  },
  closediscuss:function(){
    this.setData({
      discuss: false
    })
  },
  write:function(){
    this.setData({
      distext: true
    })
  },


  toindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  showconcern: function () {
    this.setData({
      concern: true
    })
  },
  closeconcern: function () {
    this.setData({
      concern: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  watSubmit: function (e) {
    wx.navigateTo({
      url: '../canpersonresult/canpersonresult?id=' + this.data.gameid + "&formid=" + e.detail.formId +  "&name=" + this.data.gamename
    })
  },
  watReset: function () {
//  console.log('form发生了reset事件')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.setting.wx_share ,
      path: '/pages/index/index?user=' + app.globalData.openid,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
              wx.showToast({
                title: '分享成功',
                icon: 'none',
                duration: 2000
              })
              // this.setData({
              //   alertdialog: false,
              //   cardstate: true
              // })
            }
          })
        }
      }
    }
  },
  totextresult:function(){
//  console.log("666");
//  console.log(this.data.gamename);
    wx.navigateTo({
      url: '../canpersonresult/canpersonresult?id=' + this.data.gameid + "&name=" + this.data.gamename
    })
  },
  writedis: function () {
    wx.navigateTo({
      url: '../writedis/writedis?id=' + this.data.video.game_id,
    })
  },
  subSubmit: function (e) {
//  console.log(e.detail.formId);
//  console.log('form发生了submit事件，携带数据为：', e.detail.value)
    app.https('/subscribe/subscribeProject', {
      open_id: app.globalData.openid,
      state: this.data.sub,
      formid: e.detail.formId
    }, res => {
      if (res.status == 2000) {
        if (res.data.state == 0) {
          this.setData({
            sub: res.data.state,
            subimg: "../../img/index_sub.png"
          })
        } else if (res.data.state == 1) {
          this.setData({
            sub: res.data.state,
            subimg: "../../img/index_finishsub.png"
          })
        }
      }
    })
  },
  subReset: function () {
    console.log('form发生了reset事件')
  },
  playSubmit: function (e) {
//  console.log(e.detail.formId);
//  console.log('form发生了submit事件，携带数据为：', e.detail.value)
    app.https('/subscribe/subscribeProject', {
      open_id: app.globalData.openid,
      state: this.data.sub,
      formid: e.detail.formId
    }, res => {
      if (res.status == 2000) {
        if (res.data.state == 0) {
          this.setData({
            sub: res.data.state,
            subimg: "../../img/index_sub.png"
          })
        } else if (res.data.state == 1) {
          this.setData({
            sub: res.data.state,
            subimg: "../../img/index_finishsub.png"
          })
        }


      }
    })
  },
  playReset: function () {
//  console.log('form发生了reset事件')
  },
})