function rpx(x) {
  var winwidth = wx.getSystemInfoSync().windowWidth  
  return x * winwidth / 750*2
}
module.exports = rpx;