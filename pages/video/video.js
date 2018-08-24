const APP = getApp();
var ID = '';  //最后几个方法里有用到
var system = '';  //手机的系统
var model = ''; //手机的型号
var counttip = 0; //为了显示弹窗  分享
var version = ''; //版本号
var local = false; //微信开发工具  pc
var iswebsocket = false;
var timer = null;//定时器
var times = 0; //定时器
var qtetimes = -1; //qte显示 用户未作处理
var qteblock = []; //当前数组下的qte显示或隐藏
var onlyqte = 0;
var qtesuc = [];
var startstate = true;
Page({
  data: {
    width: "", //宽
    height: "", //高
    count: 0, //结束进度条
    concern: false,
    ending: "",
    score: 0,
    videos: [],
    loader: [],
    hide: [],
    action: [],
    options: [],
    showOption: false,
    duration: '',
    rightbottom: true,
    rotate: '', //横竖屏
    endanalyse: 1, //1显示视频 2显示计算结果 3返回页 
    sharetip: false,
    isvideostart: false,
    videoImage: '',
    isvideoimage: true,
    pis: '',
    optionNum: 'zero',
    isRe_on: false,
    durationurl: "", //横屏倒计时
    qtemote: -1, //qte 弹窗
    qtemoteitem: [], //qte data绑定
    qtemoteitemy:[],
    qtemoteitemwid:[],
    qtemoteitemhei:[],
    qtemoteiteml:[],
    partitemy: [],
    partitemwid: [],
    partitemhei: [],
    partiteml: [],
    dispart: false, // 场景 弹窗
    partitem: [], //场景 data绑定
    touchstart: 0,
    touchstartx: 0,
    touchmove: 0,
    touchmovex: 0,
    qtedjs: 0,
    qteblock: [],
    videohei:"100vh",
    videotop:0,
    partitemimg :"../../img/bac.jpg",
    togal:false,
    partstyle :[]

  },
  qteover: true,
  partchoose: -1, //是否执行了场景操作
  gamename: "", //游戏名字
  qtechoosing: -1, //数字几代表那个选了  //-1没选 执行的是qte的第几个数组
  taptimes: "", //多次点击
  qtearr: [], //qtemoteitem下的数组
  optionlength: "",
  max: 0, //  选项长度
  video: [],
  name: "start",
  playing: -1,
  playingName: "start",
  pointer: 0,
  paused: false,
  userChoosed: -1,
  onchoosing: [],
  nowPlay: -1,
  onended: [],
  userScore: {},
  CONFIG: {}, //步骤
  game_id: '', //gameid
  titleName: '', //title
  user: '', //用户
  openid: '',
  issharetip: true,
  ontime: true,
  onLoad: function (option) {
    var that = this;
    let parem = option;
    this.game_id = ID = parem.id;
    this.gamename = parem.name;
    APP.globalData.page = {
      page: "video",
      game_id: this.game_id
    };
    if (parem.user) {
      APP.login(res => {
        this.openid = res.openid;
        this.titleName = parem.name;
        this.user = parem.user;
        //当用户从开始玩跳转过来，变成真
        // iswebsocket = true;
        this.getSysInfo();
      });
    } else {
      this.getSysInfo();
    }
    wx.setNavigationBarTitle({
      title: option.name
    });
    //清除所有用户的缓存,需要后台配合，把字段startgame全部变成1
    /*if ( !wx.getStorageSync('clearAllStorage_v1') ){
          wx.setStorageSync('clearAllStorage_v1', 'success_v1');
          wx.removeStorageSync('name_ckhnZVJUbkZlRDJ4SC9TZXNpeFFvUT09');
          wx.removeStorageSync('playingName_ckhnZVJUbkZlRDJ4SC9TZXNpeFFvUT09');
          wx.removeStorageSync('name_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
          wx.removeStorageSync('playingName_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
          wx.removeStorageSync('userScore_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
    }*/
    wx.getSystemInfo({
      success: res => {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight
        });

      }
    })
  },
  getSysInfo() {
    wx.getSystemInfo({
      success: res => {
        if (res.platform == "devtools") local = true;
        if ((res.windowWidth / res.windowHeight) <= 0.59) this.setData({
          pis: "iphoneX"
        });
        system = res.system.slice(4, 6);
        model = res.model;
        this.acceptright();
      }
    });
  },
  // 判断是否是分享进入
  acceptright() {
    if (this.user && this.openid) APP.https('/matelist/friendship', {
      sender: APP.globalData.openid,
      openid: this.user
    }, res => {
      this.user = '';
      this.userplaygamevideo();
    })
    else this.userplaygamevideo();
  },
  userplaygamevideo() {
    APP.https('/gamevideoinfo/userplaygamevideo', {
      openid: APP.globalData.openid,
      game_id: this.game_id
    }, res => {
      if (res.status == '2000') {
        this.jiekou(res);
      }
    })
  },
  // 获取数据接口
  jiekou(res) {
    // 版本号
    version = res.data.version;
    // 步骤
    let data = res.data.setting;
    // 横竖屏
    let orientation = res.data.orientation;
    // 新手
    let newhand = res.data.newhand;
    // 本地存储
    wx.setStorageSync('newhand', res.data.newhand);
    this.setData({
      rotate: res.data.orientation
    });
    this.CONFIG = data;
    for (let key in this.CONFIG) {
      let config = this.CONFIG[key];
      // 结束时  无默认值时 图片 跳出循环
      if (config.ending || config.gotoPrev || key == "optionImage") continue;
      // 选项的长度
      // if()
      if (config.video) {
        // 有选项时
        if (config.choose) {
          let len = config.choose.option.length;
          if (len > this.max) this.max = len;
        } else if (config.qte) {
          // 有qte时
          // 首先依次遍历出所有的视频 获取长度
          var optonlen = 0;
          for (var i = 0; i < config.qte.option.length; i++) {
            if (config.qte.option[i].success.type == "video") {
              optonlen++;
            }
            if (config.qte.option[i].fail.type == "video") {
              optonlen++;
            }
          }
          this.optionlength = optonlen;
          if (optonlen > this.max) this.max = optonlen;
        }
      } else if (config.image) {
        // 有场景时
        if (config.part) {
          // 长度目前只有一个  视频
          let len = config.part.option.length;
          if (len > this.max) this.max = len;
        }
      }

    }
    this.max++;
    for (let i = 0; i < this.max; i++) {
      this.data.videos.push("");
    }
    this.setData({
      videos: this.data.videos
    });
    for (let i = 0; i < this.max; i++) {
      this.onchoosing[i] = 0;
      this.video[i] = wx.createVideoContext(`video${i}`);
    }
    let startgame = res.data.startgame;
    if (startgame == 1) { } else if (startgame == 2) {
      // if (config)
      this.setData({
        isRe_on: true
      })
    }
    this.play(0)
  },
  play: function (x,fn) {
    this.qteover = true;
    this.setData({
      dispart: false
      
    })
    qtetimes = -1;
    let config = this.CONFIG[this.name];
    if (config.height == "undefined" || !config.height){
      config.height = "960"
    }
    if (config.width == "undefined" || !config.width) {
      config.width = "540"
    }
    this.data.videohei = parseInt(config.height) * this.data.width / parseInt(config.width);
    this.setData({
      videotop: (this.data.height - parseInt(this.data.videohei))/2 +"px",
      videohei: this.data.videohei + "px",
    })
    this.userChoosed = -1;
    if (config.ending) {
      this.playing = (this.playing + x + 1) % this.max;
      
      for (let j = 0; j < this.max; j++) {
        let i = (this.playing + j) % this.max;
        if (this.playing == i) {
          //播放
          this.onchoosing[i] = 0;
          this.data.loader[i] = {
            src: getVideo.call(this, this.name),
            poster: getPoster.call(this, this.name),
            name: this.name
          };
          this.data.hide[i] = false;
        } else {
          //禁用
          this.data.loader[i] = {
            src: "",
            poster: "",
            name: ""
          };
          this.data.hide[i] = true;
        }
      }
    } else if (config.gotoPrev) {
      if (this.data.loader.length == 0) {
        this.name = this.playingName;
        return this.play(0);
      }
      var pointer = (this.playing + x + 1) % this.max;
      for (let j = 0; j < this.max; j++) {
        let i = (pointer + j) % this.max;
        if (pointer == i) {
          //播放
          this.onchoosing[i] = 0;
          this.data.hide[i] = false;
        } else {
          //其他
          this.data.hide[i] = true;
        }
      }
    } else {
      this.playing = (this.playing + x + 1) % this.max;
      this.data.loader = [];
      // 有video 包括qte和选项
      if (config.video) {
        if (config.choose) {
          this.pointer = (this.playing + config.choose.option.length) % this.max;
          let opi = 0;
          for (let j = 0; j < this.max; j++) {
            let i = (this.playing + j) % this.max;
            if (this.playing == i) {
              //播放
              this.onchoosing[i] = 0;
              this.data.loader[i] = {
                src: getVideo.call(this, this.name),
                poster: getPoster.call(this, this.name),
                name: this.name
              };
              this.setData({
                videoImage: getPoster.call(this, this.name)
              });
              this.data.hide[i] = false;
              if (this.data.rotate == 'landscape') {
                for (let i = 0; i < config.choose.option.length; i++) {
                  config.choose.option[i].image = getOption(this.CONFIG.optionImage[this.name][i]);
                }
              }
              this.setData({
                options: config.choose.option
              });
            } else if (
              (this.playing < this.pointer && i > this.playing && i <= this.pointer) ||
              (this.playing > this.pointer && (i > this.playing || i <= this.pointer))
            ) {
              //预载
              this.data.loader[i] = {
                src: getVideo.call(this, config.choose.option[opi].next),
                poster: getPoster.call(this, config.choose.option[opi].next),
                name: config.choose.option[opi++].next
              };
              this.data.hide[i] = true;
            } else {
              //禁用
              this.data.loader[i] = {
                src: "",
                poster: "",
                name: ""
              };
              this.data.hide[i] = true;
            }
          }
        } else if (config.qte) {
          // 同样依次遍历出视频的长度
          var optonlen = 0;
          var optarrnext = [];
          for (var i = 0; i < config.qte.option.length; i++) {
            qteblock[i] = false;
            this.setData({
              qteblock: qteblock,
              togal:false
            })
            if (config.qte.option[i].success.type == "video") {
              optarrnext.push(config.qte.option[i].success.next);
              optonlen++;
            }
            if (config.qte.option[i].fail.type == "video") {
              optarrnext.push(config.qte.option[i].fail.next);
              optonlen++;
            }
          }
          this.setData({
            qteblock: qteblock
          })
          // 指向 
          this.pointer = (this.playing + optonlen) % this.max;
          let opi = 0;
          for (let j = 0; j < this.max; j++) {
            let i = (this.playing + j) % this.max;
            if (this.playing == i) {
              //播放
              // 当前播放
              this.onchoosing[i] = 0;
              this.data.loader[i] = {
                src: getVideo.call(this, this.name),
                poster: getPoster.call(this, this.name),
                name: this.name
              };
              this.setData({
                videoImage: getPoster.call(this, this.name)
              });
              this.data.hide[i] = false;
            } else if (
              (this.playing < this.pointer && i > this.playing && i <= this.pointer) ||
              (this.playing > this.pointer && (i > this.playing || i <= this.pointer))
            ) {
              //预载  
              this.data.loader[i] = {
                src: getVideo.call(this, optarrnext[opi]),
                poster: getPoster.call(this, optarrnext[opi]),
                name: optarrnext[opi++]
              };
              this.data.hide[i] = true;
            } else {
              //禁用
              this.data.loader[i] = {
                src: "",
                poster: "",
                name: ""
              };
              this.data.hide[i] = true;
            }
          }
        }
        
      } else if (config.image) {
        // 场景
        if (config.part) {
          // 场景图片 位置显示
          this.setData({
            dispart: true
          })
          // 长度只能为1
          var optonlen = 1;
          let opi = 0;
          this.pointer = (this.playing + optonlen) % this.max;
          for (let j = 0; j < this.max; j++) {
            let i = (this.playing + j) % this.max;
            // 当前没有vide 只有视频 
            if (this.playing == i) {
              //播放
              // this.data.hide[i] = true;
              this.data.loader[i] = {
                src: "",
                poster: "",
                name: ""
              };
              this.data.hide[i] = true;
            } else if (
              (this.playing < this.pointer && i > this.playing && i <= this.pointer) ||
              (this.playing > this.pointer && (i > this.playing || i <= this.pointer))
            ) {
              //预载
              this.data.loader[i] = {
                src: getVideo.call(this, config.part.option[opi].next),
                poster: getPoster.call(this, config.part.option[opi].next),
                name: config.part.option[opi++].next
              };
              this.data.hide[i] = true;
            } else {
              //禁用
              this.data.loader[i] = {
                src: "",
                poster: "",
                name: ""
              };
              this.data.hide[i] = true;
            }
          }
        }
      }
    }
    let setDatas = {
      hide: this.data.hide
    };
    if (!config.gotoPrev) setDatas.loader = this.data.loader;
    this.nowPlay = config.gotoPrev ? pointer : this.playing;
    this.setData(setDatas);
    // qte的位置 弹窗
    if (config.qte) {
      var qtearritem = [];
      this.qtearr = [];
      config.qte.option = config.qte.option;
      var qtemoteitemy = [];
      var qtemoteitemwid= [];
      var qtemoteitemhei=[];
      var qtemoteiteml=[];
      for (var i = 0; i < config.qte.option.length; i++) {
        config.qte.option[i].image = getqte(this.CONFIG[this.name].qte.option[i].image);
        var qtemoteitemyy= parseInt(config.qte.option[i].y) * parseInt(this.data.width) /100 + parseInt(this.data.videotop);
        var qtemoteitemwidth = parseInt(config.qte.option[i].w) * parseInt(this.data.width) / 100 ;
        var qtemoteitemheight = parseInt(config.qte.option[i].h) * parseInt(this.data.width) / 100 ;
        var qtemoteitemleft = parseInt(config.qte.option[i].x) * parseInt(this.data.width) / 100 ;
        qtemoteitemy.push(qtemoteitemyy);
        qtemoteitemwid.push(qtemoteitemwidth);
        qtemoteitemhei.push(qtemoteitemheight);
        qtemoteiteml.push(qtemoteitemleft);
        qtearritem = config.qte.option[i];
        qtesuc[i] = "false";
        this.qtearr.push(qtearritem);
        this.setData({
          qtemoteitem: this.qtearr,
          qtemoteitemy: qtemoteitemy,
          qtemoteitemwid: qtemoteitemwid,
          qtemoteitemhei: qtemoteitemhei,
          qtemoteiteml: qtemoteiteml
        })
      }
      this.nowPlay = this.playing;
    }
    // 场景的位置 弹窗
    if (config.part) {
      let configpart = config.part;
      var partitemy = [];
      var partitemwid = [];
      var partitemhei = [];
      var partiteml = [];
      for (var i = 0; i < config.part.option.length;i++){
        configpart.option[i].image = getpart(this.CONFIG[this.name].part.option[i].image);
        var partitemyy = parseInt(config.part.option[i].y) * parseInt(this.data.width) / 100 + parseInt(this.data.videotop);
        var partitemwidth = parseInt(config.part.option[i].w) * parseInt(this.data.width) / 100;
        var qtemoteitemheight = parseInt(config.part.option[i].h) * parseInt(this.data.width) / 100;
        var partitemleft = parseInt(config.part.option[i].x) * parseInt(this.data.width) / 100;
        partitemy.push(partitemyy);
        partitemwid.push(partitemwidth);
        partitemhei.push(qtemoteitemheight);
        partiteml.push(partitemleft);
        this.setData({
          partitemy: partitemy,
          partitemwid: partitemwid,
          partitemhei: partitemhei,
          partiteml: partiteml
        })
      }
      
      this.setData({
        partitem: configpart.option,
        partitemimg: getpart(config.image)

      })
    }
    if (config.gotoPrev) this.video[pointer].play();
    else if (this.name != "start") this.video[this.playing].play();
 
    if (fn) fn();
    this.onended[this.nowPlay] = false;
    this.setData({
      rightbottom: false
    });
    //需要在这个位置添加动态实时缓存，为了防止用户从意外渠道退出
    //存在一个问题，如果需要计分，积分是在用户选择的函数里，此处是空对象，少一次计分,计分放在用户选择里
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);
  },
  ended: function (e) {
    let i = e.currentTarget.dataset.i;

    if (this.onended[i]) return;
    this.onended[i] = true;
    this.name = e.currentTarget.dataset.name;
    let config = this.CONFIG[this.name];
    if (config.ending) {
      counttip = 0;
      this.issharetip = true;
      this.setData({
        endanalyse: 2
      });
      let score = 0;
      let ending = config.ending;
      let endScore = ending;
      if (ending == "ending") {
        for (let i in this.userScore) {
          score += parseInt(this.userScore[i].score);
        }
        endScore = score;
      }
      this.name = 'start';
      this.playingName = 'start';
      this.userScore = {};
      wx.removeStorageSync('name_' + ID);
      wx.removeStorageSync('playingName_' + ID);
      wx.removeStorageSync('userScore_' + ID);
      let newhand = wx.getStorageSync('newhand');
      APP.https('/result/usergameresult', {
        openid: APP.globalData.openid,
        game_id: this.game_id,
        newhand: newhand,
        end: endScore
      }, res => {
        if (res.status == '2000') {
          var that = this
          var count = 0;
          if (this.data.rotate != 'landscape') {
            var timer = setInterval(function (e) {
              count++;
              that.setData({
                count: count
              });
              if (count == 100) clearInterval(timer);
            }, 40);
          } else {
            var timer = setInterval(function (e) {
              count++;
              that.setData({
                count: count
              });
              if (count == 100) clearInterval(timer);
            }, 40);
          }
          setTimeout(() => {
            this.setData({
              endanalyse: 3
            });
            wx.navigateTo({
              url: '../canpersonresult/canpersonresult?id=' + this.game_id + '&name=' + this.titleName
            })
          }, 4000);
        }
      });
    } else if (config.gotoPrev) {
      let prev = this.CONFIG[this.playingName];
      this.name = this.playingName;
      this.data.hide[i] = true;
      this.data.hide[this.playing] = false;
      this.video[i].pause();
      if (this.data.rotate == 'landscape') {
        for (let i = 0; i < prev.choose.option.length; i++) {
          prev.choose.option[i].image = getOption(this.CONFIG.optionImage[this.name][i]);
        }
      }
      this.setData({
        options: prev.choose.option,
        showOption: true,
        hide: this.data.hide
      });
      this.onchoosing[this.playing] = 1;
      this.nowPlay = this.playing;
      this.video[this.playing].seek(parseInt(prev.choose.at));
      this.video[this.playing].play();
      this.onended[this.playing] = false;
      this.paused = false;
    } else {
      if (config.video) {
        if (config.choose) {
          if (config.choose.duration >= 0 || this.userChoosed != -1) {
            let choosed = this.userChoosed == -1 ? parseInt(config.choose.def) : this.userChoosed;
            this.name = config.choose.option[choosed].next;
            if (config.choose.duration >= 0 || this.userChoosed == config.choose.def) this.playingName = config.choose.option[choosed].next;
            this.setData({
              showOption: false
            });
            this.play(choosed);
          } else {
            this.paused = true;
            //如果暂停则暂停
            this.video[this.nowPlay].pause();
            this.setData({
              isvideoimage: false
            });
          }
        } else if (config.qte) {
          for (var j = 0; j < qteblock.length; j++) {
            qteblock[j] = "false"
          }
          this.setData({
            qteblock: qteblock
          })
          console.log(qteblock);

          // 从未做处理
          if (qtetimes == -1) {
            if (config.qte.option[0].fail.type == "video") {
              let qtechoose = parseInt(0 * 2) + parseInt(1);
              this.name = config.qte.option[0].fail.next;
              this.playingName = config.qte.option[0].fail.next;
              if (config.qte.option[0].success.type == "video") {
                this.play(1);
              } else {
                this.play(0);
              }
            } else if (config.qte.option[0].fail.type == "gameover") {
              this.setData({
                endanalyse: 3
              });
              wx.navigateTo({
                url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
              })

            } else if (config.qte.option[0].fail.type == "nextqte") {

              for (var t = 0; t < config.qte.option.length; t++) {
                if (config.qte.option[t].fail.type == "video") {
                  var playlen = 0;
                  this.name = config.qte.option[t].fail.next;
                  this.playingName = config.qte.option[t].fail.next;
                  if (t > 0) {
                    for (var n = 0; n < t; n++) {
                      if (config.qte.option[n].success.type == "video") {
                        playlen++;
                      }
                      if (config.qte.option[n].fail.type == "video") {
                        playlen++;
                      }
                    }
                    if (config.qte.option[t].success.type == "video") {
                      playlen++;
                    }

                    this.play(playlen);
                  } else {
                    if (config.qte.option[0].success.type == "video") {
                      this.play(1);
                    } else {
                      this.play(0);
                    }

                  }
                }
              }

            }
          } else if (qtetimes != -1) {
            // 有事件成功时
            if (qtesuc[qtetimes] == "true") {
              if (config.qte.option[qtetimes].success.type == "video") {
                this.name = config.qte.option[qtetimes].success.next;
                this.playingName = config.qte.option[qtetimes].success.next;
                var playlen = 0;
                if (qtetimes > 0) {
                  var playlen = 0;
                  for (var n = 0; n < qtetimes; n++) {
                    if (config.qte.option[n].success.type == "video") {
                      playlen++;
                    }
                    if (config.qte.option[n].fail.type == "video") {
                      playlen++;
                    }
                  }
                  
                  this.play(playlen);
                } else {
                 
                    this.play(0);

                }
              } else if (config.qte.option[qtetimes].success.type == "gameover") {
                this.setData({
                  endanalyse: 3
                });
                wx.navigateTo({
                  url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                })
              } else if (config.qte.option[qtetimes].success.type == "nextqte") {
                for (var w = 0; w < qtesuc.length; w++) {
                  if (qtesuc[w] = "true") {
                    w = w + parseInt(1);
                    if (config.qte.option[w].fail.type == "gameover") {
                      this.setData({
                        endanalyse: 3
                      });
                      wx.navigateTo({
                        url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                      })
                    } else if (config.qte.option[w].fail.type == "video") {
                      this.name = config.qte.option[w].fail.next;
                      this.playingName = config.qte.option[w].fail.next;
                      var playlen = 0;
                      if (w > 0) {
                        for (var n = 0; n < w; n++) {
                          if (config.qte.option[n].success.type == "video") {
                            playlen++;
                          }
                          if (config.qte.option[n].fail.type == "video") {
                            playlen++;
                          }
                        }
                        if (config.qte.option[w].success.type == "video") {
                          playlen++;
                        }

                        this.play(playlen);
                      } else {
                        if (config.qte.option[0].success.type == "video") {
                          this.play(1);
                        } else {
                          this.play(0);
                        }

                      }
                    } else if (config.qte.option[w].fail.type == "nextqte") {
                      // 
                      w = w + parseInt(1);
                      if (config.qte.option[w].fail.type == "gameover") {
                        this.setData({
                          endanalyse: 3
                        });
                        wx.navigateTo({
                          url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                        })
                      } else if (config.qte.option[w].fail.type == "video") {
                        this.name = config.qte.option[w].fail.next;
                        this.playingName = config.qte.option[w].fail.next;
                        var playlen = 0;
                        if (w > 0) {
                          for (var n = 0; n < w; n++) {
                            if (config.qte.option[n].success.type == "video") {
                              playlen++;
                            }
                            if (config.qte.option[n].fail.type == "video") {
                              playlen++;
                            }
                          }
                          if (config.qte.option[w].success.type == "video") {
                            playlen++;
                          }
                          this.play(playlen);
                        } else {
                          if (config.qte.option[0].success.type == "video") {
                            this.play(1);
                          } else {
                            this.play(0);
                          }

                        }
                      } else if (config.qte.option[w].fail.type == "nextqte") {
                        //
                        w = w + parseInt(1);
                        if (config.qte.option[w].fail.type == "gameover") {
                          this.setData({
                            endanalyse: 3
                          });
                          wx.navigateTo({
                            url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                          })
                        } else if (config.qte.option[w].fail.type == "video") {
                          this.name = config.qte.option[w].fail.next;
                          this.playingName = config.qte.option[w].fail.next;
                          var playlen = 0;
                          if (w > 0) {
                            for (var n = 0; n < w; n++) {
                              if (config.qte.option[n].success.type == "video") {
                                playlen++;
                              }
                              if (config.qte.option[n].fail.type == "video") {
                                playlen++;
                              }
                            }
                            if (config.qte.option[w].success.type == "video") {
                              playlen++;
                            }
                            this.play(playlen);
                          } else {
                            if (config.qte.option[0].success.type == "video") {
                              this.play(1);
                            } else {
                              this.play(0);
                            }

                          }
                        } else if (config.qte.option[w].fail.type == "nextqte") {
                          // 
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (config.qte.option[qtetimes].fail.type == "video") {
                this.name = config.qte.option[qtetimes].fail.next;
                this.playingName = config.qte.option[qtetimes].fail.next;
                if (qtetimes > 0) {
                  var playlen = 0;
                  for (var n = 0; n < qtetimes; n++) {
                    if (config.qte.option[n].success.type == "video") {
                      playlen++;
                    }
                    if (config.qte.option[n].fail.type == "video") {
                      playlen++;
                    }
                  }
                  if (config.qte.option[qtetimes].success.type == "video") {
                    playlen++;
                  }
                  this.play(playlen);
                } else {
                  if (config.qte.option[0].success.type == "video") {
                    this.play(1);
                  } else {
                    this.play(0);
                  }

                }
              } else if (config.qte.option[qtetimes].fail.type == "gameover") {
                this.setData({
                  endanalyse: 3
                });
                wx.navigateTo({
                  url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                })
              } else if (config.qte.option[qtetimes].fail.type == "nextqte") {
                var w = qtetimes + parseInt(1);
                    if (config.qte.option[w].fail.type == "gameover") {
                      this.setData({
                        endanalyse: 3
                      });
                      wx.navigateTo({
                        url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                      })
                    } else if (config.qte.option[w].fail.type == "video") {
                      this.name = config.qte.option[w].fail.next;
                      this.playingName = config.qte.option[w].fail.next;
                      var playlen = 0;
                      if (w > 0) {
                        for (var n = 0; n < w; n++) {
                          if (config.qte.option[n].success.type == "video") {
                            playlen++;
                          }
                          if (config.qte.option[n].fail.type == "video") {
                            playlen++;
                          }
                        }
                        if (config.qte.option[w].success.type == "video") {
                          playlen++;
                        }

                        this.play(playlen);
                      } else {
                        if (config.qte.option[0].success.type == "video") {
                          this.play(1);
                        } else {
                          this.play(0);
                        }

                      }
                    } else if (config.qte.option[w].fail.type == "nextqte") {
                      // 
                      w = w + parseInt(1);
                      if (config.qte.option[w].fail.type == "gameover") {
                        this.setData({
                          endanalyse: 3
                        });
                        wx.navigateTo({
                          url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                        })
                      } else if (config.qte.option[w].fail.type == "video") {
                        this.name = config.qte.option[w].fail.next;
                        this.playingName = config.qte.option[w].fail.next;
                        var playlen = 0;
                        if (w > 0) {
                          for (var n = 0; n < w; n++) {
                            if (config.qte.option[n].success.type == "video") {
                              playlen++;
                            }
                            if (config.qte.option[n].fail.type == "video") {
                              playlen++;
                            }
                          }
                          if (config.qte.option[w].success.type == "video") {
                            playlen++;
                          }
                          this.play(playlen);
                        } else {
                          if (config.qte.option[0].success.type == "video") {
                            this.play(1);
                          } else {
                            this.play(0);
                          }

                        }
                      } else if (config.qte.option[w].fail.type == "nextqte") {
                        //
                        w = w + parseInt(1);
                        if (config.qte.option[w].fail.type == "gameover") {
                          this.setData({
                            endanalyse: 3
                          });
                          wx.navigateTo({
                            url: '../gameover/gameover?gameid=' + this.game_id + '&name=' + this.gamename + '&gameurl= ' + getPoster.call(this, this.name)
                          })
                        } else if (config.qte.option[w].fail.type == "video") {
                          this.name = config.qte.option[w].fail.next;
                          this.playingName = config.qte.option[w].fail.next;
                          var playlen = 0;
                          if (w > 0) {
                            for (var n = 0; n < w; n++) {
                              if (config.qte.option[n].success.type == "video") {
                                playlen++;
                              }
                              if (config.qte.option[n].fail.type == "video") {
                                playlen++;
                              }
                            }
                            if (config.qte.option[w].success.type == "video") {
                              playlen++;
                            }
                            this.play(playlen);
                          } else {
                            if (config.qte.option[0].success.type == "video") {
                              this.play(1);
                            } else {
                              this.play(0);
                            }

                          }
                        } else if (config.qte.option[w].fail.type == "nextqte") {
                          // 
                        }
                      }
                    }
                  }
            }
          } else {
            this.paused = true;
            //如果暂停则暂停
            this.video[this.nowPlay].pause();
            this.setData({
              isvideoimage: false
            });
          }
        }
      } else if (config.image) {
        if (config.part) {
          this.name = config.part.option[0].next;
          this.playingName = config.qte.option[0].next;
          if (this.partchoose != -1) {
            this.play(0);
          }
        }
      }
    }
  },
  onplaying: function (e) {
    let i = e.currentTarget.dataset.i;
    if (this.data.loader[i].src !== "") {
      this.paused = false;
      if (i != this.nowPlay) this.video[i].pause();
    } else {
      this.video[i].pause();
    }

  },
  on_play: function () {
    this.video[this.playing].play();
    this.setData({
      isRe_on: false
    })
  },
  re_play: function () {
    this.name = 'start';
    this.playingName = 'start';
    this.playing = -1;
    this.nowPlay = -1;
    this.qteover = true;
    wx.removeStorageSync('name_' + ID);
    wx.removeStorageSync('playingName_' + ID);
    wx.removeStorageSync('userScore_' + ID);
    this.play(0, e => {
      this.video[0].play();
      this.video[0].seek(0);
    });
    this.setData({
      isRe_on: false
    })
  },
  timeupdate: function (e) {
    // 当前时间
    let currentTime = e.detail.currentTime;
    if (this.ontime && this.data.isRe_on) {
      this.video[this.playing].pause();
      this.ontime = false;
    }
    // 视频持续的时间 
    let duration = e.detail.duration;
    let i = e.currentTarget.dataset.i;
    let name = e.currentTarget.dataset.name;
    if (name != this.name) return;
    let config = this.CONFIG[this.name];
    if (config.ending || config.gotoPrev) {
      if (duration - currentTime <= 2 && !this.onended[i]) this.ended(e);
      return;
    }
    if (config.video) {
      if (config.choose) {
        config.choose.at = parseInt(config.choose.at);
        config.choose.duration = parseInt(config.choose.duration);
        if ((counttip == 3) && (currentTime > (config.choose.at - 3)) && this.issharetip) {
          this.setData({
            sharetip: true
          });
          setTimeout(() => {
            this.setData({
              sharetip: false
            });
          }, 2000);
          this.issharetip = !this.issharetip;
        }
        if (config.choose.duration != 0) {
          if (currentTime >= config.choose.at && this.onchoosing[i] == 0) {
            let optionNum = config.choose.option.length;
            this.setData({
              optionNum: optionNum
            });
            counttip++;
            this.setData({
              showOption: true,
              duration: (config.choose.duration)
            });
            var parseduration = parseInt(config.choose.duration);
            if (parseInt(config.choose.duration) < 6 && parseInt(config.choose.duration) > 0) {
              this.setData({
                durationurl: "../../img/durationurl" + parseInt(config.choose.duration) + ".png"
              })
            }
            //这里需要判断是谁的游戏，双星还是罗哥的，双星视频不需要倒计时,后期需要在这里修改
            if (!config.choose.score) {
              let duration = (config.choose.duration);
              this.setData({
                duration: duration
              })
              if (duration > 0) {
                timer = setInterval(() => {
                  let middle = duration - 1;
                  duration = middle;
                  this.setData({
                    duration: middle
                  })
                  if (middle < 6 && middle > 0) {
                    this.setData({
                      durationurl: "../../img/durationurl" + parseInt(middle) + ".png"
                    })
                  }
                  if (middle == -1 || duration == -1) {
                    clearInterval(timer);
                    this.setData({
                      showOption: false,
                      duration: -1
                    });
                  }
                }, 1000);
              }
            }
            this.onchoosing[i] = 1;
          }
          if (config.choose.duration > 0) {
            //bug原因，后台设置的at事件加上duration时间总和过大，导致当前时间与duratiojn差值已经小于2了
            if (currentTime >= (config.choose.at + config.choose.duration) && this.onchoosing[i] == 1) {
              this.onchoosing[i] = 2;
            }
          }
          if (duration - currentTime <= 2 && !this.onended[i]) {
            this.ended(e);
          }
        }
      } else if (config.qte) {
        console.log(qteblock)
        var _this = this;
        // 因为有可能有多个qte的情况 先给0;
        for (var qtepointer = 0; qtepointer < config.qte.option.length; qtepointer++) {
          config.qte.option[qtepointer].at = parseInt(config.qte.option[qtepointer].at);
          config.qte.option[qtepointer].duration = parseInt(config.qte.option[qtepointer].duration);
          if ((counttip == 3) && (currentTime > (config.qte.option[qtepointer].at - 3)) && _this.issharetip) {
            // 弹窗
            _this.setData({
              sharetip: true
            });
            setTimeout(() => {
              _this.setData({
                sharetip: false
              });
            }, 2000);
            _this.issharetip = !_this.issharetip;
          }
          if (config.qte.option[qtepointer].duration != 0) {
            // qte 倒计时 浮窗消失
            var qtedur = config.qte.option[qtepointer].duration;
            var djs = config.qte.option[qtepointer].duration * 1000;
            if (currentTime >= config.qte.option[qtepointer].at && currentTime < (parseInt(config.qte.option[qtepointer].at) + parseInt(config.qte.option[qtepointer].duration)) && _this.qteover) {
           
              if (qtepointer > 0) {
                if (qtetimes == -1) {
                  if (config.qte.option[0].fail.type == "nextqte") {
                    _this.qteover = true;
                  } else {
                    _this.qteover = false;
                    return false;
                  }
                
                } else if (qtetimes != -1) {
                  // 说明用户做处理了
                  if (this.qtechoosing < 0) {
                    // 在当前qte发生时没有事件的产生
                    // 在这里 video 和 ganeover 都是需要播完视频之后才执行
                    if (config.qte.option[0].fail.type == "nextqte") {
                      _this.qteover = true;
                    } else {
                      _this.qteover = false;
                      return false;
                    }
                  } else if (this.qtechoosing == qtetimes) {
                    // 事件发生了 但是失败了
                    // qtetimes 记录的是上个qte执行成功时 的数值 但是此时是下个qte执行失败了 ++
                    this.qtechoosing++;
                    if (config.qte.option[qtetimes].fail.type == "nextqte") {
                      _this.qteover = true;
                    } else {
                      _this.qteover = false;
                      return false;
                    }
                  } else {
                    // 执行了 而且成功了
                    if (config.qte.option[qtetimes].success.type == "nextqte") {
                      _this.qteover = true;
                    } else {
                      _this.qteover = false;
                      return false;
                    }
                  }
                }
              }
              console.log(qtesuc);
              if(qtesuc[qtepointer] == "true"){
                qteblock[qtepointer] = "false";
                _this.setData({
                  qteblock: qteblock
                })
              }else{
                qteblock[qtepointer] = "true";
                _this.setData({
                  qteblock: qteblock
                })

              }
             
              if (qtedur > 0) {
                _this.setData({
                  qtemote: qtepointer
                });
                var timer = setInterval(function (e) {
                  _this.setData({
                    qtedjs: qtedur
                  })
                  qtedur--;

                  if (qtedur == 0) clearInterval(timer);
                }, 1000);
              }
              counttip++;
              _this.onchoosing[i] = 1;
            }

            if (currentTime > (parseInt(config.qte.option[qtepointer].at) + parseInt(config.qte.option[qtepointer].duration))) {
              if (qteblock[qtepointer] = "true"){
                qteblock[qtepointer] = "false";
                _this.setData({
                  qteblock: qteblock
                })
              }
            
            }
            // 暂时没遇到
            if (config.qte.option[qtepointer].duration > 0) {
              //bug原因，后台设置的at事件加上duration时间总和过大，导致当前时间与duratiojn差值已经小于2了
              if (currentTime >= (config.qte.option[qtepointer].at + config.qte.option[qtepointer].duration) && this.onchoosing[i] == 1) {
                this.onchoosing[i] = 2;
              }
            }

          }
        }
        if (duration - currentTime <= 2 && !this.onended[i]) {
          this.ended(e);
        }
      }

    } else if (config.image) {
      if (config.part) {

      }
    }
  },
  userChoose: function (e) {
    let i = e.currentTarget.dataset.i;
    let config = this.CONFIG[this.name];
    this.userChoosed = parseInt(i);
    if (config.choose.duration && config.choose.duration == -1) {
      let userScore = this.userScore[this.name] || {
        times: 0,
        score: 0
      };
      if (config.choose.score) {
        if (this.userChoosed == config.choose.def) userScore.score = config.choose.score[userScore.times] || 0;
        else userScore.times++;
        this.userScore[this.name] = userScore;
        //需要在这里计分，用户选择了就立刻计分
        wx.setStorageSync('userScore_' + ID, this.userScore);
      }
    }
    this.setData({
      showOption: false
    });
    this.onchoosing[this.nowPlay] = 2;
    if (this.paused) {
      let config = this.CONFIG[this.name];
      this.name = config.choose.option[this.userChoosed].next;
      this.onchoosing[this.nowPlay] = 0;
      if (!config.choose.score || (config.choose.score && this.userChoosed == config.choose.def)) this.playingName = config.choose.option[this.userChoosed].next;
      // this.play(this.userChoosed);
    }
  },
  controls: function () {
    if (this.onchoosing[this.nowPlay] == 1 || this.onended[this.nowPlay]) return;
    //当第二次播放，弹出选项时，有1秒的播放期间用于给用户提供剧情印象，此时用户点击暂停，是不允许的
    if (this.data.isRe_on) return;
    if (this.paused) {
      this.video[this.nowPlay].play();
      this.setData({
        isvideostart: false
      });
    } else {
      this.video[this.nowPlay].pause();
      this.setData({
        isvideostart: true
      });
    }
    this.paused = !this.paused;
  },
  gobackindex() {
    wx.switchTab({
      url: '../index/index',
      success: function () {
        //可以用来修改是否保存的状态
      }
    })
  },
  closeconcern() {
    this.setData({
      concern: false
    })
  },
  onHide: function () {
    // iswebsocket = false;
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);
    wx.setStorageSync('userScore_' + ID, this.userScore);
  },
  onShow: function () {
    this.name = wx.getStorageSync('name_' + ID) || 'start';
    this.playingName = wx.getStorageSync('playingName_' + ID) || 'start';
    this.userScore = wx.getStorageSync('userScore_' + ID) || {};

  },
  onUnload: function () {
    //需要判断是谁下的游戏，罗哥下的视频是不需要计分的
    let config = this.CONFIG[this.name];
    if (config.choose) {
      if (config.choose.score) {
        wx.setStorageSync('userScore_' + ID, this.userScore);
      }
    }
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);

    APP.globalData.page = {};
    APP.https('/subscribe/disconnect', {
      open_id: APP.globalData.openid
    }, res => {
      if (res.status == '2000') { }
    });
  },
  onShareAppMessage: function () {
    return {
      title: APP.globalData.setting.wx_share,
      path: '/pages/index/index?user=' + APP.globalData.openid,
      imageUrl: APP.urlimg(APP.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          APP.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.game_id,
            openid: APP.globalData.openid
          }, res => {
            if (res.status == 2000) {
              this.setData({
                //alertdialog: false,
                //cardstate: true
              })
            }
          })
        }
      }
    }
  },
  // qte 点击事件
  tap: function (e) {
    this.onchoosing[this.nowPlay] = 2;
    // qtetimes 当前数组的长度  避免例如滑动时多次触发 造成数据错误
    qtetimes = e.currentTarget.dataset.i;
    // console.log(qtetimes);
    // 每点击一次  加一次 判断是否多次点击
    this.taptimes++;
    console.log(this.taptimes);
    // 在这里是为了 判断用户是否执行了实践操作 是qte失败 还是用户无反馈
    this.qtechoosing = -1;
    if (e.currentTarget.dataset.action == "click") {
      var flue = true;
      qtesuc[qtetimes] = "true";
      if (flue) {
        flue = false;
        dispart: false
      }
      qteblock[qtetimes] = "false";
      this.setData({
        qteblock: qteblock
      })
      console.log(qteblock);
      // 事件执行成功之后要加加
      // 成功是this.qtechoosing要大于qtetimes
      this.qtechoosing = parseInt(qtetimes) + 1;
      // 更新数据 播放视频
      if (e.currentTarget.dataset.success.type == "video") {
        this.playingName = e.currentTarget.dataset.success.next;
        this.name = e.currentTarget.dataset.success.next;
        // qte 弹窗取消
        // qteblock[qtetimes] = "false";
        this.qteover = false;
        // this.setData({
        //   qteblock: qteblock
        // })
      } else if (e.currentTarget.dataset.success.type == "nextqte") {
        // 改变qtemote 当前qtemote消失 下一个显示
        // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
        // qteblock[this.data.qtemote] = "ture";
        // qteblock[this.data.qtemote] = "false";
        // this.setData({
        //   qteblock: qteblock
        // })
        this.qteover = true;
        // this.setData({
        //   togal: false
        // })
        this.qteover = true;
      } else if (e.currentTarget.dataset.success.type == "gameover") {
        // qte 弹窗取消
        // qteblock[qtetimes] = "false";
        this.qteover = false;
        // this.setData({
        //   qteblock: qteblock,
        //   togal: false
        // })
      }

    } else if (e.currentTarget.dataset.action == "doubleclick") {
      if (this.taptimes > 3) {
        console.log("猛击成功");
        qtesuc[qtetimes] = "true";
        var flue = true;
        if (flue) {
          flue = false;
          dispart: false
        }
        qteblock[qtetimes] = "false";

        console.log(qtesuc);
        console.log(qteblock);
        this.qtechoosing = parseInt(qtetimes) + 1;
        this.qteover = false;
        // 重新恢复成零
        // this.qtetimes = 0;
        if (e.currentTarget.dataset.success.type == "video") {
          this.playingName = e.currentTarget.dataset.success.next;
          this.name = e.currentTarget.dataset.success.next;
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "nextqte") {
          // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
          // qteblock[his.data.qtemote] = "true";
          // qteblock[this.data.qtemote] = "false";
          // this.setData({
          //   qteblock: qteblock
          // })
          this.qteover = true;
          // this.setData({
          //   togal: false
          // })
          this.qteover = true;
        } else if (e.currentTarget.dataset.success.type == "gameover") {
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        }
        this.setData({
            qteblock: qteblock,
            // togal: false
          })
      }
    }
  },
  // 下滑开始
  touchstart: function (e) {
    // e.preventDefault();
    // try{
    //   e.preventDefault();
    // }catch(err){

    // }
    // let qtetimes = e.currentTarget.dataset.i;
    // console.log(qtetimes);
    // this.setData({
    //   touchstart: e.touches[0].clientY,
    //   touchstartx: e.touches[0].pageX
    // })
    // this.data.touchstart = e.touches[0].pageY,
    // this.data.touchstartx = e.touches[0].pageX
    // console.log(this.data.touchmove);
    // console.log(this.data.touchstart)
  },
  // 下滑移动
  touchmove: function(e){
    console.log(e);
  },
  // touchmove: function (e) {
  //   this.onchoosing[this.nowPlay] = 2;
  //   this.qtechoosing = -1;
  //   qtetimes = e.currentTarget.dataset.i;
  //   if(startstate) {
  //     this.data.touchstart = e.touches[0].pageY;
  //     this.data.touchstartx = e.touches[0].pageX;
  //     startstate = false;
  //     return;
  //   }else{
  //     this.data.touchmove = e.touches[0].pageY;
  //     this.data.touchmovex = e.touches[0].pageX;
  //     // console.log(1);
  //   }
  //   // this.setData({
  //   //   touchmove: e.touches[0].clientY,
  //   //   touchmovex: e.touches[0].pageX
  //   // })
  //   // console.log((this.data.touchmove - this.data.touchstart) > 0);
  //   // console.log(this.data.touchstartx);
  //   // console.log(this.data.touchstart)
  //   // if ((this.data.touchmove - this.data.touchstart) > 0) {
  //   //   if (e.currentTarget.dataset.action == "slidedown") {
  //   //     qtesuc[qtetimes] = "true";
  //   //     // 场景弹窗取消
  //   //     this.setData({
  //   //       dispart: false
  //   //     })
  //   //     this.setData({
  //   //       qtemote: this.data.qtemote
  //   //     })
  //   //     this.qtechoosing = parseInt(qtetimes) + 1;
  //   //     if (e.currentTarget.dataset.success.type == "video") {
  //   //       this.playingName = e.currentTarget.dataset.success.next;
  //   //       this.name = e.currentTarget.dataset.success.next;
  //   //       this.setData({
  //   //         qtemote: -1
  //   //       });
  //   //       this.qteover = false;
  //   //       // qteblock[qtetimes] = "false";
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "nextqte") {
  //   //       // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
  //   //       // qteblock[this.data.qtemote] = "false";
  //   //       this.qteover = true;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock
  //   //       // })
  //   //       // this.setData({
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "gameover") {
  //   //       // qteblock[qtetimes] = "false";
  //   //       this.qteover = false;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     }
  //   //   }
  //   // } else {
  //   //   if (e.currentTarget.dataset.action == "slideup") {
  //   //     qtesuc[qtetimes] = "true";
  //   //     this.setData({
  //   //       dispart: false
  //   //     })
  //   //     this.qtechoosing = parseInt(qtetimes) + 1;
  //   //     if (e.currentTarget.dataset.success.type == "video") {
  //   //       this.playingName = e.currentTarget.dataset.success.next;
  //   //       this.name = e.currentTarget.dataset.success.next;
  //   //       // qteblock[qtetimes] = "false";
  //   //       this.qteover = false;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "nextqte") {
  //   //       // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
  //   //       // qteblock[this.data.qtemote] = "true";
  //   //       // qteblock[this.data.qtemote] = "false";
  //   //       this.qteover = true;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock
  //   //       // })
  //   //       // this.setData({
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "gameover") {
  //   //       // qteblock[qtetimes] = "false";
  //   //       this.qteover = false;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     }
  //   //   }
  //   // }
  //   // if ((this.data.touchmovex - this.data.touchstartx) > 0) {
  //   //   if (e.currentTarget.dataset.action == "slideright") {
  //   //     qtesuc[qtetimes] = "true";
  //   //     this.setData({
  //   //       dispart: false
  //   //     })
  //   //     this.qtechoosing = parseInt(qtetimes) + 1;
  //   //     if (e.currentTarget.dataset.success.type == "video") {
  //   //       this.playingName = e.currentTarget.dataset.success.next;
  //   //       this.name = e.currentTarget.dataset.success.next;
  //   //       // qteblock[qtetimes] = "false";
  //   //       this.qteover = false;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "nextqte") {
  //   //       // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
  //   //       // qteblock[this.data.qtemote] = "true";
  //   //       // qteblock[this.data.qtemote] = "false";
  //   //       this.qteover = true;
  //   //       // this.setData({
  //   //       //   qteblock: qteblock
  //   //       // })
  //   //       // this.setData({
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "gameover") {
  //   //       this.qteover = false;
  //   //       // qteblock[qtetimes] = "false";
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     }
  //   //   }
  //   // } else {
  //   //   if (e.currentTarget.dataset.action == "slideleft") {
  //   //     qtesuc[qtetimes] = "true";
  //   //     this.setData({
  //   //       dispart: false
  //   //     })
  //   //     this.qtechoosing = parseInt(qtetimes) + 1;
  //   //     if (e.currentTarget.dataset.success.type == "video") {
  //   //       this.playingName = e.currentTarget.dataset.success.next;
  //   //       this.name = e.currentTarget.dataset.success.next;
  //   //       this.qteover = false;
  //   //       // qteblock[qtetimes] = "false";
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "nextqte") {
  //   //       // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
  //   //       // qteblock[this.data.qtemote] = "true";
  //   //       // qteblock[this.data.qtemote] = "false";
  //   //       this.qteover = true;
  //   //       // qteblock[qtetimes] = "false";
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     } else if (e.currentTarget.dataset.success.type == "gameover") {
  //   //       this.qteover = false;
  //   //       // qteblock[qtetimes] = "false";
  //   //       // this.setData({
  //   //       //   qteblock: qteblock,
  //   //       //   togal: false
  //   //       // })
  //   //     }
  //   //   }
  //   // }
  // },
  touchend: function(e){
    this.data.touchmove = e.changedTouches[0].pageY;
    this.data.touchmovex = e.changedTouches[0].pageX;
    if ((this.data.touchmove - this.data.touchstart) > 0) {
      if (e.currentTarget.dataset.action == "slidedown") {
        qtesuc[qtetimes] = "true";
        // 场景弹窗取消
        this.setData({
          dispart: false
        })
        this.setData({
          qtemote: this.data.qtemote
        })
        this.qtechoosing = parseInt(qtetimes) + 1;
        if (e.currentTarget.dataset.success.type == "video") {
          this.playingName = e.currentTarget.dataset.success.next;
          this.name = e.currentTarget.dataset.success.next;
          this.setData({
            qtemote: -1
          });
          this.qteover = false;
          // qteblock[qtetimes] = "false";
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "nextqte") {
          // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
          // qteblock[this.data.qtemote] = "false";
          this.qteover = true;
          // this.setData({
          //   qteblock: qteblock
          // })
          // this.setData({
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "gameover") {
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        }
      }
    } else {
      if (e.currentTarget.dataset.action == "slideup") {
        qtesuc[qtetimes] = "true";
        this.setData({
          dispart: false
        })
        this.qtechoosing = parseInt(qtetimes) + 1;
        if (e.currentTarget.dataset.success.type == "video") {
          this.playingName = e.currentTarget.dataset.success.next;
          this.name = e.currentTarget.dataset.success.next;
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "nextqte") {
          // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
          // qteblock[this.data.qtemote] = "true";
          // qteblock[this.data.qtemote] = "false";
          this.qteover = true;
          // this.setData({
          //   qteblock: qteblock
          // })
          // this.setData({
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "gameover") {
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        }
      }
    }
    if ((this.data.touchmovex - this.data.touchstartx) > 0) {
      if (e.currentTarget.dataset.action == "slideright") {
        qtesuc[qtetimes] = "true";
        this.setData({
          dispart: false
        })
        this.qtechoosing = parseInt(qtetimes) + 1;
        if (e.currentTarget.dataset.success.type == "video") {
          this.playingName = e.currentTarget.dataset.success.next;
          this.name = e.currentTarget.dataset.success.next;
          // qteblock[qtetimes] = "false";
          this.qteover = false;
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "nextqte") {
          // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
          // qteblock[this.data.qtemote] = "true";
          // qteblock[this.data.qtemote] = "false";
          this.qteover = true;
          // this.setData({
          //   qteblock: qteblock
          // })
          // this.setData({
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "gameover") {
          this.qteover = false;
          // qteblock[qtetimes] = "false";
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        }
      }
    } else {
      if (e.currentTarget.dataset.action == "slideleft") {
        qtesuc[qtetimes] = "true";
        this.setData({
          dispart: false
        })
        this.qtechoosing = parseInt(qtetimes) + 1;
        if (e.currentTarget.dataset.success.type == "video") {
          this.playingName = e.currentTarget.dataset.success.next;
          this.name = e.currentTarget.dataset.success.next;
          this.qteover = false;
          // qteblock[qtetimes] = "false";
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "nextqte") {
          // this.data.qtemote = parseInt(qtetimes) + parseInt(1);
          // qteblock[this.data.qtemote] = "true";
          // qteblock[this.data.qtemote] = "false";
          this.qteover = true;
          // qteblock[qtetimes] = "false";
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        } else if (e.currentTarget.dataset.success.type == "gameover") {
          this.qteover = false;
          // qteblock[qtetimes] = "false";
          // this.setData({
          //   qteblock: qteblock,
          //   togal: false
          // })
        }
      }
    }
    startstate = true;
  },
  partap: function (e) {
    var taptime = e.currentTarget.dataset.i;;
    this.taptimes++;
    this.partchoose = -1;
    if (e.currentTarget.dataset.action == "click") {
      this.setData({
        dispart: false
      })
      this.partchoose = 1;
      this.playingName = this.data.partitem[taptime].next;
      this.name = this.data.partitem[taptime].next;
      this.play(0)

    } else if (e.currentTarget.dataset.action == "doubleclick") {

      if (this.taptimes > 3) {
        this.setData({
          dispart: false
        })
        this.taptimes = 0;
        this.partchoose = 1;
        this.playingName = this.data.partitem[taptime].next;
        this.name = this.data.partitem[taptime].next;
        this.play(0)
      }
    }
  },
  // 下滑开始
  partouchstart: function (e) {
    this.setData({
      touchstart: e.touches[0].pageY,
      touchstartx: e.touches[0].pageX
    })
  },
  // 下滑移动
  partouchmove: function (e) {
    this.partchoose = -1;
    if ((this.data.touchmove - this.data.touchstart) > 0) {
      if (e.currentTarget.dataset.action == "slidedown") {
        this.partchoose = 1;
        this.playingName = this.data.partitem[taptime].next;
        this.name = this.data.partitem[taptime].next;
        this.play(0)
      }
    } else {
      if (e.currentTarget.dataset.action == "slideup") {
        this.partchoose = 1;
        this.playingName = this.data.partitem[taptime].next;
        this.name = this.data.partitem[taptime].next;
        this.play(0)
      }
    }
    if ((this.data.touchmovex - this.data.touchstartx) > 0) {
      if (e.currentTarget.dataset.action == "slideright") {
        this.partchoose = 1;
        this.playingName = this.data.partitem[taptime].next;
        this.name = this.data.partitem[taptime].next;
        this.play(0)
      }
    } else {
      if (e.currentTarget.dataset.action == "slideleft") {
        this.partchoose = 1;
        this.playingName = this.data.partitem[taptime].next;
        this.name = this.data.partitem[taptime].next;
        this.play(0)
      }
    }
  },
  onShareAppMessage: function () {
    return {
      title: APP.globalData.setting.wx_share,
      path: '/pages/video/video?user=' + APP.globalData.openid + '&id=' + this.data.gameid + '&name=' + this.data.gamename,
      imageUrl: APP.urlimg(APP.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            openid: APP.globalData.openid
          }, res => {
            if (res.status == 2000) {
            }
          })
        }
      }
    }
  },
});
function getVideo(name) {
  let video = this.CONFIG[name].video;
  if (video) {
    let h265 = video.h265 == "1" ? "h265/" : "";
    //判断手机型号，如果ios系统型号是10以下，需要走h264视频资源
    if ((parseInt(system) < 10 && model.indexOf('iPhone') != -1)) h265 = '';
    else if (parseInt(system) == 10 && model.indexOf('iPhone') != -1) h265 = '';
    else if (parseInt(system) < 11 && parseInt(system) > 10 && model.indexOf('iPhone') != -1) h265 = '';
    else if (local) h265 = '';
    let src = `https://vgame-cdn.edisonluorui.com/upload/${ID}/${h265}${video.video}?t=${version}`;
    return src;
  }
}
function getPoster(name) {
  let video = this.CONFIG[name].video;
  if (video) {
    let src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/${video.pic}?t=${version}`;
    return src;
  }
}
function getOption(name) {
  let src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/options/${name}?t=${version}`;
  return src;
}
function getqte(name) {
  var src = "";
  if (name.indexOf('https') != -1) {
    src = name;
  }else{
    src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/image${name}?t=${version}`;
  }
  return src;
}
function getpart(name) {
  var src = "";
  if (name.indexOf('https') != -1){
    src = name;
  }else{
    src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/part${name}?t=${version}`;
  }
  
  return src;
}