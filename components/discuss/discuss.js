Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disdata: {
      type: Array,
      observer:function(newVal,oldVal,changedPath){
        for(let dis of newVal){
          let stars = [
            "bstarwhite",
            "bstarwhite",
            "bstarwhite",
            "bstarwhite",
            "bstarwhite"
          ]
          for (let i = 0; i < Math.round(dis.score/2);i++){
            stars[i] = "bstaryellow"
          }
          dis.score = stars
        }
        this.setData({
          discussdata: newVal
        })
      }
    },
    writedis: {
      type: Boolean
    },
    gameid:{
      type:String
    },
    times:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars: [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ],
    discussdata:[],
    // writedis:false,
    starnum: 3
  },
  attached:function(){
    // console.log(this.properties.disdata)
    // this.selestar();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    writedis:function(){
      wx.navigateTo({
        url: '../writedis/writedis?id=' + this.properties.gameid,
      })
    },
    alldis:function(){
      wx.navigateTo({
        url: '../alldis/alldis?id=' + this.properties.gameid,
      })
    },
    selestar: function (e) {
      // let stars = [
      //   "bstarwhite",
      //   "bstarwhite",
      //   "bstarwhite",
      //   "bstarwhite",
      //   "bstarwhite",
      // ]
      // for (let i = 0; i <= this.data.starnum-1; i++) {
      //   stars[i] = "bstaryellow"
      // }
      // this.setData({
      //   stars: stars,
      // })
    },
    close: function () {
      this.triggerEvent('closediscuss')
    },
    write: function () {
      this.triggerEvent('write')
    }
  }
})
