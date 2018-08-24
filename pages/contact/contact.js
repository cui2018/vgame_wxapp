// pages/contact/contact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition:false,
    msg:"",
    imgsrc:'../../img/qrcode.jpg',
    height: "",
    width: "",
    windowwidth: ""
  },
  tofeedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          statusBarHeight: res.screenHeight - res.windowHeight
          // windowwidth: 750 * res.windowWidth / 750 / 2
        })
        this.drawcanvas();
      }
    })
  },
  drawcanvas:function(){
    var that = this;
    wx.downloadFile({
      url: 'https://vgame-cdn.edisonluorui.com/filmimgs/index_back.jpg', //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          let ctx = wx.createCanvasContext('contactus');
          ctx.drawImage(res.tempFilePath, 0, 0, that.data.width, that.data.height);
          ctx.drawImage("../../img/contact_code.png", that.setpx(150), that.setpx(300), that.setpx(450), that.setpx(450));
          var pertext = "扫描二维码关注不眨眼平台"
          ctx.setFillStyle('#fff');
          ctx.setFontSize(that.setpx(26));
          ctx.fillText(pertext, (that.setpx(750) - ctx.measureText(pertext).width) / 2, that.setpx(850));
          ctx.draw();
          

        }
      }
    })
    
  },
  tap: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.setpx(this.data.width * 4),
      height: this.setpx(this.data.height * 4),
      destWidth: this.setpx(this.data.width * 4),
      destHeight: this.setpx(this.data.height * 4),
      canvasId: 'contactus',
      success: function (res) {
        that.setData({
          mag: "wenjiandizhi"
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '已保存到本地',
              icon: 'success',
              duration: 2000
            })

          },
          fail: function (res) {
            that.setData({
              mag: res
            });
            wx.openSetting({
              success(settingdata) {
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  wx.showToast({
                    title: '已保存到本地',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  that.setData({
                    mag: "获取权限失败"
                  });
                }
              }
            })
          }
        })
      },
      fail: function () {
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
  
  }
})