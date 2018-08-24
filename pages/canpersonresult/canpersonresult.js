// pages/can/can.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameid:"",
    height: "", //heighgt
    width: "", //width
    windowwidth: "", //width
    condition: false, //黑色蒙版
    content: [
    ],  //二次改版后的数据格式
    percent: "63%", //百分数
    gameresult: "", //接口返回总数据结构
    newstate: 0, //新手引导
    resultform: "", //formid  表单
    gameid: "", //上一页传过来的gameid
    gamename: "", // 上一页传过来的游戏名称
    qradeurl: "", //二维码
    ewmpng: "../../img/ewmqude.jpg", //二维码赋值
    openset: true, //组件废弃之后可能会用到 暂时么有
    concern: false, //提示关注的弹窗
    endresult: true, //加载中的提示
    cantitle:"" //画布标题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 开始时 显示正在加载
    this.setData({
      endresult: true
    })
    // 赋值 title 
    wx.setNavigationBarTitle({
      title: options.name,
    })
    var that = this;
    // 判断是从详情进入 还是游戏结束进入
      this.setData({
        gameid: options.id,
        gamename: options.name
      })
      // 获取设备的值 宽和高
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
        // 获取数据接口 进行初始化赋值
        app.https('/gamevideoinfo/gameresult', {
          game_id: options.id,
          openid: app.globalData.openid,
          // formid: that.data.resultform
        }, res => {
          if (res.status == 2000) {
            // res.data.game.pic = app.urlimg(res.data.game.pic);
            that.setData({
              gameresult: res.data,
              content: res.data.result.content,
              percent: res.data.result_score,
              newstate: res.data.newstate,
              cantitle: res.data.result.title
            })
            // 渲染画布
            that.drawcanvas();

            // if (!this.data.gameresult_state) {
            //   setTimeout(() => {
            //     this.setData({
            //       matestate: true
            //     })
            //   }, 4000)
            // }
          }
        })

      }
    })

  },
  showcon: function () {
    this.setData({
      condition: false,
      concern: true
    })
  },
  toindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  qrade: function () {
    var that = this;

    app.https('/qrcode', {
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        // res.data.game.pic = app.urlimg(res.data.game.pic);
        that.setData({
          qradeurl: app.urlimg("/qrcode/" + res.data.data)
        });
        //      (that.data.qradeurl);console.log
        wx.downloadFile({
          url: that.data.qradeurl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              that.setData({
                ewmpng: res.tempFilePath
              });
              that.canvascommon("myCanvas", "true");
            }
          }
        })

      }
    })



  },
  // 
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  canvascommon: function (can, booval) {
    var that = this;
    //  console.log(that.data.qradeurl);
    // 获取画布
    let ctx = wx.createCanvasContext(can);
    // 画背景图
    ctx.drawImage("../../img/canvasbac.jpg", 0, 0, that.data.width, that.data.height);
    ctx.setStrokeStyle('#000000');
    ctx.setLineWidth(4);
    ctx.strokeRect(that.setpx(53), that.setpx(56), that.setpx(635), that.setpx(80));
    ctx.setFillStyle('#fff');
    ctx.fillRect(that.setpx(53), that.setpx(56), that.setpx(635), that.setpx(80));
    let percent = that.data.percent;
    var pertext = "您已击败全球" + percent + "%的用户";
    ctx.setFillStyle('#000');
    ctx.setFontSize(that.setpx(39));
    ctx.fillText(pertext, (that.setpx(750) - ctx.measureText(pertext).width) / 2, that.setpx(110));
    ctx.drawImage("../../img/canvasurl.png", that.setpx(52), that.setpx(162), that.setpx(636), that.setpx(627));
    var stringtitle = that.data.cantitle;
    ctx.setFillStyle('#000');
    ctx.setFontSize(that.setpx(60));
    ctx.fillText(stringtitle, (that.setpx(750) - ctx.measureText(stringtitle).width) / 2, that.setpx(300));
    
    var string = that.data.content;
    var arritem = [];
    var arritems = {};
    var atttol = [];
    // 在这里做了判断 如果传过来的类型是字符串类型 转成对象格式
    if (typeof (string) == "string") {
      arritems.text = string;
      arritems.type = "1";
      arritem.push(arritems);
      atttol.push(arritem);
      string = atttol;
    }
  // 画布改版后 要求是字体大小不一致 但是居中显示 所以我是一个字一个字画的
  // 先计算出每一个字体大小的宽度 字母和数字还不一样
  // 先循环遍历出每一行的文字 计算出整体的宽度  然后用（总宽度-整体的宽度）/2 计算出x的坐标
     var xx = "";
    var linearr = [];
    var numitem = "";
    var numCnt = "";
    var yy = that.setpx(380);
    for (var i = 0; i < string.length; i++) {
      // i 行数
      var linewidth = 0;
      for (var y = 0; y < string[i].length; y++) {
      // 每一行的不同类型
        if (string[i][y].type == 1) {
          numitem = string[i][y].text;
          // 判断数字的长度
          numCnt = numitem.replace(/\D/g, '').length;
          // 汉字 是 61
          xx += that.setpx(61) * (string[i][y].text.length - numCnt);
          // 汉字 是 25
          xx += that.setpx(25) * numCnt;
          // 宽度
          linewidth = linewidth + (that.setpx(61) * (string[i][y].text.length - numCnt)) + that.setpx(25) * numCnt;

        } else if (string[i][y].type == 2) {
          numitem = string[i][y].text;
          numCnt = numitem.replace(/\D/g, '').length;
          xx += that.setpx(49) * (string[i][y].text.length - numCnt);
          xx += that.setpx(22) * numCnt;
          // 宽度累加
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
           // 宽度累加
          linewidth = linewidth + (that.setpx(33) * (string[i][y].text.length - numCnt)) + that.setpx(15) * numCnt;
        }
        var num = 0;

      }
      linearr.push(linewidth)
    }
    // 数字
    var testnumber = /[0-9]/;
    for (var ii = 0; ii < string.length; ii++) {
      // 获取每一行的宽度
      // var realistic = linearr[ii];
      var realistic = that.setpx(15) * 16;
      // var realx = (that.setpx(750) - realistic) / 2;
      var realx = that.setpx(122) ;
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
      // 纵坐标不断增加
      yy += that.setpx(60)
    }
    // 化小程序吗
    if (booval == "true") {
      ctx.setFontSize(that.setpx(28));
      var textfill = "长按扫描小程序码"
      ctx.drawImage(that.data.ewmpng, that.setpx(243), that.setpx(827), that.setpx(260), that.setpx(260));
      ctx.fillText(textfill, (that.data.width - ctx.measureText(textfill).width) / 2, that.setpx(1118));
    }
    ctx.draw();
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
              mag: res,
              openset: true
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
  drawcanvas: function () {

    var that = this;
    // 传值 画布id 布尔值判断是有有二维码
    that.canvascommon("myCanvasid", "false");
    // 调取有二维码时的情况
    that.qrade();
    // 1秒的计时 正在加载中取消
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
  // 匹配好友的弹出框
  swicondition: function () {
    // this.setData({
    //   condition: true
    // })
    app.https('/matelist/friendpic', res => {
      if (res.status == 2000) {
        res.data.pic = app.urlimg(res.data.pic)
        this.setData({
          typeitem: res.data
        })
        this.sharemore();
      }
    })
  },
  // 取消匹配好友的弹窗
  shareless: function () {
    this.setData({
      condition: false
    })
  },
  // 取消新手引导 引导完成
  editstate: function () {
    app.https('/gamevideoinfo/newhandresultending', {
      openid: app.globalData.openid
    }, res => {
      // res.data.game.pic = app.urlimg(res.data.game.pic);
      this.setData({
        newstate: false
      })
    })

  },
  // 公众号关注弹窗
  close: function () {
    this.setData({
      concern: false
    })
  },
  sharemore: function () {
    var that = this;
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      condition: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 在玩一次
  playnow: function () {
    wx.navigateTo({
      url: '../video/video?id=' + this.data.gameid + '&name=' + this.data.gamename,
    })
  },
  // 分享配图
  onShareAppMessage: function () {
    console.log('/pages/canpersonresult/canpersonresult?user=' + app.globalData.openid + '&id=' + this.data.gameid + '&name=' + this.data.gamename);

    return {
      title: app.globalData.setting.wx_share,
      path: '/pages/canpersonresult/canpersonresult?user=' + app.globalData.openid + '&id=' + this.data.gameid + '&name=' + this.data.gamename,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.data.gameid,
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
            console.log(123)
            }
          })
        }
      }
    }
  },
  writedis: function () {
    wx.navigateTo({
      url: '../writedis/writedis?id=' + this.data.gameid,
    })
  },
})