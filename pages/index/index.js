//主页
const app = getApp();
Page({
  userinfo:{},
  data: {
    concern:false,
    cancelsub:false,
    subalert:false,
    mate: false,
    swiperCurrent:0,
    gameCurrent:0,
    previousmargin:"130rpx",
    nextmargin:"130rpx",
    circular: true,
    autoplay:false,
    oauth: false,
    subscribe:false,
    collect:true,
    banners:[],
    gameid:"",
    openid:"",
    newhand: 1,
    newCurrent:0,
    canceldata:{},
    bannerdata: {},
    // imgs : [
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner1.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png"
    // ],
    hasmate: 0,
    matelist:[],
    friendlist:[],
    newswiper:[
      "../../img/new1.png",
      "../../img/new2.jpg",
      "../../img/new3.png"
    ],
    sub:0,
    subimg:"../../img/index_finishsub.png",
    scene:"",
  },
  onLoad:function(options){
    this.data.scene = decodeURIComponent(options.scene);
    // this.setData({
    //   scene: scene
    // })  
    // this.localbanner();
    this.data.openid = options.user;
    app.login(res => {
      if (app.globalData.oauth) {
        this.setData({
          oauth: true
        })
      } else {
        this.setData({
          oauth: false
        })
      }
      if (this.data.openid) {
        this.shareuser(res =>{
          this.getbanner(res => {
          });
        })
      } else {
        this.getbanner( res => {
        });
      }
      if (!app.globalData.newhand) {
        wx.hideTabBar({})
      }
      this.userScene();
      this.setData({
        newhand: app.globalData.newhand
      }) 
    })
  },
  userScene:function(){
    if (this.data.scene != 'undefined') {
      app.https('/matelist/friendship', {
        sendeid: this.data.scene,
        openid: app.globalData.openid
      }, res => {

      })
    }
  },
  onShow:function(){
    this.setData({
      newhand: app.globalData.newhand
    }) 
    if (!app.globalData.newhand) {
      wx.hideTabBar({})
    }else{
      wx.showTabBar({

      })
    }

  },
  shareuser:function(fn){
    app.https('/matelist/friendship', {
      sender: this.data.openid,
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        if(fn) fn();
      }
    })
  },
  getbanner: function (fn) {
    app.https('/project',{
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        // console.log(res)
        let banners = res.data.resproject;
        for (let i = 0; i < banners.length;i++){
          banners[i].pic = app.urlimg(banners[i].pic);
        }
        // if (!res.data.newhand_state){
        //   wx.hideTabBar({})
        // }
        // let localbanner = app.local.get("banner");
        // app.local.set("banner", res.data.resproject);
        // if (!localbanner) this.localbanner(res.data.resproject);
        this.setData({
          banners: banners,
          hasmate: res.data.record_state,
          // newhand: res.data.newhand_state,
          // sub: res.data.subscribe
        })
        // if (res.data.subscribe == 0){
        //   this.setData({
        //     subimg: "../../img/index_sub.png"
        //   })
        // } else if (res.data.subscribe == 1){
        //   this.setData({
        //     subimg: "../../img/index_finishsub.png"
        //   })
        // }
      }
      if (fn) fn();
    })
  },
  localbanner:function(newBanner){
    let localbanner = newBanner || app.local.get("banner")
    if (localbanner) {
      for (let banner of localbanner) {
        if (banner.pic == 'local') {
          banner.pic = `../../img/${banner.id}.jpg`
        } else {
          banner.pic = app.urlimg(banner.pic)
        }
      }
      this.setData({
        banners: localbanner
      })
    }
  },
  sendform: function (e) {
    this.data.bannerdata = e.target.dataset
    app.https('/qrcode/userformid', {
      openid: app.globalData.openid,
      formid: e.detail.formId
    }, res => {
      if (res.status == 2000) {
        this.subscribe();
      }
    })
  },
  subscribe: function () {
    let detail = this.data.bannerdata;
    app.https('/subscribe/subscribeProject',{
      open_id: app.globalData.openid,
      state: detail.state,
      pro_id: detail.id
    },res => {
      if(res.status == 2000){
        let banners = this.data.banners;
        banners[detail.index].subscribe_state = res.data.state;
        banners[detail.index].subuser = res.data.subuser;
        this.setData({
          subalert : true,
          banners : banners
        })
      }
    })
  },
  cancelsubscribe: function(e) {
    this.data.canceldata = e.target.dataset
    this.showcancel();
  },
  getinfo:function(res){
    let detail = res.detail;
    if (detail.errMsg == "getUserInfo:fail auth deny") return;
    app.setUserInfo(detail,res => {
      this.setData({
        oauth: app.globalData.oauth
      })
      // this.showmate();
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
  newchange:function(e){
    this.setData({
      newCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
  closecon:function(){
    this.setData({
      dissub: false  //获取当前轮播图片的下标
    })
  },
  resetcon:function(){
    this.setData({
      dissub: false,  //获取当前轮播图片的下标
      sub: 0,
      subimg: "../../img/index_sub.png",
      concern: false
    })
  },
  totype:function(e) {
    if (!app.globalData.openid) return
    wx.navigateTo({
      url: '../type/type?id=' + e.target.id + '&name=' + e.target.dataset.name 
    })
  },
  showconcern : function(){
    this.setData({
      concern: true
    })
  },
  closeconcern: function(){
    this.setData({
      concern: false
    })
  },
  showsub:function(){
    this.setData({
      subalert: true
    })
  },
  closesub:function(){
    this.setData({
      subalert: false
    })
  },
  showcancel: function(){
    this.setData({
      cancelsub: true
    })
  },
  closecancel: function(){
    this.setData({
      cancelsub: false
    })
  },
  confirmcancel:function(){
    this.closecancel();
    let data = this.data.canceldata;
    app.https('/subscribe/subscribeProject', {
      open_id: app.globalData.openid,
      state: data.state,
      pro_id: data.id
    }, res => {
      if (res.status == 2000) {
        let banners = this.data.banners;
        banners[data.index].subscribe_state = res.data.state;
        banners[data.index].subuser = res.data.subuser;
        this.setData({
          banners: banners
        })
      }
    })
  },
  newstate:function(){
    app.https('/gamevideoinfo/newhandending',{
      openid: app.globalData.openid,
    },res => {
      if(res.status == 2000){
        // this.setData({
        //   newhand:1
        // })
        wx.showTabBar({
          
        })
      }
    })
  },
  showmate: function() {
    this.setData({
      mate: true
    })
    app.https('/matelist',{
      openid: app.globalData.openid,
    },res => {
      if(res.status == 2000){
        this.setData({
          matelist: res.data
        })
        if(res.data.length != 0){
          this.matefriend();
        }
      }
    })
  },
  // matefriend: function (e) {
  //   let game_id = "";
  //   if (e) {
  //     game_id = e.currentTarget.dataset.id
  //     if (this.data.gameCurrent == e.currentTarget.dataset.index) return false;
  //   } else {
  //     game_id = this.data.matelist[0].game_id
  //   }
  //   console.log(e.currentTarget.dataset.index)
  //   app.https('/matelist/friendmate', {
  //     openid: app.globalData.openid,
  //     game_id: game_id
  //   }, res => {
  //     if (res.status == 2000) {
  //       this.setData({
  //         friendlist: res.data,
  //         matefriend: e.currentTarget.dataset.index
  //       })
  //     }
  //   })
  // },
  matefriend:function(e){
    if(e){
      this.data.gameid = e.currentTarget.dataset.id;
      if (this.data.gameCurrent == e.currentTarget.dataset.index){
        return false;
      }else{
        app.https('/matelist/friendmate', {
          openid: app.globalData.openid,
          game_id: e.currentTarget.dataset.id
        }, res => {
          if (res.status == 2000) {
            this.setData({
              friendlist: res.data,
              gameCurrent: e.currentTarget.dataset.index
            })
          }
        })
      }
    }else{
      this.data.gameid = this.data.matelist[0].game_id;
      app.https('/matelist/friendmate', {
        openid: app.globalData.openid,
        game_id: this.data.matelist[0].game_id
      }, res => {
        if (res.status == 2000) {
          this.setData({
            friendlist: res.data,
            gameCurrent: 0
          })
        }
      })
    }
  },
  makephoto:function(e){
    // console.log(e)
    // wx.navigateTo({
    //   url: '../fit/fit?id=' + e.currentTarget.dataset.id + '&gameid=' + e.currentTarget.dataset.gameid,
    // })
    wx.navigateTo({
      url: '../cancouperesult/cancouperesult?id=' + e.currentTarget.dataset.id + '&gameid=' + e.currentTarget.dataset.gameid,
    })
  },
  closemate: function(){
    this.setData({
      mate: false
    })
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  }, 
  tovideo:function(e){
    wx.navigateTo({
      url: '../newhand/newhand?id=' + e.currentTarget.dataset.id + '&gameid=' + e.currentTarget.dataset.gameid,
    })
  },
  // subSubmit: function (e) {
  //   // console.log(e.detail.formId);
  //   // console.log('form发生了submit事件，携带数据为：', e.detail.value)
  //     app.https('/subscribe/subscribeProject', {
  //       open_id: app.globalData.openid,
  //       state: this.data.sub,
  //       formid: e.detail.formId
  //     }, res => {
  //       if (res.status == 2000) {
  //         if (res.data.state == 0) {
  //           this.setData({
  //             concern: false,
  //             dissub: true
  //           })
  //         } else if (res.data.state == 1) {
  //           this.setData({
  //             sub: res.data.state,
  //             subimg: "../../img/index_finishsub.png",
  //             concern: true,
  //             dissub: false
  //           })
  //         }
  //       }
  //     })
  // },
  subReset: function () {
    // console.log('form发生了reset事件')
  },
  typeSubmit: function (e) {
//  console.log(e);
//  console.log(e.detail.formId);
//  console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!app.globalData.openid) return
    wx.navigateTo({
      url: '../type/type?id=' + e.target.id + '&name=' + e.target.dataset.name + '&result=' + e.target.dataset.result + "&formid=" + e.detail.formId
    })
  },
  typeReset: function () {
    console.log('form发生了reset事件')
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.setting.wx_share,
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
            }
          })
        }
      }
    }
  }
});