// pages/can/can.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    width: "",
    windowwidth: "",
    condition: false,
    content: [],
    personimg: "",
    otherimg: [],
    personnick: "",
    othernick: "",
    percent: "",
    openinfo: [],
    userinfo: [],
    datainfo: [],
    friendid: "",
    qradeurlimg: "",
    ewmpng: "",
    endresult: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      endresult: true
    })
    this.data.openinfo = options;
    this.data.userinfo = app.globalData.userinfo;
    wx.getSystemInfo({
      success: res => {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          statusBarHeight: res.screenHeight - res.windowHeight
          // windowwidth: 750 * res.windowWidth / 750 / 2
        });
        app.https('/matelist/friendmatepic', {
          openid: app.globalData.openid,
          friend_openid: this.data.openinfo.id,
          game_id: this.data.openinfo.gameid
        }, res => {
          if (res.status == 2000) {
            this.setData({
              datainfo: res.data
            })
            this.drawcanvas()
            // if (fn) fn(res.data);
          }
        })
      }
    })
  },
  // 换算格式
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  // 保存图片到本地
  tap: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.setpx(this.data.width * 4),
      height: this.setpx(this.data.height * 4),
      destWidth: this.setpx(this.data.width * 4),
      destHeight: this.setpx(this.data.height * 4),
      canvasId: 'myCanvas',
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
            // 开启用户授权
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
      fail: function () { }
    })
  },
  qrade: function () {


    var that = this;
    app.https('/qrcode', {
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        // res.data.game.pic = app.urlimg(res.data.game.pic);
        this.setData({
          qradeurl: app.urlimg("/qrcode/" + res.data.data)
          // "https://vgame-cdn-image.edisonluorui.com/upload/qrcode/" + 
        });
        wx.downloadFile({
          url: that.data.qradeurl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              that.setData({
                qradeurl: res.tempFilePath
              });
              that.cancommon("myCanvas", "true");
            }
          }
        })
      }
    })



  },
  cancommon: function (can, fooval) {
    var canvas = can;
    var that = this;
    wx.downloadFile({
      url: that.data.userinfo.headimg, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            personimg: res.tempFilePath
          });
          //      console.log(that.data.datainfo.friend_hendimg);
          //      console.log()
          // 下载网络图片
          wx.downloadFile({
            url: that.data.datainfo.friend_hendimg, //仅为示例，并非真实的资源
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                that.setData({
                  otherimg: res.tempFilePath
                });
                let ctx = wx.createCanvasContext(canvas);
                ctx.drawImage("../../img/canvasbac.jpg", 0, 0, that.data.width, that.data.height);
                ctx.setStrokeStyle('#000000');
                ctx.setLineWidth(4);
                ctx.strokeRect(that.setpx(53), that.setpx(56), that.setpx(635), that.setpx(80));
                ctx.setFillStyle('#fff');
                ctx.fillRect(that.setpx(53), that.setpx(56), that.setpx(635), that.setpx(80));
                let percent = that.data.datainfo.pic_content.score;
                var pertext = "默契度高达" + percent + "%";
                ctx.setFillStyle('#000');
                ctx.setFontSize(that.setpx(39));
                ctx.fillText(pertext, (that.setpx(750) - ctx.measureText(pertext).width) / 2, that.setpx(110));
                ctx.drawImage("../../img/canvasfri.png", that.setpx(52), that.setpx(162), that.setpx(653), that.setpx(759));
                // var stringcontent = that.data.datainfo.pic_content.title;
                // ctx.setFillStyle('#000');
                // ctx.setFontSize(that.setpx(60));
                // ctx.fillText(stringcontent, (that.setpx(750) - ctx.measureText(stringcontent).width) / 2, that.setpx(500));
                var string = that.data.datainfo.pic_content.content;
                // 画布改版后 要求是字体大小不一致 但是居中显示 所以我是一个字一个字画的
                // 先计算出每一个字体大小的宽度 字母和数字还不一样
                // 先循环遍历出每一行的文字 计算出整体的宽度  然后用（总宽度-整体的宽度）/2 计算出x的坐标
                var arritem = [];
                var arritems = {};
                var atttol = []
                //            console.log(typeof (string) == "string");
                if (typeof (string) == "string") {
                  // arritem[0].text = string;
                  // arritem[0].type = 0;
                  // arritem[0] = ["text":string,"type":]
                  arritems.text = string;
                  arritems.type = "1";
                  arritem.push(arritems);
                  atttol.push(arritem);
                  string = atttol;
                }
                // console.log(JSON.parse(string))
                var xx = "";
                var linearr = [];
                var numitem = "";
                var numCnt = "";
                var yy = that.setpx(500);
                for (var i = 0; i < string.length; i++) {
                  var linewidth = 0;
                  for (var y = 0; y < string[i].length; y++) {
                    //                console.log(string[i][y].type);
                    if (string[i][y].type == 1) {
                      numitem = string[i][y].text;
                      numCnt = numitem.replace(/\D/g, '').length;
                      xx += that.setpx(61) * (string[i][y].text.length - numCnt);
                      xx += that.setpx(25) * numCnt;
                      linewidth = linewidth + (that.setpx(61) * (string[i][y].text.length - numCnt)) + that.setpx(25) * numCnt;

                    } else if (string[i][y].type == 2) {
                      numitem = string[i][y].text;
                      numCnt = numitem.replace(/\D/g, '').length;
                      xx += that.setpx(49) * (string[i][y].text.length - numCnt);
                      xx += that.setpx(22) * numCnt;
                      linewidth = linewidth + (that.setpx(49) * (string[i][y].text.length - numCnt)) + that.setpx(22) * numCnt;
                    } else if (string[i][y].type == 3) {
                      numitem = string[i][y].text;
                      numCnt = numitem.replace(/\D/g, '').length;
                      xx += that.setpx(33) * (string[i][y].text.length - numCnt);
                      xx += that.setpx(15) * numCnt;
                      linewidth = linewidth + (that.setpx(33) * (string[i][y].text.length - numCnt)) + that.setpx(15) * numCnt;
                    } else if (string[i][y].type == 0) {
                      numitem = string[i][y].text;
                      numCnt = numitem.replace(/\D/g, '').length;
                      xx += that.setpx(33) * (string[i][y].text.length - numCnt);
                      xx += that.setpx(15) * numCnt;
                      linewidth = linewidth + (that.setpx(33) * (string[i][y].text.length - numCnt)) + that.setpx(15) * numCnt;
                    }
                  }
                  // 数组的值代表每一行文字的宽度
                  linearr.push(linewidth)
                }
                var testnumber = /[0-9]/;
                var textabc = /[a-z]/i;
                for (var ii = 0; ii < string.length; ii++) {
                  var realistic = linearr[ii];
                  // var realx = (that.setpx(750) - realistic) / 2;
                  var realx = that.setpx(156);
                  for (var y = 0; y < string[ii].length; y++) {
                    if (string[ii][y].type == 1) {
                      ctx.setFillStyle('#000');
                      ctx.setFontSize(that.setpx(61));
                      var textlen = string[ii][y].text;
                      for (var t = 0; t < textlen.length; t++) {
                        if (testnumber.test(string[ii][y].text[t])) {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(25);
                        } else {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(61);
                        }
                      }
                    } else if (string[ii][y].type == 2) {
                      ctx.setFillStyle('#000');
                      ctx.setFontSize(that.setpx(49));
                      var textlen = string[ii][y].text;
                      for (var t = 0; t < textlen.length; t++) {
                        if (testnumber.test(string[ii][y].text[t])) {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(22);
                        } else {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(49);
                        }
                      }
                    } else if (string[ii][y].type == 3) {
                      ctx.setFillStyle('#000');
                      ctx.setFontSize(that.setpx(33));
                      var textlen = string[ii][y].text;
                      for (var t = 0; t < textlen.length; t++) {
                        if (testnumber.test(string[ii][y].text[t])) {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(15);
                        } else {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(33);
                        }
                      }
                    } else if (string[ii][y].type == 0) {
                      ctx.setFillStyle('#000');
                      ctx.setFontSize(that.setpx(33));
                      var textlen = string[ii][y].text;
                      for (var t = 0; t < textlen.length; t++) {
                        if (testnumber.test(string[ii][y].text[t])) {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(15);
                        } else {
                          ctx.fillText(string[ii][y].text[t], realx, yy);
                          realx += that.setpx(33);
                        }
                      }
                    }
                  }
                  // yy += that.setpx(80)
                  yy += that.setpx(50)
                }
                ctx.save();
                ctx.beginPath();
                ctx.arc(that.setpx(200), that.setpx(300), that.setpx(94), 0, Math.PI * 2);
                ctx.setFillStyle("#FFD75F");
                ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.arc(that.setpx(539), that.setpx(300), that.setpx(94), 0, Math.PI * 2);
                ctx.setFillStyle("#FFD75F");
                ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.arc(that.setpx(200), that.setpx(300), that.setpx(88), 0, Math.PI * 2);
                ctx.arc(that.setpx(539), that.setpx(300), that.setpx(88), 0, Math.PI * 2);
                // ctx.fill();
                ctx.clip();
                ctx.drawImage(that.data.personimg, that.setpx(106), that.setpx(200), that.setpx(188), that.setpx(188));
                ctx.drawImage(that.data.otherimg, that.setpx(445), that.setpx(200), that.setpx(188), that.setpx(188));
                ctx.restore();
                ctx.setFontSize(that.setpx(24));
                ctx.setFillStyle('#000');
                let nickname = that.data.userinfo.nick;
                let personname = that.data.datainfo.friend_nick;
                let nicknamelen = nickname.length;
                let personnamelen = personname.length;
                let nicklength = 0;
                let personlength = 0
                if (nicknamelen < 12) {
                  for (var n = 0; n < nicknamelen && n < 12; n++) {
                    if (testnumber.test(nickname[n])) {
                      nicklength += 6;
                    } else if (textabc.test(nickname[n])) {
                      nicklength += 6;
                    } else {
                      nicklength += 12;
                    }
                  }
                } else {
                  nickname = nickname.slice(0, 9) + "...";
                  for (var n = 0; n < nicknamelen && n < 10; n++) {
                    if (testnumber.test(nickname[n])) {
                      nicklength += 6;
                    } else if (textabc.test(nickname[n])) {
                      nicklength += 6;
                    } else {
                      nicklength += 12;
                    }
                  }
                  nicklength += 18
                }
                if (personnamelen < 12) {
                  for (var n = 0; n < personnamelen && n < 12; n++) {
                    if (testnumber.test(personname[n])) {
                      personlength += 6;
                    } else if (textabc.test(personname[n])) {
                      personlength += 6;
                    } else {
                      personlength += 12;
                    }
                  }
                } else {
                  personname = personname.slice(0, 9) + "...";
                  for (var n = 0; n < personnamelen && n < 10; n++) {
                    if (testnumber.test(personname[n])) {
                      personlength += 6;
                    } else if (textabc.test(personname[n])) {
                      personlength += 6;
                    } else {
                      personlength += 12;
                    }
                  }

                  personlength += 18;
                }
                ctx.fillText(nickname, that.setpx(194 - nicklength), that.setpx(420));
                ctx.fillText(personname, that.setpx(533 - personlength), that.setpx(420));
                // 画小程序二维码
                if (fooval == "true") {
                  ctx.setFontSize(that.setpx(28));
                  var textfill = "长按扫描小程序码";
                  ctx.drawImage(that.data.qradeurl, that.setpx(293), that.setpx(940), that.setpx(180), that.setpx(180));
                  ctx.fillText(textfill, (that.data.width - ctx.measureText(textfill).width) / 2, that.setpx(1160));
                }
                ctx.draw();
              }
            }
          })
        }
      }
    })
  },
  drawcanvas: function () {

    var that = this;


    this.cancommon("myCanvasid", "false")

    // ctx.drawImage("../../img/touxiang.png", this.setpx(106), this.setpx(200), this.setpx(188), this.setpx(188));
    // ctx.drawImage("../../img/touxiang.png", this.setpx(445), this.setpx(200), this.setpx(188), this.setpx(188));
    this.qrade();
    setTimeout(() => {
      this.setData({
        endresult: false
      })
    }, 1000);


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
  // 解除匹配
  relieve: function () {
    app.https('/matelist/frienddel', {
      openid: app.globalData.openid,
      friend_openid: this.data.datainfo.friend_id
    }, res => {
      if (res.status == 2000) {
        wx.showToast({
          title: '解除成功',
          icon: 'success',
          duration: 2000
        })
        // if (fn) fn(res.data);
      }
    })
  },

  
})