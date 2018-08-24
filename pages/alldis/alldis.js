// pages/alldis/alldis.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ],
    page: 1,
    total: 1,
    gameid:"",
    starnum:0,
    times:0,
    score:0,
    discussdata:[]
  },
  selestar: function (num) {
    let stars = [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite"
    ];
    for (let i = 0; i < Math.round(num/2); i++) {
      stars[i] = "bstaryellow"
    }
    return stars;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gameid = options.id
    this.getalldis();
  },
  getalldis:function(){
    if(this.data.page > this.data.total) return false;
    app.https('/comment',{
      openid: app.globalData.openid,
      game_id: this.data.gameid,
      page : this.data.page
    },res => {
      if(res.status == 2000){
        let stars = this.selestar(res.data.score);
        for (let dis of res.data.resgames_com) {
          let stars = [
            "bstarwhite",
            "bstarwhite",
            "bstarwhite",
            "bstarwhite",
            "bstarwhite"
          ]
          for (let i = 0; i < Math.round(dis.score/2); i++) {
            stars[i] = "bstaryellow"
          }
          dis.score = stars
        }
        let discussdata = [...this.data.discussdata, ...res.data.resgames_com];
//      console.log(discussdata)
        this.setData({
          stars: stars,
          discussdata: discussdata,
          page: this.data.page +1,
          total: res.data.totalpage,
          times: res.data.times,
          score: res.data.score
        })
      }
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
    this.getalldis();
  },
})