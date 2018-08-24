const SIGN = require("utils/sign.js");
App({
  //登录
  login: function (fn) {
    wx.login({
      success: res => {
        let requestTask = this.https("/login", {
          code: res.code
        }, res => {
          if (res.status == 2000) {
            this.globalData.newhand = res.data.newhand_state,
              this.globalData.openid = res.data.openid;
            this.globalData.oauth = res.data.oauth;
            this.globalData.userinfo = res.data.info;
            this.globalData.setting = res.data.setting;
            this.local.set("openid", res.data.openid, 86400);
            this.local.set("oauth", res.data.oauth, 86400);
            this.local.set("userinfo", res.data.info, 86400);
            this.local.set("setting", res.data.setting, 86400);
            if (fn) fn(this.globalData);
          }
        });
      }
    });
  },
  //登出
  logout: function (fn) {
    this.globalData.openid = null;
    this.globalData.oauth = 0;
    this.globalData.userinfo = null;
    // this.local.del("openid");
    // this.local.del("oauth");
    // this.local.del("userinfo");
    fn(this.globalData);
  },
  //读取配置文件信息
  getSetting: function (fn) {
    this.globalData.setting = this.local.get("setting");
    if (this.globalData.setting) {
      if (fn) fn(this.globalData);
    } else {
      this.https('/setting', res => {
        if (res.status == 2000) {
          this.globalData.setting = res.data;
          this.local.set("setting", res.data, 86400);
          if (fn) fn(this.globalData);
        }
      })
    }
  },
  //设置用户信息
  setUserInfo: function (detail, fn) {
    wx.checkSession({
      success: e => {
        setInfo.call(this);
      },
      fail: e => {
        this.logout(data => {
          this.login(data => {
            setInfo.call(this);
          });
        });
      }
    });
    function setInfo() {
      this.https("/login/setInfo", {
        openid: this.globalData.openid,
        info: detail.userInfo,
        rawData: detail.rawData,
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        signature: detail.signature
      }, res => {
        if (res.status == 2000) {
          this.globalData.oauth = 1;
          this.globalData.userinfo = res.data;
          this.local.set("oauth", 1, 86400);
          this.local.set("userinfo", res.data, 86400);
          fn(res.data);
        }
      });
    }
  },
  https: function (path, data, success, error) {
    if (typeof data == "function") {
      error = success;
      success = data;
      data = {};
    }
    wx.request({
      method: "POST",
      url: "https://vgame.edisonluorui.com" + path,
      data: SIGN(data),
      dataType: "json",
      success: res => {
        if (res.data.status != "2000") {
          if(res.data.status == "10001") {
            wx.navigateTo({
              url: '../service/service',
            })
          }
          // wx.hideLoading();
          // wx.showToast({
          //   title: res.data.msg,
          //   image: "/img/notice.png",
          //   duration: 2000,
          //   mask: true
          // });
        }
        else if (success) success.call(this, res.data);
      },
      fail: err => {
        // if (error) error.call(this, err);
      }
    });
  },

  //本地存储控制
  local: {
    get: name => {
      let data = wx.getStorageSync(name);
      if (data) {
        if (data.expire && parseInt(new Date().getTime() / 1000) - data.time > data.expire) {
          wx.removeStorageSync(name);
          return "";
        }
        else return data.data;
      }
      return "";
    },
    set: (name, value, expire = 0) => {
      wx.setStorage({
        key: name,
        data: {
          expire: expire,
          time: parseInt(new Date().getTime() / 1000),
          data: value
        }
      });
    },
    del: name => {
      wx.removeStorageSync(name);
    }
  },
  //图片引用
  urlimg: function (path) {
    let V = this.globalData.setting ? this.globalData.setting.version : "v0.0.0";
    return `https://vgame-cdn-image.edisonluorui.com/upload${path}?v=${V}`;
    //return `https://vgame-gm.edisonluorui.com/upload${path}?v=${V}`;
  },
  //全局变量
  globalData: {
    openid: null,
    oauth: 0,
    userinfo: null,
    setting: null,
    socket: null,
    page: {},
    relogin: false,
    newhand: 1
  }
});