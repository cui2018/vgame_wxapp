// components/distext/distext.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [
      "bstaryellow",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ],
    starnum:1
  },
  selestar: function (e) {
    let stars = [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ]
    for (let i = 0; i <= e.target.dataset.num; i++) {
      stars[i] = "bstaryellow"
    }
//  console.log(e.target.dataset.num + 1)
    this.setData({
      stars: stars,
      starnum: e.target.dataset.num + 1
    })
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
  
  }
})